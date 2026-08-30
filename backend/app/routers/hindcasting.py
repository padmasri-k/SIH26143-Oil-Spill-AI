import json
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.app.database import get_db
from backend.app.models.incident import IncidentModel
from backend.app.schemas.hindcast import HindcastRecalculateRequest, HindcastRecalculateResponse
from backend.app.services.hindcast_engine import run_lagrangian_hindcast

router = APIRouter(prefix="/api/hindcasting", tags=["Hindcasting"])

@router.get("/{incident_id}")
def get_hindcast_data(incident_id: str, db: Session = Depends(get_db)):
    inc = db.query(IncidentModel).filter(IncidentModel.id == incident_id).first()
    if not inc or not inc.hindcast:
        raise HTTPException(status_code=404, detail=f"Hindcast data for incident {incident_id} not found")

    try:
        steps = json.loads(inc.hindcast.backward_steps_json)
    except Exception:
        steps = []

    return {
        "incident_id": inc.id,
        "name": inc.name,
        "current_coordinates": [inc.lat, inc.lng],
        "hindcast": {
            "originCoordinates": [inc.hindcast.origin_lat, inc.hindcast.origin_lng],
            "originName": inc.hindcast.origin_name,
            "dischargeStartTime": inc.hindcast.discharge_start_time,
            "dischargeEndTime": inc.hindcast.discharge_end_time,
            "durationHours": inc.hindcast.duration_hours,
            "windageFactorUsed": inc.hindcast.windage_factor_used,
            "hydrodynamicModel": inc.hindcast.hydrodynamic_model,
            "confidence": inc.hindcast.confidence,
            "releaseVolumeEstBbl": inc.hindcast.release_volume_est_bbl,
            "uncertaintyAreaKm2": inc.hindcast.uncertainty_area_km2,
            "backwardSteps": steps
        }
    }

@router.post("/{incident_id}/recalculate", response_model=HindcastRecalculateResponse)
def recalculate_hindcast(
    incident_id: str, 
    payload: HindcastRecalculateRequest, 
    db: Session = Depends(get_db)
):
    inc = db.query(IncidentModel).filter(IncidentModel.id == incident_id).first()
    if not inc:
        raise HTTPException(status_code=404, detail=f"Incident {incident_id} not found")

    result = run_lagrangian_hindcast(
        current_lat=inc.lat,
        current_lng=inc.lng,
        wind_speed_knots=inc.wind_speed_knots,
        wind_dir_deg=inc.wind_direction_deg,
        current_speed_knots=inc.current_speed_knots,
        current_dir_deg=inc.current_direction_deg,
        windage_factor=payload.windage_factor,
        include_stokes_drift=payload.include_stokes_drift
    )

    return {
        "incident_id": inc.id,
        "origin_coordinates": result["originCoordinates"],
        "origin_name": result["originName"],
        "discharge_start_time": result["dischargeStartTime"],
        "discharge_end_time": result["dischargeEndTime"],
        "duration_hours": result["durationHours"],
        "windage_factor_used": result["windageFactorUsed"],
        "hydrodynamic_model": payload.hydrodynamic_model,
        "confidence": result["confidence"],
        "release_volume_est_bbl": result["releaseVolumeEstBbl"],
        "uncertainty_area_km2": result["uncertaintyAreaKm2"],
        "backward_steps": result["backwardSteps"]
    }

import json
from typing import List, Dict, Any
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.app.database import get_db
from backend.app.models.incident import IncidentModel

router = APIRouter(prefix="/api/tracking", tags=["Tracking"])

@router.get("/{incident_id}")
def get_tracking_data(incident_id: str, db: Session = Depends(get_db)):
    inc = db.query(IncidentModel).filter(IncidentModel.id == incident_id).first()
    if not inc:
        raise HTTPException(status_code=404, detail=f"Incident {incident_id} not found")

    drift_steps = []
    for d in sorted(inc.drift_forecast, key=lambda x: x.time_offset_hours):
        try:
            poly = json.loads(d.polygon_json)
        except Exception:
            poly = []
        drift_steps.append({
            "timeOffsetHours": d.time_offset_hours,
            "timestamp": d.timestamp,
            "coordinates": [d.lat, d.lng],
            "areaKm2": d.area_km2,
            "uncertaintyRadiusKm": d.uncertainty_radius_km,
            "polygon": poly
        })

    # Weathering and evaporation simulation data
    weathering_curve = [
        {"hour": "0h", "area": inc.area_km2, "evaporation": 0.0, "emulsification": 5.0},
        {"hour": "6h", "area": round(inc.area_km2 * 1.13, 1), "evaporation": 8.2, "emulsification": 18.0},
        {"hour": "12h", "area": round(inc.area_km2 * 1.29, 1), "evaporation": 15.6, "emulsification": 32.0},
        {"hour": "24h", "area": round(inc.area_km2 * 1.62, 1), "evaporation": 24.1, "emulsification": 48.0},
        {"hour": "48h", "area": round(inc.area_km2 * 2.15, 1), "evaporation": 35.8, "emulsification": 68.0},
        {"hour": "72h", "area": round(inc.area_km2 * 2.77, 1), "evaporation": 42.0, "emulsification": 79.0}
    ]

    return {
        "incident_id": inc.id,
        "name": inc.name,
        "current_coordinates": [inc.lat, inc.lng],
        "metocean": {
            "windSpeedKnots": inc.wind_speed_knots,
            "windDirectionDeg": inc.wind_direction_deg,
            "currentSpeedKnots": inc.current_speed_knots,
            "currentDirectionDeg": inc.current_direction_deg,
            "seaSurfaceTempC": inc.sea_surface_temp_c,
            "waveHeightM": inc.wave_height_m
        },
        "environmental_risk": {
            "coastalDistanceKm": inc.coastal_distance_km,
            "etaToCoastHours": inc.eta_to_coast_hours,
            "protectedAreaNearby": inc.protected_area_nearby,
            "sensitivityIndex": inc.sensitivity_index
        },
        "drift_forecast_steps": drift_steps,
        "weathering_curve": weathering_curve
    }

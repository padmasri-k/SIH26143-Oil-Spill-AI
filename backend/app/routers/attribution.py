import json
from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.app.database import get_db
from backend.app.models.vessel import AttributedVesselModel
from backend.app.models.incident import IncidentModel
from backend.app.schemas.incident import AttributedVessel

router = APIRouter(prefix="/api/attribution", tags=["Attribution"])

def format_vessel(v: AttributedVesselModel) -> dict:
    try:
        hist = json.loads(v.history_points_json)
    except Exception:
        hist = []

    return {
        "id": v.id,
        "name": v.name,
        "imo": v.imo,
        "mmsi": v.mmsi,
        "callSign": v.call_sign,
        "flag": v.flag,
        "flagCode": v.flag_code,
        "vesselType": v.vessel_type,
        "lengthM": v.length_m,
        "beamM": v.beam_m,
        "draughtM": v.draught_m,
        "dwtTons": v.dwt_tons,
        "yearBuilt": v.year_built,
        "owner": v.owner,
        "operator": v.operator,
        "destination": v.destination,
        "eta": v.eta,
        "currentCoords": [v.current_lat, v.current_lng],
        "hindcastInterceptCoords": [v.intercept_lat, v.intercept_lng],
        "interceptTimestamp": v.intercept_timestamp,
        "speedKnots": v.speed_knots,
        "headingDeg": v.heading_deg,
        "distanceScore": v.distance_score,
        "timeMatchScore": v.time_match_score,
        "routeSimilarityScore": v.route_similarity_score,
        "anomalyScore": v.anomaly_score,
        "overallAttributionScore": v.overall_attribution_score,
        "isPrimeSuspect": v.is_prime_suspect,
        "aisStatus": v.ais_status,
        "historyPoints": hist,
        "forensicSummary": v.forensic_summary
    }

@router.get("/{incident_id}", response_model=List[AttributedVessel])
def get_vessel_attribution_list(incident_id: str, db: Session = Depends(get_db)):
    vessels = (
        db.query(AttributedVesselModel)
        .filter(AttributedVesselModel.incident_id == incident_id)
        .order_by(AttributedVesselModel.overall_attribution_score.desc())
        .all()
    )
    return [format_vessel(v) for v in vessels]

@router.get("/vessel/{vessel_id}", response_model=AttributedVessel)
def get_vessel_dossier(vessel_id: str, db: Session = Depends(get_db)):
    v = db.query(AttributedVesselModel).filter(AttributedVesselModel.id == vessel_id).first()
    if not v:
        raise HTTPException(status_code=404, detail=f"Vessel {vessel_id} not found")
    return format_vessel(v)

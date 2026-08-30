import json
from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.app.database import get_db
from backend.app.models.incident import IncidentModel
from backend.app.schemas.incident import OilSpillIncident

router = APIRouter(prefix="/api/incidents", tags=["Incidents"])

def format_incident_response(inc: IncidentModel) -> dict:
    # Parse polygon
    try:
        polygon = json.loads(inc.polygon_json)
    except Exception:
        polygon = []

    # Parse drift forecast
    drift_forecast = []
    for d in sorted(inc.drift_forecast, key=lambda x: x.time_offset_hours):
        try:
            poly = json.loads(d.polygon_json)
        except Exception:
            poly = []
        drift_forecast.append({
            "timeOffsetHours": d.time_offset_hours,
            "timestamp": d.timestamp,
            "coordinates": [d.lat, d.lng],
            "areaKm2": d.area_km2,
            "uncertaintyRadiusKm": d.uncertainty_radius_km,
            "polygon": poly
        })

    # Parse hindcast
    hindcast = {}
    if inc.hindcast:
        try:
            b_steps = json.loads(inc.hindcast.backward_steps_json)
        except Exception:
            b_steps = []
        hindcast = {
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
            "backwardSteps": b_steps
        }

    # Parse vessels
    vessels = []
    for v in sorted(inc.attributed_vessels, key=lambda x: x.overall_attribution_score, reverse=True):
        try:
            hist = json.loads(v.history_points_json)
        except Exception:
            hist = []
        vessels.append({
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
        })

    return {
        "id": inc.id,
        "name": inc.name,
        "region": inc.region,
        "coordinates": [inc.lat, inc.lng],
        "polygon": polygon,
        "detectionTime": inc.detection_time,
        "sensor": inc.sensor,
        "resolution": inc.resolution,
        "confidence": inc.confidence,
        "areaKm2": inc.area_km2,
        "estimatedVolumeBbl": inc.estimated_volume_bbl,
        "estimatedVolumeTons": inc.estimated_volume_tons,
        "oilType": inc.oil_type,
        "thicknessMicrons": inc.thickness_microns,
        "severity": inc.severity,
        "status": inc.status,
        "environmentalRisk": {
            "coastalDistanceKm": inc.coastal_distance_km,
            "etaToCoastHours": inc.eta_to_coast_hours,
            "protectedAreaNearby": inc.protected_area_nearby,
            "sensitivityIndex": inc.sensitivity_index
        },
        "currentMetOcean": {
            "windSpeedKnots": inc.wind_speed_knots,
            "windDirectionDeg": inc.wind_direction_deg,
            "currentSpeedKnots": inc.current_speed_knots,
            "currentDirectionDeg": inc.current_direction_deg,
            "seaSurfaceTempC": inc.sea_surface_temp_c,
            "waveHeightM": inc.wave_height_m
        },
        "driftForecast": drift_forecast,
        "hindcast": hindcast,
        "attributedVessels": vessels
    }

@router.get("", response_model=List[OilSpillIncident])
def get_all_incidents(db: Session = Depends(get_db)):
    incidents = db.query(IncidentModel).all()
    return [format_incident_response(inc) for inc in incidents]

@router.get("/{incident_id}", response_model=OilSpillIncident)
def get_incident_by_id(incident_id: str, db: Session = Depends(get_db)):
    inc = db.query(IncidentModel).filter(IncidentModel.id == incident_id).first()
    if not inc:
        raise HTTPException(status_code=404, detail=f"Incident {incident_id} not found")
    return format_incident_response(inc)

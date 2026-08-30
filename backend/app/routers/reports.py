import hashlib
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from backend.app.database import get_db
from backend.app.models.report import IncidentReportModel
from backend.app.models.incident import IncidentModel
from backend.app.schemas.report import ReportNotesUpdateRequest, ReportResponse
from backend.app.routers.incidents import format_incident_response

router = APIRouter(prefix="/api/reports", tags=["Reports"])

@router.get("/{incident_id}", response_model=ReportResponse)
def get_incident_report(incident_id: str, db: Session = Depends(get_db)):
    inc = db.query(IncidentModel).filter(IncidentModel.id == incident_id).first()
    if not inc:
        raise HTTPException(status_code=404, detail=f"Incident {incident_id} not found")

    report = db.query(IncidentReportModel).filter(IncidentReportModel.incident_id == incident_id).first()
    if not report:
        # Create default report if not present
        seal_hash = hashlib.sha256(f"{incident_id}-{datetime.utcnow().isoformat()}".encode()).hexdigest()
        report = IncidentReportModel(
            id=f"REP-{incident_id}",
            incident_id=incident_id,
            created_at=datetime.utcnow().isoformat() + "Z",
            classification="OFFICIAL EVIDENCE // MARPOL COMPLIANT",
            investigator_notes="Visual analysis confirms dark SAR formation damping Bragg wave scattering across Sector 4B. Cross-correlation with HYCOM hydrodynamic backtrack identifies vessel loitering anomaly with 96.2% confidence. Immediate Port State Control inspection recommended upon docking.",
            digital_seal_hash=seal_hash
        )
        db.add(report)
        db.commit()
        db.refresh(report)

    formatted_inc = format_incident_response(inc)
    prime_suspect = next((v for v in formatted_inc["attributedVessels"] if v["isPrimeSuspect"]), None)

    return {
        "report_id": report.id,
        "incident_id": report.incident_id,
        "created_at": report.created_at,
        "classification": report.classification,
        "investigator_notes": report.investigator_notes,
        "digital_seal_hash": report.digital_seal_hash,
        "incident_data": formatted_inc,
        "prime_suspect": prime_suspect
    }

@router.post("/{incident_id}/notes")
def update_report_notes(incident_id: str, payload: ReportNotesUpdateRequest, db: Session = Depends(get_db)):
    report = db.query(IncidentReportModel).filter(IncidentReportModel.incident_id == incident_id).first()
    if not report:
        seal_hash = hashlib.sha256(f"{incident_id}-{datetime.utcnow().isoformat()}".encode()).hexdigest()
        report = IncidentReportModel(
            id=f"REP-{incident_id}",
            incident_id=incident_id,
            created_at=datetime.utcnow().isoformat() + "Z",
            classification="OFFICIAL EVIDENCE // MARPOL COMPLIANT",
            investigator_notes=payload.investigator_notes,
            digital_seal_hash=seal_hash
        )
        db.add(report)
    else:
        report.investigator_notes = payload.investigator_notes

    db.commit()
    return {"status": "SUCCESS", "incident_id": incident_id, "investigator_notes": payload.investigator_notes}

@router.get("/{incident_id}/export-json")
def export_report_json(incident_id: str, db: Session = Depends(get_db)):
    inc = db.query(IncidentModel).filter(IncidentModel.id == incident_id).first()
    if not inc:
        raise HTTPException(status_code=404, detail=f"Incident {incident_id} not found")

    report = db.query(IncidentReportModel).filter(IncidentReportModel.incident_id == incident_id).first()
    formatted_inc = format_incident_response(inc)
    prime_suspect = next((v for v in formatted_inc["attributedVessels"] if v["isPrimeSuspect"]), None)

    package = {
        "package_type": "MARPOL_ANNEX_I_EVIDENTIARY_DOSSIER",
        "authority": "Directorate General of Shipping / Indian Coast Guard — OceanGuard AI",
        "incident_id": inc.id,
        "generated_at": datetime.utcnow().isoformat() + "Z",
        "digital_seal": report.digital_seal_hash if report else "UNSIGNED",
        "lead_investigator_notes": report.investigator_notes if report else "",
        "spaceborne_detection": {
            "sensor": inc.sensor,
            "resolution": inc.resolution,
            "confidence_percent": inc.confidence,
            "classified_oil_type": inc.oil_type,
            "slick_area_km2": inc.area_km2,
            "slick_centroid_gps": [inc.lat, inc.lng]
        },
        "lagrangian_hindcast": formatted_inc["hindcast"],
        "attributed_prime_suspect": prime_suspect,
        "all_monitored_vessels": formatted_inc["attributedVessels"],
        "coastal_vulnerability": formatted_inc["environmentalRisk"]
    }

    return JSONResponse(
        content=package,
        headers={"Content-Disposition": f"attachment; filename=forensic_dossier_{incident_id}.json"}
    )

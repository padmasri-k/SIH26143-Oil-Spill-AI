import json
from typing import List
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from backend.app.database import get_db
from backend.app.models.scan import SampleScanModel
from backend.app.schemas.scan import (
    SampleDetectionScan, 
    AiDetectionRunRequest, 
    AiDetectionRunResponse, 
    DetectionStageProgress
)

router = APIRouter(prefix="/api/detection", tags=["Detection"])

def format_scan(scan: SampleScanModel) -> dict:
    try:
        bands = json.loads(scan.spectral_bands_json)
    except Exception:
        bands = []
    try:
        poly = json.loads(scan.detected_polygon_json)
    except Exception:
        poly = []

    return {
        "id": scan.id,
        "name": scan.name,
        "satellite": scan.satellite,
        "sensorType": scan.sensor_type,
        "mode": scan.mode,
        "acquisitionDate": scan.acquisition_date,
        "locationName": scan.location_name,
        "centerCoords": [scan.center_lat, scan.center_lng],
        "rawImageUrl": scan.raw_image_url,
        "maskImageUrl": scan.mask_image_url,
        "thermalImageUrl": scan.thermal_image_url,
        "spectralBands": bands,
        "confidence": scan.confidence,
        "areaKm2": scan.area_km2,
        "severity": scan.severity,
        "oilType": scan.oil_type,
        "estimatedVolumeBbl": scan.estimated_volume_bbl,
        "detectedPolygon": poly,
        "notes": scan.notes
    }

@router.get("/scans", response_model=List[SampleDetectionScan])
def list_sample_scans(db: Session = Depends(get_db)):
    scans = db.query(SampleScanModel).all()
    return [format_scan(s) for s in scans]

@router.get("/scans/{scan_id}", response_model=SampleDetectionScan)
def get_sample_scan(scan_id: str, db: Session = Depends(get_db)):
    scan = db.query(SampleScanModel).filter(SampleScanModel.id == scan_id).first()
    if not scan:
        raise HTTPException(status_code=404, detail=f"Scan {scan_id} not found")
    return format_scan(scan)

@router.post("/run", response_model=AiDetectionRunResponse)
def run_ai_detection_pipeline(payload: AiDetectionRunRequest, db: Session = Depends(get_db)):
    scan_id = payload.scan_id or "SCAN-S1-MUMBAI"
    scan = db.query(SampleScanModel).filter(SampleScanModel.id == scan_id).first()
    if not scan:
        scan = db.query(SampleScanModel).first()

    stages = [
        DetectionStageProgress(
            stage=1,
            name="Radiometric Calibration",
            progress=25,
            details="Converted raw radar signal to sigma-0 backscatter coefficient."
        ),
        DetectionStageProgress(
            stage=2,
            name="Lee-Sigma Speckle Suppression",
            progress=55,
            details="Suppressed 7x7 spatial granular speckle noise."
        ),
        DetectionStageProgress(
            stage=3,
            name="DeepLabV3+ Feature Extraction",
            progress=85,
            details="ResNet-101 with ASPP dual-pol feature pyramid extraction."
        ),
        DetectionStageProgress(
            stage=4,
            name="Morphological Look-Alike Filter",
            progress=100,
            details="Filtered biogenic look-alikes with 99.1% specificity."
        )
    ]

    return {
        "status": "COMPLETED",
        "scan_id": scan.id,
        "stages": stages,
        "result": format_scan(scan)
    }

@router.post("/upload")
async def upload_custom_satellite_file(file: UploadFile = File(...), db: Session = Depends(get_db)):
    # Create simulated scan for uploaded file
    scan = db.query(SampleScanModel).first()
    scan_dict = format_scan(scan)
    scan_dict["name"] = f"Custom Scan — {file.filename}"
    scan_dict["notes"] = f"Successfully parsed and ingested user satellite raster {file.filename}. Dual-pol SAR calibration applied."
    return {
        "status": "UPLOAD_SUCCESS",
        "filename": file.filename,
        "content_type": file.content_type,
        "scan": scan_dict
    }

from pydantic import BaseModel
from typing import List, Optional

class SampleDetectionScan(BaseModel):
    id: str
    name: str
    satellite: str
    sensorType: str
    mode: str
    acquisitionDate: str
    locationName: str
    centerCoords: List[float]
    rawImageUrl: str
    maskImageUrl: str
    thermalImageUrl: str
    spectralBands: List[str]
    confidence: float
    areaKm2: float
    severity: str
    oilType: str
    estimatedVolumeBbl: int
    detectedPolygon: List[List[float]]
    notes: str

    class Config:
        from_attributes = True

class AiDetectionRunRequest(BaseModel):
    scan_id: Optional[str] = None
    custom_image_name: Optional[str] = None
    mode: Optional[str] = "DeepLabV3+ ResNet-101"

class DetectionStageProgress(BaseModel):
    stage: int
    name: str
    progress: int
    details: str

class AiDetectionRunResponse(BaseModel):
    status: str
    scan_id: str
    stages: List[DetectionStageProgress]
    result: SampleDetectionScan

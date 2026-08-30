from pydantic import BaseModel, Field
from typing import List, Optional, Literal

SeverityLevel = Literal['Critical', 'High', 'Moderate', 'Minor']
IncidentStatus = Literal['Active Tracking', 'Hindcast Verified', 'Attribution Confirmed', 'Contained']
OilType = Literal['Heavy Crude', 'Bunker Fuel C', 'Light Diesel / Condensate', 'Refined Gasoil']

class MetOceanConditions(BaseModel):
    windSpeedKnots: float
    windDirectionDeg: float
    currentSpeedKnots: float
    currentDirectionDeg: float
    seaSurfaceTempC: float
    waveHeightM: float

class EnvironmentalRisk(BaseModel):
    coastalDistanceKm: float
    etaToCoastHours: float
    protectedAreaNearby: str = Field(..., alias="protectedAreaNearby")
    sensitivityIndex: Literal['Very High', 'High', 'Medium', 'Low']

    class Config:
        populate_by_name = True

class DriftStep(BaseModel):
    timeOffsetHours: int
    timestamp: str
    coordinates: List[float]  # [lat, lng]
    areaKm2: float
    uncertaintyRadiusKm: float
    polygon: List[List[float]]

class HindcastStep(BaseModel):
    stepHour: int
    timestamp: str
    coordinates: List[float]
    ellipseMajorKm: float
    ellipseMinorKm: float
    ellipseAngleDeg: float
    currentVelocityKnots: float
    windStressFactor: float

class HindcastData(BaseModel):
    originCoordinates: List[float]
    originName: str
    dischargeStartTime: str
    dischargeEndTime: str
    durationHours: float
    backwardSteps: List[HindcastStep]
    windageFactorUsed: float
    hydrodynamicModel: str
    confidence: float
    releaseVolumeEstBbl: int
    uncertaintyAreaKm2: float

class VesselHistoryPoint(BaseModel):
    timestamp: str
    coords: List[float]
    speedKnots: float
    courseDeg: float

class AttributedVessel(BaseModel):
    id: str
    name: str
    imo: str
    mmsi: str
    callSign: str
    flag: str
    flagCode: str
    vesselType: str
    lengthM: float
    beamM: float
    draughtM: float
    dwtTons: int
    yearBuilt: int
    owner: str
    operator: str
    destination: str
    eta: str
    currentCoords: List[float]
    hindcastInterceptCoords: List[float]
    interceptTimestamp: str
    speedKnots: float
    headingDeg: float
    distanceScore: float
    timeMatchScore: float
    routeSimilarityScore: float
    anomalyScore: float
    overallAttributionScore: float
    isPrimeSuspect: bool
    aisStatus: str
    historyPoints: List[VesselHistoryPoint]
    forensicSummary: str

class OilSpillIncident(BaseModel):
    id: str
    name: str
    region: str
    coordinates: List[float]
    polygon: List[List[float]]
    detectionTime: str
    sensor: str
    resolution: str
    confidence: float
    areaKm2: float
    estimatedVolumeBbl: int
    estimatedVolumeTons: int
    oilType: OilType
    thicknessMicrons: float
    severity: SeverityLevel
    status: IncidentStatus
    environmentalRisk: EnvironmentalRisk
    currentMetOcean: MetOceanConditions
    driftForecast: List[DriftStep]
    hindcast: HindcastData
    attributedVessels: List[AttributedVessel]

    class Config:
        from_attributes = True
        populate_by_name = True

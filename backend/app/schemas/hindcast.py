from pydantic import BaseModel
from typing import List, Optional

class HindcastRecalculateRequest(BaseModel):
    windage_factor: float = 0.034  # 0.020 to 0.045
    hydrodynamic_model: str = "HYCOM 1/12° + ECMWF ERA5"
    include_stokes_drift: bool = True

class HindcastRecalculateResponse(BaseModel):
    incident_id: str
    origin_coordinates: List[float]
    origin_name: str
    discharge_start_time: str
    discharge_end_time: str
    duration_hours: float
    windage_factor_used: float
    hydrodynamic_model: str
    confidence: float
    release_volume_est_bbl: int
    uncertainty_area_km2: float
    backward_steps: List[dict]

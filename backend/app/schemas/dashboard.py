from pydantic import BaseModel
from typing import List, Dict, Any

class SatelliteStatus(BaseModel):
    name: str
    status: str
    pass_time: str
    coverage: str

class DashboardStatsResponse(BaseModel):
    total_active_slicks: int
    total_area_km2: float
    total_monitored_vessels: int
    high_risk_alerts: int
    model_accuracy_percent: float
    satellite_feeds: List[SatelliteStatus]
    system_status: str
    active_incidents_summary: List[Dict[str, Any]]
    dispersion_forecast_summary: List[Dict[str, Any]]

class SystemHealthResponse(BaseModel):
    status: str
    version: str
    database: str
    uptime: str
    timestamp: str

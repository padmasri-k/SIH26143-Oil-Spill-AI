from sqlalchemy import Column, String, Float, Integer, ForeignKey, Text, Boolean
from sqlalchemy.orm import relationship
from backend.app.database import Base

class IncidentModel(Base):
    __tablename__ = "incidents"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    region = Column(String, nullable=False)
    lat = Column(Float, nullable=False)
    lng = Column(Float, nullable=False)
    polygon_json = Column(Text, nullable=False)  # JSON string of coordinates [[lat, lng], ...]
    detection_time = Column(String, nullable=False)
    sensor = Column(String, nullable=False)
    resolution = Column(String, nullable=False)
    confidence = Column(Float, nullable=False)
    area_km2 = Column(Float, nullable=False)
    estimated_volume_bbl = Column(Integer, nullable=False)
    estimated_volume_tons = Column(Integer, nullable=False)
    oil_type = Column(String, nullable=False)
    thickness_microns = Column(Float, nullable=False)
    severity = Column(String, nullable=False)  # Critical, High, Moderate, Minor
    status = Column(String, nullable=False)

    # Environmental Risk
    coastal_distance_km = Column(Float, nullable=False)
    eta_to_coast_hours = Column(Float, nullable=False)
    protected_area_nearby = Column(String, nullable=False)
    sensitivity_index = Column(String, nullable=False)

    # MetOcean
    wind_speed_knots = Column(Float, nullable=False)
    wind_direction_deg = Column(Float, nullable=False)
    current_speed_knots = Column(Float, nullable=False)
    current_direction_deg = Column(Float, nullable=False)
    sea_surface_temp_c = Column(Float, nullable=False)
    wave_height_m = Column(Float, nullable=False)

    # Relationships
    drift_forecast = relationship("DriftForecastStepModel", back_populates="incident", cascade="all, delete-orphan")
    hindcast = relationship("HindcastModel", back_populates="incident", uselist=False, cascade="all, delete-orphan")
    attributed_vessels = relationship("AttributedVesselModel", back_populates="incident", cascade="all, delete-orphan")
    reports = relationship("IncidentReportModel", back_populates="incident", cascade="all, delete-orphan")


class DriftForecastStepModel(Base):
    __tablename__ = "drift_forecast_steps"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    incident_id = Column(String, ForeignKey("incidents.id", ondelete="CASCADE"), nullable=False)
    time_offset_hours = Column(Integer, nullable=False)
    timestamp = Column(String, nullable=False)
    lat = Column(Float, nullable=False)
    lng = Column(Float, nullable=False)
    area_km2 = Column(Float, nullable=False)
    uncertainty_radius_km = Column(Float, nullable=False)
    polygon_json = Column(Text, nullable=False)

    incident = relationship("IncidentModel", back_populates="drift_forecast")


class HindcastModel(Base):
    __tablename__ = "hindcasts"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    incident_id = Column(String, ForeignKey("incidents.id", ondelete="CASCADE"), nullable=False, unique=True)
    origin_lat = Column(Float, nullable=False)
    origin_lng = Column(Float, nullable=False)
    origin_name = Column(String, nullable=False)
    discharge_start_time = Column(String, nullable=False)
    discharge_end_time = Column(String, nullable=False)
    duration_hours = Column(Float, nullable=False)
    windage_factor_used = Column(Float, nullable=False)
    hydrodynamic_model = Column(String, nullable=False)
    confidence = Column(Float, nullable=False)
    release_volume_est_bbl = Column(Integer, nullable=False)
    uncertainty_area_km2 = Column(Float, nullable=False)
    backward_steps_json = Column(Text, nullable=False)  # JSON array of step objects

    incident = relationship("IncidentModel", back_populates="hindcast")

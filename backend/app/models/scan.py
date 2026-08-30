from sqlalchemy import Column, String, Float, Integer, Text
from backend.app.database import Base

class SampleScanModel(Base):
    __tablename__ = "sample_scans"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    satellite = Column(String, nullable=False)
    sensor_type = Column(String, nullable=False)
    mode = Column(String, nullable=False)
    acquisition_date = Column(String, nullable=False)
    location_name = Column(String, nullable=False)
    center_lat = Column(Float, nullable=False)
    center_lng = Column(Float, nullable=False)
    raw_image_url = Column(String, nullable=False)
    mask_image_url = Column(String, nullable=False)
    thermal_image_url = Column(String, nullable=False)
    spectral_bands_json = Column(Text, nullable=False)  # JSON array of strings
    confidence = Column(Float, nullable=False)
    area_km2 = Column(Float, nullable=False)
    severity = Column(String, nullable=False)
    oil_type = Column(String, nullable=False)
    estimated_volume_bbl = Column(Integer, nullable=False)
    detected_polygon_json = Column(Text, nullable=False)  # JSON array of [[lat, lng], ...]
    notes = Column(Text, nullable=False)

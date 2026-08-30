from sqlalchemy import Column, String, Float, Integer, ForeignKey, Text, Boolean
from sqlalchemy.orm import relationship
from backend.app.database import Base

class AttributedVesselModel(Base):
    __tablename__ = "attributed_vessels"

    id = Column(String, primary_key=True, index=True)
    incident_id = Column(String, ForeignKey("incidents.id", ondelete="CASCADE"), nullable=False)
    name = Column(String, nullable=False)
    imo = Column(String, nullable=False, index=True)
    mmsi = Column(String, nullable=False, index=True)
    call_sign = Column(String, nullable=False)
    flag = Column(String, nullable=False)
    flag_code = Column(String, nullable=False)
    vessel_type = Column(String, nullable=False)
    length_m = Column(Float, nullable=False)
    beam_m = Column(Float, nullable=False)
    draught_m = Column(Float, nullable=False)
    dwt_tons = Column(Integer, nullable=False)
    year_built = Column(Integer, nullable=False)
    owner = Column(String, nullable=False)
    operator = Column(String, nullable=False)
    destination = Column(String, nullable=False)
    eta = Column(String, nullable=False)

    current_lat = Column(Float, nullable=False)
    current_lng = Column(Float, nullable=False)
    intercept_lat = Column(Float, nullable=False)
    intercept_lng = Column(Float, nullable=False)
    intercept_timestamp = Column(String, nullable=False)
    speed_knots = Column(Float, nullable=False)
    heading_deg = Column(Float, nullable=False)

    # Attribution Scoring Matrix
    distance_score = Column(Float, nullable=False)
    time_match_score = Column(Float, nullable=False)
    route_similarity_score = Column(Float, nullable=False)
    anomaly_score = Column(Float, nullable=False)
    overall_attribution_score = Column(Float, nullable=False)
    is_prime_suspect = Column(Boolean, default=False)
    ais_status = Column(String, nullable=False)

    history_points_json = Column(Text, nullable=False)  # JSON array of [{timestamp, coords, speedKnots, courseDeg}]
    forensic_summary = Column(Text, nullable=False)

    incident = relationship("IncidentModel", back_populates="attributed_vessels")

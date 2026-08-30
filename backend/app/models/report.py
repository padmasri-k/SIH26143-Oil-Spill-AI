from sqlalchemy import Column, String, ForeignKey, Text
from sqlalchemy.orm import relationship
from backend.app.database import Base

class IncidentReportModel(Base):
    __tablename__ = "incident_reports"

    id = Column(String, primary_key=True, index=True)
    incident_id = Column(String, ForeignKey("incidents.id", ondelete="CASCADE"), nullable=False)
    created_at = Column(String, nullable=False)
    classification = Column(String, default="OFFICIAL EVIDENCE // MARPOL COMPLIANT")
    investigator_notes = Column(Text, nullable=False)
    digital_seal_hash = Column(String, nullable=False)

    incident = relationship("IncidentModel", back_populates="reports")

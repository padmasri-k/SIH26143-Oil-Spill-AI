from pydantic import BaseModel
from typing import Optional, Dict, Any

class ReportNotesUpdateRequest(BaseModel):
    investigator_notes: str

class ReportResponse(BaseModel):
    report_id: str
    incident_id: str
    created_at: str
    classification: str
    investigator_notes: str
    digital_seal_hash: str
    incident_data: Dict[str, Any]
    prime_suspect: Optional[Dict[str, Any]]

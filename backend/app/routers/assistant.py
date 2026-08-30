from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.app.database import get_db
from backend.app.models.incident import IncidentModel
from backend.app.schemas.assistant import ChatRequest, ChatResponse
from backend.app.services.ai_copilot import query_maritime_intelligence
from backend.app.routers.incidents import format_incident_response

router = APIRouter(prefix="/api/assistant", tags=["AI Assistant"])

@router.post("/chat", response_model=ChatResponse)
def handle_assistant_chat(payload: ChatRequest, db: Session = Depends(get_db)):
    inc = db.query(IncidentModel).filter(IncidentModel.id == payload.incident_id).first()
    if not inc:
        inc = db.query(IncidentModel).first()
        if not inc:
            raise HTTPException(status_code=404, detail="No active incidents available")

    formatted_inc = format_incident_response(inc)
    prime_suspect = next((v for v in formatted_inc["attributedVessels"] if v["isPrimeSuspect"]), formatted_inc["attributedVessels"][0] if formatted_inc["attributedVessels"] else {})

    result = query_maritime_intelligence(
        prompt=payload.message,
        incident=formatted_inc,
        prime_suspect=prime_suspect
    )

    return result

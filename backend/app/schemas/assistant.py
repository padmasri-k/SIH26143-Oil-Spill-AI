from pydantic import BaseModel
from typing import List, Optional, Dict, Any

class ChatRequest(BaseModel):
    incident_id: str
    message: str
    context_filters: Optional[Dict[str, Any]] = None

class ChatReference(BaseModel):
    label: str
    url: Optional[str] = None
    type: str

class ChatResponse(BaseModel):
    reply: str
    incident_id: str
    references: List[ChatReference]
    suggested_actions: List[str]
    timestamp: str

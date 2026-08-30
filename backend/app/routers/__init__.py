from backend.app.routers.dashboard import router as dashboard_router
from backend.app.routers.incidents import router as incidents_router
from backend.app.routers.detection import router as detection_router
from backend.app.routers.tracking import router as tracking_router
from backend.app.routers.hindcasting import router as hindcasting_router
from backend.app.routers.attribution import router as attribution_router
from backend.app.routers.assistant import router as assistant_router
from backend.app.routers.reports import router as reports_router

__all__ = [
    "dashboard_router",
    "incidents_router",
    "detection_router",
    "tracking_router",
    "hindcasting_router",
    "attribution_router",
    "assistant_router",
    "reports_router"
]

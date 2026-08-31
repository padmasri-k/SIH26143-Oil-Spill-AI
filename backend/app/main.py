import os
from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles

from backend.app.database import engine, Base
from backend.app.seed.seed_data import seed_database
from backend.app.routers import (
    dashboard_router,
    incidents_router,
    detection_router,
    tracking_router,
    hindcasting_router,
    attribution_router,
    assistant_router,
    reports_router,
)

# Initialize FastAPI
app = FastAPI(
    title="OceanGuard AI — Maritime Oil Spill Intelligence & Vessel Attribution API",
    description="Backend REST API for SIH26143: Spaceborne SAR detection, Lagrangian hindcast backtracking, and AIS Vessel correlation.",
    version="1.0.0",
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize database
@app.on_event("startup")
def on_startup():
    Base.metadata.create_all(bind=engine)
    seed_database()


# -----------------------------
# API ROUTERS
# -----------------------------

app.include_router(dashboard_router)
app.include_router(incidents_router)
app.include_router(detection_router)
app.include_router(tracking_router)
app.include_router(hindcasting_router)
app.include_router(attribution_router)
app.include_router(assistant_router)
app.include_router(reports_router)


# -----------------------------
# REACT FRONTEND
# -----------------------------

PROJECT_ROOT = Path(__file__).resolve().parents[2]
DIST_DIR = PROJECT_ROOT / "dist"
ASSETS_DIR = DIST_DIR / "assets"


# Serve React assets
if ASSETS_DIR.exists():
    app.mount(
        "/assets",
        StaticFiles(directory=str(ASSETS_DIR)),
        name="assets",
    )


# Main website
@app.get("/", include_in_schema=False)
async def frontend():
    return FileResponse(DIST_DIR / "index.html")


# React SPA fallback
@app.get("/{path:path}", include_in_schema=False)
async def frontend_routes(path: str):

    file_path = DIST_DIR / path

    if file_path.is_file():
        return FileResponse(file_path)

    return FileResponse(DIST_DIR / "index.html")

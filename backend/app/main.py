from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
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
    reports_router
)

# Initialize FastAPI App
app = FastAPI(
    title="OceanGuard AI — Maritime Oil Spill Intelligence & Vessel Attribution API",
    description="Backend REST API for SIH26143: Spaceborne SAR detection, Lagrangian hindcast backtracking, and AIS vessel correlation.",
    version="1.0.0"
)

# Configure CORS for React frontend (port 3000, 5173, etc.)
origins = [
    "http://localhost:3000",
    "http://localhost:5173",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:5173",
    "*"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Startup Event: Ensure tables and seed data exist
@app.on_event("startup")
def on_startup():
    Base.metadata.create_all(bind=engine)
    seed_database()

# Mount all Routers
app.include_router(dashboard_router)
app.include_router(incidents_router)
app.include_router(detection_router)
app.include_router(tracking_router)
app.include_router(hindcasting_router)
app.include_router(attribution_router)
app.include_router(assistant_router)
app.include_router(reports_router)

@app.get("/")
def root():
    return {
        "system": "OceanGuard AI Backend",
        "problem_statement": "SIH26143 — AI-based Oil Spill Detection, Tracking, Hindcasting and Vessel Attribution",
        "docs": "/docs",
        "status": "OPERATIONAL"
    }

# Implementation Plan: FastAPI + SQLite Backend & Frontend Integration

## Phase 1: Python Virtual Environment & Dependencies Setup
1. Create virtual environment `venv` using `python -m venv venv`.
2. Create `backend/requirements.txt` with:
   - `fastapi>=0.115.0`
   - `uvicorn[standard]>=0.32.0`
   - `sqlalchemy>=2.0.36`
   - `pydantic>=2.10.0`
   - `python-multipart>=0.0.18`
   - `requests>=2.32.0`
3. Install dependencies inside `venv`.

---

## Phase 2: Backend Architecture & Directory Layout
Create a clean, modular backend directory structure:
```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py                  # FastAPI app instance, CORS middleware, API router mounting
│   ├── database.py              # SQLite connection, engine, sessionmaker, Base
│   ├── models/
│   │   ├── __init__.py
│   │   ├── incident.py          # SQLAlchemy ORM models for Incidents, DriftSteps, Hindcast
│   │   ├── vessel.py            # SQLAlchemy ORM models for Vessels, AIS points
│   │   ├── scan.py              # SQLAlchemy ORM models for Satellite Scans
│   │   └── report.py            # SQLAlchemy ORM models for Forensic Reports
│   ├── schemas/
│   │   ├── __init__.py
│   │   ├── incident.py          # Pydantic schemas for requests/responses
│   │   ├── vessel.py            # Pydantic schemas for vessel attribution
│   │   ├── scan.py              # Pydantic schemas for detection scans
│   │   ├── tracking.py          # Pydantic schemas for drift tracking
│   │   ├── hindcast.py          # Pydantic schemas for hindcasting
│   │   ├── report.py            # Pydantic schemas for reports
│   │   └── assistant.py         # Pydantic schemas for AI Assistant chat
│   ├── routers/
│   │   ├── __init__.py
│   │   ├── dashboard.py         # /api/dashboard/stats, /api/health
│   │   ├── incidents.py         # /api/incidents
│   │   ├── detection.py         # /api/detection/scans, /api/detection/run
│   │   ├── tracking.py          # /api/tracking/{id}
│   │   ├── hindcasting.py       # /api/hindcasting/{id}
│   │   ├── attribution.py       # /api/attribution/{id}
│   │   ├── assistant.py         # /api/assistant/chat
│   │   └── reports.py           # /api/reports/{id}
│   ├── services/
│   │   ├── __init__.py
│   │   ├── attribution_engine.py # 4-factor scoring calculation algorithm
│   │   ├── hindcast_engine.py    # Lagrangian particle reverse-drift calculator
│   │   └── ai_copilot.py         # Contextual maritime intelligence reasoning
│   └── seed/
│       ├── __init__.py
│       └── seed_data.py         # Comprehensive maritime dataset seeder for SQLite
├── run.py                       # Application starter script on port 8000
└── requirements.txt
```

---

## Phase 3: SQLite Database & Realistic Maritime Data Seeding
1. Build SQLAlchemy declarative models for all domain entities in `backend/app/models/`.
2. Implement `backend/app/seed/seed_data.py` to populate realistic high-fidelity maritime data:
   - **Incident 1**: `INC-2026-0829-01` (Mumbai High Offshore Sector 4B Slick - 42.8 km² Heavy Crude, 4 vessels, *MT OCEAN VANGUARD* prime suspect).
   - **Incident 2**: `INC-2026-0828-02` (Gulf of Kachchh Outer Fairway Slick - 18.2 km² Bunker Fuel C near Marine National Park, *MT KACHCHH GLORY* prime suspect).
   - **Incident 3**: `INC-2026-0827-03` (Bay of Bengal Deepwater Discharge - 29.5 km² Light Diesel near Paradip corridor, *MSC AEGEAN VOYAGER* prime suspect).
   - **Satellite Scans**: Sentinel-1A SAR C-Band, Sentinel-2B Optical MSI, RADARSAT-Constellation RCM-1, Airborne Thermal FLIR.
   - **Forensic Reports & Pre-calculated Drift & Hindcast trajectories**.
3. Execute seed script to generate `oil_spill_intel.db`.

---

## Phase 4: REST API Endpoints Implementation
Implement all routers and services:
1. `dashboard.py`: Return live aggregated metrics, active alert count, system radar health, MetOcean conditions.
2. `incidents.py`: Fetch all incidents or single incident with relations.
3. `detection.py`: Satellite scene retrieval, AI scan simulation with multi-stage progress telemetry, file upload parser.
4. `tracking.py`: Forward 72h drift steps, weathering curves (evaporation, emulsification), coastal beaching ETA countdown.
5. `hindcasting.py`: Backward drift steps, origin point estimation, interactive parameter recalculation with windage factor slider.
6. `attribution.py`: Vessel candidates ranking with 4-factor matrix, suspect inspection dossier, AIS history points.
7. `assistant.py`: Intelligent contextual Q&A copilot with domain reasoning and statutory enforcement citations.
8. `reports.py`: Official court-ready forensic reports, custom investigator notes updates, JSON evidence package download.

---

## Phase 5: Frontend Integration with Backend APIs
1. Create `src/services/api.ts` with typed asynchronous API calls to `http://localhost:8000/api`.
2. Enhance `src/context/IncidentContext.tsx` to initialize data from the live backend API, with transparent local fallback if backend is starting up.
3. Update pages where interactive operations occur (e.g. recalculating hindcast parameters, updating investigator notes, running detection scanner, AI chat) to hit the FastAPI backend.
4. Maintain all visual styling, high-tech command center dark aesthetic, Leaflet maps, and Recharts charts without regressions.

---

## Phase 6: Testing & Verification
1. Launch FastAPI backend on `http://localhost:8000`.
2. Test backend health and endpoints with curl/Python requests.
3. Start frontend dev server on port 3000 (`npm run dev -- --port 3000`).
4. Verify end-to-end user flows across all 8 pages.
5. Compile full production build (`npm run build`).

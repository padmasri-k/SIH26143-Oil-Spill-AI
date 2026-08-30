# Technical Specifications: SIH26143 Maritime AI Platform Backend & API

## 1. System Overview
The **OceanGuard AI** backend provides high-performance RESTful APIs, persistent SQLite storage, and analytical modeling engines for **Smart India Hackathon Problem Statement SIH26143**: *AI-based Oil Spill Detection, Tracking, Hindcasting and Vessel Attribution System*.

The backend powers spaceborne SAR satellite detection processing, 72-hour forward hydrodynamic drift tracking, backward Lagrangian particle hindcasting to pinpoint illicit discharge points, and multi-criteria AIS vessel spatiotemporal correlation.

---

## 2. Technical Stack & Network Topology
- **Backend Framework**: Python 3.14+ with FastAPI
- **ASGI Web Server**: Uvicorn running on `http://0.0.0.0:8000` (port 8000)
- **Database**: SQLite 3 (`oil_spill_intel.db`) with SQLAlchemy ORM
- **CORS Configuration**: Enabled for `http://localhost:3000`, `http://localhost:5173`, and local network origins
- **Frontend Integration**: Connected React TypeScript client with resilient API client service layer

---

## 3. Database Schema (SQLite / SQLAlchemy)

### 3.1 `incidents` Table
| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | VARCHAR PRIMARY KEY | Unique identifier (e.g., `INC-2026-0829-01`) |
| `name` | VARCHAR | Incident name |
| `region` | VARCHAR | Maritime basin / sector name |
| `lat` | FLOAT | Centroid latitude |
| `lng` | FLOAT | Centroid longitude |
| `polygon_json` | TEXT (JSON) | Boundary GPS coordinates array |
| `detection_time` | DATETIME / VARCHAR | ISO 8601 acquisition timestamp |
| `sensor` | VARCHAR | Spaceborne sensor (e.g., Sentinel-1A C-SAR) |
| `resolution` | VARCHAR | Spatial resolution (e.g., 10.0m GSD) |
| `confidence` | FLOAT | Neural network segmentation confidence (0-100%) |
| `area_km2` | FLOAT | Slick surface area in square kilometers |
| `estimated_volume_bbl` | INTEGER | Estimated volume in barrels |
| `estimated_volume_tons` | INTEGER | Estimated volume in metric tons |
| `oil_type` | VARCHAR | Hydrocarbon classification (e.g., Heavy Crude) |
| `thickness_microns` | FLOAT | Average slick thickness |
| `severity` | VARCHAR | Severity rating (`Critical`, `High`, `Moderate`, `Minor`) |
| `status` | VARCHAR | Operational status (`Active Tracking`, `Attribution Confirmed`, etc.) |
| `coastal_distance_km` | FLOAT | Proximity to nearest coast |
| `eta_to_coast_hours` | FLOAT | Forecasted hours to shoreline impact |
| `protected_area_nearby` | VARCHAR | Vulnerable marine park or sanctuary name |
| `sensitivity_index` | VARCHAR | Environmental vulnerability rating |
| `wind_speed_knots` | FLOAT | Surface wind speed |
| `wind_direction_deg` | FLOAT | Wind direction azimuth |
| `current_speed_knots` | FLOAT | Ocean surface current velocity |
| `current_direction_deg` | FLOAT | Ocean current direction azimuth |
| `sea_surface_temp_c` | FLOAT | Sea surface temperature in °C |
| `wave_height_m` | FLOAT | Significant wave height in meters |

### 3.2 `drift_forecast_steps` Table
| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | INTEGER PRIMARY KEY AUTOINCREMENT | Step identifier |
| `incident_id` | VARCHAR FOREIGN KEY | Reference to `incidents.id` |
| `time_offset_hours` | INTEGER | Horizon (0, 6, 12, 24, 48, 72 hours) |
| `timestamp` | VARCHAR | Forecasted timestamp |
| `lat` | FLOAT | Forecasted centroid latitude |
| `lng` | FLOAT | Forecasted centroid longitude |
| `area_km2` | FLOAT | Forecasted spread area |
| `uncertainty_radius_km` | FLOAT | Error radius |
| `polygon_json` | TEXT (JSON) | Forecasted boundary polygon coordinates |

### 3.3 `hindcasts` Table
| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | INTEGER PRIMARY KEY AUTOINCREMENT | Record ID |
| `incident_id` | VARCHAR FOREIGN KEY | Reference to `incidents.id` |
| `origin_lat` | FLOAT | Reconstructed origin latitude |
| `origin_lng` | FLOAT | Reconstructed origin longitude |
| `origin_name` | VARCHAR | Reconstructed sector name |
| `discharge_start_time` | VARCHAR | Estimated discharge start timestamp |
| `discharge_end_time` | VARCHAR | Estimated discharge end timestamp |
| `duration_hours` | FLOAT | Estimated discharge duration |
| `windage_factor_used` | FLOAT | Atmospheric windage coefficient ($C_w$) |
| `hydrodynamic_model` | VARCHAR | Current model name (e.g. HYCOM 1/12°) |
| `confidence` | FLOAT | Origin confidence score (0-100%) |
| `release_volume_est_bbl`| INTEGER | Reconstructed discharge volume |
| `uncertainty_area_km2` | FLOAT | Dispersion error ellipse area |
| `backward_steps_json` | TEXT (JSON) | Timestamped advection step array |

### 3.4 `attributed_vessels` Table
| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | VARCHAR PRIMARY KEY | Vessel record ID (e.g., `VES-01`) |
| `incident_id` | VARCHAR FOREIGN KEY | Reference to `incidents.id` |
| `name` | VARCHAR | Vessel name (e.g., `MT OCEAN VANGUARD`) |
| `imo` | VARCHAR | IMO registration number |
| `mmsi` | VARCHAR | Maritime Mobile Service Identity |
| `call_sign` | VARCHAR | Radio call sign |
| `flag` | VARCHAR | Flag state registry |
| `flag_code` | VARCHAR | 2-letter ISO flag code |
| `vessel_type` | VARCHAR | Vessel category (e.g. VLCC Crude Tanker) |
| `length_m` | FLOAT | Vessel length in meters |
| `beam_m` | FLOAT | Vessel beam in meters |
| `draught_m` | FLOAT | Vessel draught in meters |
| `dwt_tons` | INTEGER | Deadweight tonnage |
| `year_built` | INTEGER | Construction year |
| `owner` | VARCHAR | Beneficial owner entity |
| `operator` | VARCHAR | Commercial operator |
| `destination` | VARCHAR | Port of destination |
| `eta` | VARCHAR | Estimated arrival timestamp |
| `current_lat` | FLOAT | Current latitude |
| `current_lng` | FLOAT | Current longitude |
| `intercept_lat` | FLOAT | Intercept latitude at hindcast origin |
| `intercept_lng` | FLOAT | Intercept longitude at hindcast origin |
| `intercept_timestamp` | VARCHAR | Timestamp of origin intercept |
| `speed_knots` | FLOAT | Speed over ground |
| `heading_deg` | FLOAT | True heading azimuth |
| `distance_score` | FLOAT | Spatial proximity score (0-100) |
| `time_match_score` | FLOAT | Temporal coincidence score (0-100) |
| `route_similarity_score`| FLOAT | Course consistency score (0-100) |
| `anomaly_score` | FLOAT | Speed drop / dark gap anomaly score (0-100) |
| `overall_attribution_score` | FLOAT | Weighted attribution score (0-100) |
| `is_prime_suspect` | BOOLEAN | Highlighted primary culprit flag |
| `ais_status` | VARCHAR | AIS transponder status description |
| `history_points_json` | TEXT (JSON) | Historical GPS & speed track array |
| `forensic_summary` | TEXT | Evidentiary findings text |

### 3.5 `sample_scans` Table
| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | VARCHAR PRIMARY KEY | Scan ID |
| `name` | VARCHAR | Scene name |
| `satellite` | VARCHAR | Satellite mission |
| `sensor_type` | VARCHAR | Sensor mode (SAR C-Band / MSI / Thermal) |
| `mode` | VARCHAR | Acquisition mode |
| `acquisition_date` | VARCHAR | Acquisition timestamp |
| `location_name` | VARCHAR | Scene location |
| `center_lat` | FLOAT | Center latitude |
| `center_lng` | FLOAT | Center longitude |
| `raw_image_url` | VARCHAR | Raw scene URL |
| `mask_image_url` | VARCHAR | Segmented mask URL |
| `thermal_image_url` | VARCHAR | Thermal scene URL |
| `spectral_bands_json` | TEXT (JSON) | Spectral bands array |
| `confidence` | FLOAT | Model confidence score |
| `area_km2` | FLOAT | Detected slick area |
| `severity` | VARCHAR | Severity category |
| `oil_type` | VARCHAR | Classified oil type |
| `estimated_volume_bbl` | INTEGER | Volume estimate |
| `detected_polygon_json`| TEXT (JSON) | Vector polygon points |
| `notes` | TEXT | Diagnostics notes |

### 3.6 `incident_reports` Table
| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | VARCHAR PRIMARY KEY | Report ID |
| `incident_id` | VARCHAR FOREIGN KEY | Reference to `incidents.id` |
| `created_at` | VARCHAR | Creation timestamp |
| `classification` | VARCHAR | Security classification |
| `investigator_notes` | TEXT | Field findings & notes |
| `digital_seal_hash` | VARCHAR | SHA-256 digital evidence signature |

---

## 4. REST API Endpoint Specifications

### 4.1 Dashboard & System Health
- `GET /api/health` -> System health, active satellites, database connectivity
- `GET /api/dashboard/stats` -> High-level stats (active slicks, area, monitored vessels, risk warnings, model accuracy, metocean conditions)

### 4.2 Incidents
- `GET /api/incidents` -> List all active oil spill incidents with summary telemetry
- `GET /api/incidents/{incident_id}` -> Full detail of a specific incident with drift, hindcast, and vessels
- `POST /api/incidents` -> Register new incident

### 4.3 Spaceborne Detection & AI Scanner
- `GET /api/detection/scans` -> List preset satellite scenes
- `GET /api/detection/scans/{scan_id}` -> Specific satellite scene
- `POST /api/detection/run` -> Run DeepLabV3+ neural segmentation simulation on scene or uploaded image
- `POST /api/detection/upload` -> Ingest custom GeoTIFF / satellite scene

### 4.4 Spill Drift Tracking
- `GET /api/tracking/{incident_id}` -> 72-hour forward drift forecast steps, vector decomposition, and weathering decay curves

### 4.5 Hydrodynamic Hindcasting
- `GET /api/hindcasting/{incident_id}` -> Backward Lagrangian trajectory steps, error ellipses, and origin coordinates
- `POST /api/hindcasting/{incident_id}/recalculate` -> Recalculate hindcast origin given adjusted windage factor ($C_w$), ocean model, and Stokes drift parameters

### 4.6 Vessel Attribution & AIS
- `GET /api/attribution/{incident_id}` -> List all ranked candidate vessels with 4-factor scoring and prime suspect
- `GET /api/attribution/vessel/{vessel_id}` -> Detailed inspection dossier, ownership, voyage, and AIS speed anomaly history

### 4.7 AI Investigation Assistant
- `POST /api/assistant/chat` -> LLM copilot reasoning query grounded in incident telemetry, AIS tracks, and MARPOL jurisprudence

### 4.8 Legal Forensic Reports
- `GET /api/reports/{incident_id}` -> Court-ready MARPOL Annex I forensic dossier
- `POST /api/reports/{incident_id}/notes` -> Update lead investigator field notes
- `GET /api/reports/{incident_id}/export-json` -> Download JSON evidentiary package

---

## 5. Security, Validation & CORS
- **CORS**: Allows `GET`, `POST`, `PUT`, `DELETE`, `OPTIONS` from `http://localhost:3000`, `http://localhost:5173`, `http://127.0.0.1:3000`, `http://127.0.0.1:5173`.
- **Validation**: Pydantic v2 schemas for all request payloads and responses.
- **Error Handling**: Standardized HTTP 404/422/500 JSON error objects with clear error diagnostics.

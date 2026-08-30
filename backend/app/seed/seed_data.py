import json
import os
from backend.app.database import engine, Base, SessionLocal
from backend.app.models.incident import IncidentModel, DriftForecastStepModel, HindcastModel
from backend.app.models.vessel import AttributedVesselModel
from backend.app.models.scan import SampleScanModel
from backend.app.models.report import IncidentReportModel

def seed_database():
    print("Creating all database tables in SQLite...")
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()

    # Check if already seeded
    if db.query(IncidentModel).first():
        print("Database already contains records. Skipping seed.")
        db.close()
        return

    print("Seeding realistic maritime intelligence dataset for SIH26143...")

    # Incident 1: Mumbai High Offshore Sector 4B Slick
    inc1 = IncidentModel(
        id="INC-2026-0829-01",
        name="Mumbai High Offshore Sector 4B Slick",
        region="Arabian Sea — Mumbai Offshore Basin",
        lat=19.3824,
        lng=71.3412,
        polygon_json=json.dumps([
            [19.395, 71.325],
            [19.412, 71.358],
            [19.398, 71.385],
            [19.365, 71.372],
            [19.352, 71.339],
            [19.378, 71.318],
            [19.395, 71.325]
        ]),
        detection_time="2026-08-29T06:45:00Z",
        sensor="Sentinel-1A C-SAR (IW GRDH Mode)",
        resolution="10.0m Spatial GSD",
        confidence=96.8,
        area_km2=42.8,
        estimated_volume_bbl=1850,
        estimated_volume_tons=260,
        oil_type="Heavy Crude",
        thickness_microns=45.2,
        severity="Critical",
        status="Attribution Confirmed",
        coastal_distance_km=142.5,
        eta_to_coast_hours=48.0,
        protected_area_nearby="Alibaug Coral Reef Marine Sanctuary & Breeding Grounds",
        sensitivity_index="Very High",
        wind_speed_knots=14.8,
        wind_direction_deg=235,
        current_speed_knots=1.35,
        current_direction_deg=55,
        sea_surface_temp_c=28.4,
        wave_height_m=1.8
    )
    db.add(inc1)

    # Drift steps for Incident 1
    drift_steps_data = [
        {"offset": 0, "ts": "2026-08-29T06:45:00Z", "lat": 19.3824, "lng": 71.3412, "area": 42.8, "rad": 1.2, "poly": [[19.395, 71.325], [19.412, 71.358], [19.398, 71.385], [19.365, 71.372], [19.352, 71.339], [19.378, 71.318], [19.395, 71.325]]},
        {"offset": 6, "ts": "2026-08-29T12:45:00Z", "lat": 19.4150, "lng": 71.4120, "area": 48.5, "rad": 2.4, "poly": [[19.430, 71.390], [19.448, 71.432], [19.428, 71.460], [19.395, 71.442], [19.382, 71.408], [19.410, 71.382], [19.430, 71.390]]},
        {"offset": 12, "ts": "2026-08-29T18:45:00Z", "lat": 19.4520, "lng": 71.4880, "area": 55.2, "rad": 3.8, "poly": [[19.470, 71.460], [19.492, 71.512], [19.468, 71.540], [19.430, 71.518], [19.415, 71.480], [19.448, 71.452], [19.470, 71.460]]},
        {"offset": 24, "ts": "2026-08-30T06:45:00Z", "lat": 19.5310, "lng": 71.6350, "area": 69.4, "rad": 6.2, "poly": [[19.555, 71.600], [19.580, 71.665], [19.550, 71.695], [19.505, 71.670], [19.488, 71.622], [19.525, 71.590], [19.555, 71.600]]},
        {"offset": 48, "ts": "2026-08-31T06:45:00Z", "lat": 19.6820, "lng": 71.9120, "area": 92.1, "rad": 11.5, "poly": [[19.712, 71.870], [19.745, 71.950], [19.708, 71.988], [19.650, 71.955], [19.630, 71.895], [19.675, 71.855], [19.712, 71.870]]},
        {"offset": 72, "ts": "2026-09-01T06:45:00Z", "lat": 19.8250, "lng": 72.1850, "area": 118.6, "rad": 18.0, "poly": [[19.865, 72.135], [19.902, 72.230], [19.855, 72.275], [19.785, 72.235], [19.760, 72.165], [19.815, 72.118], [19.865, 72.135]]}
    ]
    for d in drift_steps_data:
        db.add(DriftForecastStepModel(
            incident_id="INC-2026-0829-01",
            time_offset_hours=d["offset"],
            timestamp=d["ts"],
            lat=d["lat"],
            lng=d["lng"],
            area_km2=d["area"],
            uncertainty_radius_km=d["rad"],
            polygon_json=json.dumps(d["poly"])
        ))

    # Hindcast for Incident 1
    hc1 = HindcastModel(
        incident_id="INC-2026-0829-01",
        origin_lat=19.1850,
        origin_lng=70.9240,
        origin_name="Western Arabian Sea Tanker Corridor (Point HC-01)",
        discharge_start_time="2026-08-28T18:20:00Z",
        discharge_end_time="2026-08-28T21:45:00Z",
        duration_hours=3.4,
        windage_factor_used=0.034,
        hydrodynamic_model="HYCOM 1/12° + ECMWF ERA5 Wind Stress + Stokes Wave Drift",
        confidence=94.2,
        release_volume_est_bbl=1950,
        uncertainty_area_km2=18.5,
        backward_steps_json=json.dumps([
            {"stepHour": 0, "timestamp": "2026-08-29T06:45:00Z", "coordinates": [19.3824, 71.3412], "ellipseMajorKm": 1.2, "ellipseMinorKm": 0.8, "ellipseAngleDeg": 45, "currentVelocityKnots": 1.35, "windStressFactor": 0.034},
            {"stepHour": -3, "timestamp": "2026-08-29T03:45:00Z", "coordinates": [19.3450, 71.2650], "ellipseMajorKm": 2.1, "ellipseMinorKm": 1.4, "ellipseAngleDeg": 48, "currentVelocityKnots": 1.28, "windStressFactor": 0.034},
            {"stepHour": -6, "timestamp": "2026-08-29T00:45:00Z", "coordinates": [19.3020, 71.1820], "ellipseMajorKm": 3.5, "ellipseMinorKm": 2.1, "ellipseAngleDeg": 52, "currentVelocityKnots": 1.20, "windStressFactor": 0.034},
            {"stepHour": -9, "timestamp": "2026-08-28T21:45:00Z", "coordinates": [19.2550, 71.0900], "ellipseMajorKm": 5.2, "ellipseMinorKm": 3.0, "ellipseAngleDeg": 56, "currentVelocityKnots": 1.15, "windStressFactor": 0.034},
            {"stepHour": -12, "timestamp": "2026-08-28T18:45:00Z", "coordinates": [19.1850, 70.9240], "ellipseMajorKm": 6.8, "ellipseMinorKm": 4.1, "ellipseAngleDeg": 60, "currentVelocityKnots": 1.05, "windStressFactor": 0.034}
        ])
    )
    db.add(hc1)

    # Vessels for Incident 1
    vessels_data = [
        {
            "id": "VES-01",
            "name": "MT OCEAN VANGUARD",
            "imo": "9481234",
            "mmsi": "538009871",
            "callSign": "V7AB8",
            "flag": "Marshall Islands",
            "flagCode": "MH",
            "vesselType": "Crude Oil Tanker (VLCC)",
            "lengthM": 333,
            "beamM": 60,
            "draughtM": 21.5,
            "dwtTons": 318500,
            "yearBuilt": 2017,
            "owner": "Pacific Maritime Holdings Ltd.",
            "operator": "Vanguard Tanker Management S.A.",
            "destination": "Sikka Terminal, India",
            "eta": "2026-08-30T14:00:00Z",
            "currentCoords": [19.6450, 70.1200],
            "hindcastInterceptCoords": [19.1880, 70.9190],
            "interceptTimestamp": "2026-08-28T19:35:00Z",
            "speedKnots": 11.2,
            "headingDeg": 342,
            "distanceScore": 97.4,
            "timeMatchScore": 98.1,
            "routeSimilarityScore": 92.6,
            "anomalyScore": 95.0,
            "overallAttributionScore": 96.2,
            "isPrimeSuspect": True,
            "aisStatus": "AIS Anomaly / Speed Drop",
            "history": [
                {"timestamp": "2026-08-28T16:00:00Z", "coords": [18.950, 70.620], "speedKnots": 14.5, "courseDeg": 42},
                {"timestamp": "2026-08-28T18:00:00Z", "coords": [19.120, 70.820], "speedKnots": 13.8, "courseDeg": 40},
                {"timestamp": "2026-08-28T19:30:00Z", "coords": [19.188, 70.919], "speedKnots": 6.4, "courseDeg": 38},
                {"timestamp": "2026-08-28T21:30:00Z", "coords": [19.245, 70.985], "speedKnots": 7.1, "courseDeg": 35},
                {"timestamp": "2026-08-28T23:30:00Z", "coords": [19.380, 70.750], "speedKnots": 14.2, "courseDeg": 330},
                {"timestamp": "2026-08-29T06:00:00Z", "coords": [19.645, 70.120], "speedKnots": 14.8, "courseDeg": 325}
            ],
            "summary": "Spatial match within 480 meters of hindcast discharge centroid. Vessel executed sudden speed drop from 14.2 to 6.4 kts for 2.8 hours at origin coordinates, accompanied by 850m course divergence characteristic of open-sea ballast slop discharge."
        },
        {
            "id": "VES-02",
            "name": "MV ARABIAN STAR",
            "imo": "9623841",
            "mmsi": "419001429",
            "callSign": "AUVZ",
            "flag": "India",
            "flagCode": "IN",
            "vesselType": "Chemical / Products Tanker",
            "lengthM": 182,
            "beamM": 32,
            "draughtM": 11.2,
            "dwtTons": 49990,
            "yearBuilt": 2019,
            "owner": "Shipping Corporation of India",
            "operator": "SCI Tanker Services",
            "destination": "Mumbai Port (JNPT)",
            "eta": "2026-08-29T18:00:00Z",
            "currentCoords": [19.0120, 71.8500],
            "hindcastInterceptCoords": [19.1120, 70.8200],
            "interceptTimestamp": "2026-08-28T16:15:00Z",
            "speedKnots": 13.5,
            "headingDeg": 105,
            "distanceScore": 54.0,
            "timeMatchScore": 48.5,
            "routeSimilarityScore": 62.0,
            "anomalyScore": 12.0,
            "overallAttributionScore": 44.1,
            "isPrimeSuspect": False,
            "aisStatus": "Normal AIS",
            "history": [
                {"timestamp": "2026-08-28T14:00:00Z", "coords": [19.200, 70.500], "speedKnots": 13.6, "courseDeg": 110},
                {"timestamp": "2026-08-28T16:15:00Z", "coords": [19.112, 70.820], "speedKnots": 13.5, "courseDeg": 108},
                {"timestamp": "2026-08-28T18:30:00Z", "coords": [19.040, 71.200], "speedKnots": 13.4, "courseDeg": 105}
            ],
            "summary": "Vessel transited 14.8 km south of hindcasted origin point 3.2 hours prior to estimated discharge start. Constant cruising speed maintained with no engine anomalies."
        },
        {
            "id": "VES-03",
            "name": "COSCO PACIFIC TRADER",
            "imo": "9745129",
            "mmsi": "477283900",
            "callSign": "VRKQ6",
            "flag": "Hong Kong",
            "flagCode": "HK",
            "vesselType": "Container Ship (14000 TEU)",
            "lengthM": 366,
            "beamM": 48,
            "draughtM": 14.8,
            "dwtTons": 145000,
            "yearBuilt": 2021,
            "owner": "COSCO Shipping Lines Co.",
            "operator": "COSCO Maritime Fleet",
            "destination": "Jebel Ali, UAE",
            "eta": "2026-09-01T08:00:00Z",
            "currentCoords": [20.1500, 69.4500],
            "hindcastInterceptCoords": [19.2800, 70.9900],
            "interceptTimestamp": "2026-08-28T22:40:00Z",
            "speedKnots": 19.8,
            "headingDeg": 295,
            "distanceScore": 61.2,
            "timeMatchScore": 42.0,
            "routeSimilarityScore": 48.0,
            "anomalyScore": 8.0,
            "overallAttributionScore": 38.5,
            "isPrimeSuspect": False,
            "aisStatus": "Normal AIS",
            "history": [
                {"timestamp": "2026-08-28T20:00:00Z", "coords": [19.120, 71.400], "speedKnots": 20.1, "courseDeg": 295},
                {"timestamp": "2026-08-28T22:40:00Z", "coords": [19.280, 70.990], "speedKnots": 19.8, "courseDeg": 295},
                {"timestamp": "2026-08-29T02:00:00Z", "coords": [19.650, 70.300], "speedKnots": 19.9, "courseDeg": 295}
            ],
            "summary": "Container vessel transited at constant high speed (19.8 kts). Fuel type mismatch (ULSFO) and absence of cargo hold discharge capabilities make direct culpability highly improbable."
        },
        {
            "id": "VES-04",
            "name": "STOLT PROTECTOR",
            "imo": "9394582",
            "mmsi": "319082000",
            "callSign": "ZCIQ4",
            "flag": "Cayman Islands",
            "flagCode": "KY",
            "vesselType": "Parcel Tanker",
            "lengthM": 165,
            "beamM": 27,
            "draughtM": 9.8,
            "dwtTons": 32000,
            "yearBuilt": 2012,
            "owner": "Stolt Tankers B.V.",
            "operator": "Stolt-Nielsen Fleet",
            "destination": "Kandla Port",
            "eta": "2026-08-30T10:00:00Z",
            "currentCoords": [20.8000, 69.9000],
            "hindcastInterceptCoords": [19.2400, 70.7800],
            "interceptTimestamp": "2026-08-28T17:10:00Z",
            "speedKnots": 12.8,
            "headingDeg": 355,
            "distanceScore": 42.0,
            "timeMatchScore": 35.0,
            "routeSimilarityScore": 50.0,
            "anomalyScore": 5.0,
            "overallAttributionScore": 31.2,
            "isPrimeSuspect": False,
            "aisStatus": "Normal AIS",
            "history": [
                {"timestamp": "2026-08-28T15:00:00Z", "coords": [18.900, 70.750], "speedKnots": 12.9, "courseDeg": 358},
                {"timestamp": "2026-08-28T17:10:00Z", "coords": [19.240, 70.780], "speedKnots": 12.8, "courseDeg": 355}
            ],
            "summary": "Vessel route passed 22 km west of hindcast centroid during pre-discharge window. No course or engine variations observed."
        }
    ]

    for v in vessels_data:
        db.add(AttributedVesselModel(
            id=v["id"],
            incident_id="INC-2026-0829-01",
            name=v["name"],
            imo=v["imo"],
            mmsi=v["mmsi"],
            call_sign=v["callSign"],
            flag=v["flag"],
            flag_code=v["flagCode"],
            vessel_type=v["vesselType"],
            length_m=v["lengthM"],
            beam_m=v["beamM"],
            draught_m=v["draughtM"],
            dwt_tons=v["dwtTons"],
            year_built=v["yearBuilt"],
            owner=v["owner"],
            operator=v["operator"],
            destination=v["destination"],
            eta=v["eta"],
            current_lat=v["currentCoords"][0],
            current_lng=v["currentCoords"][1],
            intercept_lat=v["hindcastInterceptCoords"][0],
            intercept_lng=v["hindcastInterceptCoords"][1],
            intercept_timestamp=v["interceptTimestamp"],
            speed_knots=v["speedKnots"],
            heading_deg=v["headingDeg"],
            distance_score=v["distanceScore"],
            time_match_score=v["timeMatchScore"],
            route_similarity_score=v["routeSimilarityScore"],
            anomaly_score=v["anomalyScore"],
            overall_attribution_score=v["overallAttributionScore"],
            is_prime_suspect=v["isPrimeSuspect"],
            ais_status=v["aisStatus"],
            history_points_json=json.dumps(v["history"]),
            forensic_summary=v["summary"]
        ))

    # Incident 2: Gulf of Kachchh Outer Fairway Slick
    inc2 = IncidentModel(
        id="INC-2026-0828-02",
        name="Gulf of Kachchh Outer Fairway Slick",
        region="Arabian Sea — Gujarat Coast",
        lat=22.4820,
        lng=69.2150,
        polygon_json=json.dumps([
            [22.495, 69.190],
            [22.510, 69.225],
            [22.488, 69.245],
            [22.465, 69.220],
            [22.475, 69.185],
            [22.495, 69.190]
        ]),
        detection_time="2026-08-28T11:20:00Z",
        sensor="Sentinel-2B MSI (SWIR/NDWI)",
        resolution="10.0m Spatial GSD",
        confidence=94.5,
        area_km2=18.2,
        estimated_volume_bbl=780,
        estimated_volume_tons=110,
        oil_type="Bunker Fuel C",
        thickness_microns=32.0,
        severity="High",
        status="Hindcast Verified",
        coastal_distance_km=34.0,
        eta_to_coast_hours=19.5,
        protected_area_nearby="Marine National Park & Sanctuary, Jamnagar",
        sensitivity_index="Very High",
        wind_speed_knots=12.0,
        wind_direction_deg=260,
        current_speed_knots=2.1,
        current_direction_deg=80,
        sea_surface_temp_c=29.1,
        wave_height_m=1.2
    )
    db.add(inc2)

    db.add(DriftForecastStepModel(
        incident_id="INC-2026-0828-02",
        time_offset_hours=0,
        timestamp="2026-08-28T11:20:00Z",
        lat=22.4820,
        lng=69.2150,
        area_km2=18.2,
        uncertainty_radius_km=0.8,
        polygon_json=json.dumps([[22.495, 69.190], [22.510, 69.225], [22.488, 69.245], [22.465, 69.220], [22.475, 69.185], [22.495, 69.190]])
    ))

    db.add(HindcastModel(
        incident_id="INC-2026-0828-02",
        origin_lat=22.3800,
        origin_lng=68.9500,
        origin_name="Gulf of Kachchh Deepwater Anchorage",
        discharge_start_time="2026-08-28T02:00:00Z",
        discharge_end_time="2026-08-28T05:30:00Z",
        duration_hours=3.5,
        windage_factor_used=0.032,
        hydrodynamic_model="Delft3D Tidal Stream + WRF Local Winds",
        confidence=91.8,
        release_volume_est_bbl=850,
        uncertainty_area_km2=9.4,
        backward_steps_json=json.dumps([
            {"stepHour": 0, "timestamp": "2026-08-28T11:20:00Z", "coordinates": [22.4820, 69.2150], "ellipseMajorKm": 0.8, "ellipseMinorKm": 0.5, "ellipseAngleDeg": 60, "currentVelocityKnots": 2.1, "windStressFactor": 0.032},
            {"stepHour": -6, "timestamp": "2026-08-28T05:20:00Z", "coordinates": [22.4200, 69.0800], "ellipseMajorKm": 2.4, "ellipseMinorKm": 1.5, "ellipseAngleDeg": 65, "currentVelocityKnots": 1.8, "windStressFactor": 0.032},
            {"stepHour": -10, "timestamp": "2026-08-28T01:20:00Z", "coordinates": [22.3800, 68.9500], "ellipseMajorKm": 4.1, "ellipseMinorKm": 2.8, "ellipseAngleDeg": 70, "currentVelocityKnots": 1.5, "windStressFactor": 0.032}
        ])
    ))

    db.add(AttributedVesselModel(
        id="VES-G1",
        incident_id="INC-2026-0828-02",
        name="MT KACHCHH GLORY",
        imo="9512398",
        mmsi="419002150",
        call_sign="ATJK",
        flag="India",
        flag_code="IN",
        vessel_type="Aframax Crude Tanker",
        length_m=244,
        beam_m=42,
        draught_m=14.2,
        dwt_tons=105000,
        year_built=2015,
        owner="Western Maritime Logistics",
        operator="Kachchh Shipping Corp",
        destination="Vadinar SPM",
        eta="2026-08-28T16:00:00Z",
        current_lat=22.4100,
        current_lng=69.6000,
        intercept_lat=22.3820,
        intercept_lng=68.9550,
        intercept_timestamp="2026-08-28T03:15:00Z",
        speed_knots=10.4,
        heading_deg=75,
        distance_score=92.5,
        time_match_score=94.0,
        route_similarity_score=89.0,
        anomaly_score=88.0,
        overall_attribution_score=91.2,
        is_prime_suspect=True,
        ais_status="AIS Anomaly / Speed Drop",
        history_points_json=json.dumps([
            {"timestamp": "2026-08-28T01:00:00Z", "coords": [22.310, 68.750], "speedKnots": 12.8, "courseDeg": 72},
            {"timestamp": "2026-08-28T03:15:00Z", "coords": [22.382, 68.955], "speedKnots": 4.2, "courseDeg": 70},
            {"timestamp": "2026-08-28T05:30:00Z", "coords": [22.400, 69.150], "speedKnots": 11.5, "courseDeg": 78}
        ]),
        forensic_summary="Vessel hovered for 2h 15m near SPM channel waypoint prior to port clearance. Speed reduced to 4.2 kts corresponding precisely with hindcast release window."
    ))

    # Incident 3: Bay of Bengal Deepwater Discharge
    inc3 = IncidentModel(
        id="INC-2026-0827-03",
        name="Bay of Bengal Deepwater Discharge",
        region="Bay of Bengal — Paradip Offshore Corridor",
        lat=19.8250,
        lng=87.2100,
        polygon_json=json.dumps([
            [19.840, 87.180],
            [19.860, 87.225],
            [19.835, 87.255],
            [19.805, 87.220],
            [19.815, 87.175],
            [19.840, 87.180]
        ]),
        detection_time="2026-08-27T16:10:00Z",
        sensor="RADARSAT-Constellation Mission (RCM-1 SAR)",
        resolution="5.0m High-Res GSD",
        confidence=98.2,
        area_km2=29.5,
        estimated_volume_bbl=1240,
        estimated_volume_tons=175,
        oil_type="Light Diesel / Condensate",
        thickness_microns=18.5,
        severity="Moderate",
        status="Active Tracking",
        coastal_distance_km=118.0,
        eta_to_coast_hours=58.0,
        protected_area_nearby="Gahirmatha Olive Ridley Turtle Sanctuary",
        sensitivity_index="High",
        wind_speed_knots=11.2,
        wind_direction_deg=195,
        current_speed_knots=0.95,
        current_direction_deg=35,
        sea_surface_temp_c=30.2,
        wave_height_m=1.4
    )
    db.add(inc3)

    db.add(DriftForecastStepModel(
        incident_id="INC-2026-0827-03",
        time_offset_hours=0,
        timestamp="2026-08-27T16:10:00Z",
        lat=19.8250,
        lng=87.2100,
        area_km2=29.5,
        uncertainty_radius_km=0.9,
        polygon_json=json.dumps([[19.840, 87.180], [19.860, 87.225], [19.835, 87.255], [19.805, 87.220], [19.815, 87.175], [19.840, 87.180]])
    ))

    db.add(HindcastModel(
        incident_id="INC-2026-0827-03",
        origin_lat=19.6200,
        origin_lng=86.9800,
        origin_name="East Coast Shipping Highway Sector E-2",
        discharge_start_time="2026-08-27T08:00:00Z",
        discharge_end_time="2026-08-27T10:45:00Z",
        duration_hours=2.75,
        windage_factor_used=0.030,
        hydrodynamic_model="INCOIS Coastal Ocean Model + GFS Winds",
        confidence=93.0,
        release_volume_est_bbl=1300,
        uncertainty_area_km2=12.1,
        backward_steps_json=json.dumps([
            {"stepHour": 0, "timestamp": "2026-08-27T16:10:00Z", "coordinates": [19.8250, 87.2100], "ellipseMajorKm": 0.9, "ellipseMinorKm": 0.6, "ellipseAngleDeg": 35, "currentVelocityKnots": 0.95, "windStressFactor": 0.030},
            {"stepHour": -8, "timestamp": "2026-08-27T08:10:00Z", "coordinates": [19.6200, 86.9800], "ellipseMajorKm": 3.8, "ellipseMinorKm": 2.4, "ellipseAngleDeg": 40, "currentVelocityKnots": 0.88, "windStressFactor": 0.030}
        ])
    ))

    db.add(AttributedVesselModel(
        id="VES-B1",
        incident_id="INC-2026-0827-03",
        name="MSC AEGEAN VOYAGER",
        imo="9785432",
        mmsi="354981000",
        call_sign="3FGB8",
        flag="Panama",
        flag_code="PA",
        vessel_type="Container Carrier",
        length_m=299,
        beam_m=48,
        draught_m=13.5,
        dwt_tons=98000,
        year_built=2018,
        owner="Mediterranean Shipping Co.",
        operator="MSC Fleet Geneva",
        destination="Kolkata (Haldia)",
        eta="2026-08-28T08:00:00Z",
        current_lat=20.6000,
        current_lng=87.8000,
        intercept_lat=19.6250,
        intercept_lng=86.9820,
        intercept_timestamp="2026-08-27T09:10:00Z",
        speed_knots=17.5,
        heading_deg=38,
        distance_score=88.0,
        time_match_score=91.0,
        route_similarity_score=84.0,
        anomaly_score=78.0,
        overall_attribution_score=86.5,
        is_prime_suspect=True,
        ais_status="AIS Gap / Transponder Off",
        history_points_json=json.dumps([
            {"timestamp": "2026-08-27T07:00:00Z", "coords": [19.450, 86.820], "speedKnots": 18.2, "courseDeg": 40},
            {"timestamp": "2026-08-27T09:10:00Z", "coords": [19.625, 86.982], "speedKnots": 17.5, "courseDeg": 38},
            {"timestamp": "2026-08-27T12:00:00Z", "coords": [19.950, 87.300], "speedKnots": 18.0, "courseDeg": 36}
        ]),
        forensic_summary="Transponder AIS gap logged for 42 minutes across estimated release timestamp. Intersected hindcast uncertainty ellipse within 1.1 km."
    ))

    # Sample Satellite Scans
    scans_data = [
        {
            "id": "SCAN-S1-MUMBAI",
            "name": "Sentinel-1A SAR C-Band — Mumbai High Basin",
            "satellite": "Sentinel-1A (ESA / Copernicus)",
            "sensorType": "SAR C-Band",
            "mode": "Interferometric Wide (IW) - VV Polarization",
            "acquisitionDate": "2026-08-29 06:45:12 UTC",
            "locationName": "Mumbai High Offshore Platform Field",
            "centerCoords": [19.3824, 71.3412],
            "rawImageUrl": "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80",
            "maskImageUrl": "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80",
            "thermalImageUrl": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
            "spectralBands": ["VV (Dual-Pol)", "VH (Cross-Pol)", "Normalized Radar Cross Section (NRCS)"],
            "confidence": 96.8,
            "areaKm2": 42.8,
            "severity": "Critical",
            "oilType": "Heavy Crude",
            "estimatedVolumeBbl": 1850,
            "detectedPolygon": [[19.395, 71.325], [19.412, 71.358], [19.398, 71.385], [19.365, 71.372], [19.352, 71.339], [19.378, 71.318], [19.395, 71.325]],
            "notes": "Distinct dark backscatter signature damping Bragg scattering on sea surface. Neural network DeepLabV3+ flagged high boundary contrast with 96.8% confidence."
        },
        {
            "id": "SCAN-S2-KACHCHH",
            "name": "Sentinel-2B Optical MSI — Gulf of Kachchh",
            "satellite": "Sentinel-2B (ESA / Copernicus)",
            "sensorType": "Optical Multispectral",
            "mode": "MSI Level-2A Bottom-of-Atmosphere (BOA)",
            "acquisitionDate": "2026-08-28 11:20:00 UTC",
            "locationName": "Gulf of Kachchh Outer Channel",
            "centerCoords": [22.4820, 69.2150],
            "rawImageUrl": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
            "maskImageUrl": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80",
            "thermalImageUrl": "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80",
            "spectralBands": ["B02 (Blue)", "B03 (Green)", "B04 (Red)", "B08 (NIR)", "B11 (SWIR-1)"],
            "confidence": 94.5,
            "areaKm2": 18.2,
            "severity": "High",
            "oilType": "Bunker Fuel C",
            "estimatedVolumeBbl": 780,
            "detectedPolygon": [[22.495, 69.190], [22.510, 69.225], [22.488, 69.245], [22.465, 69.220], [22.475, 69.185], [22.495, 69.190]],
            "notes": "Sun-glint enhanced multispectral SWIR index shows hydrocarbon absorption peaks at 1.73 µm and 2.31 µm."
        },
        {
            "id": "SCAN-RCM-PARADIP",
            "name": "RADARSAT-Constellation Mission — Paradip Corridor",
            "satellite": "RCM-1 (Canadian Space Agency)",
            "sensorType": "SAR C-Band",
            "mode": "High-Resolution 5m StripMap",
            "acquisitionDate": "2026-08-27 16:10:00 UTC",
            "locationName": "Bay of Bengal Deepwater Sector",
            "centerCoords": [19.8250, 87.2100],
            "rawImageUrl": "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80",
            "maskImageUrl": "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80",
            "thermalImageUrl": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80",
            "spectralBands": ["HH", "HV", "Compact Pol Circular RH/RV"],
            "confidence": 98.2,
            "areaKm2": 29.5,
            "severity": "Moderate",
            "oilType": "Light Diesel / Condensate",
            "estimatedVolumeBbl": 1240,
            "detectedPolygon": [[19.840, 87.180], [19.860, 87.225], [19.835, 87.255], [19.805, 87.220], [19.815, 87.175], [19.840, 87.180]],
            "notes": "Linear sheen formation detected along ship transit vector. Polarimetric entropy analysis confirms low surface roughness."
        },
        {
            "id": "SCAN-FLIR-AIRBORNE",
            "name": "Airborne FLIR Thermal Infrared — Coastal Surveillance",
            "satellite": "Maritime Patrol Aircraft (Do-228 FLIR)",
            "sensorType": "Thermal IR",
            "mode": "Long-Wave Infrared (LWIR 8-14 µm)",
            "acquisitionDate": "2026-08-29 09:30:00 UTC",
            "locationName": "Nearshore Coastal Reconnaissance",
            "centerCoords": [19.4500, 71.4500],
            "rawImageUrl": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80",
            "maskImageUrl": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
            "thermalImageUrl": "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80",
            "spectralBands": ["LWIR Thermal (8-14 µm)", "Visible Daytime High Definition"],
            "confidence": 97.5,
            "areaKm2": 12.4,
            "severity": "High",
            "oilType": "Heavy Crude",
            "estimatedVolumeBbl": 620,
            "detectedPolygon": [[19.460, 71.430], [19.475, 71.465], [19.450, 71.485], [19.435, 71.450], [19.460, 71.430]],
            "notes": "Direct thermal contrast measurement: thick emulsion core shows +2.8°C thermal signature due to solar absorption compared to ambient water."
        }
    ]

    for s in scans_data:
        db.add(SampleScanModel(
            id=s["id"],
            name=s["name"],
            satellite=s["satellite"],
            sensor_type=s["sensorType"],
            mode=s["mode"],
            acquisition_date=s["acquisitionDate"],
            location_name=s["locationName"],
            center_lat=s["centerCoords"][0],
            center_lng=s["centerCoords"][1],
            raw_image_url=s["rawImageUrl"],
            mask_image_url=s["maskImageUrl"],
            thermal_image_url=s["thermalImageUrl"],
            spectral_bands_json=json.dumps(s["spectralBands"]),
            confidence=s["confidence"],
            area_km2=s["areaKm2"],
            severity=s["severity"],
            oil_type=s["oilType"],
            estimated_volume_bbl=s["estimatedVolumeBbl"],
            detected_polygon_json=json.dumps(s["detectedPolygon"]),
            notes=s["notes"]
        ))

    # Seed Initial Forensic Report
    db.add(IncidentReportModel(
        id="REP-INC-2026-0829-01",
        incident_id="INC-2026-0829-01",
        created_at="2026-08-29T10:00:00Z",
        classification="OFFICIAL EVIDENCE // MARPOL COMPLIANT",
        investigator_notes="Visual analysis confirms dark SAR formation damping Bragg wave scattering across Sector 4B. Cross-correlation with HYCOM hydrodynamic backtrack identifies vessel loitering anomaly with 96.2% confidence. Immediate Port State Control inspection recommended upon docking.",
        digital_seal_hash="e7b89f2a4c1038b4d82f7193b092ac192837f48e9102c81"
    ))

    db.commit()
    db.close()
    print("Database seeded successfully!")

if __name__ == "__main__":
    seed_database()

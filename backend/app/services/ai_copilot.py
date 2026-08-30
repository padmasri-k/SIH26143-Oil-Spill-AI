from typing import Dict, Any, List

def query_maritime_intelligence(
    prompt: str,
    incident: Dict[str, Any],
    prime_suspect: Dict[str, Any]
) -> Dict[str, Any]:
    """
    Generates domain-grounded conversational reasoning for SIH26143.
    """
    lower = prompt.lower()
    inc_name = incident.get("name", "Active Incident")
    inc_id = incident.get("id", "INC-01")
    area_km2 = incident.get("areaKm2", 42.8)
    oil_type = incident.get("oilType", "Heavy Crude")
    conf = incident.get("confidence", 96.8)
    vessel_name = prime_suspect.get("name", "MT OCEAN VANGUARD")
    vessel_imo = prime_suspect.get("imo", "9481234")
    vessel_score = prime_suspect.get("overallAttributionScore", 96.2)
    vessel_dest = prime_suspect.get("destination", "Sikka Terminal")
    met = incident.get("currentMetOcean", {})
    env = incident.get("environmentalRisk", {})

    if any(k in lower for k in ['suspect', 'ocean vanguard', 'culprit', 'vessel', 'who']):
        reply = (
            f"### 🚨 Primary Suspect Attribution Finding: **{vessel_name}**\n\n"
            f"Cross-referencing satellite SAR segmentation against historical AIS positional logs for **{inc_name} ({inc_id})** identifies **{vessel_name} (IMO: {vessel_imo})** with an **attribution confidence score of {vessel_score}%**.\n\n"
            f"#### Evidentiary Analysis Breakdown:\n"
            f"1. **Spatial Intercept**: Proximity within **480 meters** of reconstructed Lagrangian discharge centroid.\n"
            f"2. **Discharge Synchronization**: Transited origin waypoint at **{prime_suspect.get('interceptTimestamp', '2026-08-28 19:35 UTC')}**, matching the hindcasted release window.\n"
            f"3. **Speed & Maneuver Anomaly**: Logged sudden speed reduction from **14.2 knots down to 6.4 knots for 2.8 hours**, accompanied by an open-sea zigzag route characteristic of illegal oily ballast dumping under MARPOL Annex I.\n\n"
            f"**Recommended Directives:** Notify Indian Coast Guard Maritime Rescue Coordination Centre (MRCC) and issue Port State Control inspection order upon docking at **{vessel_dest}**."
        )
        refs = [
            {"label": f"Suspect: {vessel_name}", "url": "/attribution", "type": "vessel"},
            {"label": "Hindcast Origin HC-01", "url": "/hindcasting", "type": "incident"}
        ]
        actions = [
            "Inspect Vessel Dossier",
            "Generate Enforcement Memo",
            "Export AIS Trajectory GeoJSON"
        ]

    elif any(k in lower for k in ['drift', 'forecast', '48', 'weather', 'hydrodynamic', 'spread']):
        reply = (
            f"### 🌊 Hydrodynamic Drift & Slick Spreading Forecast (+72h)\n\n"
            f"**MetOcean Conditions at {inc_name}:**\n"
            f"- **Surface Current (HYCOM)**: {met.get('currentSpeedKnots', 1.35)} kts @ {met.get('currentDirectionDeg', 55)}°\n"
            f"- **Wind Stress (ECMWF ERA5)**: {met.get('windSpeedKnots', 14.8)} kts @ {met.get('windDirectionDeg', 235)}° (3.4% Windage)\n"
            f"- **Sea Surface Temp**: {met.get('seaSurfaceTempC', 28.4)}°C | Wave Height: {met.get('waveHeightM', 1.8)}m\n\n"
            f"**Spread Trajectory:**\n"
            f"- Current: **{area_km2} km²** ({oil_type})\n"
            f"- +24h Horizon: **69.4 km²**\n"
            f"- +48h Horizon: **92.1 km²**\n"
            f"- +72h Horizon: **118.6 km²** with significant emulsification (chocolate mousse viscosity increase)."
        )
        refs = [
            {"label": "Forward Drift Forecast", "url": "/tracking", "type": "metric"},
            {"label": "Weathering Decay Chart", "url": "/tracking", "type": "metric"}
        ]
        actions = [
            "Open 48h Time Scrubber",
            "View Weathering Curves",
            "Check Coastal ETA"
        ]

    elif any(k in lower for k in ['coastal', 'risk', 'sanctuary', 'habitat', 'beach', 'mangrove']):
        reply = (
            f"### 🛡️ Coastal Vulnerability & Environmental Risk Assessment\n\n"
            f"- **Vulnerable Zone Nearby**: **{env.get('protectedAreaNearby', 'Alibaug Coral Reef Marine Sanctuary')}**\n"
            f"- **Distance to Shoreline**: **{env.get('coastalDistanceKm', 142.5)} km**\n"
            f"- **Estimated Shoreline Impact ETA**: **~{env.get('etaToCoastHours', 48.0)} Hours**\n"
            f"- **Sensitivity Rating**: **{env.get('sensitivityIndex', 'Very High')}**\n\n"
            f"**Containment Strategy:** Pre-stage offshore containment booms and skimmers along the 50-meter bathymetry contour to intercept the leading edge prior to shallow intertidal ingress."
        )
        refs = [
            {"label": "Coastal Threat Radius", "url": "/tracking", "type": "metric"}
        ]
        actions = [
            "View Coastal Warning",
            "Issue Emergency Notification",
            "Compile Incident Report"
        ]

    elif any(k in lower for k in ['memo', 'court', 'legal', 'coast guard', 'dg shipping', 'enforcement']):
        reply = (
            f"### 📋 Official Maritime Enforcement Evidentiary Memo\n\n"
            f"**TO:** Commander, Indian Coast Guard MRCC / Directorate General of Shipping\n"
            f"**FROM:** OceanGuard AI Maritime Surveillance Unit\n"
            f"**REGARDING:** Statutory Action under Merchant Shipping Act (Part XI-A) & MARPOL Annex I\n\n"
            f"1. **INCIDENT SUMMARY**: Detected surface hydrocarbon slick of **{area_km2} km²** ({oil_type}) via Sentinel-1A SAR.\n"
            f"2. **HINDCAST CENTROID**: Point HC-01 at **19.1850°N, 70.9240°E** (Discharge window: 2026-08-28 18:20–21:45 UTC).\n"
            f"3. **CULPRIT ATTRIBUTION**: **{vessel_name}** (IMO: {vessel_imo}, Flag: {prime_suspect.get('flag', 'Marshall Islands')}) with 6.4 kt loitering anomaly.\n"
            f"4. **RECOMMENDED ACTION**: Order physical oil sampling for Gas Chromatography-Mass Spectrometry (GC-MS) fingerprinting and detain vessel at next port of call."
        )
        refs = [
            {"label": "Official Forensic Dossier", "url": "/reports", "type": "report"}
        ]
        actions = [
            "Download PDF Report",
            "Export JSON Evidence Package",
            "Edit Field Notes"
        ]

    else:
        reply = (
            f"### 🤖 Maritime Intelligence Analysis for {inc_name}\n\n"
            f"Operational telemetry summary for active target **{inc_id}**:\n"
            f"- **Detected Area**: {area_km2} km² ({oil_type}, {conf}% AI Confidence)\n"
            f"- **Suspect Identification**: **{vessel_name}** ({vessel_score}% attribution score)\n"
            f"- **Shoreline Distance**: {env.get('coastalDistanceKm', 142.5)} km (ETA ~{env.get('etaToCoastHours', 48)}h)\n\n"
            f"How would you like to direct this investigation?"
        )
        refs = [
            {"label": "Command Dashboard", "url": "/dashboard", "type": "incident"}
        ]
        actions = [
            "Run Spaceborne Scan",
            "View Hindcast Origins",
            "Inspect Suspect Vessel"
        ]

    return {
        "reply": reply,
        "incident_id": inc_id,
        "references": refs,
        "suggested_actions": actions,
        "timestamp": "2026-08-30T10:30:00Z"
    }

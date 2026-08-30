import math
from typing import Dict, Any, List

def calculate_haversine_distance_km(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Calculate the great-circle distance between two points in km."""
    R = 6371.0
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = math.sin(dlat / 2)**2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon / 2)**2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return R * c

def compute_vessel_attribution_scores(
    vessel_data: Dict[str, Any],
    origin_coords: List[float],
    discharge_window_hours: float
) -> Dict[str, float]:
    """
    Computes a 4-factor multi-criteria attribution score:
    - Distance Score (30% weight): Proximity to origin point
    - Temporal Match Score (25% weight): Timestamp coincidence
    - Route Similarity Score (25% weight): Heading and corridor continuity
    - Anomaly Score (20% weight): Speed reduction (<7 kts) or AIS gap
    """
    intercept_coords = vessel_data.get("hindcastInterceptCoords", [0.0, 0.0])
    dist_km = calculate_haversine_distance_km(
        origin_coords[0], origin_coords[1],
        intercept_coords[0], intercept_coords[1]
    )

    # 1. Distance Score: 100 at 0km, decays smoothly over 25km
    distance_score = max(0.0, min(100.0, 100.0 - (dist_km / 0.25)))
    if dist_km < 1.0:
        distance_score = max(90.0, 100.0 - (dist_km * 5.0))

    # 2. Time Match Score
    time_match_score = vessel_data.get("timeMatchScore", 85.0)

    # 3. Route Similarity Score
    route_similarity_score = vessel_data.get("routeSimilarityScore", 80.0)

    # 4. Anomaly Score
    speed = vessel_data.get("speedKnots", 12.0)
    ais_status = vessel_data.get("aisStatus", "Normal AIS")
    
    if "Anomaly" in ais_status or speed < 8.0:
        anomaly_score = 95.0
    elif "Gap" in ais_status:
        anomaly_score = 88.0
    else:
        anomaly_score = 15.0

    # Overall Weighted Score
    overall = (
        (distance_score * 0.30) +
        (time_match_score * 0.25) +
        (route_similarity_score * 0.25) +
        (anomaly_score * 0.20)
    )

    return {
        "distanceScore": round(distance_score, 1),
        "timeMatchScore": round(time_match_score, 1),
        "routeSimilarityScore": round(route_similarity_score, 1),
        "anomalyScore": round(anomaly_score, 1),
        "overallAttributionScore": round(overall, 1)
    }

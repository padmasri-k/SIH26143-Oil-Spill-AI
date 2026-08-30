export type SeverityLevel = 'Critical' | 'High' | 'Moderate' | 'Minor';
export type IncidentStatus = 'Active Tracking' | 'Hindcast Verified' | 'Attribution Confirmed' | 'Contained';
export type OilType = 'Heavy Crude' | 'Bunker Fuel C' | 'Light Diesel / Condensate' | 'Refined Gasoil';

export interface MetOceanConditions {
  windSpeedKnots: number;
  windDirectionDeg: number;
  currentSpeedKnots: number;
  currentDirectionDeg: number;
  seaSurfaceTempC: number;
  waveHeightM: number;
}

export interface EnvironmentalRisk {
  coastalDistanceKm: number;
  etaToCoastHours: number;
  protectedAreaNearby: string;
  sensitivityIndex: 'Very High' | 'High' | 'Medium' | 'Low';
}

export interface DriftStep {
  timeOffsetHours: number;
  timestamp: string;
  coordinates: [number, number];
  areaKm2: number;
  uncertaintyRadiusKm: number;
  polygon: [number, number][];
}

export interface HindcastStep {
  stepHour: number; // e.g. -2, -4, -6, -8, -12, -18, -24
  timestamp: string;
  coordinates: [number, number];
  ellipseMajorKm: number;
  ellipseMinorKm: number;
  ellipseAngleDeg: number;
  currentVelocityKnots: number;
  windStressFactor: number;
}

export interface HindcastData {
  originCoordinates: [number, number];
  originName: string;
  dischargeStartTime: string;
  dischargeEndTime: string;
  durationHours: number;
  backwardSteps: HindcastStep[];
  windageFactorUsed: number;
  hydrodynamicModel: string;
  confidence: number;
  releaseVolumeEstBbl: number;
  uncertaintyAreaKm2: number;
}

export interface VesselHistoryPoint {
  timestamp: string;
  coords: [number, number];
  speedKnots: number;
  courseDeg: number;
}

export interface AttributedVessel {
  id: string;
  name: string;
  imo: string;
  mmsi: string;
  callSign: string;
  flag: string;
  flagCode: string;
  vesselType: string;
  lengthM: number;
  beamM: number;
  draughtM: number;
  dwtTons: number;
  yearBuilt: number;
  owner: string;
  operator: string;
  destination: string;
  eta: string;
  currentCoords: [number, number];
  hindcastInterceptCoords: [number, number];
  interceptTimestamp: string;
  speedKnots: number;
  headingDeg: number;
  distanceScore: number;
  timeMatchScore: number;
  routeSimilarityScore: number;
  anomalyScore: number;
  overallAttributionScore: number;
  isPrimeSuspect: boolean;
  aisStatus: 'Normal AIS' | 'AIS Anomaly / Speed Drop' | 'AIS Gap / Transponder Off';
  historyPoints: VesselHistoryPoint[];
  forensicSummary: string;
}

export interface OilSpillIncident {
  id: string;
  name: string;
  region: string;
  coordinates: [number, number];
  polygon: [number, number][];
  detectionTime: string;
  sensor: string;
  resolution: string;
  confidence: number;
  areaKm2: number;
  estimatedVolumeBbl: number;
  estimatedVolumeTons: number;
  oilType: OilType;
  thicknessMicrons: number;
  severity: SeverityLevel;
  status: IncidentStatus;
  environmentalRisk: EnvironmentalRisk;
  currentMetOcean: MetOceanConditions;
  driftForecast: DriftStep[];
  hindcast: HindcastData;
  attributedVessels: AttributedVessel[];
}

export interface SampleDetectionScan {
  id: string;
  name: string;
  satellite: string;
  sensorType: 'SAR C-Band' | 'Optical Multispectral' | 'Thermal IR' | 'SAR X-Band';
  mode: string;
  acquisitionDate: string;
  locationName: string;
  centerCoords: [number, number];
  rawImageUrl: string;
  maskImageUrl: string;
  thermalImageUrl: string;
  spectralBands: string[];
  confidence: number;
  areaKm2: number;
  severity: SeverityLevel;
  oilType: OilType;
  estimatedVolumeBbl: number;
  detectedPolygon: [number, number][];
  notes: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  timestamp: string;
  content: string;
  references?: Array<{ label: string; url?: string; type: 'incident' | 'vessel' | 'satellite' | 'metric' }>;
  suggestedActions?: string[];
}

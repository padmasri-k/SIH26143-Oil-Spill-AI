import { OilSpillIncident, SampleDetectionScan, ChatMessage } from '../types';

export const mockIncidents: OilSpillIncident[] = [
  {
    id: 'INC-2026-0829-01',
    name: 'Mumbai High Offshore Sector 4B Slick',
    region: 'Arabian Sea — Mumbai Offshore Basin',
    coordinates: [19.3824, 71.3412],
    polygon: [
      [19.395, 71.325],
      [19.412, 71.358],
      [19.398, 71.385],
      [19.365, 71.372],
      [19.352, 71.339],
      [19.378, 71.318],
      [19.395, 71.325]
    ],
    detectionTime: '2026-08-29T06:45:00Z',
    sensor: 'Sentinel-1A C-SAR (IW GRDH Mode)',
    resolution: '10.0m Spatial GSD',
    confidence: 96.8,
    areaKm2: 42.8,
    estimatedVolumeBbl: 1850,
    estimatedVolumeTons: 260,
    oilType: 'Heavy Crude',
    thicknessMicrons: 45.2,
    severity: 'Critical',
    status: 'Attribution Confirmed',
    environmentalRisk: {
      coastalDistanceKm: 142.5,
      etaToCoastHours: 48.0,
      protectedAreaNearby: 'Alibaug Coral Reef Marine Sanctuary & Breeding Grounds',
      sensitivityIndex: 'Very High'
    },
    currentMetOcean: {
      windSpeedKnots: 14.8,
      windDirectionDeg: 235,
      currentSpeedKnots: 1.35,
      currentDirectionDeg: 55,
      seaSurfaceTempC: 28.4,
      waveHeightM: 1.8
    },
    driftForecast: [
      {
        timeOffsetHours: 0,
        timestamp: '2026-08-29T06:45:00Z',
        coordinates: [19.3824, 71.3412],
        areaKm2: 42.8,
        uncertaintyRadiusKm: 1.2,
        polygon: [
          [19.395, 71.325],
          [19.412, 71.358],
          [19.398, 71.385],
          [19.365, 71.372],
          [19.352, 71.339],
          [19.378, 71.318],
          [19.395, 71.325]
        ]
      },
      {
        timeOffsetHours: 6,
        timestamp: '2026-08-29T12:45:00Z',
        coordinates: [19.4150, 71.4120],
        areaKm2: 48.5,
        uncertaintyRadiusKm: 2.4,
        polygon: [
          [19.430, 71.390],
          [19.448, 71.432],
          [19.428, 71.460],
          [19.395, 71.442],
          [19.382, 71.408],
          [19.410, 71.382],
          [19.430, 71.390]
        ]
      },
      {
        timeOffsetHours: 12,
        timestamp: '2026-08-29T18:45:00Z',
        coordinates: [19.4520, 71.4880],
        areaKm2: 55.2,
        uncertaintyRadiusKm: 3.8,
        polygon: [
          [19.470, 71.460],
          [19.492, 71.512],
          [19.468, 71.540],
          [19.430, 71.518],
          [19.415, 71.480],
          [19.448, 71.452],
          [19.470, 71.460]
        ]
      },
      {
        timeOffsetHours: 24,
        timestamp: '2026-08-30T06:45:00Z',
        coordinates: [19.5310, 71.6350],
        areaKm2: 69.4,
        uncertaintyRadiusKm: 6.2,
        polygon: [
          [19.555, 71.600],
          [19.580, 71.665],
          [19.550, 71.695],
          [19.505, 71.670],
          [19.488, 71.622],
          [19.525, 71.590],
          [19.555, 71.600]
        ]
      },
      {
        timeOffsetHours: 48,
        timestamp: '2026-08-31T06:45:00Z',
        coordinates: [19.6820, 71.9120],
        areaKm2: 92.1,
        uncertaintyRadiusKm: 11.5,
        polygon: [
          [19.712, 71.870],
          [19.745, 71.950],
          [19.708, 71.988],
          [19.650, 71.955],
          [19.630, 71.895],
          [19.675, 71.855],
          [19.712, 71.870]
        ]
      },
      {
        timeOffsetHours: 72,
        timestamp: '2026-09-01T06:45:00Z',
        coordinates: [19.8250, 72.1850],
        areaKm2: 118.6,
        uncertaintyRadiusKm: 18.0,
        polygon: [
          [19.865, 72.135],
          [19.902, 72.230],
          [19.855, 72.275],
          [19.785, 72.235],
          [19.760, 72.165],
          [19.815, 72.118],
          [19.865, 72.135]
        ]
      }
    ],
    hindcast: {
      originCoordinates: [19.1850, 70.9240],
      originName: 'Western Arabian Sea Tanker Corridor (Point HC-01)',
      dischargeStartTime: '2026-08-28T18:20:00Z',
      dischargeEndTime: '2026-08-28T21:45:00Z',
      durationHours: 3.4,
      windageFactorUsed: 0.034,
      hydrodynamicModel: 'HYCOM 1/12° + ECMWF ERA5 Wind Stress + Stokes Wave Drift',
      confidence: 94.2,
      releaseVolumeEstBbl: 1950,
      uncertaintyAreaKm2: 18.5,
      backwardSteps: [
        {
          stepHour: 0,
          timestamp: '2026-08-29T06:45:00Z',
          coordinates: [19.3824, 71.3412],
          ellipseMajorKm: 1.2,
          ellipseMinorKm: 0.8,
          ellipseAngleDeg: 45,
          currentVelocityKnots: 1.35,
          windStressFactor: 0.034
        },
        {
          stepHour: -3,
          timestamp: '2026-08-29T03:45:00Z',
          coordinates: [19.3450, 71.2650],
          ellipseMajorKm: 2.1,
          ellipseMinorKm: 1.4,
          ellipseAngleDeg: 48,
          currentVelocityKnots: 1.28,
          windStressFactor: 0.034
        },
        {
          stepHour: -6,
          timestamp: '2026-08-29T00:45:00Z',
          coordinates: [19.3020, 71.1820],
          ellipseMajorKm: 3.5,
          ellipseMinorKm: 2.1,
          ellipseAngleDeg: 52,
          currentVelocityKnots: 1.20,
          windStressFactor: 0.034
        },
        {
          stepHour: -9,
          timestamp: '2026-08-28T21:45:00Z',
          coordinates: [19.2550, 71.0900],
          ellipseMajorKm: 5.2,
          ellipseMinorKm: 3.0,
          ellipseAngleDeg: 56,
          currentVelocityKnots: 1.15,
          windStressFactor: 0.034
        },
        {
          stepHour: -12,
          timestamp: '2026-08-28T18:45:00Z',
          coordinates: [19.1850, 70.9240],
          ellipseMajorKm: 6.8,
          ellipseMinorKm: 4.1,
          ellipseAngleDeg: 60,
          currentVelocityKnots: 1.05,
          windStressFactor: 0.034
        }
      ]
    },
    attributedVessels: [
      {
        id: 'VES-01',
        name: 'MT OCEAN VANGUARD',
        imo: '9481234',
        mmsi: '538009871',
        callSign: 'V7AB8',
        flag: 'Marshall Islands',
        flagCode: 'MH',
        vesselType: 'Crude Oil Tanker (VLCC)',
        lengthM: 333,
        beamM: 60,
        draughtM: 21.5,
        dwtTons: 318500,
        yearBuilt: 2017,
        owner: 'Pacific Maritime Holdings Ltd.',
        operator: 'Vanguard Tanker Management S.A.',
        destination: 'Sikka Terminal, India',
        eta: '2026-08-30T14:00:00Z',
        currentCoords: [19.6450, 70.1200],
        hindcastInterceptCoords: [19.1880, 70.9190],
        interceptTimestamp: '2026-08-28T19:35:00Z',
        speedKnots: 11.2,
        headingDeg: 342,
        distanceScore: 97.4,
        timeMatchScore: 98.1,
        routeSimilarityScore: 92.6,
        anomalyScore: 95.0,
        overallAttributionScore: 96.2,
        isPrimeSuspect: true,
        aisStatus: 'AIS Anomaly / Speed Drop',
        historyPoints: [
          { timestamp: '2026-08-28T16:00:00Z', coords: [18.950, 70.620], speedKnots: 14.5, courseDeg: 42 },
          { timestamp: '2026-08-28T18:00:00Z', coords: [19.120, 70.820], speedKnots: 13.8, courseDeg: 40 },
          { timestamp: '2026-08-28T19:30:00Z', coords: [19.188, 70.919], speedKnots: 6.4, courseDeg: 38 }, // ANOMALY SPEED DROP
          { timestamp: '2026-08-28T21:30:00Z', coords: [19.245, 70.985], speedKnots: 7.1, courseDeg: 35 },
          { timestamp: '2026-08-28T23:30:00Z', coords: [19.380, 70.750], speedKnots: 14.2, courseDeg: 330 },
          { timestamp: '2026-08-29T06:00:00Z', coords: [19.645, 70.120], speedKnots: 14.8, courseDeg: 325 }
        ],
        forensicSummary: 'Spatial match within 480 meters of hindcast discharge centroid. Vessel executed sudden speed drop from 14.2 to 6.4 kts for 2.8 hours at origin coordinates, accompanied by 850m course divergence characteristic of open-sea ballast slop discharge.'
      },
      {
        id: 'VES-02',
        name: 'MV ARABIAN STAR',
        imo: '9623841',
        mmsi: '419001429',
        callSign: 'AUVZ',
        flag: 'India',
        flagCode: 'IN',
        vesselType: 'Chemical / Products Tanker',
        lengthM: 182,
        beamM: 32,
        draughtM: 11.2,
        dwtTons: 49990,
        yearBuilt: 2019,
        owner: 'Shipping Corporation of India',
        operator: 'SCI Tanker Services',
        destination: 'Mumbai Port (JNPT)',
        eta: '2026-08-29T18:00:00Z',
        currentCoords: [19.0120, 71.8500],
        hindcastInterceptCoords: [19.1120, 70.8200],
        interceptTimestamp: '2026-08-28T16:15:00Z',
        speedKnots: 13.5,
        headingDeg: 105,
        distanceScore: 54.0,
        timeMatchScore: 48.5,
        routeSimilarityScore: 62.0,
        anomalyScore: 12.0,
        overallAttributionScore: 44.1,
        isPrimeSuspect: false,
        aisStatus: 'Normal AIS',
        historyPoints: [
          { timestamp: '2026-08-28T14:00:00Z', coords: [19.200, 70.500], speedKnots: 13.6, courseDeg: 110 },
          { timestamp: '2026-08-28T16:15:00Z', coords: [19.112, 70.820], speedKnots: 13.5, courseDeg: 108 },
          { timestamp: '2026-08-28T18:30:00Z', coords: [19.040, 71.200], speedKnots: 13.4, courseDeg: 105 }
        ],
        forensicSummary: 'Vessel transited 14.8 km south of hindcasted origin point 3.2 hours prior to estimated discharge start. Constant cruising speed maintained with no engine anomalies.'
      },
      {
        id: 'VES-03',
        name: 'COSCO PACIFIC TRADER',
        imo: '9745129',
        mmsi: '477283900',
        callSign: 'VRKQ6',
        flag: 'Hong Kong',
        flagCode: 'HK',
        vesselType: 'Container Ship (14000 TEU)',
        lengthM: 366,
        beamM: 48,
        draughtM: 14.8,
        dwtTons: 145000,
        yearBuilt: 2021,
        owner: 'COSCO Shipping Lines Co.',
        operator: 'COSCO Maritime Fleet',
        destination: 'Jebel Ali, UAE',
        eta: '2026-09-01T08:00:00Z',
        currentCoords: [20.1500, 69.4500],
        hindcastInterceptCoords: [19.2800, 70.9900],
        interceptTimestamp: '2026-08-28T22:40:00Z',
        speedKnots: 19.8,
        headingDeg: 295,
        distanceScore: 61.2,
        timeMatchScore: 42.0,
        routeSimilarityScore: 48.0,
        anomalyScore: 8.0,
        overallAttributionScore: 38.5,
        isPrimeSuspect: false,
        aisStatus: 'Normal AIS',
        historyPoints: [
          { timestamp: '2026-08-28T20:00:00Z', coords: [19.120, 71.400], speedKnots: 20.1, courseDeg: 295 },
          { timestamp: '2026-08-28T22:40:00Z', coords: [19.280, 70.990], speedKnots: 19.8, courseDeg: 295 },
          { timestamp: '2026-08-29T02:00:00Z', coords: [19.650, 70.300], speedKnots: 19.9, courseDeg: 295 }
        ],
        forensicSummary: 'Container vessel transited at constant high speed (19.8 kts). Fuel type mismatch (ULSFO) and absence of cargo hold discharge capabilities make direct culpability highly improbable.'
      },
      {
        id: 'VES-04',
        name: 'STOLT PROTECTOR',
        imo: '9394582',
        mmsi: '319082000',
        callSign: 'ZCIQ4',
        flag: 'Cayman Islands',
        flagCode: 'KY',
        vesselType: 'Parcel Tanker',
        lengthM: 165,
        beamM: 27,
        draughtM: 9.8,
        dwtTons: 32000,
        yearBuilt: 2012,
        owner: 'Stolt Tankers B.V.',
        operator: 'Stolt-Nielsen Fleet',
        destination: 'Kandla Port',
        eta: '2026-08-30T10:00:00Z',
        currentCoords: [20.8000, 69.9000],
        hindcastInterceptCoords: [19.2400, 70.7800],
        interceptTimestamp: '2026-08-28T17:10:00Z',
        speedKnots: 12.8,
        headingDeg: 355,
        distanceScore: 42.0,
        timeMatchScore: 35.0,
        routeSimilarityScore: 50.0,
        anomalyScore: 5.0,
        overallAttributionScore: 31.2,
        isPrimeSuspect: false,
        aisStatus: 'Normal AIS',
        historyPoints: [
          { timestamp: '2026-08-28T15:00:00Z', coords: [18.900, 70.750], speedKnots: 12.9, courseDeg: 358 },
          { timestamp: '2026-08-28T17:10:00Z', coords: [19.240, 70.780], speedKnots: 12.8, courseDeg: 355 }
        ],
        forensicSummary: 'Vessel route passed 22 km west of hindcast centroid during pre-discharge window. No course or engine variations observed.'
      }
    ]
  },
  {
    id: 'INC-2026-0828-02',
    name: 'Gulf of Kachchh Outer Fairway Slick',
    region: 'Arabian Sea — Gujarat Coast',
    coordinates: [22.4820, 69.2150],
    polygon: [
      [22.495, 69.190],
      [22.510, 69.225],
      [22.488, 69.245],
      [22.465, 69.220],
      [22.475, 69.185],
      [22.495, 69.190]
    ],
    detectionTime: '2026-08-28T11:20:00Z',
    sensor: 'Sentinel-2B MSI (SWIR/NDWI)',
    resolution: '10.0m Spatial GSD',
    confidence: 94.5,
    areaKm2: 18.2,
    estimatedVolumeBbl: 780,
    estimatedVolumeTons: 110,
    oilType: 'Bunker Fuel C',
    thicknessMicrons: 32.0,
    severity: 'High',
    status: 'Hindcast Verified',
    environmentalRisk: {
      coastalDistanceKm: 34.0,
      etaToCoastHours: 19.5,
      protectedAreaNearby: 'Marine National Park & Sanctuary, Jamnagar',
      sensitivityIndex: 'Very High'
    },
    currentMetOcean: {
      windSpeedKnots: 12.0,
      windDirectionDeg: 260,
      currentSpeedKnots: 2.1,
      currentDirectionDeg: 80,
      seaSurfaceTempC: 29.1,
      waveHeightM: 1.2
    },
    driftForecast: [
      {
        timeOffsetHours: 0,
        timestamp: '2026-08-28T11:20:00Z',
        coordinates: [22.4820, 69.2150],
        areaKm2: 18.2,
        uncertaintyRadiusKm: 0.8,
        polygon: [
          [22.495, 69.190],
          [22.510, 69.225],
          [22.488, 69.245],
          [22.465, 69.220],
          [22.475, 69.185],
          [22.495, 69.190]
        ]
      },
      {
        timeOffsetHours: 12,
        timestamp: '2026-08-28T23:20:00Z',
        coordinates: [22.5350, 69.3400],
        areaKm2: 24.8,
        uncertaintyRadiusKm: 2.2,
        polygon: [
          [22.550, 69.310],
          [22.565, 69.355],
          [22.538, 69.375],
          [22.515, 69.345],
          [22.530, 69.310],
          [22.550, 69.310]
        ]
      }
    ],
    hindcast: {
      originCoordinates: [22.3800, 68.9500],
      originName: 'Gulf of Kachchh Deepwater Anchorage',
      dischargeStartTime: '2026-08-28T02:00:00Z',
      dischargeEndTime: '2026-08-28T05:30:00Z',
      durationHours: 3.5,
      windageFactorUsed: 0.032,
      hydrodynamicModel: 'Delft3D Tidal Stream + WRF Local Winds',
      confidence: 91.8,
      releaseVolumeEstBbl: 850,
      uncertaintyAreaKm2: 9.4,
      backwardSteps: [
        {
          stepHour: 0,
          timestamp: '2026-08-28T11:20:00Z',
          coordinates: [22.4820, 69.2150],
          ellipseMajorKm: 0.8,
          ellipseMinorKm: 0.5,
          ellipseAngleDeg: 60,
          currentVelocityKnots: 2.1,
          windStressFactor: 0.032
        },
        {
          stepHour: -6,
          timestamp: '2026-08-28T05:20:00Z',
          coordinates: [22.4200, 69.0800],
          ellipseMajorKm: 2.4,
          ellipseMinorKm: 1.5,
          ellipseAngleDeg: 65,
          currentVelocityKnots: 1.8,
          windStressFactor: 0.032
        },
        {
          stepHour: -10,
          timestamp: '2026-08-28T01:20:00Z',
          coordinates: [22.3800, 68.9500],
          ellipseMajorKm: 4.1,
          ellipseMinorKm: 2.8,
          ellipseAngleDeg: 70,
          currentVelocityKnots: 1.5,
          windStressFactor: 0.032
        }
      ]
    },
    attributedVessels: [
      {
        id: 'VES-G1',
        name: 'MT KACHCHH GLORY',
        imo: '9512398',
        mmsi: '419002150',
        callSign: 'ATJK',
        flag: 'India',
        flagCode: 'IN',
        vesselType: 'Aframax Crude Tanker',
        lengthM: 244,
        beamM: 42,
        draughtM: 14.2,
        dwtTons: 105000,
        yearBuilt: 2015,
        owner: 'Western Maritime Logistics',
        operator: 'Kachchh Shipping Corp',
        destination: 'Vadinar SPM',
        eta: '2026-08-28T16:00:00Z',
        currentCoords: [22.4100, 69.6000],
        hindcastInterceptCoords: [22.3820, 68.9550],
        interceptTimestamp: '2026-08-28T03:15:00Z',
        speedKnots: 10.4,
        headingDeg: 75,
        distanceScore: 92.5,
        timeMatchScore: 94.0,
        routeSimilarityScore: 89.0,
        anomalyScore: 88.0,
        overallAttributionScore: 91.2,
        isPrimeSuspect: true,
        aisStatus: 'AIS Anomaly / Speed Drop',
        historyPoints: [
          { timestamp: '2026-08-28T01:00:00Z', coords: [22.310, 68.750], speedKnots: 12.8, courseDeg: 72 },
          { timestamp: '2026-08-28T03:15:00Z', coords: [22.382, 68.955], speedKnots: 4.2, courseDeg: 70 },
          { timestamp: '2026-08-28T05:30:00Z', coords: [22.400, 69.150], speedKnots: 11.5, courseDeg: 78 }
        ],
        forensicSummary: 'Vessel hovered for 2h 15m near SPM channel waypoint prior to port clearance. Speed reduced to 4.2 kts corresponding precisely with hindcast release window.'
      }
    ]
  },
  {
    id: 'INC-2026-0827-03',
    name: 'Bay of Bengal Deepwater Discharge',
    region: 'Bay of Bengal — Paradip Offshore Corridor',
    coordinates: [19.8250, 87.2100],
    polygon: [
      [19.840, 87.180],
      [19.860, 87.225],
      [19.835, 87.255],
      [19.805, 87.220],
      [19.815, 87.175],
      [19.840, 87.180]
    ],
    detectionTime: '2026-08-27T16:10:00Z',
    sensor: 'RADARSAT-Constellation Mission (RCM-1 SAR)',
    resolution: '5.0m High-Res GSD',
    confidence: 98.2,
    areaKm2: 29.5,
    estimatedVolumeBbl: 1240,
    estimatedVolumeTons: 175,
    oilType: 'Light Diesel / Condensate',
    thicknessMicrons: 18.5,
    severity: 'Moderate',
    status: 'Active Tracking',
    environmentalRisk: {
      coastalDistanceKm: 118.0,
      etaToCoastHours: 58.0,
      protectedAreaNearby: 'Gahirmatha Olive Ridley Turtle Sanctuary',
      sensitivityIndex: 'High'
    },
    currentMetOcean: {
      windSpeedKnots: 11.2,
      windDirectionDeg: 195,
      currentSpeedKnots: 0.95,
      currentDirectionDeg: 35,
      seaSurfaceTempC: 30.2,
      waveHeightM: 1.4
    },
    driftForecast: [
      {
        timeOffsetHours: 0,
        timestamp: '2026-08-27T16:10:00Z',
        coordinates: [19.8250, 87.2100],
        areaKm2: 29.5,
        uncertaintyRadiusKm: 0.9,
        polygon: [
          [19.840, 87.180],
          [19.860, 87.225],
          [19.835, 87.255],
          [19.805, 87.220],
          [19.815, 87.175],
          [19.840, 87.180]
        ]
      }
    ],
    hindcast: {
      originCoordinates: [19.6200, 86.9800],
      originName: 'East Coast Shipping Highway Sector E-2',
      dischargeStartTime: '2026-08-27T08:00:00Z',
      dischargeEndTime: '2026-08-27T10:45:00Z',
      durationHours: 2.75,
      windageFactorUsed: 0.030,
      hydrodynamicModel: 'INCOIS Coastal Ocean Model + GFS Winds',
      confidence: 93.0,
      releaseVolumeEstBbl: 1300,
      uncertaintyAreaKm2: 12.1,
      backwardSteps: [
        {
          stepHour: 0,
          timestamp: '2026-08-27T16:10:00Z',
          coordinates: [19.8250, 87.2100],
          ellipseMajorKm: 0.9,
          ellipseMinorKm: 0.6,
          ellipseAngleDeg: 35,
          currentVelocityKnots: 0.95,
          windStressFactor: 0.030
        },
        {
          stepHour: -8,
          timestamp: '2026-08-27T08:10:00Z',
          coordinates: [19.6200, 86.9800],
          ellipseMajorKm: 3.8,
          ellipseMinorKm: 2.4,
          ellipseAngleDeg: 40,
          currentVelocityKnots: 0.88,
          windStressFactor: 0.030
        }
      ]
    },
    attributedVessels: [
      {
        id: 'VES-B1',
        name: 'MSC AEGEAN VOYAGER',
        imo: '9785432',
        mmsi: '354981000',
        callSign: '3FGB8',
        flag: 'Panama',
        flagCode: 'PA',
        vesselType: 'Container Carrier',
        lengthM: 299,
        beamM: 48,
        draughtM: 13.5,
        dwtTons: 98000,
        yearBuilt: 2018,
        owner: 'Mediterranean Shipping Co.',
        operator: 'MSC Fleet Geneva',
        destination: 'Kolkata (Haldia)',
        eta: '2026-08-28T08:00:00Z',
        currentCoords: [20.6000, 87.8000],
        hindcastInterceptCoords: [19.6250, 86.9820],
        interceptTimestamp: '2026-08-27T09:10:00Z',
        speedKnots: 17.5,
        headingDeg: 38,
        distanceScore: 88.0,
        timeMatchScore: 91.0,
        routeSimilarityScore: 84.0,
        anomalyScore: 78.0,
        overallAttributionScore: 86.5,
        isPrimeSuspect: true,
        aisStatus: 'AIS Gap / Transponder Off',
        historyPoints: [
          { timestamp: '2026-08-27T07:00:00Z', coords: [19.450, 86.820], speedKnots: 18.2, courseDeg: 40 },
          { timestamp: '2026-08-27T09:10:00Z', coords: [19.625, 86.982], speedKnots: 17.5, courseDeg: 38 },
          { timestamp: '2026-08-27T12:00:00Z', coords: [19.950, 87.300], speedKnots: 18.0, courseDeg: 36 }
        ],
        forensicSummary: 'Transponder AIS gap logged for 42 minutes across estimated release timestamp. Intersected hindcast uncertainty ellipse within 1.1 km.'
      }
    ]
  }
];

export const sampleScans: SampleDetectionScan[] = [
  {
    id: 'SCAN-S1-MUMBAI',
    name: 'Sentinel-1A SAR C-Band — Mumbai High Basin',
    satellite: 'Sentinel-1A (ESA / Copernicus)',
    sensorType: 'SAR C-Band',
    mode: 'Interferometric Wide (IW) - VV Polarization',
    acquisitionDate: '2026-08-29 06:45:12 UTC',
    locationName: 'Mumbai High Offshore Platform Field',
    centerCoords: [19.3824, 71.3412],
    rawImageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80',
    maskImageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
    thermalImageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    spectralBands: ['VV (Dual-Pol)', 'VH (Cross-Pol)', 'Normalized Radar Cross Section (NRCS)'],
    confidence: 96.8,
    areaKm2: 42.8,
    severity: 'Critical',
    oilType: 'Heavy Crude',
    estimatedVolumeBbl: 1850,
    detectedPolygon: [
      [19.395, 71.325],
      [19.412, 71.358],
      [19.398, 71.385],
      [19.365, 71.372],
      [19.352, 71.339],
      [19.378, 71.318],
      [19.395, 71.325]
    ],
    notes: 'Distinct dark backscatter signature damping Bragg scattering on sea surface. Neural network DeepLabV3+ flagged high boundary contrast with 96.8% confidence.'
  },
  {
    id: 'SCAN-S2-KACHCHH',
    name: 'Sentinel-2B Optical MSI — Gulf of Kachchh',
    satellite: 'Sentinel-2B (ESA / Copernicus)',
    sensorType: 'Optical Multispectral',
    mode: 'MSI Level-2A Bottom-of-Atmosphere (BOA)',
    acquisitionDate: '2026-08-28 11:20:00 UTC',
    locationName: 'Gulf of Kachchh Outer Channel',
    centerCoords: [22.4820, 69.2150],
    rawImageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    maskImageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
    thermalImageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80',
    spectralBands: ['B02 (Blue)', 'B03 (Green)', 'B04 (Red)', 'B08 (NIR)', 'B11 (SWIR-1)'],
    confidence: 94.5,
    areaKm2: 18.2,
    severity: 'High',
    oilType: 'Bunker Fuel C',
    estimatedVolumeBbl: 780,
    detectedPolygon: [
      [22.495, 69.190],
      [22.510, 69.225],
      [22.488, 69.245],
      [22.465, 69.220],
      [22.475, 69.185],
      [22.495, 69.190]
    ],
    notes: 'Sun-glint enhanced multispectral SWIR index shows hydrocarbon absorption peaks at 1.73 µm and 2.31 µm.'
  },
  {
    id: 'SCAN-RCM-PARADIP',
    name: 'RADARSAT-Constellation Mission — Paradip Corridor',
    satellite: 'RCM-1 (Canadian Space Agency)',
    sensorType: 'SAR C-Band',
    mode: 'High-Resolution 5m StripMap',
    acquisitionDate: '2026-08-27 16:10:00 UTC',
    locationName: 'Bay of Bengal Deepwater Sector',
    centerCoords: [19.8250, 87.2100],
    rawImageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
    maskImageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80',
    thermalImageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
    spectralBands: ['HH', 'HV', 'Compact Pol Circular RH/RV'],
    confidence: 98.2,
    areaKm2: 29.5,
    severity: 'Moderate',
    oilType: 'Light Diesel / Condensate',
    estimatedVolumeBbl: 1240,
    detectedPolygon: [
      [19.840, 87.180],
      [19.860, 87.225],
      [19.835, 87.255],
      [19.805, 87.220],
      [19.815, 87.175],
      [19.840, 87.180]
    ],
    notes: 'Linear sheen formation detected along ship transit vector. Polarimetric entropy analysis confirms low surface roughness.'
  },
  {
    id: 'SCAN-FLIR-AIRBORNE',
    name: 'Airborne FLIR Thermal Infrared — Coastal Surveillance',
    satellite: 'Maritime Patrol Aircraft (Do-228 FLIR)',
    sensorType: 'Thermal IR',
    mode: 'Long-Wave Infrared (LWIR 8-14 µm)',
    acquisitionDate: '2026-08-29 09:30:00 UTC',
    locationName: 'Nearshore Coastal Reconnaissance',
    centerCoords: [19.4500, 71.4500],
    rawImageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
    maskImageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    thermalImageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
    spectralBands: ['LWIR Thermal (8-14 µm)', 'Visible Daytime High Definition'],
    confidence: 97.5,
    areaKm2: 12.4,
    severity: 'High',
    oilType: 'Heavy Crude',
    estimatedVolumeBbl: 620,
    detectedPolygon: [
      [19.460, 71.430],
      [19.475, 71.465],
      [19.450, 71.485],
      [19.435, 71.450],
      [19.460, 71.430]
    ],
    notes: 'Direct thermal contrast measurement: thick emulsion core shows +2.8°C thermal signature due to solar absorption compared to ambient water.'
  }
];

export const initialChatMessages: ChatMessage[] = [
  {
    id: 'MSG-001',
    sender: 'system',
    timestamp: '2026-08-29T06:50:00Z',
    content: 'Maritime Intelligence AI Copilot initialized. Connected to Sentinel SAR feed, HYCOM oceanographic models, and Global AIS tracking stream.'
  },
  {
    id: 'MSG-002',
    sender: 'assistant',
    timestamp: '2026-08-29T06:50:05Z',
    content: 'Welcome, Officer. I have loaded active incident **INC-2026-0829-01 (Mumbai High Offshore Sector 4B Slick)**.\n\nKey Telemetry:\n- **Spill Area**: 42.8 km² (Estimated 1,850 bbls Heavy Crude)\n- **Drift Vector**: Moving Northeast at 1.35 kts towards Maharashtra coast (ETA ~48 hrs)\n- **Prime Suspect**: **MT OCEAN VANGUARD (IMO 9481234)** — 96.2% Attribution Confidence.\n\nHow would you like to proceed with this investigation?'
  }
];

export const presetAssistantQuestions = [
  'Why is MT OCEAN VANGUARD identified as the prime suspect?',
  'What are the hydrodynamic drift forecast conditions for the next 48 hours?',
  'What is the coastal impact risk to marine protected sanctuaries?',
  'Draft an official Maritime Enforcement Evidentiary Memo for Indian Coast Guard',
  'Explain the SAR speckle filtering and DeepLabV3+ segmentation process'
];

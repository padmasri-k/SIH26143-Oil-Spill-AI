import React, { useEffect, useRef } from 'react';
import { 
  MapContainer, 
  TileLayer, 
  Marker, 
  Popup, 
  Polygon, 
  Polyline, 
  Circle, 
  useMap 
} from 'react-leaflet';
import L from 'leaflet';
import { useIncident } from '../../context/IncidentContext';
import { OilSpillIncident, AttributedVessel, HindcastStep } from '../../types';
import { 
  Ship, 
  AlertTriangle, 
  Layers, 
  Crosshair, 
  Navigation, 
  Compass, 
  Activity,
  Wind,
  ShieldCheck
} from 'lucide-react';

// Fix Leaflet default marker icon bug in bundlers
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Custom SVG Icons
const createOilSpillIcon = (severity: string) => {
  const color = severity === 'Critical' ? '#f43f5e' : severity === 'High' ? '#f59e0b' : '#00f0ff';
  return L.divIcon({
    className: 'custom-spill-marker',
    html: `
      <div style="position: relative; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center;">
        <div style="position: absolute; width: 32px; height: 32px; border-radius: 50%; background: ${color}33; animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
        <div style="position: absolute; width: 22px; height: 22px; border-radius: 50%; background: ${color}66; border: 2px solid ${color};"></div>
        <div style="position: absolute; width: 8px; height: 8px; border-radius: 50%; background: #ffffff;"></div>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16]
  });
};

const createVesselIcon = (isPrimeSuspect: boolean, heading: number) => {
  const color = isPrimeSuspect ? '#f43f5e' : '#38bdf8';
  return L.divIcon({
    className: 'custom-vessel-marker',
    html: `
      <div style="position: relative; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; transform: rotate(${heading}deg);">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="${color}" stroke="#070f22" stroke-width="1.5">
          <path d="M12 2L19 21L12 17L5 21L12 2Z" />
        </svg>
        ${isPrimeSuspect ? '<div style="position: absolute; width: 32px; height: 32px; border-radius: 50%; border: 2px dashed #f43f5e; animation: spin 4s linear infinite;"></div>' : ''}
      </div>
    `,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -14]
  });
};

const createHindcastOriginIcon = () => {
  return L.divIcon({
    className: 'custom-hindcast-marker',
    html: `
      <div style="position: relative; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center;">
        <div style="position: absolute; width: 28px; height: 28px; border-radius: 50%; background: rgba(168, 85, 247, 0.3); border: 2px dashed #a855f7; animation: spin 6s linear infinite;"></div>
        <div style="width: 12px; height: 12px; background: #a855f7; border: 2px solid #ffffff; transform: rotate(45deg);"></div>
      </div>
    `,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
    popupAnchor: [0, -15]
  });
};

// Component to dynamically re-center map when selected incident changes
const MapRecenter: React.FC<{ center: [number, number]; zoom?: number }> = ({ center, zoom = 9 }) => {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, zoom, { duration: 1.2 });
  }, [center, zoom, map]);
  return null;
};

interface LeafletMapWrapperProps {
  showAllIncidents?: boolean;
  showHindcastTrajectory?: boolean;
  showVesselAttribution?: boolean;
  showDriftForecast?: boolean;
  activeDriftHour?: number;
  highlightedVesselId?: string | null;
  onVesselSelect?: (vessel: AttributedVessel) => void;
  height?: string;
}

export const LeafletMapWrapper: React.FC<LeafletMapWrapperProps> = ({
  showAllIncidents = false,
  showHindcastTrajectory = true,
  showVesselAttribution = true,
  showDriftForecast = true,
  activeDriftHour = 0,
  highlightedVesselId = null,
  onVesselSelect,
  height = '100%'
}) => {
  const { incidents, selectedIncident, mapLayers, toggleLayer, setActiveAttributionVesselId } = useIncident();

  const activeDriftForecast = selectedIncident.driftForecast.find(d => d.timeOffsetHours === activeDriftHour) || selectedIncident.driftForecast[0];

  return (
    <div className="relative w-full rounded-xl overflow-hidden border border-marine-700/80 shadow-2xl bg-marine-950" style={{ height }}>
      {/* Map Control HUD Overlay */}
      <div className="absolute top-4 right-4 z-[500] flex flex-col space-y-2">
        <div className="bg-marine-900/90 backdrop-blur-md border border-marine-700/80 rounded-xl p-2.5 shadow-xl text-xs space-y-2">
          <div className="flex items-center space-x-2 text-slate-300 font-mono font-semibold border-b border-marine-800 pb-1.5 px-1">
            <Layers className="w-3.5 h-3.5 text-radar-cyan" />
            <span>LAYER CONTROLS</span>
          </div>

          <div className="space-y-1.5 font-mono text-[11px]">
            <label className="flex items-center space-x-2 cursor-pointer hover:text-white text-slate-300 px-1">
              <input
                type="checkbox"
                checked={mapLayers.spills}
                onChange={() => toggleLayer('spills')}
                className="rounded bg-marine-800 border-marine-600 text-radar-cyan focus:ring-0 focus:ring-offset-0"
              />
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-radar-rose"></span>
                Oil Slicks
              </span>
            </label>

            <label className="flex items-center space-x-2 cursor-pointer hover:text-white text-slate-300 px-1">
              <input
                type="checkbox"
                checked={mapLayers.vessels}
                onChange={() => toggleLayer('vessels')}
                className="rounded bg-marine-800 border-marine-600 text-radar-cyan focus:ring-0 focus:ring-offset-0"
              />
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-radar-cyan"></span>
                AIS Vessels
              </span>
            </label>

            <label className="flex items-center space-x-2 cursor-pointer hover:text-white text-slate-300 px-1">
              <input
                type="checkbox"
                checked={mapLayers.driftVectors}
                onChange={() => toggleLayer('driftVectors')}
                className="rounded bg-marine-800 border-marine-600 text-radar-cyan focus:ring-0 focus:ring-offset-0"
              />
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-1 bg-radar-amber"></span>
                Drift Forecast
              </span>
            </label>

            <label className="flex items-center space-x-2 cursor-pointer hover:text-white text-slate-300 px-1">
              <input
                type="checkbox"
                checked={mapLayers.hindcastCones}
                onChange={() => toggleLayer('hindcastCones')}
                className="rounded bg-marine-800 border-marine-600 text-radar-cyan focus:ring-0 focus:ring-offset-0"
              />
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-1 bg-radar-purple"></span>
                Hindcast Drift
              </span>
            </label>
          </div>
        </div>
      </div>

      {/* Environmental HUD Badge on Map */}
      <div className="absolute bottom-4 left-4 z-[500] hidden sm:flex items-center space-x-3 bg-marine-900/90 backdrop-blur-md border border-marine-700/80 rounded-xl px-3 py-2 text-xs font-mono shadow-xl">
        <div className="flex items-center space-x-1.5 text-slate-300">
          <Wind className="w-3.5 h-3.5 text-radar-cyan" />
          <span>Wind: <strong className="text-white">{selectedIncident.currentMetOcean.windSpeedKnots} kts</strong> ({selectedIncident.currentMetOcean.windDirectionDeg}°)</span>
        </div>
        <span className="text-marine-700">|</span>
        <div className="flex items-center space-x-1.5 text-slate-300">
          <Compass className="w-3.5 h-3.5 text-radar-teal" />
          <span>Current: <strong className="text-white">{selectedIncident.currentMetOcean.currentSpeedKnots} kts</strong> ({selectedIncident.currentMetOcean.currentDirectionDeg}°)</span>
        </div>
        <span className="text-marine-700">|</span>
        <div className="flex items-center space-x-1.5 text-slate-300">
          <Activity className="w-3.5 h-3.5 text-radar-amber" />
          <span>SST: <strong className="text-white">{selectedIncident.currentMetOcean.seaSurfaceTempC}°C</strong></span>
        </div>
      </div>

      {/* Leaflet Map Component */}
      <MapContainer
        center={selectedIncident.coordinates}
        zoom={9}
        scrollWheelZoom={true}
        className="w-full h-full"
      >
        <MapRecenter center={selectedIncident.coordinates} zoom={9} />

        {/* High Contrast Maritime Dark Tiles */}
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CARTO</a> | Sentinel-1 SAR / ESA Copernicus'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          maxZoom={18}
        />

        {/* Render Oil Spill Polygons & Markers */}
        {mapLayers.spills && (
          <>
            {(showAllIncidents ? incidents : [selectedIncident]).map((incident) => {
              const isSelected = incident.id === selectedIncident.id;
              const strokeColor = incident.severity === 'Critical' ? '#f43f5e' : incident.severity === 'High' ? '#f59e0b' : '#00f0ff';

              return (
                <React.Fragment key={incident.id}>
                  {/* Spill Polygon Area */}
                  <Polygon
                    positions={activeDriftHour > 0 && isSelected ? activeDriftForecast.polygon : incident.polygon}
                    pathOptions={{
                      color: strokeColor,
                      weight: isSelected ? 2.5 : 1.5,
                      fillColor: strokeColor,
                      fillOpacity: 0.45,
                      dashArray: isSelected ? '4, 4' : undefined,
                    }}
                  >
                    <Popup>
                      <div className="p-3 max-w-xs space-y-2">
                        <div className="flex items-center justify-between border-b border-marine-800 pb-1.5">
                          <span className="text-[11px] font-mono font-bold text-radar-cyan">{incident.id}</span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded font-mono bg-radar-rose/20 text-radar-rose border border-radar-rose/40 font-bold">
                            {incident.severity}
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-white leading-tight">{incident.name}</h4>
                        <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-1 text-slate-300">
                          <div>
                            <span className="text-slate-400 block text-[10px]">AFFECTED AREA</span>
                            <span className="font-semibold text-white">{incident.areaKm2} km²</span>
                          </div>
                          <div>
                            <span className="text-slate-400 block text-[10px]">AI CONFIDENCE</span>
                            <span className="font-semibold text-radar-cyan">{incident.confidence}%</span>
                          </div>
                          <div>
                            <span className="text-slate-400 block text-[10px]">OIL TYPE</span>
                            <span className="font-semibold text-white">{incident.oilType}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 block text-[10px]">EST. VOLUME</span>
                            <span className="font-semibold text-radar-amber">{incident.estimatedVolumeBbl} bbls</span>
                          </div>
                        </div>
                        <div className="text-[11px] text-slate-400 border-t border-marine-800/80 pt-1.5">
                          Detected by {incident.sensor}
                        </div>
                      </div>
                    </Popup>
                  </Polygon>

                  {/* Centroid Pulse Marker */}
                  <Marker
                    position={activeDriftHour > 0 && isSelected ? activeDriftForecast.coordinates : incident.coordinates}
                    icon={createOilSpillIcon(incident.severity)}
                  >
                    <Popup>
                      <div className="p-2 text-xs font-mono">
                        <strong className="text-white">{incident.name} Centroid</strong>
                        <div className="text-slate-400 mt-1">
                          GPS: {incident.coordinates[0].toFixed(4)}°N, {incident.coordinates[1].toFixed(4)}°E
                        </div>
                      </div>
                    </Popup>
                  </Marker>
                </React.Fragment>
              );
            })}
          </>
        )}

        {/* Forward Drift Forecast Trajectory */}
        {showDriftForecast && mapLayers.driftVectors && selectedIncident.driftForecast.length > 1 && (
          <>
            <Polyline
              positions={selectedIncident.driftForecast.map(d => d.coordinates)}
              pathOptions={{
                color: '#f59e0b',
                weight: 3,
                dashArray: '6, 8',
                opacity: 0.85
              }}
            />
            {selectedIncident.driftForecast.map((step, idx) => (
              <Circle
                key={`drift-step-${idx}`}
                center={step.coordinates}
                radius={step.uncertaintyRadiusKm * 1000}
                pathOptions={{
                  color: '#f59e0b',
                  fillColor: '#f59e0b',
                  fillOpacity: 0.15,
                  weight: 1.5,
                  dashArray: '3, 5'
                }}
              >
                <Popup>
                  <div className="p-2 text-xs font-mono space-y-1">
                    <div className="text-radar-amber font-bold">Drift Forecast +{step.timeOffsetHours}h</div>
                    <div className="text-slate-300">Timestamp: {step.timestamp.replace('T', ' ').substring(0, 16)} UTC</div>
                    <div className="text-slate-300">Spread Area: {step.areaKm2} km²</div>
                    <div className="text-slate-400">Uncertainty Radius: ±{step.uncertaintyRadiusKm} km</div>
                  </div>
                </Popup>
              </Circle>
            ))}
          </>
        )}

        {/* Hindcast Backward Trajectory & Uncertainty Ellipses */}
        {showHindcastTrajectory && mapLayers.hindcastCones && selectedIncident.hindcast && (
          <>
            {/* Backward Track Polyline */}
            <Polyline
              positions={selectedIncident.hindcast.backwardSteps.map(s => s.coordinates)}
              pathOptions={{
                color: '#a855f7',
                weight: 3,
                dashArray: '5, 5',
                opacity: 0.9
              }}
            />

            {/* Hindcast Uncertainty Circles at each step */}
            {selectedIncident.hindcast.backwardSteps.map((step, index) => (
              <Circle
                key={`hindcast-${index}`}
                center={step.coordinates}
                radius={step.ellipseMajorKm * 1000}
                pathOptions={{
                  color: '#a855f7',
                  fillColor: '#a855f7',
                  fillOpacity: 0.12,
                  weight: 1.5
                }}
              >
                <Popup>
                  <div className="p-2 text-xs font-mono space-y-1">
                    <div className="text-radar-purple font-bold">Hindcast Step {step.stepHour}h</div>
                    <div className="text-slate-300">Time: {step.timestamp.replace('T', ' ').substring(0, 16)} UTC</div>
                    <div className="text-slate-300">Current Velocity: {step.currentVelocityKnots} kts</div>
                    <div className="text-slate-400">Uncertainty Zone: ±{step.ellipseMajorKm} km</div>
                  </div>
                </Popup>
              </Circle>
            ))}

            {/* Origin Point Marker */}
            <Marker
              position={selectedIncident.hindcast.originCoordinates}
              icon={createHindcastOriginIcon()}
            >
              <Popup>
                <div className="p-3 text-xs font-mono space-y-2">
                  <div className="flex items-center space-x-1.5 text-radar-purple font-bold border-b border-marine-800 pb-1">
                    <Crosshair className="w-4 h-4" />
                    <span>ESTIMATED ORIGIN POINT</span>
                  </div>
                  <div className="text-white font-semibold">{selectedIncident.hindcast.originName}</div>
                  <div className="text-slate-300">
                    Est. Discharge Time: <strong className="text-white">{selectedIncident.hindcast.dischargeStartTime.replace('T', ' ').substring(0, 16)} UTC</strong>
                  </div>
                  <div className="text-slate-400">
                    Model: {selectedIncident.hindcast.hydrodynamicModel}
                  </div>
                  <div className="text-radar-purple font-bold">
                    Confidence: {selectedIncident.hindcast.confidence}%
                  </div>
                </div>
              </Popup>
            </Marker>
          </>
        )}

        {/* Vessel AIS Positions and Intercept Tracks */}
        {showVesselAttribution && mapLayers.vessels && (
          <>
            {selectedIncident.attributedVessels.map((vessel) => {
              const isSelected = highlightedVesselId === vessel.id;
              const isPrime = vessel.isPrimeSuspect;

              return (
                <React.Fragment key={vessel.id}>
                  {/* Vessel Historical Transit Path */}
                  {vessel.historyPoints.length > 0 && (
                    <Polyline
                      positions={vessel.historyPoints.map(p => p.coords)}
                      pathOptions={{
                        color: isPrime ? '#f43f5e' : isSelected ? '#38bdf8' : '#64748b',
                        weight: isPrime ? 2.5 : 1.5,
                        opacity: isPrime ? 0.9 : 0.6,
                        dashArray: isPrime ? '6, 6' : undefined
                      }}
                    />
                  )}

                  {/* Intercept Point Marker */}
                  <Circle
                    center={vessel.hindcastInterceptCoords}
                    radius={1200}
                    pathOptions={{
                      color: isPrime ? '#f43f5e' : '#38bdf8',
                      fillColor: isPrime ? '#f43f5e' : '#38bdf8',
                      fillOpacity: isPrime ? 0.35 : 0.15,
                      weight: 1
                    }}
                  />

                  {/* Vessel Current Position Marker */}
                  <Marker
                    position={vessel.currentCoords}
                    icon={createVesselIcon(isPrime, vessel.headingDeg)}
                    eventHandlers={{
                      click: () => {
                        setActiveAttributionVesselId(vessel.id);
                        if (onVesselSelect) onVesselSelect(vessel);
                      }
                    }}
                  >
                    <Popup>
                      <div className="p-3 max-w-xs space-y-2 font-mono">
                        <div className="flex items-center justify-between border-b border-marine-800 pb-1.5">
                          <span className="text-[11px] font-bold text-white flex items-center gap-1.5">
                            <Ship className="w-3.5 h-3.5 text-radar-cyan" />
                            {vessel.name}
                          </span>
                          {isPrime && (
                            <span className="text-[9px] px-1.5 py-0.5 rounded bg-radar-rose/20 text-radar-rose border border-radar-rose/40 font-bold animate-pulse">
                              PRIME SUSPECT
                            </span>
                          )}
                        </div>

                        <div className="grid grid-cols-2 gap-1.5 text-xs text-slate-300">
                          <div>
                            <span className="text-slate-400 block text-[9px]">IMO / MMSI</span>
                            <span>{vessel.imo} / {vessel.mmsi}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 block text-[9px]">FLAG / TYPE</span>
                            <span className="truncate block">{vessel.flag} • {vessel.vesselType}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 block text-[9px]">CURRENT SPEED</span>
                            <span className="text-radar-cyan font-bold">{vessel.speedKnots} kts</span>
                          </div>
                          <div>
                            <span className="text-slate-400 block text-[9px]">ATTRIBUTION SCORE</span>
                            <span className={`font-bold ${isPrime ? 'text-radar-rose' : 'text-radar-amber'}`}>
                              {vessel.overallAttributionScore}%
                            </span>
                          </div>
                        </div>

                        <div className="p-2 rounded bg-marine-950/80 border border-marine-800 text-[10px] text-slate-400 leading-tight">
                          {vessel.forensicSummary}
                        </div>
                      </div>
                    </Popup>
                  </Marker>
                </React.Fragment>
              );
            })}
          </>
        )}
      </MapContainer>
    </div>
  );
};

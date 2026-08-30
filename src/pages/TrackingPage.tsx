import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useIncident } from '../context/IncidentContext';
import { LeafletMapWrapper } from '../components/common/LeafletMapWrapper';
import { 
  Waves, 
  Play, 
  Pause, 
  RotateCcw, 
  FastForward, 
  Wind, 
  Compass, 
  ShieldAlert, 
  Clock, 
  ArrowRight, 
  History, 
  TrendingUp, 
  Activity,
  Layers,
  Sparkles
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  Legend 
} from 'recharts';

export const TrackingPage: React.FC = () => {
  const navigate = useNavigate();
  const { 
    selectedIncident, 
    simulationTimeOffset, 
    setSimulationTimeOffset, 
    isSimulating, 
    setIsSimulating 
  } = useIncident();

  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);

  // Time steps: 0h, 6h, 12h, 24h, 48h, 72h
  const timeSteps = [0, 6, 12, 24, 48, 72];

  const currentStepData = selectedIncident.driftForecast.find(d => d.timeOffsetHours === simulationTimeOffset) || selectedIncident.driftForecast[0];

  // Weathering and spreading chart data
  const spreadWeatheringData = [
    { hour: '0h', area: selectedIncident.areaKm2, evaporation: 0, emulsification: 5 },
    { hour: '6h', area: 48.5, evaporation: 8.2, emulsification: 18 },
    { hour: '12h', area: 55.2, evaporation: 15.6, emulsification: 32 },
    { hour: '24h', area: 69.4, evaporation: 24.1, emulsification: 48 },
    { hour: '48h', area: 92.1, evaporation: 35.8, emulsification: 68 },
    { hour: '72h', area: 118.6, evaporation: 42.0, emulsification: 79 }
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-marine-800/80 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white uppercase tracking-tight font-sans">
              Spill Drift Tracking & <span className="text-radar-amber">Forward Forecast</span>
            </h1>
            <span className="px-2 py-0.5 text-xs font-mono font-bold bg-radar-amber/20 text-radar-amber border border-radar-amber/40 rounded">
              +72h HYDRODYNAMIC MODEL
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 font-mono mt-1">
            Lagrangian hydrodynamic trajectory forecasting driven by HYCOM currents and ECMWF ERA5 winds.
          </p>
        </div>

        {/* Action Link to Hindcast */}
        <button
          onClick={() => navigate('/hindcasting')}
          className="px-4 py-2.5 rounded-xl bg-marine-800 hover:bg-marine-750 border border-marine-600 hover:border-radar-purple/50 text-xs font-mono font-bold text-slate-200 hover:text-white flex items-center space-x-2 transition-all shadow-sm"
        >
          <History className="w-4 h-4 text-radar-purple" />
          <span>Switch to Backward Hindcasting</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Main Map & Interactive Simulation Timeline */}
      <div className="space-y-4">
        {/* Leaflet Map Viewer */}
        <div className="h-[440px] sm:h-[500px] rounded-xl overflow-hidden shadow-2xl relative">
          <LeafletMapWrapper
            showHindcastTrajectory={false}
            showVesselAttribution={true}
            showDriftForecast={true}
            activeDriftHour={simulationTimeOffset}
          />
        </div>

        {/* Interactive Playback & Time Scrubber HUD */}
        <div className="p-5 rounded-xl bg-marine-900/95 border border-marine-700/80 backdrop-blur-md space-y-4 shadow-xl">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-marine-800 pb-3">
            <div className="flex items-center space-x-3">
              {/* Play / Pause button */}
              <button
                onClick={() => setIsSimulating(!isSimulating)}
                className={`p-2.5 rounded-xl flex items-center justify-center transition-all ${
                  isSimulating
                    ? 'bg-radar-amber text-marine-950 shadow-glow-amber'
                    : 'bg-marine-800 hover:bg-marine-750 text-slate-200 border border-marine-600'
                }`}
              >
                {isSimulating ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
              </button>

              {/* Reset to 0h */}
              <button
                onClick={() => {
                  setIsSimulating(false);
                  setSimulationTimeOffset(0);
                }}
                className="p-2.5 rounded-xl bg-marine-800 hover:bg-marine-750 text-slate-400 hover:text-white border border-marine-700 transition-colors"
                title="Reset to 0h"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              {/* Current Simulation Step Indicator */}
              <div className="font-mono">
                <span className="text-[10px] text-slate-400 uppercase block">Active Forecast Horizon</span>
                <span className="text-lg font-black text-radar-amber">
                  +{simulationTimeOffset} Hours Projection
                </span>
              </div>
            </div>

            {/* Current Step Telemetry Badge */}
            <div className="flex items-center space-x-4 font-mono text-xs text-slate-300">
              <div className="p-2 rounded-lg bg-marine-950 border border-marine-800">
                <span className="text-slate-400 text-[10px] block">SLICK SPREAD</span>
                <strong className="text-white text-sm">{currentStepData.areaKm2} km²</strong>
              </div>
              <div className="p-2 rounded-lg bg-marine-950 border border-marine-800">
                <span className="text-slate-400 text-[10px] block">POSITION CENTROID</span>
                <strong className="text-radar-cyan text-sm">{currentStepData.coordinates[0].toFixed(3)}°N, {currentStepData.coordinates[1].toFixed(3)}°E</strong>
              </div>
              <div className="p-2 rounded-lg bg-marine-950 border border-marine-800">
                <span className="text-slate-400 text-[10px] block">UNCERTAINTY</span>
                <strong className="text-slate-300 text-sm">±{currentStepData.uncertaintyRadiusKm} km</strong>
              </div>
            </div>
          </div>

          {/* Timeline Slider */}
          <div className="space-y-2">
            <div className="flex justify-between font-mono text-xs text-slate-400">
              {timeSteps.map((hour) => (
                <button
                  key={hour}
                  onClick={() => {
                    setIsSimulating(false);
                    setSimulationTimeOffset(hour);
                  }}
                  className={`px-2 py-1 rounded transition-colors font-bold ${
                    simulationTimeOffset === hour
                      ? 'bg-radar-amber text-marine-950 shadow-glow-amber'
                      : 'hover:text-white'
                  }`}
                >
                  +{hour}h
                </button>
              ))}
            </div>

            <input
              type="range"
              min="0"
              max="72"
              step="6"
              value={simulationTimeOffset}
              onChange={(e) => {
                setIsSimulating(false);
                setSimulationTimeOffset(Number(e.target.value));
              }}
              className="w-full accent-radar-amber cursor-pointer h-2 bg-marine-950 rounded-lg"
            />
          </div>
        </div>
      </div>

      {/* Physics Breakdown & Coastline Impact Risk Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left 6 Cols: Weathering & Evaporation Time-Series */}
        <div className="lg:col-span-6 p-5 rounded-xl bg-marine-900/90 border border-marine-700/80 backdrop-blur-md space-y-3 shadow-xl">
          <div className="flex items-center justify-between border-b border-marine-800 pb-2">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-radar-amber" />
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
                Surface Weathering, Evaporation & Emulsification
              </h3>
            </div>
            <span className="text-[10px] font-mono text-slate-400">ADIOS2 Weathering Model</span>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={spreadWeatheringData} margin={{ top: 10, right: 15, left: -15, bottom: 0 }}>
                <XAxis dataKey="hour" stroke="#64748b" tick={{ fontSize: 11, fontFamily: 'monospace' }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 11, fontFamily: 'monospace' }} unit="%" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0a1529',
                    border: '1px solid rgba(245, 158, 11, 0.4)',
                    borderRadius: '0.5rem',
                    fontSize: '11px',
                    fontFamily: 'monospace'
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', fontFamily: 'monospace' }} />
                <Line type="monotone" dataKey="evaporation" stroke="#38bdf8" strokeWidth={2} name="Evaporated (%)" dot={{ fill: '#38bdf8' }} />
                <Line type="monotone" dataKey="emulsification" stroke="#f43f5e" strokeWidth={2} name="Water Emulsion (%)" dot={{ fill: '#f43f5e' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="p-3 rounded-lg bg-marine-950/80 border border-marine-800 text-xs font-mono text-slate-300">
            <strong className="text-radar-amber">Physical Behavior: </strong>
            Heavy Crude will reach 68% chocolate mousse water-in-oil emulsion by +48h, increasing effective slick volume by 2.4x.
          </div>
        </div>

        {/* Right 6 Cols: Vulnerable Coastline Impact Alert */}
        <div className="lg:col-span-6 p-5 rounded-xl bg-marine-900/90 border border-marine-700/80 backdrop-blur-md space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-marine-800 pb-2">
            <div className="flex items-center space-x-2">
              <ShieldAlert className="w-4 h-4 text-radar-rose animate-pulse" />
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
                Coastal Sensitivity & Beaching Warning
              </h3>
            </div>
            <span className="text-[10px] font-mono text-radar-rose font-bold bg-radar-rose/20 px-2 py-0.5 rounded border border-radar-rose/40">
              HIGH RISK
            </span>
          </div>

          <div className="p-4 rounded-xl bg-marine-950/80 border border-marine-800 space-y-3 font-mono">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">NEAREST PROTECTED HABITAT:</span>
              <span className="text-white font-bold text-right">{selectedIncident.environmentalRisk.protectedAreaNearby}</span>
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">DISTANCE TO SHORELINE:</span>
              <span className="text-radar-amber font-bold">{selectedIncident.environmentalRisk.coastalDistanceKm} km</span>
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">ESTIMATED SHORELINE IMPACT ETA:</span>
              <span className="text-radar-rose font-extrabold text-sm">~{selectedIncident.environmentalRisk.etaToCoastHours} Hours</span>
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">ENVIRONMENTAL SENSITIVITY:</span>
              <span className="text-radar-rose font-bold">{selectedIncident.environmentalRisk.sensitivityIndex}</span>
            </div>
          </div>

          {/* Hydrodynamic Drift Vector Equation HUD */}
          <div className="p-3 rounded-xl bg-marine-950/80 border border-marine-800 space-y-2 font-mono text-xs">
            <div className="text-[10px] text-radar-cyan font-bold uppercase">Active Vector Decomposition:</div>
            <div className="text-slate-300 space-y-1 text-[11px]">
              <div>• Surface Current Vector (HYCOM): <strong>{selectedIncident.currentMetOcean.currentSpeedKnots} kts @ {selectedIncident.currentMetOcean.currentDirectionDeg}°</strong></div>
              <div>• Direct Wind Stress Vector (10m GFS): <strong>{selectedIncident.currentMetOcean.windSpeedKnots} kts @ {selectedIncident.currentMetOcean.windDirectionDeg}° (3.4% Windage)</strong></div>
              <div>• Wave Stokes Drift: <strong>0.22 kts @ 048° (Significant Wave Height: {selectedIncident.currentMetOcean.waveHeightM}m)</strong></div>
            </div>
          </div>

          <button
            onClick={() => navigate('/hindcasting')}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-radar-purple to-radar-cyan text-marine-950 font-mono font-extrabold text-xs flex items-center justify-center gap-2 shadow-glow-cyan hover:brightness-110 active:scale-95 transition-all"
          >
            <span>Proceed to Origin Hindcasting Analysis</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

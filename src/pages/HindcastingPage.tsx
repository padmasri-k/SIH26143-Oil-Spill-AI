import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useIncident } from '../context/IncidentContext';
import { apiService } from '../services/api';
import { LeafletMapWrapper } from '../components/common/LeafletMapWrapper';
import { ConfidenceGauge } from '../components/common/ConfidenceGauge';
import { 
  History, 
  Crosshair, 
  Clock, 
  Wind, 
  Compass, 
  Cpu, 
  Sliders, 
  Ship, 
  ArrowRight, 
  AlertTriangle, 
  CheckCircle2, 
  Layers, 
  HelpCircle,
  Activity,
  RotateCcw
} from 'lucide-react';

export const HindcastingPage: React.FC = () => {
  const navigate = useNavigate();
  const { selectedIncident } = useIncident();

  const [windageFactor, setWindageFactor] = useState<number>(selectedIncident.hindcast.windageFactorUsed * 100);
  const [selectedModel, setSelectedModel] = useState<string>('HYCOM 1/12° + ECMWF ERA5');
  const [includeStokesDrift, setIncludeStokesDrift] = useState<boolean>(true);
  const [isRecalculating, setIsRecalculating] = useState<boolean>(false);
  const [customHindcast, setCustomHindcast] = useState<any>(null);

  const handleRecalculate = async () => {
    setIsRecalculating(true);
    try {
      const res = await apiService.recalculateHindcast(
        selectedIncident.id,
        windageFactor / 100,
        selectedModel,
        includeStokesDrift
      );
      if (res) {
        setCustomHindcast(res);
      }
    } catch (e) {
      console.warn('[Hindcasting] Recalculation fallback:', e);
    } finally {
      setIsRecalculating(false);
    }
  };

  const hindcast = customHindcast ? {
    ...selectedIncident.hindcast,
    originCoordinates: customHindcast.origin_coordinates || customHindcast.originCoordinates || selectedIncident.hindcast.originCoordinates,
    windageFactorUsed: customHindcast.windage_factor_used || (windageFactor / 100),
    hydrodynamicModel: customHindcast.hydrodynamic_model || selectedModel,
    backwardSteps: customHindcast.backward_steps || customHindcast.backwardSteps || selectedIncident.hindcast.backwardSteps
  } : selectedIncident.hindcast;

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-marine-800/80 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white uppercase tracking-tight font-sans">
              Lagrangian Particle <span className="text-radar-purple">Hindcasting Analysis</span>
            </h1>
            <span className="px-2 py-0.5 text-xs font-mono font-bold bg-radar-purple/20 text-radar-purple border border-radar-purple/40 rounded">
              REVERSE DRIFT ENGINE
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 font-mono mt-1">
            Backtracking surface slick displacement to reconstruct the exact origin coordinates and discharge time window.
          </p>
        </div>

        {/* Action Button to Vessel Attribution */}
        <button
          onClick={() => navigate('/attribution')}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-radar-rose to-radar-amber text-marine-950 font-mono font-extrabold text-xs flex items-center space-x-2 shadow-glow-rose hover:brightness-110 active:scale-95 transition-all"
        >
          <Ship className="w-4 h-4 text-marine-950" />
          <span>Cross-Correlate AIS Vessels</span>
          <ArrowRight className="w-4 h-4 text-marine-950" />
        </button>
      </div>

      {/* Main Workspace: Interactive Backward Map & Telemetry HUD */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left 8 Cols: Map with Reverse Drift Track & Uncertainty Cones */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 font-mono text-xs text-slate-300">
              <History className="w-4 h-4 text-radar-purple" />
              <span>Backtracking from Detection (T=0h) to Origin (T=-12h)</span>
            </div>
            <div className="text-xs font-mono text-radar-purple font-bold">
              Uncertainty Ellipse: ±{hindcast.uncertaintyAreaKm2} km²
            </div>
          </div>

          <div className="h-[460px] sm:h-[520px] rounded-xl overflow-hidden shadow-2xl relative">
            <LeafletMapWrapper
              showHindcastTrajectory={true}
              showVesselAttribution={false}
              showDriftForecast={false}
            />
          </div>

          {/* Backward Drift Step Inspection Table */}
          <div className="p-4 rounded-xl bg-marine-900/90 border border-marine-700/80 backdrop-blur-md space-y-3 shadow-xl">
            <div className="flex items-center justify-between border-b border-marine-800 pb-2">
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-radar-cyan" />
                Reverse Trajectory Time-Step Log
              </h3>
              <span className="text-[10px] font-mono text-slate-400">Lagrangian Particle Advection</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-xs text-slate-300 divide-y divide-marine-800">
                <thead>
                  <tr className="text-slate-400 text-[10px] uppercase bg-marine-950/60">
                    <th className="py-2 px-3">Step</th>
                    <th className="py-2 px-3">UTC Timestamp</th>
                    <th className="py-2 px-3">Coordinates</th>
                    <th className="py-2 px-3">Current Velocity</th>
                    <th className="py-2 px-3">Uncertainty Radius</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-marine-800/60">
                  {hindcast.backwardSteps.map((step: any, idx: number) => (
                    <tr
                      key={idx}
                      className={`hover:bg-marine-800/40 transition-colors ${
                        idx === hindcast.backwardSteps.length - 1 ? 'bg-radar-purple/10 text-white font-bold' : ''
                      }`}
                    >
                      <td className="py-2 px-3 text-radar-purple font-bold">
                        {step.stepHour === 0 ? 'T = 0h (Scan)' : `T = ${step.stepHour}h`}
                      </td>
                      <td className="py-2 px-3">{step.timestamp.replace('T', ' ').substring(0, 19)}</td>
                      <td className="py-2 px-3 text-radar-cyan">
                        {step.coordinates[0].toFixed(4)}°N, {step.coordinates[1].toFixed(4)}°E
                      </td>
                      <td className="py-2 px-3">{step.currentVelocityKnots} kts</td>
                      <td className="py-2 px-3 text-slate-400">±{step.ellipseMajorKm} km</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right 4 Cols: Origin Determination HUD & Physics Parameter Controls */}
        <div className="lg:col-span-4 space-y-4">
          {/* Origin Determination Card */}
          <div className="p-5 rounded-xl bg-marine-900/90 border border-marine-700/80 backdrop-blur-md space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-marine-800 pb-3">
              <div className="flex items-center space-x-2">
                <Crosshair className="w-4 h-4 text-radar-purple" />
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
                  Probable Release Origin
                </h3>
              </div>
              <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-radar-purple/20 text-radar-purple border border-radar-purple/40 rounded">
                POINT HC-01
              </span>
            </div>

            {/* Confidence Meter */}
            <div className="flex justify-center p-3 rounded-xl bg-marine-950/80 border border-marine-800">
              <ConfidenceGauge
                score={hindcast.confidence}
                size={115}
                strokeWidth={8}
                label="Hindcast Confidence"
                sublabel="Error Ellipse: 94.2% Bound"
              />
            </div>

            {/* Key Origin Parameters */}
            <div className="space-y-2 font-mono text-xs">
              <div className="p-2.5 rounded-lg bg-marine-950/70 border border-marine-800">
                <span className="text-slate-400 text-[10px] block">ORIGIN COORDINATES</span>
                <span className="font-bold text-radar-purple text-sm">
                  {hindcast.originCoordinates[0].toFixed(4)}°N, {hindcast.originCoordinates[1].toFixed(4)}°E
                </span>
                <span className="text-[10px] text-slate-400 block mt-0.5">{hindcast.originName}</span>
              </div>

              <div className="p-2.5 rounded-lg bg-marine-950/70 border border-marine-800">
                <span className="text-slate-400 text-[10px] block">ESTIMATED DISCHARGE WINDOW</span>
                <span className="font-bold text-white text-xs block">
                  {hindcast.dischargeStartTime.replace('T', ' ').substring(0, 16)} to {hindcast.dischargeEndTime.substring(11, 16)} UTC
                </span>
                <span className="text-[10px] text-radar-amber block mt-0.5">
                  Discharge Duration: ~{hindcast.durationHours} Hours
                </span>
              </div>

              <div className="p-2.5 rounded-lg bg-marine-950/70 border border-marine-800 flex items-center justify-between">
                <span className="text-slate-400 text-[10px]">EST. RELEASE VOLUME</span>
                <span className="font-bold text-radar-amber">{hindcast.releaseVolumeEstBbl} bbls</span>
              </div>
            </div>

            {/* Interactive Physics Tuner */}
            <div className="p-3.5 rounded-xl bg-marine-950/80 border border-marine-800 space-y-3 font-mono">
              <div className="flex items-center justify-between text-xs text-radar-cyan font-bold border-b border-marine-800 pb-1.5">
                <span className="flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5" />
                  Physics Model Tuning
                </span>
                <button
                  onClick={handleRecalculate}
                  className="text-[10px] text-radar-purple hover:underline"
                >
                  Recalculate
                </button>
              </div>

              {/* Windage Factor Slider */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] text-slate-300">
                  <span>Windage Factor (C_w):</span>
                  <strong className="text-radar-purple">{windageFactor.toFixed(1)}%</strong>
                </div>
                <input
                  type="range"
                  min="2.0"
                  max="4.5"
                  step="0.1"
                  value={windageFactor}
                  onChange={(e) => setWindageFactor(Number(e.target.value))}
                  className="w-full accent-radar-purple cursor-pointer h-1.5 bg-marine-800 rounded"
                />
              </div>

              {/* Ocean Current Model Selector */}
              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 uppercase block">Hydrodynamic Current Model</label>
                <select
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-marine-800 border border-marine-700 text-xs text-slate-200 focus:outline-none focus:border-radar-purple"
                >
                  <option value="HYCOM 1/12° + ECMWF ERA5">HYCOM 1/12° + ECMWF ERA5</option>
                  <option value="INCOIS High-Res Coastal ROMS">INCOIS High-Res Coastal ROMS</option>
                  <option value="Copernicus CMEMS Global Physics">Copernicus CMEMS Global Physics</option>
                </select>
              </div>

              {/* Stokes Drift Checkbox */}
              <label className="flex items-center space-x-2 text-[11px] text-slate-300 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={includeStokesDrift}
                  onChange={(e) => setIncludeStokesDrift(e.target.checked)}
                  className="rounded bg-marine-800 border-marine-600 text-radar-purple focus:ring-0"
                />
                <span>Include Wave Stokes Drift Integration</span>
              </label>
            </div>

            {/* Action Button to Vessel Attribution */}
            <button
              onClick={() => navigate('/attribution')}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-radar-rose to-radar-purple text-white font-mono font-extrabold text-xs flex items-center justify-center gap-2 shadow-glow-rose hover:brightness-110 active:scale-95 transition-all"
            >
              <span>Correlate AIS Vessels at Point HC-01</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

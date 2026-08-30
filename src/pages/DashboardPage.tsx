import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useIncident } from '../context/IncidentContext';
import { LeafletMapWrapper } from '../components/common/LeafletMapWrapper';
import { StatCard } from '../components/common/StatCard';
import { ConfidenceGauge } from '../components/common/ConfidenceGauge';
import { 
  AlertTriangle, 
  Satellite, 
  Ship, 
  Waves, 
  History, 
  FileText, 
  Wind, 
  Compass, 
  Activity, 
  ArrowRight, 
  CheckCircle2, 
  ShieldAlert, 
  Eye, 
  Radio, 
  Sliders, 
  Crosshair,
  BarChart3
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  Cell 
} from 'recharts';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { incidents, selectedIncident, setSelectedIncidentId, setActiveAttributionVesselId } = useIncident();

  const primeSuspect = selectedIncident.attributedVessels.find(v => v.isPrimeSuspect);

  // Recharts dispersion trend data
  const dispersionData = selectedIncident.driftForecast.map(d => ({
    hour: `+${d.timeOffsetHours}h`,
    area: d.areaKm2,
    uncertainty: d.uncertaintyRadiusKm
  }));

  const severityBarData = incidents.map(inc => ({
    name: inc.name.split(' ')[0],
    fullName: inc.name,
    area: inc.areaKm2,
    confidence: inc.confidence,
    severity: inc.severity
  }));

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'Critical':
        return 'bg-radar-rose/20 text-radar-rose border-radar-rose/40';
      case 'High':
        return 'bg-radar-amber/20 text-radar-amber border-radar-amber/40';
      case 'Moderate':
        return 'bg-radar-cyan/20 text-radar-cyan border-radar-cyan/40';
      default:
        return 'bg-slate-700/50 text-slate-300 border-slate-600';
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Welcome & Sub-Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-marine-800/80 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white uppercase tracking-tight font-sans">
              Maritime Monitoring <span className="text-radar-cyan">Dashboard</span>
            </h1>
            <span className="px-2 py-0.5 text-xs font-mono font-bold bg-radar-emerald/20 text-radar-emerald border border-radar-emerald/40 rounded">
              SYSTEM READY
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 font-mono mt-1">
            Real-time orbital radar surveillance, hydrodynamic drift forecasting & vessel attribution.
          </p>
        </div>

        {/* Action Shortcuts */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => navigate('/detection')}
            className="px-3.5 py-2 rounded-xl bg-marine-800 hover:bg-marine-750 border border-marine-600 hover:border-radar-cyan/50 text-xs font-mono font-bold text-slate-200 hover:text-white flex items-center space-x-1.5 transition-all shadow-sm"
          >
            <Satellite className="w-3.5 h-3.5 text-radar-cyan" />
            <span>New SAR Scan</span>
          </button>

          <button
            onClick={() => navigate('/assistant')}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-radar-cyan/20 to-radar-teal/20 border border-radar-cyan/40 hover:border-radar-cyan text-xs font-mono font-bold text-radar-cyan hover:text-white flex items-center space-x-1.5 transition-all shadow-glow-cyan/10"
          >
            <Activity className="w-3.5 h-3.5 text-radar-teal" />
            <span>AI Investigator</span>
          </button>
        </div>
      </div>

      {/* Top 5 Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        <StatCard
          title="Active Slicks"
          value="3"
          unit="Incidents"
          subtitle="Monitored in Indian EEZ"
          icon={AlertTriangle}
          accentColor="rose"
          trend={{ value: "+1 in 24h", isPositive: false }}
        />

        <StatCard
          title="Contaminated Area"
          value="90.5"
          unit="km²"
          subtitle="Estimated 3,870 bbls"
          icon={Waves}
          accentColor="amber"
          trend={{ value: "+14.2% spread", isPositive: false }}
        />

        <StatCard
          title="Monitored Vessels"
          value="14,280"
          unit="AIS"
          subtitle="99.8% Stream Uptime"
          icon={Ship}
          accentColor="cyan"
          trend={{ value: "4 Candidates", isPositive: true }}
        />

        <StatCard
          title="Coastal Risk"
          value="142.5"
          unit="km"
          subtitle="ETA: 48h to Alibaug"
          icon={ShieldAlert}
          accentColor="purple"
          trend={{ value: "Warning Level 3", isPositive: false }}
        />

        <StatCard
          title="AI Accuracy"
          value="96.8"
          unit="%"
          subtitle="DeepLabV3+ UNet"
          icon={Activity}
          accentColor="emerald"
          trend={{ value: "High Confidence", isPositive: true }}
        />
      </div>

      {/* Main Command Center: Map + Right Telemetry Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left 8 Cols: Interactive Ocean Map */}
        <div className="lg:col-span-8 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Compass className="w-4 h-4 text-radar-cyan" />
              <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-white">
                Live Ocean Surveillance Grid — {selectedIncident.region}
              </h2>
            </div>
            <div className="text-xs font-mono text-slate-400">
              Centroid: <span className="text-radar-cyan font-bold">{selectedIncident.coordinates[0].toFixed(3)}°N, {selectedIncident.coordinates[1].toFixed(3)}°E</span>
            </div>
          </div>

          <div className="h-[460px] lg:h-[540px] rounded-xl overflow-hidden shadow-2xl">
            <LeafletMapWrapper
              showAllIncidents={true}
              showHindcastTrajectory={true}
              showVesselAttribution={true}
              showDriftForecast={true}
              onVesselSelect={(vessel) => {
                setActiveAttributionVesselId(vessel.id);
                navigate('/attribution');
              }}
            />
          </div>
        </div>

        {/* Right 4 Cols: Active Incident Telemetry HUD & Suspect Dossier */}
        <div className="lg:col-span-4 space-y-4">
          {/* Active Target Card */}
          <div className="p-5 rounded-xl bg-marine-900/90 border border-marine-700/80 backdrop-blur-md space-y-4 shadow-xl">
            <div className="flex items-start justify-between border-b border-marine-800 pb-3">
              <div>
                <span className="text-[10px] font-mono text-slate-400 block">{selectedIncident.id}</span>
                <h3 className="text-sm font-bold text-white leading-tight mt-0.5">{selectedIncident.name}</h3>
              </div>
              <span className={`px-2 py-0.5 text-[10px] font-mono font-bold rounded border ${getSeverityBadge(selectedIncident.severity)}`}>
                {selectedIncident.severity}
              </span>
            </div>

            {/* AI Confidence Gauge & Key Metrics */}
            <div className="grid grid-cols-2 gap-3 items-center">
              <div className="flex justify-center p-2 rounded-lg bg-marine-950/70 border border-marine-800">
                <ConfidenceGauge
                  score={selectedIncident.confidence}
                  size={105}
                  strokeWidth={8}
                  label="Detection Conf."
                />
              </div>

              <div className="space-y-2 font-mono text-xs">
                <div className="p-2 rounded-lg bg-marine-950/70 border border-marine-800">
                  <span className="text-[10px] text-slate-400 block">SLICK AREA</span>
                  <span className="text-sm font-bold text-white">{selectedIncident.areaKm2} km²</span>
                </div>
                <div className="p-2 rounded-lg bg-marine-950/70 border border-marine-800">
                  <span className="text-[10px] text-slate-400 block">EST. DISCHARGE</span>
                  <span className="text-sm font-bold text-radar-amber">{selectedIncident.estimatedVolumeBbl} bbls</span>
                </div>
              </div>
            </div>

            {/* MetOcean Weather Card */}
            <div className="p-3 rounded-xl bg-marine-950/80 border border-marine-800 space-y-2">
              <div className="text-[10px] font-mono font-bold text-radar-cyan uppercase tracking-wider flex items-center justify-between">
                <span>Hydrodynamic Conditions</span>
                <Wind className="w-3.5 h-3.5" />
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-slate-300">
                <div>
                  <span className="text-slate-400 block text-[9px]">WIND STRESS</span>
                  <span>{selectedIncident.currentMetOcean.windSpeedKnots} kts @ {selectedIncident.currentMetOcean.windDirectionDeg}°</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[9px]">OCEAN CURRENT</span>
                  <span>{selectedIncident.currentMetOcean.currentSpeedKnots} kts @ {selectedIncident.currentMetOcean.currentDirectionDeg}°</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[9px]">SST TEMP</span>
                  <span>{selectedIncident.currentMetOcean.seaSurfaceTempC}°C</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[9px]">WAVE HEIGHT</span>
                  <span>{selectedIncident.currentMetOcean.waveHeightM} m</span>
                </div>
              </div>
            </div>

            {/* Suspect Ship Highlight */}
            {primeSuspect && (
              <div className="p-3 rounded-xl bg-radar-rose/10 border border-radar-rose/30 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold text-radar-rose uppercase tracking-wider flex items-center gap-1.5">
                    <Ship className="w-3.5 h-3.5" />
                    Prime Suspect Attributed
                  </span>
                  <span className="text-[10px] font-mono font-bold text-radar-rose bg-radar-rose/20 px-1.5 py-0.5 rounded border border-radar-rose/40">
                    {primeSuspect.overallAttributionScore}% Match
                  </span>
                </div>

                <div className="text-xs font-mono text-white font-bold">{primeSuspect.name}</div>
                <div className="text-[11px] font-mono text-slate-300">
                  IMO: {primeSuspect.imo} • {primeSuspect.flag} • {primeSuspect.vesselType}
                </div>

                <button
                  onClick={() => {
                    setActiveAttributionVesselId(primeSuspect.id);
                    navigate('/attribution');
                  }}
                  className="w-full mt-1 py-1.5 rounded-lg bg-radar-rose/20 hover:bg-radar-rose/30 border border-radar-rose/50 text-[11px] font-mono font-bold text-white flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Crosshair className="w-3.5 h-3.5" />
                  View Suspect Investigation
                </button>
              </div>
            )}

            {/* Navigation Quick Links */}
            <div className="grid grid-cols-3 gap-2 pt-1">
              <button
                onClick={() => navigate('/tracking')}
                className="p-2 rounded-lg bg-marine-800 hover:bg-marine-750 border border-marine-700 text-center text-[10px] font-mono font-semibold text-slate-300 hover:text-white transition-colors"
              >
                <Waves className="w-4 h-4 text-radar-amber mx-auto mb-1" />
                Drift 48h
              </button>

              <button
                onClick={() => navigate('/hindcasting')}
                className="p-2 rounded-lg bg-marine-800 hover:bg-marine-750 border border-marine-700 text-center text-[10px] font-mono font-semibold text-slate-300 hover:text-white transition-colors"
              >
                <History className="w-4 h-4 text-radar-purple mx-auto mb-1" />
                Hindcast
              </button>

              <button
                onClick={() => navigate('/reports')}
                className="p-2 rounded-lg bg-marine-800 hover:bg-marine-750 border border-marine-700 text-center text-[10px] font-mono font-semibold text-slate-300 hover:text-white transition-colors"
              >
                <FileText className="w-4 h-4 text-radar-teal mx-auto mb-1" />
                Dossier
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Analytics & Incident Explorer Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 6 Cols: Dispersion & Forecast Area Chart */}
        <div className="lg:col-span-6 p-5 rounded-xl bg-marine-900/90 border border-marine-700/80 backdrop-blur-md space-y-3 shadow-xl">
          <div className="flex items-center justify-between border-b border-marine-800 pb-2">
            <div className="flex items-center space-x-2">
              <BarChart3 className="w-4 h-4 text-radar-amber" />
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
                Slick Area Dispersion Forecast (0h to +72h)
              </h3>
            </div>
            <span className="text-[10px] font-mono text-slate-400">HYCOM Lagrangian Model</span>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dispersionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="hour" stroke="#64748b" tick={{ fontSize: 11, fontFamily: 'monospace' }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 11, fontFamily: 'monospace' }} unit=" km²" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0a1529',
                    border: '1px solid rgba(245, 158, 11, 0.4)',
                    borderRadius: '0.5rem',
                    fontSize: '11px',
                    fontFamily: 'monospace'
                  }}
                  itemStyle={{ color: '#f59e0b' }}
                />
                <Area type="monotone" dataKey="area" stroke="#f59e0b" strokeWidth={2.5} fillOpacity={1} fill="url(#areaGradient)" name="Surface Area (km²)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="text-[11px] font-mono text-slate-400 flex items-center justify-between">
            <span>Current: <strong>{selectedIncident.areaKm2} km²</strong></span>
            <span>+72h Projection: <strong>{selectedIncident.driftForecast[selectedIncident.driftForecast.length - 1]?.areaKm2 || 118} km²</strong></span>
          </div>
        </div>

        {/* Right 6 Cols: Multi-Incident Comparison Feed */}
        <div className="lg:col-span-6 p-5 rounded-xl bg-marine-900/90 border border-marine-700/80 backdrop-blur-md space-y-3 shadow-xl">
          <div className="flex items-center justify-between border-b border-marine-800 pb-2">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-radar-cyan" />
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
                Active Incident Registry
              </h3>
            </div>
            <span className="text-[10px] font-mono text-slate-400">{incidents.length} Monitored Zones</span>
          </div>

          <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
            {incidents.map((inc) => (
              <div
                key={inc.id}
                onClick={() => setSelectedIncidentId(inc.id)}
                className={`p-3 rounded-lg border transition-all cursor-pointer flex items-center justify-between ${
                  inc.id === selectedIncident.id
                    ? 'bg-radar-cyan/10 border-radar-cyan/50 shadow-glow-cyan/10'
                    : 'bg-marine-950/70 border-marine-800 hover:bg-marine-800/60 hover:border-marine-700'
                }`}
              >
                <div className="space-y-0.5">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-mono font-bold text-white">{inc.name}</span>
                    <span className={`px-1.5 py-0.2 text-[9px] font-mono rounded border ${getSeverityBadge(inc.severity)}`}>
                      {inc.severity}
                    </span>
                  </div>
                  <div className="text-[10px] font-mono text-slate-400">
                    {inc.region} • {inc.areaKm2} km² • {inc.oilType}
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs font-mono font-bold text-radar-cyan">{inc.confidence}% Conf</div>
                  <div className="text-[10px] font-mono text-slate-400">{inc.status}</div>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => navigate('/detection')}
            className="w-full py-2 rounded-lg bg-marine-800 hover:bg-marine-750 border border-marine-700 text-xs font-mono font-bold text-slate-200 flex items-center justify-center gap-1.5 transition-colors"
          >
            <span>Scan New Satellite Orbit Tile</span>
            <ArrowRight className="w-3.5 h-3.5 text-radar-cyan" />
          </button>
        </div>
      </div>
    </div>
  );
};

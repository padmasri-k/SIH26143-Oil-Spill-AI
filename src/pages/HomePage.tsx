import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useIncident } from '../context/IncidentContext';
import { 
  Satellite, 
  ShieldAlert, 
  Waves, 
  History, 
  Ship, 
  FileText, 
  ArrowRight, 
  CheckCircle2, 
  Activity, 
  Radio, 
  Layers, 
  Cpu, 
  Compass, 
  Eye, 
  Zap, 
  Globe2, 
  Anchor
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { incidents, setSelectedIncidentId } = useIncident();

  const pipelineSteps = [
    {
      step: '01',
      title: 'Satellite SAR & Optical Ingestion',
      desc: 'Automated acquisition from Sentinel-1A/B C-SAR, Sentinel-2 MSI, and RADARSAT-Constellation with all-weather night/day surveillance.',
      icon: Satellite,
      color: 'text-radar-cyan',
      bg: 'bg-radar-cyan/10 border-radar-cyan/30'
    },
    {
      step: '02',
      title: 'Deep Learning Slick Segmentation',
      desc: 'Dual-polarized SAR radiometric calibration & DeepLabV3+ neural network segmenting oil slicks from look-alikes with >96% accuracy.',
      icon: Cpu,
      color: 'text-radar-teal',
      bg: 'bg-radar-teal/10 border-radar-teal/30'
    },
    {
      step: '03',
      title: 'Hydrodynamic Hindcast Modeling',
      desc: 'Reverse Lagrangian particle drift backtracking using HYCOM ocean currents, NOAA GFS winds, and Stokes wave drift to pinpoint release origin.',
      icon: History,
      color: 'text-radar-purple',
      bg: 'bg-radar-purple/10 border-radar-purple/30'
    },
    {
      step: '04',
      title: 'AIS Spatiotemporal Vessel Attribution',
      desc: 'Cross-correlating hindcast origin windows with global AIS vessel tracks, identifying speed anomalies, route divergences, and dark ship gaps.',
      icon: Ship,
      color: 'text-radar-rose',
      bg: 'bg-radar-rose/10 border-radar-rose/30'
    },
    {
      step: '05',
      title: 'Legal Forensic Enforcement Dossier',
      desc: 'Automated generation of court-ready MARPOL compliance evidence packages for Indian Coast Guard, DG Shipping, and maritime authorities.',
      icon: FileText,
      color: 'text-radar-amber',
      bg: 'bg-radar-amber/10 border-radar-amber/30'
    }
  ];

  return (
    <div className="space-y-10 pb-16">
      {/* Hero Section with Command Center Backdrop */}
      <section className="relative rounded-2xl overflow-hidden border border-marine-700/70 bg-gradient-to-br from-marine-900 via-marine-950 to-marine-950 p-6 sm:p-10 shadow-2xl">
        {/* Ambient Radar Background Grid */}
        <div className="absolute inset-0 radar-grid opacity-20 pointer-events-none" />
        <div className="absolute -right-24 -top-24 w-96 h-96 rounded-full bg-radar-cyan/10 blur-3xl pointer-events-none" />
        <div className="absolute -left-24 -bottom-24 w-96 h-96 rounded-full bg-radar-teal/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl space-y-6">
          {/* Top Tag */}
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-marine-800/80 border border-radar-cyan/40 text-xs font-mono text-radar-cyan shadow-glow-cyan/10">
            <span className="w-2 h-2 rounded-full bg-radar-cyan animate-ping" />
            <span className="font-semibold uppercase tracking-wider">SIH26143 • Operational Command AI</span>
          </div>

          {/* Main Title */}
          <div className="space-y-2">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight uppercase font-sans">
              AI-Powered <span className="text-transparent bg-clip-text bg-gradient-to-r from-radar-cyan via-radar-teal to-radar-emerald">Oil Spill Intelligence</span> & Vessel Attribution
            </h1>
            <p className="text-slate-300 text-sm sm:text-base lg:text-lg leading-relaxed max-w-3xl">
              Next-generation maritime defense system combining multi-mission satellite SAR imaging, deep learning segmentation, hydrodynamic Lagrangian hindcasting, and AIS spatiotemporal correlation to detect illegal ocean discharges and identify culprit vessels in real time.
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => navigate('/dashboard')}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-radar-cyan to-radar-teal text-marine-950 font-extrabold text-sm flex items-center space-x-2 shadow-glow-cyan hover:brightness-110 active:scale-95 transition-all"
            >
              <Compass className="w-4 h-4" />
              <span>Launch Ocean Command HUD</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => navigate('/detection')}
              className="px-5 py-3 rounded-xl bg-marine-800 hover:bg-marine-750 text-slate-100 font-semibold text-sm border border-marine-600 hover:border-radar-cyan/50 flex items-center space-x-2 transition-all shadow-sm"
            >
              <Satellite className="w-4 h-4 text-radar-cyan" />
              <span>Run AI Detection Engine</span>
            </button>

            <button
              onClick={() => navigate('/attribution')}
              className="px-5 py-3 rounded-xl bg-marine-800 hover:bg-marine-750 text-slate-100 font-semibold text-sm border border-marine-600 hover:border-radar-rose/50 flex items-center space-x-2 transition-all shadow-sm"
            >
              <Ship className="w-4 h-4 text-radar-rose" />
              <span>Suspect Vessel Attribution</span>
            </button>
          </div>

          {/* Live Telemetry Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-marine-800/80">
            <div className="p-3 rounded-xl bg-marine-950/60 border border-marine-800">
              <div className="text-[11px] font-mono text-slate-400 uppercase">Detection Accuracy</div>
              <div className="text-xl font-bold font-mono text-radar-cyan mt-0.5">96.8%</div>
              <div className="text-[10px] text-slate-400 font-mono">DeepLabV3+ UNet</div>
            </div>

            <div className="p-3 rounded-xl bg-marine-950/60 border border-marine-800">
              <div className="text-[11px] font-mono text-slate-400 uppercase">Hindcast Window</div>
              <div className="text-xl font-bold font-mono text-radar-purple mt-0.5">Up to 72 hrs</div>
              <div className="text-[10px] text-slate-400 font-mono">HYCOM + ECMWF</div>
            </div>

            <div className="p-3 rounded-xl bg-marine-950/60 border border-marine-800">
              <div className="text-[11px] font-mono text-slate-400 uppercase">AIS Stream Rate</div>
              <div className="text-xl font-bold font-mono text-radar-teal mt-0.5">14,200+</div>
              <div className="text-[10px] text-slate-400 font-mono">Vessels Monitored</div>
            </div>

            <div className="p-3 rounded-xl bg-marine-950/60 border border-marine-800">
              <div className="text-[11px] font-mono text-slate-400 uppercase">Response Latency</div>
              <div className="text-xl font-bold font-mono text-radar-emerald mt-0.5">&lt; 4 mins</div>
              <div className="text-[10px] text-slate-400 font-mono">From Orbit Pass</div>
            </div>
          </div>
        </div>
      </section>

      {/* Active High-Priority Incidents Feed */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white uppercase tracking-wide flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-radar-rose animate-pulse" />
              Active Monitored Incidents
            </h2>
            <p className="text-xs text-slate-400 font-mono">
              Live multi-spectral and SAR detections requiring active hindcasting and vessel correlation
            </p>
          </div>
          <button
            onClick={() => navigate('/dashboard')}
            className="text-xs font-mono text-radar-cyan hover:underline flex items-center gap-1 font-semibold"
          >
            View Live Map <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {incidents.map((incident) => {
            const primeSuspect = incident.attributedVessels.find(v => v.isPrimeSuspect);
            const severityColor = incident.severity === 'Critical' 
              ? 'border-radar-rose/40 bg-radar-rose/5' 
              : incident.severity === 'High' 
              ? 'border-radar-amber/40 bg-radar-amber/5' 
              : 'border-radar-cyan/40 bg-radar-cyan/5';

            return (
              <div
                key={incident.id}
                className={`p-5 rounded-xl bg-marine-900/90 border backdrop-blur-md transition-all duration-200 hover:-translate-y-1 hover:shadow-xl space-y-4 ${severityColor}`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-mono text-slate-400">{incident.id}</span>
                    <h3 className="text-sm font-bold text-white leading-tight mt-0.5">{incident.name}</h3>
                    <span className="text-[11px] text-slate-400 font-mono block mt-1">{incident.region}</span>
                  </div>
                  <span className={`px-2 py-0.5 text-[10px] font-mono font-bold rounded border ${
                    incident.severity === 'Critical' ? 'bg-radar-rose/20 text-radar-rose border-radar-rose/40' :
                    incident.severity === 'High' ? 'bg-radar-amber/20 text-radar-amber border-radar-amber/40' :
                    'bg-radar-cyan/20 text-radar-cyan border-radar-cyan/40'
                  }`}>
                    {incident.severity}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs font-mono p-2.5 rounded-lg bg-marine-950/80 border border-marine-800">
                  <div>
                    <span className="text-slate-400 text-[10px] block">SLICK AREA</span>
                    <span className="text-white font-bold">{incident.areaKm2} km²</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block">AI CONFIDENCE</span>
                    <span className="text-radar-cyan font-bold">{incident.confidence}%</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block">OIL TYPE</span>
                    <span className="text-white font-semibold truncate block">{incident.oilType}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block">PRIME SUSPECT</span>
                    <span className="text-radar-rose font-bold truncate block">{primeSuspect?.name || 'In Progress'}</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setSelectedIncidentId(incident.id);
                    navigate('/dashboard');
                  }}
                  className="w-full py-2 rounded-lg bg-marine-800 hover:bg-marine-750 text-slate-100 hover:text-white border border-marine-700 text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Eye className="w-3.5 h-3.5 text-radar-cyan" />
                  Investigate Slick Dossier
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* End-to-End Forensic Intelligence Pipeline */}
      <section className="space-y-6 pt-4">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-marine-850 border border-radar-cyan/30 text-xs font-mono text-radar-cyan">
            <Zap className="w-3.5 h-3.5" />
            <span>Operational Architecture</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white uppercase tracking-tight">
            End-to-End Maritime Intelligence Pipeline
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            From raw orbital radar backscatter to legally defensible vessel attribution in 5 integrated phases.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 relative">
          {pipelineSteps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.step}
                className={`p-4 rounded-xl border backdrop-blur-md space-y-3 relative group transition-all duration-200 hover:-translate-y-1 ${step.bg}`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-xl font-black font-mono ${step.color}`}>{step.step}</span>
                  <div className={`p-2 rounded-lg bg-marine-950/80 border border-white/5 ${step.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                </div>
                <h4 className="text-xs font-bold text-white leading-tight uppercase font-mono">{step.title}</h4>
                <p className="text-[11px] text-slate-300 leading-relaxed">{step.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Core Technology Capabilities Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
        <div className="p-5 rounded-xl bg-marine-900/90 border border-marine-800 space-y-3">
          <div className="p-2.5 rounded-xl bg-radar-cyan/10 border border-radar-cyan/20 w-fit text-radar-cyan">
            <Radio className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-white uppercase font-mono">Multi-Sensor Spaceborne Fusion</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Ingests Sentinel-1 C-Band SAR with polarization decomposition (VV/VH), Sentinel-2 MSI Shortwave Infrared (SWIR), and NOAA GFS surface meteorology to filter false positives like biogenic slicks, algal blooms, and rain cells.
          </p>
        </div>

        <div className="p-5 rounded-xl bg-marine-900/90 border border-marine-800 space-y-3">
          <div className="p-2.5 rounded-xl bg-radar-purple/10 border border-radar-purple/20 w-fit text-radar-purple">
            <History className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-white uppercase font-mono">Lagrangian Particle Hindcasting</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Backtracks surface oil particles through 4D hydrodynamic current fields and wind stress vectors. Generates expanding confidence ellipses to determine the exact GPS coordinates and time of illegal discharge.
          </p>
        </div>

        <div className="p-5 rounded-xl bg-marine-900/90 border border-marine-800 space-y-3">
          <div className="p-2.5 rounded-xl bg-radar-rose/10 border border-radar-rose/20 w-fit text-radar-rose">
            <Ship className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-white uppercase font-mono">Multi-Criteria Vessel Attribution</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Correlates hindcast origins against global AIS tracks using a 4-factor scoring engine (Spatial distance, Temporal window, Route/Speed anomalies, and Dark Ship transponder gaps) to pinpoint culprit ships.
          </p>
        </div>
      </section>
    </div>
  );
};

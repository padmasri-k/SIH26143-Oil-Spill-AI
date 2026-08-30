import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useIncident } from '../context/IncidentContext';
import { LeafletMapWrapper } from '../components/common/LeafletMapWrapper';
import { ConfidenceGauge } from '../components/common/ConfidenceGauge';
import { AttributedVessel } from '../types';
import { 
  Ship, 
  ShieldAlert, 
  Crosshair, 
  CheckCircle2, 
  Clock, 
  Navigation, 
  FileText, 
  Download, 
  AlertTriangle, 
  ArrowRight, 
  Search, 
  SlidersHorizontal, 
  Eye, 
  X,
  TrendingDown,
  Anchor,
  Sparkles
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

export const VesselAttributionPage: React.FC = () => {
  const navigate = useNavigate();
  const { 
    selectedIncident, 
    activeAttributionVesselId, 
    setActiveAttributionVesselId 
  } = useIncident();

  const [selectedVesselForModal, setSelectedVesselForModal] = useState<AttributedVessel | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterType, setFilterType] = useState<string>('all');

  const vessels = selectedIncident.attributedVessels;
  const primeSuspect = vessels.find(v => v.isPrimeSuspect) || vessels[0];
  const activeVessel = vessels.find(v => v.id === activeAttributionVesselId) || primeSuspect;

  const filteredVessels = vessels.filter(v => {
    const matchesSearch = v.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          v.imo.includes(searchTerm) || 
                          v.mmsi.includes(searchTerm);
    const matchesType = filterType === 'all' || v.vesselType.toLowerCase().includes(filterType.toLowerCase());
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-marine-800/80 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white uppercase tracking-tight font-sans">
              AIS Spatiotemporal <span className="text-radar-rose">Vessel Attribution</span>
            </h1>
            <span className="px-2 py-0.5 text-xs font-mono font-bold bg-radar-rose/20 text-radar-rose border border-radar-rose/40 rounded">
              CULPRIT CORRELATION ENGINE
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 font-mono mt-1">
            Cross-referencing historical AIS vessel trajectories with hydrodynamic hindcast origin coordinates.
          </p>
        </div>

        {/* Action Button to Legal Reports */}
        <button
          onClick={() => navigate('/reports')}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-radar-rose to-radar-amber text-marine-950 font-mono font-extrabold text-xs flex items-center space-x-2 shadow-glow-rose hover:brightness-110 active:scale-95 transition-all"
        >
          <FileText className="w-4 h-4 text-marine-950" />
          <span>Compile Legal Enforcement Dossier</span>
          <ArrowRight className="w-4 h-4 text-marine-950" />
        </button>
      </div>

      {/* Prime Suspect Banner Alert */}
      {primeSuspect && (
        <div className="p-5 rounded-2xl bg-gradient-to-r from-radar-rose/20 via-marine-900 to-marine-900 border-2 border-radar-rose/50 shadow-glow-rose/20 relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1.5 z-10">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-radar-rose animate-ping" />
              <span className="text-xs font-mono font-black uppercase tracking-widest text-radar-rose">
                PRIMARY SUSPECT IDENTIFIED — {primeSuspect.overallAttributionScore}% MATCH
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-wide flex items-center gap-2">
              <Ship className="w-6 h-6 text-radar-rose" />
              {primeSuspect.name}
            </h2>
            <p className="text-xs font-mono text-slate-300 max-w-2xl">
              {primeSuspect.forensicSummary}
            </p>
          </div>

          <div className="flex items-center space-x-3 z-10">
            <button
              onClick={() => setSelectedVesselForModal(primeSuspect)}
              className="px-4 py-2.5 rounded-xl bg-radar-rose text-white font-mono font-bold text-xs flex items-center space-x-1.5 shadow-glow-rose hover:brightness-110 active:scale-95 transition-all"
            >
              <Eye className="w-4 h-4" />
              <span>Inspect Vessel Dossier</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Workspace: Interactive AIS Intercept Map + Candidate Leaderboard */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left 8 Cols: Interactive Map */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between font-mono text-xs text-slate-300">
            <div className="flex items-center space-x-2">
              <Crosshair className="w-4 h-4 text-radar-cyan" />
              <span>AIS Track Intersections at Hindcast Origin ({selectedIncident.hindcast.originCoordinates[0].toFixed(3)}°N, {selectedIncident.hindcast.originCoordinates[1].toFixed(3)}°E)</span>
            </div>
            <span className="text-radar-rose font-bold">{vessels.length} Candidate Ships Tracked</span>
          </div>

          <div className="h-[460px] sm:h-[520px] rounded-xl overflow-hidden shadow-2xl relative">
            <LeafletMapWrapper
              showHindcastTrajectory={true}
              showVesselAttribution={true}
              showDriftForecast={false}
              highlightedVesselId={activeAttributionVesselId}
              onVesselSelect={(vessel) => {
                setActiveAttributionVesselId(vessel.id);
                setSelectedVesselForModal(vessel);
              }}
            />
          </div>

          {/* Attribution Scoring Criteria Breakdown */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-xl bg-marine-900/90 border border-marine-800 space-y-1">
              <span className="text-[10px] font-mono text-slate-400 block uppercase">Spatial Proximity (30%)</span>
              <div className="text-base font-bold font-mono text-radar-cyan">
                {activeVessel.distanceScore.toFixed(1)} / 100
              </div>
              <span className="text-[10px] text-slate-400 font-mono">Distance to Origin Point</span>
            </div>

            <div className="p-3 rounded-xl bg-marine-900/90 border border-marine-800 space-y-1">
              <span className="text-[10px] font-mono text-slate-400 block uppercase">Temporal Coincidence (25%)</span>
              <div className="text-base font-bold font-mono text-radar-teal">
                {activeVessel.timeMatchScore.toFixed(1)} / 100
              </div>
              <span className="text-[10px] text-slate-400 font-mono">Discharge Window Sync</span>
            </div>

            <div className="p-3 rounded-xl bg-marine-900/90 border border-marine-800 space-y-1">
              <span className="text-[10px] font-mono text-slate-400 block uppercase">Course Alignment (25%)</span>
              <div className="text-base font-bold font-mono text-radar-purple">
                {activeVessel.routeSimilarityScore.toFixed(1)} / 100
              </div>
              <span className="text-[10px] text-slate-400 font-mono">Transit Route Vector</span>
            </div>

            <div className="p-3 rounded-xl bg-marine-900/90 border border-marine-800 space-y-1">
              <span className="text-[10px] font-mono text-slate-400 block uppercase">Speed Anomaly (20%)</span>
              <div className="text-base font-bold font-mono text-radar-rose">
                {activeVessel.anomalyScore.toFixed(1)} / 100
              </div>
              <span className="text-[10px] text-slate-400 font-mono">Speed Drop / Dark Gap</span>
            </div>
          </div>
        </div>

        {/* Right 4 Cols: Candidate Vessel Leaderboard */}
        <div className="lg:col-span-4 space-y-4">
          <div className="p-5 rounded-xl bg-marine-900/90 border border-marine-700/80 backdrop-blur-md space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-marine-800 pb-3">
              <div className="flex items-center space-x-2">
                <Ship className="w-4 h-4 text-radar-rose" />
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
                  Suspect Leaderboard
                </h3>
              </div>
              <span className="text-[10px] font-mono text-slate-400">Ranked by AI Score</span>
            </div>

            {/* Search and Filters */}
            <div className="space-y-2 font-mono">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  placeholder="Search name, IMO, MMSI..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-marine-950 border border-marine-750 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-radar-cyan"
                />
              </div>

              <div className="flex items-center space-x-1 text-[10px]">
                <button
                  onClick={() => setFilterType('all')}
                  className={`px-2 py-0.5 rounded transition-colors ${filterType === 'all' ? 'bg-marine-800 text-white font-bold' : 'text-slate-400'}`}
                >
                  All Types
                </button>
                <button
                  onClick={() => setFilterType('tanker')}
                  className={`px-2 py-0.5 rounded transition-colors ${filterType === 'tanker' ? 'bg-marine-800 text-radar-rose font-bold' : 'text-slate-400'}`}
                >
                  Tankers
                </button>
                <button
                  onClick={() => setFilterType('container')}
                  className={`px-2 py-0.5 rounded transition-colors ${filterType === 'container' ? 'bg-marine-800 text-radar-cyan font-bold' : 'text-slate-400'}`}
                >
                  Cargo
                </button>
              </div>
            </div>

            {/* Vessel List Cards */}
            <div className="space-y-2.5 max-h-[460px] overflow-y-auto pr-1">
              {filteredVessels.map((vessel) => {
                const isSelected = activeVessel.id === vessel.id;
                const isPrime = vessel.isPrimeSuspect;

                return (
                  <div
                    key={vessel.id}
                    onClick={() => setActiveAttributionVesselId(vessel.id)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer space-y-2 ${
                      isPrime
                        ? 'bg-radar-rose/10 border-radar-rose/60 shadow-glow-rose/20'
                        : isSelected
                        ? 'bg-radar-cyan/10 border-radar-cyan/60'
                        : 'bg-marine-950/70 border-marine-800 hover:bg-marine-800/60'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center space-x-1.5">
                          <h4 className="text-xs font-bold text-white font-mono">{vessel.name}</h4>
                          {isPrime && (
                            <span className="px-1.5 py-0.2 text-[9px] font-mono font-bold bg-radar-rose/30 text-radar-rose border border-radar-rose/50 rounded">
                              PRIME
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] font-mono text-slate-400 block mt-0.5">
                          IMO: {vessel.imo} • {vessel.flag} ({vessel.flagCode})
                        </span>
                      </div>

                      {/* Overall Score Badge */}
                      <div className="text-right">
                        <span className={`text-sm font-black font-mono ${isPrime ? 'text-radar-rose' : 'text-radar-amber'}`}>
                          {vessel.overallAttributionScore}%
                        </span>
                        <span className="text-[9px] font-mono text-slate-400 block">SCORE</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-1 text-[10px] font-mono text-slate-300 bg-marine-950/80 p-2 rounded-lg border border-marine-800/80">
                      <div>Type: <strong className="text-white">{vessel.vesselType}</strong></div>
                      <div>Speed: <strong className="text-radar-cyan">{vessel.speedKnots} kts</strong></div>
                      <div>Intercept: <strong className="text-white">{vessel.interceptTimestamp.substring(11, 16)} UTC</strong></div>
                      <div>AIS Status: <strong className={vessel.aisStatus.includes('Anomaly') ? 'text-radar-rose' : 'text-slate-300'}>{vessel.aisStatus.split(' ')[0]}</strong></div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedVesselForModal(vessel);
                      }}
                      className="w-full py-1.5 rounded-lg bg-marine-800 hover:bg-marine-750 border border-marine-700 text-[10px] font-mono font-bold text-slate-200 hover:text-white flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Eye className="w-3 h-3 text-radar-cyan" />
                      Inspect Vessel Dossier
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Suspect Vessel Inspection Modal */}
      {selectedVesselForModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-marine-950/80 backdrop-blur-md animate-in fade-in duration-150">
          <div className="bg-marine-900 border border-radar-cyan/40 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl space-y-5 p-6 relative">
            {/* Close Button */}
            <button
              onClick={() => setSelectedVesselForModal(null)}
              className="absolute top-4 right-4 p-2 rounded-lg bg-marine-800 hover:bg-marine-700 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="border-b border-marine-800 pb-3 space-y-1">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-mono font-bold text-radar-cyan uppercase">Maritime Suspect Dossier</span>
                {selectedVesselForModal.isPrimeSuspect && (
                  <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-radar-rose/20 text-radar-rose border border-radar-rose/40 rounded">
                    PRIMARY TARGET
                  </span>
                )}
              </div>
              <h2 className="text-2xl font-black text-white uppercase font-sans flex items-center gap-2">
                <Ship className="w-6 h-6 text-radar-cyan" />
                {selectedVesselForModal.name}
              </h2>
              <div className="text-xs font-mono text-slate-400">
                IMO: {selectedVesselForModal.imo} • MMSI: {selectedVesselForModal.mmsi} • Call Sign: {selectedVesselForModal.callSign}
              </div>
            </div>

            {/* Vessel Technical Specs Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 font-mono text-xs">
              <div className="p-2.5 rounded-xl bg-marine-950 border border-marine-800">
                <span className="text-slate-400 text-[10px] block uppercase">Vessel Type</span>
                <strong className="text-white text-xs">{selectedVesselForModal.vesselType}</strong>
              </div>
              <div className="p-2.5 rounded-xl bg-marine-950 border border-marine-800">
                <span className="text-slate-400 text-[10px] block uppercase">Flag Registry</span>
                <strong className="text-white text-xs">{selectedVesselForModal.flag}</strong>
              </div>
              <div className="p-2.5 rounded-xl bg-marine-950 border border-marine-800">
                <span className="text-slate-400 text-[10px] block uppercase">Deadweight Tonnage</span>
                <strong className="text-white text-xs">{selectedVesselForModal.dwtTons.toLocaleString()} DWT</strong>
              </div>
              <div className="p-2.5 rounded-xl bg-marine-950 border border-marine-800">
                <span className="text-slate-400 text-[10px] block uppercase">Dimensions</span>
                <strong className="text-white text-xs">{selectedVesselForModal.lengthM}m × {selectedVesselForModal.beamM}m</strong>
              </div>
            </div>

            {/* Voyage & Ownership */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 font-mono text-xs">
              <div className="p-3 rounded-xl bg-marine-950 border border-marine-800 space-y-1">
                <span className="text-slate-400 text-[10px] uppercase font-bold block">Ownership & Operator</span>
                <div>Registered Owner: <strong className="text-white">{selectedVesselForModal.owner}</strong></div>
                <div>Commercial Operator: <strong className="text-white">{selectedVesselForModal.operator}</strong></div>
              </div>
              <div className="p-3 rounded-xl bg-marine-950 border border-marine-800 space-y-1">
                <span className="text-slate-400 text-[10px] uppercase font-bold block">Current Voyage</span>
                <div>Destination: <strong className="text-radar-cyan">{selectedVesselForModal.destination}</strong></div>
                <div>ETA: <strong className="text-white">{selectedVesselForModal.eta.replace('T', ' ').substring(0, 16)} UTC</strong></div>
              </div>
            </div>

            {/* Speed Profile Chart (showing speed drop anomaly at release window) */}
            {selectedVesselForModal.historyPoints.length > 0 && (
              <div className="p-4 rounded-xl bg-marine-950 border border-marine-800 space-y-2">
                <div className="flex items-center justify-between text-xs font-mono font-bold text-white">
                  <span className="flex items-center gap-1.5">
                    <TrendingDown className="w-4 h-4 text-radar-rose" />
                    AIS Speed Profile Over Discharge Window
                  </span>
                  <span className="text-[10px] text-radar-rose font-mono font-semibold">
                    Speed Anomaly Detected: 14.2 → 6.4 kts
                  </span>
                </div>

                <div className="h-40 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={selectedVesselForModal.historyPoints} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                      <XAxis dataKey="timestamp" stroke="#64748b" tickFormatter={(t) => t.substring(11, 16)} tick={{ fontSize: 10, fontFamily: 'monospace' }} />
                      <YAxis stroke="#64748b" tick={{ fontSize: 10, fontFamily: 'monospace' }} unit=" kts" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#0a1529',
                          border: '1px solid rgba(244, 63, 94, 0.5)',
                          borderRadius: '0.5rem',
                          fontSize: '11px',
                          fontFamily: 'monospace'
                        }}
                      />
                      <Line type="monotone" dataKey="speedKnots" stroke="#f43f5e" strokeWidth={2.5} name="Speed (Knots)" dot={{ fill: '#f43f5e', r: 4 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {/* Forensic Evidentiary Finding */}
            <div className="p-4 rounded-xl bg-radar-rose/10 border border-radar-rose/40 text-xs font-mono space-y-1.5">
              <strong className="text-radar-rose uppercase tracking-wider block font-bold">
                Forensic Attributive Finding:
              </strong>
              <p className="text-slate-200 leading-relaxed">
                {selectedVesselForModal.forensicSummary}
              </p>
            </div>

            {/* Action Buttons inside modal */}
            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                onClick={() => setSelectedVesselForModal(null)}
                className="px-4 py-2 rounded-xl bg-marine-800 hover:bg-marine-750 text-xs font-mono font-semibold text-slate-300"
              >
                Close
              </button>

              <button
                onClick={() => {
                  setSelectedVesselForModal(null);
                  navigate('/reports');
                }}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-radar-rose to-radar-amber text-marine-950 text-xs font-mono font-extrabold flex items-center space-x-1.5 shadow-glow-rose hover:brightness-110"
              >
                <FileText className="w-4 h-4 text-marine-950" />
                <span>Include in Formal Legal Report</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

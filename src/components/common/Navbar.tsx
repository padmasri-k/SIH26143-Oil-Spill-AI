import React, { useState, useEffect } from 'react';
import { useIncident } from '../../context/IncidentContext';
import { 
  Radio, 
  Satellite, 
  Clock, 
  ShieldAlert, 
  ChevronDown, 
  AlertTriangle,
  Activity,
  Layers
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { incidents, selectedIncident, setSelectedIncidentId } = useIncident();
  const [utcTime, setUtcTime] = useState<string>('');
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setUtcTime(now.toISOString().replace('T', ' ').substring(0, 19) + ' UTC');
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

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
    <header className="h-16 bg-marine-900/90 backdrop-blur-md border-b border-marine-700/60 px-4 lg:px-6 flex items-center justify-between sticky top-0 z-40 shadow-lg">
      {/* Left: Branding & Project Tag */}
      <div className="flex items-center space-x-3">
        <div className="relative flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-radar-cyan/20 via-marine-800 to-marine-900 border border-radar-cyan/40 shadow-glow-cyan">
          <Satellite className="w-5 h-5 text-radar-cyan animate-pulse" />
          <div className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-radar-teal animate-ping" />
          <div className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-radar-teal" />
        </div>

        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-base lg:text-lg font-extrabold tracking-wide text-white uppercase flex items-center gap-1.5">
              OceanGuard <span className="text-radar-cyan">AI</span>
            </h1>
            <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-mono font-semibold tracking-wider uppercase bg-marine-800 border border-radar-cyan/30 text-radar-cyan rounded">
              SIH26143
            </span>
          </div>
          <p className="text-[11px] text-slate-400 font-mono hidden md:block">
            Maritime Oil Spill Intelligence & Vessel Attribution
          </p>
        </div>
      </div>

      {/* Middle: Active Incident Selector */}
      <div className="relative">
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-marine-850/90 hover:bg-marine-800 border border-marine-700 hover:border-radar-cyan/40 transition-all text-xs lg:text-sm font-medium text-slate-200 shadow-sm"
        >
          <AlertTriangle className="w-4 h-4 text-radar-amber" />
          <span className="text-slate-400 hidden sm:inline">Active Incident:</span>
          <span className="font-semibold text-white max-w-[140px] sm:max-w-[200px] lg:max-w-[260px] truncate">
            {selectedIncident.name}
          </span>
          <span className={`px-1.5 py-0.5 text-[10px] rounded font-mono border ${getSeverityBadge(selectedIncident.severity)}`}>
            {selectedIncident.severity}
          </span>
          <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
        </button>

        {isDropdownOpen && (
          <div className="absolute top-full mt-2 w-80 sm:w-96 right-0 sm:left-0 bg-marine-900/95 backdrop-blur-xl border border-marine-700 rounded-xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150">
            <div className="p-2.5 bg-marine-950/60 border-b border-marine-800 flex items-center justify-between text-xs text-slate-400">
              <span className="font-mono uppercase tracking-wider font-semibold text-radar-cyan">Select Monitored Slick</span>
              <span>{incidents.length} Active Targets</span>
            </div>
            <div className="max-h-64 overflow-y-auto divide-y divide-marine-800/60">
              {incidents.map((inc) => (
                <button
                  key={inc.id}
                  onClick={() => {
                    setSelectedIncidentId(inc.id);
                    setIsDropdownOpen(false);
                  }}
                  className={`w-full text-left p-3 hover:bg-marine-800/70 transition-colors flex items-start justify-between ${
                    inc.id === selectedIncident.id ? 'bg-radar-cyan/10 border-l-2 border-radar-cyan' : ''
                  }`}
                >
                  <div className="space-y-1 pr-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-mono font-medium text-slate-400">{inc.id}</span>
                      <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono border ${getSeverityBadge(inc.severity)}`}>
                        {inc.severity}
                      </span>
                    </div>
                    <div className="text-xs font-semibold text-white">{inc.name}</div>
                    <div className="text-[11px] text-slate-400 font-mono">
                      {inc.areaKm2} km² • {inc.oilType}
                    </div>
                  </div>
                  <div className="text-right flex flex-col items-end">
                    <span className="text-[10px] font-mono text-radar-cyan bg-radar-cyan/10 px-1.5 py-0.5 rounded">
                      {inc.confidence}% Conf.
                    </span>
                    <span className="text-[10px] text-slate-400 mt-1">{inc.status}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Right: Telemetry Hub & Live Status */}
      <div className="flex items-center space-x-3 lg:space-x-4">
        {/* Satellite Feeds Indicator */}
        <div className="hidden xl:flex items-center space-x-3 bg-marine-950/70 border border-marine-800 rounded-lg px-3 py-1 text-[11px] font-mono">
          <div className="flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-radar-emerald animate-pulse"></span>
            <span className="text-slate-300">SENTINEL-1A SAR</span>
          </div>
          <span className="text-slate-600">|</span>
          <div className="flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-radar-emerald animate-pulse"></span>
            <span className="text-slate-300">AIS STREAM (99.8%)</span>
          </div>
        </div>

        {/* Live Zulu Clock */}
        <div className="flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-marine-950 border border-marine-800 text-slate-300 font-mono text-xs shadow-inner">
          <Clock className="w-3.5 h-3.5 text-radar-cyan" />
          <span className="hidden sm:inline font-medium text-radar-cyan">{utcTime || 'LIVE ZULU'}</span>
        </div>

        {/* Command Status Indicator */}
        <div className="flex items-center space-x-2 bg-radar-emerald/10 border border-radar-emerald/30 text-radar-emerald px-2.5 py-1 rounded-lg text-xs font-mono font-medium">
          <Radio className="w-3.5 h-3.5 animate-pulse" />
          <span className="hidden sm:inline">RADAR ACTIVE</span>
        </div>
      </div>
    </header>
  );
};

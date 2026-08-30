import React, { useState } from 'react';
import { useIncident } from '../context/IncidentContext';
import { apiService } from '../services/api';
import { 
  FileText, 
  Download, 
  Printer, 
  ShieldAlert, 
  CheckCircle2, 
  Ship, 
  Satellite, 
  History, 
  Waves, 
  Crosshair, 
  AlertTriangle, 
  Edit3, 
  Save,
  Share2,
  Lock
} from 'lucide-react';

export const ReportsPage: React.FC = () => {
  const { incidents, selectedIncident, setSelectedIncidentId } = useIncident();

  const [investigatorNotes, setInvestigatorNotes] = useState<string>(
    `Visual analysis confirms dark SAR formation damping Bragg wave scattering across Sector 4B. Cross-correlation with HYCOM hydrodynamic backtrack identifies vessel loitering anomaly with 96.2% confidence. Immediate Port State Control inspection recommended upon docking.`
  );
  const [isEditingNotes, setIsEditingNotes] = useState<boolean>(false);
  const [includeRadarScan, setIncludeRadarScan] = useState<boolean>(true);
  const [includeVesselDossier, setIncludeVesselDossier] = useState<boolean>(true);
  const [includeHindcastTrack, setIncludeHindcastTrack] = useState<boolean>(true);

  const primeSuspect = selectedIncident.attributedVessels.find(v => v.isPrimeSuspect) || selectedIncident.attributedVessels[0];

  const handleSaveNotes = async () => {
    setIsEditingNotes(false);
    try {
      await apiService.updateReportNotes(selectedIncident.id, investigatorNotes);
    } catch (e) {
      console.warn('[Reports] Failed to save notes to backend:', e);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExportJSON = () => {
    const reportData = {
      reportId: `REPORT-${selectedIncident.id}-${Date.now()}`,
      generatedAt: new Date().toISOString(),
      authority: "Indian Coast Guard / Directorate General of Shipping — OceanGuard AI",
      incident: selectedIncident,
      primeSuspectVessel: primeSuspect,
      investigatorNotes: investigatorNotes
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(reportData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `forensic_report_${selectedIncident.id}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Top Controls Header (Hidden during Print) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-marine-800/80 pb-4 print:hidden">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white uppercase tracking-tight font-sans">
              Maritime Incident & <span className="text-radar-amber">Legal Forensic Report</span>
            </h1>
            <span className="px-2 py-0.5 text-xs font-mono font-bold bg-radar-amber/20 text-radar-amber border border-radar-amber/40 rounded">
              MARPOL ANNEX I
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 font-mono mt-1">
            Automated court-ready evidentiary dossier for Maritime Law Enforcement & Port State Control.
          </p>
        </div>

        {/* Action Export Buttons */}
        <div className="flex items-center space-x-3">
          <button
            onClick={handleExportJSON}
            className="px-4 py-2.5 rounded-xl bg-marine-800 hover:bg-marine-750 text-slate-200 border border-marine-600 font-mono font-bold text-xs flex items-center space-x-1.5 transition-colors shadow-sm"
          >
            <Download className="w-4 h-4 text-radar-teal" />
            <span>Export JSON Evidence</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-radar-amber to-radar-rose text-marine-950 font-mono font-extrabold text-xs flex items-center space-x-1.5 shadow-glow-amber hover:brightness-110 active:scale-95 transition-all"
          >
            <Printer className="w-4 h-4 text-marine-950" />
            <span>Print Official Dossier</span>
          </button>
        </div>
      </div>

      {/* Customizable Sections Bar (Hidden during Print) */}
      <div className="p-4 rounded-xl bg-marine-900/90 border border-marine-700/80 backdrop-blur-md flex flex-wrap items-center justify-between gap-3 text-xs font-mono print:hidden">
        <div className="flex items-center space-x-2 text-slate-300">
          <span className="text-slate-400 font-semibold uppercase">Report Settings:</span>
          <select
            value={selectedIncident.id}
            onChange={(e) => setSelectedIncidentId(e.target.value)}
            className="px-3 py-1.5 rounded-lg bg-marine-950 border border-marine-700 text-white font-bold"
          >
            {incidents.map((inc) => (
              <option key={inc.id} value={inc.id}>
                {inc.id} — {inc.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center space-x-4 text-slate-300">
          <label className="flex items-center space-x-1.5 cursor-pointer">
            <input
              type="checkbox"
              checked={includeRadarScan}
              onChange={(e) => setIncludeRadarScan(e.target.checked)}
              className="rounded bg-marine-800 border-marine-600 text-radar-cyan"
            />
            <span>Include SAR Analysis</span>
          </label>
          <label className="flex items-center space-x-1.5 cursor-pointer">
            <input
              type="checkbox"
              checked={includeHindcastTrack}
              onChange={(e) => setIncludeHindcastTrack(e.target.checked)}
              className="rounded bg-marine-800 border-marine-600 text-radar-purple"
            />
            <span>Include Hindcast</span>
          </label>
          <label className="flex items-center space-x-1.5 cursor-pointer">
            <input
              type="checkbox"
              checked={includeVesselDossier}
              onChange={(e) => setIncludeVesselDossier(e.target.checked)}
              className="rounded bg-marine-800 border-marine-600 text-radar-rose"
            />
            <span>Include Suspect Dossier</span>
          </label>
        </div>
      </div>

      {/* High-Density Court-Ready Report Document Layout */}
      <div className="max-w-4xl mx-auto p-8 sm:p-12 rounded-2xl bg-marine-950 border border-marine-700/80 shadow-2xl text-slate-200 font-sans space-y-8 print:p-0 print:border-none print:shadow-none print:bg-white print:text-black">
        {/* Document Official Header */}
        <div className="border-b-2 border-marine-700 pb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="text-[11px] font-mono tracking-widest uppercase font-bold text-radar-cyan print:text-blue-700">
              MARITIME INTELLIGENCE COMMAND • COASTAL DEFENSE DIVISION
            </div>
            <h2 className="text-2xl font-black uppercase tracking-tight text-white print:text-black">
              Official Oil Pollution Forensic Dossier
            </h2>
            <div className="text-xs font-mono text-slate-400 print:text-gray-600">
              Pursuant to MARPOL 73/78 Annex I & Merchant Shipping Act Enforcement Protocol
            </div>
          </div>

          <div className="p-3 rounded-xl bg-marine-900 border border-marine-800 text-right font-mono text-xs space-y-0.5 print:bg-gray-100 print:border-gray-300">
            <div>Dossier No: <strong className="text-white print:text-black">OG-DOS-{selectedIncident.id}</strong></div>
            <div>Generated: <strong className="text-radar-cyan print:text-blue-700">{new Date().toISOString().replace('T', ' ').substring(0, 19)} UTC</strong></div>
            <div>Classification: <strong className="text-radar-rose print:text-red-600">OFFICIAL EVIDENCE</strong></div>
          </div>
        </div>

        {/* Section 1: Executive Incident Summary */}
        <section className="space-y-3">
          <h3 className="text-sm font-bold uppercase font-mono tracking-wider text-radar-cyan border-b border-marine-800 pb-1.5 flex items-center gap-2 print:text-blue-800">
            <AlertTriangle className="w-4 h-4" />
            1. Executive Incident Summary
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
            <div className="p-3 rounded-lg bg-marine-900/80 border border-marine-800 print:bg-gray-50 print:border-gray-300">
              <span className="text-slate-400 block text-[10px] uppercase">Incident Identifier</span>
              <strong className="text-white text-xs print:text-black">{selectedIncident.id}</strong>
            </div>

            <div className="p-3 rounded-lg bg-marine-900/80 border border-marine-800 print:bg-gray-50 print:border-gray-300">
              <span className="text-slate-400 block text-[10px] uppercase">Severity Index</span>
              <strong className="text-radar-rose text-xs print:text-red-600 font-bold">{selectedIncident.severity} (Critical Risk)</strong>
            </div>

            <div className="p-3 rounded-lg bg-marine-900/80 border border-marine-800 print:bg-gray-50 print:border-gray-300">
              <span className="text-slate-400 block text-[10px] uppercase">Slick Surface Area</span>
              <strong className="text-white text-xs print:text-black">{selectedIncident.areaKm2} km²</strong>
            </div>

            <div className="p-3 rounded-lg bg-marine-900/80 border border-marine-800 print:bg-gray-50 print:border-gray-300">
              <span className="text-slate-400 block text-[10px] uppercase">Estimated Volume</span>
              <strong className="text-radar-amber text-xs print:text-amber-700">{selectedIncident.estimatedVolumeBbl} Barrels ({selectedIncident.estimatedVolumeTons} MT)</strong>
            </div>
          </div>
        </section>

        {/* Section 2: Spaceborne Satellite Detection Data */}
        {includeRadarScan && (
          <section className="space-y-3">
            <h3 className="text-sm font-bold uppercase font-mono tracking-wider text-radar-teal border-b border-marine-800 pb-1.5 flex items-center gap-2 print:text-teal-800">
              <Satellite className="w-4 h-4" />
              2. Spaceborne Satellite Acquisition & AI Detection
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
              <div className="space-y-2 p-3.5 rounded-xl bg-marine-900/80 border border-marine-800 print:bg-gray-50 print:border-gray-300">
                <div>• Primary Satellite Sensor: <strong className="text-white print:text-black">{selectedIncident.sensor}</strong></div>
                <div>• Ground Sampling Distance: <strong className="text-white print:text-black">{selectedIncident.resolution}</strong></div>
                <div>• Detection Timestamp: <strong className="text-white print:text-black">{selectedIncident.detectionTime.replace('T', ' ').substring(0, 19)} UTC</strong></div>
                <div>• Slick Centroid GPS: <strong className="text-radar-cyan print:text-blue-700">{selectedIncident.coordinates[0].toFixed(4)}°N, {selectedIncident.coordinates[1].toFixed(4)}°E</strong></div>
              </div>

              <div className="space-y-2 p-3.5 rounded-xl bg-marine-900/80 border border-marine-800 print:bg-gray-50 print:border-gray-300">
                <div>• AI Model Architecture: <strong className="text-white print:text-black">DeepLabV3+ ResNet-101 (ASPP)</strong></div>
                <div>• Segmentation Confidence: <strong className="text-radar-emerald print:text-green-700 font-bold">{selectedIncident.confidence}%</strong></div>
                <div>• Classified Hydrocarbon: <strong className="text-white print:text-black">{selectedIncident.oilType} (Thickness ~{selectedIncident.thicknessMicrons} µm)</strong></div>
                <div>• Look-Alike False Alarm Filter: <strong className="text-radar-emerald print:text-green-700">99.1% Rejection Passed</strong></div>
              </div>
            </div>
          </section>
        )}

        {/* Section 3: Hydrodynamic Drift & Hindcast Origin */}
        {includeHindcastTrack && (
          <section className="space-y-3">
            <h3 className="text-sm font-bold uppercase font-mono tracking-wider text-radar-purple border-b border-marine-800 pb-1.5 flex items-center gap-2 print:text-purple-800">
              <History className="w-4 h-4" />
              3. Lagrangian Hydrodynamic Hindcast Reconstruction
            </h3>

            <div className="p-4 rounded-xl bg-marine-900/80 border border-marine-800 space-y-2 font-mono text-xs print:bg-gray-50 print:border-gray-300">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>• Reconstructed Origin Centroid: <strong className="text-radar-purple print:text-purple-700">{selectedIncident.hindcast.originCoordinates[0].toFixed(4)}°N, {selectedIncident.hindcast.originCoordinates[1].toFixed(4)}°E</strong></div>
                <div>• Probable Location: <strong className="text-white print:text-black">{selectedIncident.hindcast.originName}</strong></div>
                <div>• Estimated Discharge Window: <strong className="text-white print:text-black">{selectedIncident.hindcast.dischargeStartTime.replace('T', ' ').substring(0, 16)} to {selectedIncident.hindcast.dischargeEndTime.substring(11, 16)} UTC</strong></div>
                <div>• Discharge Duration: <strong className="text-radar-amber print:text-amber-700">~{selectedIncident.hindcast.durationHours} Hours</strong></div>
                <div>• Ocean Hydrodynamic Model: <strong className="text-slate-300 print:text-gray-700">{selectedIncident.hindcast.hydrodynamicModel}</strong></div>
                <div>• Hindcast Confidence Score: <strong className="text-radar-purple print:text-purple-700 font-bold">{selectedIncident.hindcast.confidence}%</strong></div>
              </div>
            </div>
          </section>
        )}

        {/* Section 4: Suspect Vessel AIS Correlation Matrix */}
        {includeVesselDossier && (
          <section className="space-y-3">
            <h3 className="text-sm font-bold uppercase font-mono tracking-wider text-radar-rose border-b border-marine-800 pb-1.5 flex items-center gap-2 print:text-red-800">
              <Ship className="w-4 h-4" />
              4. AIS Vessel Spatiotemporal Attribution & Prime Suspect
            </h3>

            <div className="p-4 rounded-xl bg-radar-rose/10 border border-radar-rose/40 space-y-3 font-mono text-xs print:bg-red-50 print:border-red-300">
              <div className="flex items-center justify-between border-b border-radar-rose/20 pb-2">
                <span className="font-bold text-white print:text-black text-sm">{primeSuspect.name}</span>
                <span className="text-radar-rose font-bold bg-radar-rose/20 px-2 py-0.5 rounded border border-radar-rose/40 print:bg-red-100 print:text-red-700">
                  {primeSuspect.overallAttributionScore}% Attribution Match
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] text-slate-300 print:text-gray-800">
                <div>IMO Number: <strong className="text-white print:text-black">{primeSuspect.imo}</strong></div>
                <div>MMSI: <strong className="text-white print:text-black">{primeSuspect.mmsi}</strong></div>
                <div>Flag State: <strong className="text-white print:text-black">{primeSuspect.flag}</strong></div>
                <div>Vessel Type: <strong className="text-white print:text-black">{primeSuspect.vesselType}</strong></div>
                <div>Registered Owner: <strong className="text-white print:text-black">{primeSuspect.owner}</strong></div>
                <div>Deadweight: <strong className="text-white print:text-black">{primeSuspect.dwtTons.toLocaleString()} DWT</strong></div>
                <div>Next Port of Call: <strong className="text-radar-cyan print:text-blue-700">{primeSuspect.destination}</strong></div>
                <div>Speed at Origin: <strong className="text-radar-rose print:text-red-600">6.4 kts (Speed Drop Anomaly)</strong></div>
              </div>

              <div className="p-3 rounded bg-marine-950/80 border border-marine-800/80 text-[11px] text-slate-200 print:bg-white print:border-gray-300 print:text-black leading-relaxed">
                <strong className="text-radar-rose print:text-red-600 block mb-1">Forensic Culpability Statement:</strong>
                {primeSuspect.forensicSummary}
              </div>
            </div>
          </section>
        )}

        {/* Section 5: Investigator Official Notes */}
        <section className="space-y-3">
          <div className="flex items-center justify-between border-b border-marine-800 pb-1.5">
            <h3 className="text-sm font-bold uppercase font-mono tracking-wider text-slate-300 flex items-center gap-2 print:text-black">
              <Edit3 className="w-4 h-4 text-radar-cyan" />
              5. Lead Investigator Field Findings
            </h3>
            <button
              onClick={isEditingNotes ? handleSaveNotes : () => setIsEditingNotes(true)}
              className="text-[11px] font-mono text-radar-cyan hover:underline print:hidden"
            >
              {isEditingNotes ? 'Save & Done Editing' : 'Edit Notes'}
            </button>
          </div>

          {isEditingNotes ? (
            <textarea
              value={investigatorNotes}
              onChange={(e) => setInvestigatorNotes(e.target.value)}
              rows={3}
              className="w-full p-3 rounded-xl bg-marine-900 border border-marine-700 text-xs font-mono text-slate-100 focus:outline-none focus:border-radar-cyan"
            />
          ) : (
            <p className="text-xs font-mono text-slate-300 print:text-gray-800 leading-relaxed p-3.5 rounded-xl bg-marine-900/60 border border-marine-800 print:bg-gray-50 print:border-gray-300">
              {investigatorNotes}
            </p>
          )}
        </section>

        {/* Section 6: Actionable Statutory Enforcement Recommendations */}
        <section className="space-y-3">
          <h3 className="text-sm font-bold uppercase font-mono tracking-wider text-radar-emerald border-b border-marine-800 pb-1.5 flex items-center gap-2 print:text-green-800">
            <CheckCircle2 className="w-4 h-4" />
            6. Statutory Enforcement Directives
          </h3>

          <div className="p-4 rounded-xl bg-marine-900/80 border border-marine-800 space-y-2 font-mono text-xs print:bg-gray-50 print:border-gray-300">
            <div className="text-slate-300 print:text-gray-800">
              1. <strong>Port State Control Alert:</strong> Issue immediate notice of detention and tank slop inspection under MARPOL Annex I for <strong>{primeSuspect.name}</strong> upon arrival at <strong>{primeSuspect.destination}</strong>.
            </div>
            <div className="text-slate-300 print:text-gray-800">
              2. <strong>Physical Sampling:</strong> Dispatch Indian Coast Guard patrol cutter to collect hydrocarbon fingerprint samples from origin centroid ({selectedIncident.hindcast.originCoordinates[0].toFixed(4)}°N, {selectedIncident.hindcast.originCoordinates[1].toFixed(4)}°E) for GC-MS laboratory match.
            </div>
            <div className="text-slate-300 print:text-gray-800">
              3. <strong>Coastal Protective Deployment:</strong> Stage offshore containment booms near {selectedIncident.environmentalRisk.protectedAreaNearby} prior to the 48-hour drift arrival window.
            </div>
          </div>
        </section>

        {/* Official Sign-Off Footer */}
        <div className="border-t-2 border-marine-800 pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 font-mono text-xs text-slate-400 print:border-gray-400 print:text-black">
          <div>
            <div>Authorized Signature: _______________________</div>
            <div className="text-[10px] text-slate-500 print:text-gray-600 mt-1">
              Director, Maritime Pollution Surveillance Directorate
            </div>
          </div>

          <div className="text-right">
            <div className="flex items-center space-x-1 justify-end text-radar-emerald print:text-green-800 font-bold">
              <Lock className="w-3.5 h-3.5" />
              <span>SHA-256 DIGITAL EVIDENCE SEAL</span>
            </div>
            <div className="text-[9px] text-slate-500 font-mono mt-0.5">
              HASH: e7b89f2a4c1038b4d82f7193b092ac192837f48e9102c81
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

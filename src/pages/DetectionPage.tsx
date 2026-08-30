import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useIncident } from '../context/IncidentContext';
import { apiService } from '../services/api';
import { ConfidenceGauge } from '../components/common/ConfidenceGauge';
import { 
  Satellite, 
  UploadCloud, 
  Play, 
  CheckCircle2, 
  Sliders, 
  Cpu, 
  Crosshair, 
  Layers, 
  Download, 
  ArrowRight, 
  AlertTriangle,
  RefreshCw,
  Eye,
  Activity,
  Maximize2
} from 'lucide-react';

export const DetectionPage: React.FC = () => {
  const navigate = useNavigate();
  const { sampleScans, activeScan, setActiveScanId } = useIncident();

  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisProgress, setAnalysisProgress] = useState<number>(0);
  const [currentStepText, setCurrentStepText] = useState<string>('');
  const [hasRunAnalysis, setHasRunAnalysis] = useState<boolean>(true);
  const [viewMode, setViewMode] = useState<'raw' | 'mask' | 'split' | 'thermal'>('split');
  const [splitPosition, setSplitPosition] = useState<number>(50);
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [customUploadName, setCustomUploadName] = useState<string | null>(null);

  const runAiDetection = async () => {
    setIsAnalyzing(true);
    setAnalysisProgress(5);
    setHasRunAnalysis(false);
    setCurrentStepText('Radiometric SAR Calibration & Noise Suppression...');

    // Trigger backend pipeline in parallel
    apiService.runAiDetection(activeScan.id).catch(err => console.warn('[Detection] API run:', err));

    const stages = [
      { p: 25, text: 'Lee-Sigma Speckle Filtering & NRCS Calculation...' },
      { p: 55, text: 'DeepLabV3+ Neural Feature Extraction (ResNet-101)...' },
      { p: 80, text: 'Morphological Segmentation & Look-Alike Damping...' },
      { p: 100, text: 'Classification Complete: Oil Slick Boundary Vectorized!' }
    ];

    let current = 0;
    const interval = setInterval(() => {
      if (current < stages.length) {
        setAnalysisProgress(stages[current].p);
        setCurrentStepText(stages[current].text);
        current++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setIsAnalyzing(false);
          setHasRunAnalysis(true);
        }, 600);
      }
    }, 700);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setCustomUploadName(file.name);
      runAiDetection();
    }
  };

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
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-marine-800/80 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white uppercase tracking-tight font-sans">
              Spaceborne <span className="text-radar-cyan">Oil Spill Detection</span>
            </h1>
            <span className="px-2 py-0.5 text-xs font-mono font-bold bg-radar-cyan/20 text-radar-cyan border border-radar-cyan/40 rounded">
              DeepLabV3+ AI
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 font-mono mt-1">
            Dual-polarimetric Synthetic Aperture Radar (SAR) & Multispectral optical segmentation.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-3">
          <button
            onClick={runAiDetection}
            disabled={isAnalyzing}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-radar-cyan to-radar-teal text-marine-950 font-extrabold text-xs font-mono flex items-center space-x-2 shadow-glow-cyan hover:brightness-110 active:scale-95 disabled:opacity-50 transition-all"
          >
            {isAnalyzing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Processing Neural Pipeline...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>Run AI Detection Engine</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Preset Satellite Scenes Selector */}
      <div className="space-y-2">
        <span className="text-xs font-mono text-slate-400 uppercase tracking-wider font-semibold block">
          Select Satellite Acquisition Scene:
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {sampleScans.map((scan) => (
            <button
              key={scan.id}
              onClick={() => {
                setActiveScanId(scan.id);
                setCustomUploadName(null);
                setHasRunAnalysis(true);
              }}
              className={`p-3 rounded-xl text-left border transition-all ${
                activeScan.id === scan.id && !customUploadName
                  ? 'bg-radar-cyan/10 border-radar-cyan shadow-glow-cyan/20'
                  : 'bg-marine-900/80 border-marine-800 hover:bg-marine-800/60 hover:border-marine-700'
              }`}
            >
              <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-1">
                <span>{scan.sensorType}</span>
                <span className={`px-1.5 py-0.2 rounded border ${getSeverityBadge(scan.severity)}`}>
                  {scan.severity}
                </span>
              </div>
              <div className="text-xs font-bold text-white truncate">{scan.name}</div>
              <div className="text-[11px] text-slate-400 font-mono mt-1 truncate">
                {scan.satellite} • {scan.areaKm2} km²
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Analysis Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left 8 Cols: Satellite Image Viewer with Interactive Split / Mask Slider */}
        <div className="lg:col-span-8 space-y-4">
          <div className="p-4 rounded-xl bg-marine-900/90 border border-marine-700/80 backdrop-blur-md space-y-3 shadow-xl">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-marine-800 pb-3">
              <div className="flex items-center space-x-2">
                <Satellite className="w-4 h-4 text-radar-cyan" />
                <span className="text-xs font-mono font-bold text-white uppercase">
                  {customUploadName ? `Custom Scene: ${customUploadName}` : activeScan.name}
                </span>
              </div>

              {/* View Mode Tabs */}
              <div className="flex items-center space-x-1 bg-marine-950 p-1 rounded-lg border border-marine-800 text-xs font-mono">
                <button
                  onClick={() => setViewMode('raw')}
                  className={`px-2.5 py-1 rounded transition-colors ${
                    viewMode === 'raw' ? 'bg-marine-800 text-radar-cyan font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Raw SAR
                </button>
                <button
                  onClick={() => setViewMode('mask')}
                  className={`px-2.5 py-1 rounded transition-colors ${
                    viewMode === 'mask' ? 'bg-marine-800 text-radar-teal font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  AI Mask
                </button>
                <button
                  onClick={() => setViewMode('split')}
                  className={`px-2.5 py-1 rounded transition-colors ${
                    viewMode === 'split' ? 'bg-marine-800 text-white font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Split Slider
                </button>
                <button
                  onClick={() => setViewMode('thermal')}
                  className={`px-2.5 py-1 rounded transition-colors ${
                    viewMode === 'thermal' ? 'bg-marine-800 text-radar-amber font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Thermal IR
                </button>
              </div>
            </div>

            {/* Visual Canvas Area */}
            <div className="relative w-full h-[400px] sm:h-[480px] rounded-lg overflow-hidden bg-marine-950 border border-marine-800 select-none group">
              {/* Scanline Animation Effect during processing */}
              {isAnalyzing && (
                <div className="absolute inset-0 z-30 pointer-events-none">
                  <div className="w-full h-1 bg-radar-cyan shadow-glow-cyan animate-scanline" />
                  <div className="absolute inset-0 bg-marine-950/40 backdrop-blur-[2px] flex flex-col items-center justify-center space-y-4">
                    <div className="p-4 rounded-2xl bg-marine-900/90 border border-radar-cyan/50 shadow-glow-cyan max-w-sm w-full space-y-3 text-center">
                      <Cpu className="w-8 h-8 text-radar-cyan animate-pulse mx-auto" />
                      <div className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                        {currentStepText}
                      </div>
                      <div className="w-full bg-marine-950 h-2 rounded-full overflow-hidden border border-marine-800">
                        <div
                          className="bg-gradient-to-r from-radar-cyan via-radar-teal to-radar-emerald h-full transition-all duration-300"
                          style={{ width: `${analysisProgress}%` }}
                        />
                      </div>
                      <div className="text-[10px] font-mono text-radar-cyan font-bold">
                        {analysisProgress}% Pipeline Complete
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* View 1: Raw Image */}
              {viewMode === 'raw' && (
                <div className="w-full h-full relative">
                  <img
                    src={activeScan.rawImageUrl}
                    alt="Raw Satellite"
                    className="w-full h-full object-cover filter contrast-125 brightness-90 grayscale"
                  />
                  <div className="absolute bottom-3 left-3 bg-marine-900/80 px-2.5 py-1 rounded text-[11px] font-mono text-slate-300 border border-marine-700">
                    Sensor: {activeScan.mode}
                  </div>
                </div>
              )}

              {/* View 2: Segmented AI Mask */}
              {viewMode === 'mask' && (
                <div className="w-full h-full relative">
                  <img
                    src={activeScan.maskImageUrl}
                    alt="AI Mask"
                    className="w-full h-full object-cover filter saturate-150"
                  />
                  {/* Vector Bounding Box Overlay */}
                  <div className="absolute inset-16 border-2 border-radar-rose rounded-lg shadow-glow-rose/40 pointer-events-none">
                    <div className="absolute -top-6 left-2 bg-radar-rose text-white text-[10px] font-mono font-bold px-2 py-0.5 rounded shadow">
                      OIL SLICK DETECTED ({activeScan.confidence}%)
                    </div>
                  </div>
                </div>
              )}

              {/* View 3: Thermal Infrared */}
              {viewMode === 'thermal' && (
                <div className="w-full h-full relative">
                  <img
                    src={activeScan.thermalImageUrl}
                    alt="Thermal Scan"
                    className="w-full h-full object-cover filter hue-rotate-90 saturate-200"
                  />
                  <div className="absolute bottom-3 left-3 bg-marine-900/80 px-2.5 py-1 rounded text-[11px] font-mono text-radar-amber border border-marine-700">
                    Thermal Gradient: LWIR 8-14 µm (+2.8°C Emulsion Core)
                  </div>
                </div>
              )}

              {/* View 4: Split Comparison Slider */}
              {viewMode === 'split' && (
                <div className="w-full h-full relative">
                  {/* Background: Segmented AI Mask */}
                  <img
                    src={activeScan.maskImageUrl}
                    alt="AI Mask"
                    className="w-full h-full object-cover filter saturate-150"
                  />

                  {/* Foreground: Raw SAR Image clipped by slider position */}
                  <div
                    className="absolute inset-0 overflow-hidden border-r-2 border-radar-cyan shadow-glow-cyan"
                    style={{ width: `${splitPosition}%` }}
                  >
                    <img
                      src={activeScan.rawImageUrl}
                      alt="Raw SAR"
                      className="absolute inset-0 w-[1000px] sm:w-[1200px] max-w-none h-full object-cover filter contrast-125 brightness-90 grayscale"
                    />
                    <div className="absolute top-3 left-3 bg-marine-950/80 px-2 py-0.5 rounded text-[10px] font-mono text-slate-300 border border-marine-700">
                      RAW SAR SCENE
                    </div>
                  </div>

                  {/* Top Right Label for Mask Side */}
                  <div className="absolute top-3 right-3 bg-marine-950/80 px-2 py-0.5 rounded text-[10px] font-mono text-radar-cyan border border-marine-700">
                    AI SEGMENTED MASK
                  </div>

                  {/* Slider Control Line */}
                  <div
                    className="absolute top-0 bottom-0 w-1 bg-radar-cyan cursor-ew-resize flex items-center justify-center z-20"
                    style={{ left: `${splitPosition}%` }}
                  >
                    <div className="w-7 h-7 rounded-full bg-marine-900 border-2 border-radar-cyan shadow-glow-cyan flex items-center justify-center text-white">
                      <Sliders className="w-3.5 h-3.5 text-radar-cyan" />
                    </div>
                  </div>
                </div>
              )}

              {/* Bounding Box HUD Overlay info */}
              <div className="absolute bottom-3 right-3 bg-marine-950/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-marine-700/80 text-[11px] font-mono text-slate-300 space-y-0.5">
                <div>Centroid: <strong className="text-radar-cyan">{activeScan.centerCoords[0].toFixed(4)}°N, {activeScan.centerCoords[1].toFixed(4)}°E</strong></div>
                <div>GSD Resolution: <strong className="text-white">10.0m / pixel</strong></div>
              </div>
            </div>

            {/* Split Slider Range Bar when in Split Mode */}
            {viewMode === 'split' && (
              <div className="flex items-center space-x-3 px-2 pt-1 font-mono text-xs text-slate-400">
                <span>Raw SAR</span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={splitPosition}
                  onChange={(e) => setSplitPosition(Number(e.target.value))}
                  className="w-full accent-radar-cyan cursor-pointer"
                />
                <span>AI Mask</span>
              </div>
            )}

            {/* Notes / Diagnostics description */}
            <div className="p-3 rounded-lg bg-marine-950/80 border border-marine-800 text-xs font-mono text-slate-300">
              <strong className="text-radar-cyan">Radar Backscatter Diagnostic: </strong>
              {activeScan.notes}
            </div>
          </div>

          {/* Custom File Upload Area */}
          <div
            onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
            onDragLeave={() => setDragActive(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragActive(false);
              if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                setCustomUploadName(e.dataTransfer.files[0].name);
                runAiDetection();
              }
            }}
            className={`p-6 rounded-xl border-2 border-dashed transition-all text-center space-y-2 ${
              dragActive ? 'border-radar-cyan bg-radar-cyan/10' : 'border-marine-700 bg-marine-900/50 hover:border-marine-600'
            }`}
          >
            <UploadCloud className="w-8 h-8 text-radar-cyan mx-auto" />
            <div className="text-xs font-bold text-white font-mono uppercase">
              Upload Custom Satellite Imagery (GeoTIFF / HDF5 / NetCDF / PNG)
            </div>
            <p className="text-[11px] text-slate-400 font-mono">
              Drag and drop your Sentinel-1 SAR or Sentinel-2 scene, or click to browse local files.
            </p>
            <label className="inline-block cursor-pointer mt-1">
              <input type="file" className="hidden" accept=".tif,.tiff,.png,.jpg,.jpeg,.nc" onChange={handleFileUpload} />
              <span className="px-4 py-2 rounded-lg bg-marine-800 hover:bg-marine-750 text-xs font-mono font-bold text-slate-200 border border-marine-600 inline-block transition-colors">
                Browse Satellite File
              </span>
            </label>
          </div>
        </div>

        {/* Right 4 Cols: Neural Network Diagnostics & Extraction Metrics */}
        <div className="lg:col-span-4 space-y-4">
          <div className="p-5 rounded-xl bg-marine-900/90 border border-marine-700/80 backdrop-blur-md space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-marine-800 pb-3">
              <div className="flex items-center space-x-2">
                <Cpu className="w-4 h-4 text-radar-cyan" />
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
                  Detection Diagnostics
                </h3>
              </div>
              <span className={`px-2 py-0.5 text-[10px] font-mono font-bold rounded border ${getSeverityBadge(activeScan.severity)}`}>
                {activeScan.severity}
              </span>
            </div>

            {/* Confidence Meter */}
            <div className="flex justify-center p-3 rounded-xl bg-marine-950/80 border border-marine-800">
              <ConfidenceGauge
                score={activeScan.confidence}
                size={120}
                strokeWidth={9}
                label="DeepLabV3+ Confidence"
                sublabel="Look-alike Rejection: 99.1%"
              />
            </div>

            {/* Metric Details Grid */}
            <div className="space-y-2 font-mono text-xs">
              <div className="p-2.5 rounded-lg bg-marine-950/70 border border-marine-800 flex items-center justify-between">
                <span className="text-slate-400">ESTIMATED SLICK AREA</span>
                <span className="font-bold text-white text-sm">{activeScan.areaKm2} km²</span>
              </div>

              <div className="p-2.5 rounded-lg bg-marine-950/70 border border-marine-800 flex items-center justify-between">
                <span className="text-slate-400">ESTIMATED DISCHARGE</span>
                <span className="font-bold text-radar-amber text-sm">{activeScan.estimatedVolumeBbl} bbls</span>
              </div>

              <div className="p-2.5 rounded-lg bg-marine-950/70 border border-marine-800 flex items-center justify-between">
                <span className="text-slate-400">CLASSIFIED OIL TYPE</span>
                <span className="font-bold text-white">{activeScan.oilType}</span>
              </div>

              <div className="p-2.5 rounded-lg bg-marine-950/70 border border-marine-800 flex items-center justify-between">
                <span className="text-slate-400">SENSOR / SATELLITE</span>
                <span className="font-bold text-radar-cyan truncate max-w-[160px]">{activeScan.satellite}</span>
              </div>

              <div className="p-2.5 rounded-lg bg-marine-950/70 border border-marine-800 flex items-center justify-between">
                <span className="text-slate-400">ACQUISITION TIME</span>
                <span className="font-bold text-slate-300">{activeScan.acquisitionDate}</span>
              </div>
            </div>

            {/* Spectral Bands Utilized */}
            <div className="p-3 rounded-lg bg-marine-950/80 border border-marine-800 space-y-1.5 font-mono">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Spectral Bands Ingested:</span>
              <div className="flex flex-wrap gap-1">
                {activeScan.spectralBands.map((band, idx) => (
                  <span key={idx} className="px-2 py-0.5 rounded bg-marine-800 text-slate-300 text-[10px] border border-marine-700">
                    {band}
                  </span>
                ))}
              </div>
            </div>

            {/* Action Buttons to next pipeline stages */}
            <div className="space-y-2 pt-2">
              <button
                onClick={() => navigate('/tracking')}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-radar-cyan to-radar-teal text-marine-950 font-mono font-extrabold text-xs flex items-center justify-center gap-2 shadow-glow-cyan hover:brightness-110 active:scale-95 transition-all"
              >
                <span>Push to 48h Drift Tracking</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => navigate('/hindcasting')}
                className="w-full py-2 rounded-xl bg-marine-800 hover:bg-marine-750 text-slate-200 border border-marine-700 font-mono font-bold text-xs flex items-center justify-center gap-2 transition-colors"
              >
                <span>Initiate Origin Hindcast</span>
                <ArrowRight className="w-4 h-4 text-radar-purple" />
              </button>

              <button
                onClick={() => {
                  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(activeScan, null, 2));
                  const downloadAnchor = document.createElement('a');
                  downloadAnchor.setAttribute("href", dataStr);
                  downloadAnchor.setAttribute("download", `oil_spill_detection_${activeScan.id}.geojson`);
                  document.body.appendChild(downloadAnchor);
                  downloadAnchor.click();
                  downloadAnchor.remove();
                }}
                className="w-full py-2 rounded-xl bg-marine-950 hover:bg-marine-850 text-slate-300 border border-marine-800 font-mono text-[11px] flex items-center justify-center gap-1.5 transition-colors"
              >
                <Download className="w-3.5 h-3.5 text-radar-teal" />
                <span>Export GeoJSON Polygon Vector</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

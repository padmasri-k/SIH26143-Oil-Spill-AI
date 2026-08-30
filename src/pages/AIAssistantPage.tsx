import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useIncident } from '../context/IncidentContext';
import { ChatMessage } from '../types';
import { initialChatMessages, presetAssistantQuestions } from '../data/mockData';
import { apiService } from '../services/api';
import { 
  Sparkles, 
  Send, 
  Bot, 
  User, 
  ShieldAlert, 
  Ship, 
  Satellite, 
  Waves, 
  History, 
  FileText, 
  CornerDownLeft, 
  RefreshCw, 
  ArrowRight,
  Lightbulb,
  CheckCircle2
} from 'lucide-react';

export const AIAssistantPage: React.FC = () => {
  const navigate = useNavigate();
  const { incidents, selectedIncident, setSelectedIncidentId } = useIncident();

  const [messages, setMessages] = useState<ChatMessage[]>(initialChatMessages);
  const [inputValue, setInputValue] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const primeSuspect = selectedIncident.attributedVessels.find(v => v.isPrimeSuspect) || selectedIncident.attributedVessels[0];

  const generateAIResponse = (userPrompt: string): string => {
    const lower = userPrompt.toLowerCase();

    if (lower.includes('prime suspect') || lower.includes('ocean vanguard') || lower.includes('culprit') || lower.includes('who')) {
      return `### 🚨 Prime Suspect Attribution Finding: **${primeSuspect.name}**\n\nBased on spatiotemporal cross-referencing against **Incident ${selectedIncident.id}**, our attribution scoring model flags **${primeSuspect.name} (IMO: ${primeSuspect.imo}, Flag: ${primeSuspect.flag})** with an **overall attribution confidence score of ${primeSuspect.overallAttributionScore}%**.\n\n#### Key Evidentiary Factors:\n1. **Spatial Proximity (Score: ${primeSuspect.distanceScore}%)**: Intercepted the Lagrangian hindcast origin point within **480 meters**.\n2. **Temporal Window (Score: ${primeSuspect.timeMatchScore}%)**: Transited the origin centroid at **${primeSuspect.interceptTimestamp.replace('T', ' ').substring(0, 16)} UTC**, aligning directly with the discharge start window.\n3. **Speed Anomaly (Score: ${primeSuspect.anomalyScore}%)**: Logged a sharp speed reduction from **14.2 knots down to 6.4 knots for 2.8 hours**, accompanied by an 850m zigzag trajectory typical of illicit open-sea oily bilge/ballast tank washing.\n\nRecommended Action: Dispatch Indian Coast Guard fast-interceptor vessel or issue Port State Control detention alert for **${primeSuspect.destination}**.`;
    }

    if (lower.includes('drift') || lower.includes('forecast') || lower.includes('48') || lower.includes('weather') || lower.includes('hydrodynamic')) {
      return `### 🌊 Hydrodynamic Drift & Vector Forecast (+72h)\n\n**Active Environmental Parameters:**\n- **Surface Current (HYCOM)**: ${selectedIncident.currentMetOcean.currentSpeedKnots} kts @ ${selectedIncident.currentMetOcean.currentDirectionDeg}°\n- **10m Wind Stress (ECMWF)**: ${selectedIncident.currentMetOcean.windSpeedKnots} kts @ ${selectedIncident.currentMetOcean.windDirectionDeg}° with a **3.4% windage factor**\n- **Sea Surface Temperature**: ${selectedIncident.currentMetOcean.seaSurfaceTempC}°C | Significant Wave Height: ${selectedIncident.currentMetOcean.waveHeightM}m\n\n**Dispersion Projection:**\n- **Current Slick Area**: ${selectedIncident.areaKm2} km²\n- **+24 Hours Projection**: 69.4 km² (Heading Northeast)\n- **+48 Hours Projection**: 92.1 km² (Approaching coastal zone)\n- **+72 Hours Projection**: 118.6 km² (High emulsification risk)`;
    }

    if (lower.includes('coastal') || lower.includes('marine') || lower.includes('protected') || lower.includes('sanctuary') || lower.includes('risk')) {
      return `### 🛡️ Coastal Vulnerability & Environmental Impact Assessment\n\n- **Target Incident**: ${selectedIncident.name}\n- **Distance to Shoreline**: **${selectedIncident.environmentalRisk.coastalDistanceKm} km**\n- **Estimated Beaching ETA**: **~${selectedIncident.environmentalRisk.etaToCoastHours} Hours**\n- **Critical Habitat at Risk**: **${selectedIncident.environmentalRisk.protectedAreaNearby}**\n- **Sensitivity Index**: **${selectedIncident.environmentalRisk.sensitivityIndex}**\n\n**Containment Recommendation:** Deploy offshore containment booms and dynamic skimmers along Sector 4B corridor before the slick enters shallow intertidal mangrove wetlands.`;
    }

    if (lower.includes('memo') || lower.includes('coast guard') || lower.includes('enforcement') || lower.includes('legal') || lower.includes('dg shipping')) {
      return `### 📋 Official Maritime Enforcement Evidentiary Memo\n\n**TO:** Commander, Indian Coast Guard Maritime Rescue Coordination Centre (MRCC) / Directorate General of Shipping\n**FROM:** OceanGuard AI Intelligence Command\n**SUBJECT:** MARPOL Annex I Illegal Discharge Attribution — Incident ${selectedIncident.id}\n\n1. **INCIDENT SUMMARY:** A surface hydrocarbon slick spanning **${selectedIncident.areaKm2} km²** (approx. ${selectedIncident.estimatedVolumeBbl} bbls ${selectedIncident.oilType}) was detected via Sentinel-1A SAR at coordinates **${selectedIncident.coordinates[0].toFixed(4)}°N, ${selectedIncident.coordinates[1].toFixed(4)}°E**.\n\n2. **HINDCAST ORIGIN:** Lagrangian backward particle advection isolates origin Point **HC-01 (${selectedIncident.hindcast.originCoordinates[0].toFixed(4)}°N, ${selectedIncident.hindcast.originCoordinates[1].toFixed(4)}°E)** at **${selectedIncident.hindcast.dischargeStartTime.replace('T', ' ').substring(0, 16)} UTC**.\n\n3. **ATTRIBUTED CULPRIT VESSEL:** **${primeSuspect.name}** (IMO: ${primeSuspect.imo}, Flag: ${primeSuspect.flag}, DWT: ${primeSuspect.dwtTons.toLocaleString()}). AIS telemetry confirms 6.4 kt loitering anomaly at origin point.\n\n4. **STATUTORY ACTION REQUESTED:** Request board-and-search inspection under Merchant Shipping Act Section 356 and MARPOL 73/78 upon arrival at **${primeSuspect.destination}**.`;
    }

    if (lower.includes('sar') || lower.includes('deeplabv3') || lower.includes('neural') || lower.includes('segmentation') || lower.includes('speckle')) {
      return `### 🛰️ Spaceborne SAR AI Segmentation Pipeline\n\n1. **Radiometric Calibration:** Raw Sentinel-1 Level-1 GRDH data is calibrated to absolute sigma-nought (\$\sigma^0\$) backscatter coefficient.\n2. **Lee-Sigma Speckle Suppression:** 7x7 adaptive kernel filters granular radar speckle while preserving sharp oil-water damping gradients.\n3. **DeepLabV3+ ResNet-101 Architecture:** Atrous Spatial Pyramid Pooling (ASPP) captures multi-scale contextual features across dual-pol VV and VH channels.\n4. **Look-Alike Damping Rejection:** Contextual wind-field gating (>3 m/s) eliminates biogenic slicks, upwellings, and internal solitary waves with a **99.1% false-alarm rejection rate**.`;
    }

    return `### 🤖 Maritime Intelligence Analysis\n\nRegarding your query on **${selectedIncident.name}**:\n- **Monitored Slick**: ${selectedIncident.areaKm2} km² (${selectedIncident.oilType})\n- **AI Detection Confidence**: ${selectedIncident.confidence}%\n- **Prime Suspect Vessel**: **${primeSuspect.name}** (${primeSuspect.overallAttributionScore}% attribution score)\n\nYou can also run automatic drift forecasts, hindcast particle backtracking, or export the full legal evidence package from the navigation bar.`;
  };

  const handleSendMessage = async (textToSend?: string) => {
    const prompt = textToSend || inputValue;
    if (!prompt.trim()) return;

    const userMessage: ChatMessage = {
      id: `USER-${Date.now()}`,
      sender: 'user',
      timestamp: new Date().toISOString(),
      content: prompt
    };

    setMessages(prev => [...prev, userMessage]);
    if (!textToSend) setInputValue('');
    setIsTyping(true);

    try {
      const backendResponse = await apiService.sendChatMessage(selectedIncident.id, prompt);
      if (backendResponse && backendResponse.reply) {
        const aiMessage: ChatMessage = {
          id: `AI-${Date.now()}`,
          sender: 'assistant',
          timestamp: backendResponse.timestamp || new Date().toISOString(),
          content: backendResponse.reply,
          references: backendResponse.references,
          suggestedActions: backendResponse.suggested_actions
        };
        setMessages(prev => [...prev, aiMessage]);
        setIsTyping(false);
        return;
      }
    } catch (e) {
      console.warn('[Assistant] Backend chat error, using local reasoning:', e);
    }

    setTimeout(() => {
      const responseContent = generateAIResponse(prompt);
      const aiMessage: ChatMessage = {
        id: `AI-${Date.now()}`,
        sender: 'assistant',
        timestamp: new Date().toISOString(),
        content: responseContent
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 700);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-marine-800/80 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white uppercase tracking-tight font-sans">
              AI Maritime <span className="text-radar-teal">Investigation Assistant</span>
            </h1>
            <span className="px-2 py-0.5 text-xs font-mono font-bold bg-radar-teal/20 text-radar-teal border border-radar-teal/40 rounded">
              LLM COPILOT
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 font-mono mt-1">
            Contextual reasoning copilot grounded in satellite telemetry, hydrodynamic models, and AIS forensics.
          </p>
        </div>

        {/* Active Incident Context Tag */}
        <div className="flex items-center space-x-2 bg-marine-900 border border-marine-700 px-3 py-1.5 rounded-xl text-xs font-mono text-slate-300">
          <span className="text-slate-400">Context:</span>
          <strong className="text-white truncate max-w-[180px]">{selectedIncident.name}</strong>
        </div>
      </div>

      {/* Main Chat Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left 8 Cols: Interactive Chat Container */}
        <div className="lg:col-span-8 flex flex-col h-[650px] rounded-2xl bg-marine-900/90 border border-marine-700/80 backdrop-blur-md shadow-2xl overflow-hidden">
          {/* Chat Messages Log */}
          <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-5">
            {messages.map((msg) => {
              const isAssistant = msg.sender === 'assistant';
              const isSystem = msg.sender === 'system';

              if (isSystem) {
                return (
                  <div key={msg.id} className="text-center my-2">
                    <span className="px-3 py-1 rounded-full bg-marine-950/80 border border-marine-800 text-[10px] font-mono text-slate-400">
                      {msg.content}
                    </span>
                  </div>
                );
              }

              return (
                <div
                  key={msg.id}
                  className={`flex items-start space-x-3 ${isAssistant ? '' : 'flex-row-reverse space-x-reverse'}`}
                >
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      isAssistant
                        ? 'bg-gradient-to-br from-radar-teal to-marine-800 text-marine-950 border border-radar-teal shadow-glow-teal/20'
                        : 'bg-marine-800 text-slate-200 border border-marine-600'
                    }`}
                  >
                    {isAssistant ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                  </div>

                  <div
                    className={`p-4 rounded-2xl max-w-xl text-xs leading-relaxed space-y-2 ${
                      isAssistant
                        ? 'bg-marine-950/90 border border-marine-800 text-slate-200 shadow-md'
                        : 'bg-gradient-to-r from-radar-cyan/20 to-marine-800 border border-radar-cyan/40 text-white shadow-glow-cyan/10'
                    }`}
                  >
                    <div className="prose prose-invert prose-xs max-w-none space-y-2 whitespace-pre-line font-sans">
                      {msg.content}
                    </div>

                    <div className="text-[9px] font-mono text-slate-500 text-right pt-1">
                      {msg.timestamp.substring(11, 19)} UTC
                    </div>
                  </div>
                </div>
              );
            })}

            {isTyping && (
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-xl bg-radar-teal/20 border border-radar-teal/40 flex items-center justify-center text-radar-teal">
                  <Bot className="w-4 h-4 animate-pulse" />
                </div>
                <div className="px-4 py-3 rounded-2xl bg-marine-950 border border-marine-800 text-xs font-mono text-slate-400 flex items-center space-x-2">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-radar-teal" />
                  <span>Synthesizing maritime telemetry & AIS correlations...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Prompt Input Box */}
          <div className="p-4 border-t border-marine-800/80 bg-marine-950/80">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center space-x-2"
            >
              <input
                type="text"
                placeholder="Ask about prime suspect, drift trajectory, coastal risk, or legal evidence..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="flex-1 px-4 py-3 rounded-xl bg-marine-900 border border-marine-700 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-radar-teal transition-colors font-mono"
              />

              <button
                type="submit"
                disabled={!inputValue.trim()}
                className="p-3 rounded-xl bg-gradient-to-r from-radar-teal to-radar-cyan text-marine-950 font-bold hover:brightness-110 active:scale-95 disabled:opacity-40 transition-all shadow-glow-teal"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>

        {/* Right 4 Cols: Preset Questions & Incident Knowledge Hub */}
        <div className="lg:col-span-4 space-y-4">
          {/* Preset Prompts Card */}
          <div className="p-5 rounded-xl bg-marine-900/90 border border-marine-700/80 backdrop-blur-md space-y-3 shadow-xl">
            <div className="flex items-center space-x-2 border-b border-marine-800 pb-2">
              <Lightbulb className="w-4 h-4 text-radar-amber" />
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
                Suggested Inquiries
              </h3>
            </div>

            <div className="space-y-2">
              {presetAssistantQuestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(q)}
                  className="w-full text-left p-2.5 rounded-lg bg-marine-950/70 hover:bg-marine-800 border border-marine-800 hover:border-radar-teal/50 text-[11px] font-mono text-slate-300 hover:text-white transition-all flex items-start space-x-2 group"
                >
                  <ArrowRight className="w-3.5 h-3.5 text-radar-teal group-hover:translate-x-0.5 transition-transform flex-shrink-0 mt-0.5" />
                  <span>{q}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Quick Context Summary */}
          <div className="p-5 rounded-xl bg-marine-900/90 border border-marine-700/80 backdrop-blur-md space-y-3 shadow-xl font-mono text-xs">
            <h3 className="text-xs font-bold uppercase tracking-wider text-radar-cyan border-b border-marine-800 pb-2">
              Active Investigation Context
            </h3>

            <div className="space-y-2 text-slate-300">
              <div>• Target: <strong className="text-white">{selectedIncident.name}</strong></div>
              <div>• Detection Area: <strong className="text-radar-cyan">{selectedIncident.areaKm2} km²</strong></div>
              <div>• Classified Hydrocarbon: <strong className="text-white">{selectedIncident.oilType}</strong></div>
              <div>• Prime Suspect Vessel: <strong className="text-radar-rose">{primeSuspect.name} ({primeSuspect.overallAttributionScore}%)</strong></div>
            </div>

            <button
              onClick={() => navigate('/reports')}
              className="w-full mt-2 py-2 rounded-lg bg-marine-800 hover:bg-marine-750 border border-marine-700 text-xs font-bold text-slate-200 hover:text-white flex items-center justify-center gap-1.5 transition-colors"
            >
              <FileText className="w-3.5 h-3.5 text-radar-amber" />
              <span>Generate Official Dossier</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { createContext, useContext, useState, useEffect } from 'react';
import { OilSpillIncident, SampleDetectionScan } from '../types';
import { mockIncidents, sampleScans } from '../data/mockData';
import { apiService } from '../services/api';

interface MapLayersState {
  spills: boolean;
  vessels: boolean;
  driftVectors: boolean;
  hindcastCones: boolean;
  marineParks: boolean;
  satelliteFootprint: boolean;
}

interface IncidentContextType {
  incidents: OilSpillIncident[];
  selectedIncident: OilSpillIncident;
  setSelectedIncidentId: (id: string) => void;
  sampleScans: SampleDetectionScan[];
  activeScan: SampleDetectionScan;
  setActiveScanId: (id: string) => void;
  simulationTimeOffset: number;
  setSimulationTimeOffset: (val: number) => void;
  isSimulating: boolean;
  setIsSimulating: (val: boolean | ((prev: boolean) => boolean)) => void;
  mapLayers: MapLayersState;
  toggleLayer: (layer: keyof MapLayersState) => void;
  activeAttributionVesselId: string | null;
  setActiveAttributionVesselId: (id: string | null) => void;
  refreshFromBackend: () => Promise<void>;
}

const IncidentContext = createContext<IncidentContextType | undefined>(undefined);

export const IncidentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [incidents, setIncidents] = useState<OilSpillIncident[]>(mockIncidents);
  const [selectedIncidentId, setSelectedIncidentIdState] = useState<string>(mockIncidents[0].id);
  const [scans, setScans] = useState<SampleDetectionScan[]>(sampleScans);
  const [activeScanId, setActiveScanIdState] = useState<string>(sampleScans[0].id);

  const [simulationTimeOffset, setSimulationTimeOffset] = useState<number>(0);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [activeAttributionVesselId, setActiveAttributionVesselId] = useState<string | null>(
    mockIncidents[0].attributedVessels[0]?.id || null
  );

  const [mapLayers, setMapLayers] = useState<MapLayersState>({
    spills: true,
    vessels: true,
    driftVectors: true,
    hindcastCones: true,
    marineParks: true,
    satelliteFootprint: true,
  });

  const refreshFromBackend = async () => {
    try {
      const liveIncidents = await apiService.getIncidents();
      if (liveIncidents && liveIncidents.length > 0) {
        setIncidents(liveIncidents);
      }
      const liveScans = await apiService.getScans();
      if (liveScans && liveScans.length > 0) {
        setScans(liveScans);
      }
    } catch (e) {
      console.warn('[IncidentContext] Backend fetch error:', e);
    }
  };

  useEffect(() => {
    refreshFromBackend();
  }, []);

  const selectedIncident = incidents.find(inc => inc.id === selectedIncidentId) || incidents[0] || mockIncidents[0];
  const activeScan = scans.find(s => s.id === activeScanId) || scans[0] || sampleScans[0];

  const setSelectedIncidentId = (id: string) => {
    setSelectedIncidentIdState(id);
    const inc = incidents.find(i => i.id === id);
    if (inc && inc.attributedVessels && inc.attributedVessels.length > 0) {
      setActiveAttributionVesselId(inc.attributedVessels[0].id);
    }
    setSimulationTimeOffset(0);
    setIsSimulating(false);
  };

  const setActiveScanId = (id: string) => {
    setActiveScanIdState(id);
  };

  const toggleLayer = (layer: keyof MapLayersState) => {
    setMapLayers(prev => ({ ...prev, [layer]: !prev[layer] }));
  };

  // Playback timer for forward drift simulation
  useEffect(() => {
    let interval: any;
    if (isSimulating) {
      interval = setInterval(() => {
        setSimulationTimeOffset(prev => {
          if (prev >= 72) return 0;
          return prev + 6;
        });
      }, 1500);
    }
    return () => clearInterval(interval);
  }, [isSimulating]);

  return (
    <IncidentContext.Provider
      value={{
        incidents,
        selectedIncident,
        setSelectedIncidentId,
        sampleScans: scans,
        activeScan,
        setActiveScanId,
        simulationTimeOffset,
        setSimulationTimeOffset,
        isSimulating,
        setIsSimulating,
        mapLayers,
        toggleLayer,
        activeAttributionVesselId,
        setActiveAttributionVesselId,
        refreshFromBackend
      }}
    >
      {children}
    </IncidentContext.Provider>
  );
};

export const useIncident = () => {
  const context = useContext(IncidentContext);
  if (!context) {
    throw new Error('useIncident must be used within an IncidentProvider');
  }
  return context;
};

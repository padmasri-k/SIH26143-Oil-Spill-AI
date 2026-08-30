import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { IncidentProvider } from './context/IncidentContext';
import { Navbar } from './components/common/Navbar';
import { Sidebar } from './components/common/Sidebar';

// Pages
import { HomePage } from './pages/HomePage';
import { DashboardPage } from './pages/DashboardPage';
import { DetectionPage } from './pages/DetectionPage';
import { TrackingPage } from './pages/TrackingPage';
import { HindcastingPage } from './pages/HindcastingPage';
import { VesselAttributionPage } from './pages/VesselAttributionPage';
import { AIAssistantPage } from './pages/AIAssistantPage';
import { ReportsPage } from './pages/ReportsPage';

const AppLayout: React.FC = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);

  return (
    <div className="flex flex-col min-h-screen bg-marine-950 text-slate-100 selection:bg-radar-cyan/30 selection:text-white">
      {/* Top Command Status Bar */}
      <Navbar />

      <div className="flex flex-1 relative overflow-hidden">
        {/* Left Sidebar Navigation */}
        <Sidebar isCollapsed={isSidebarCollapsed} setIsCollapsed={setIsSidebarCollapsed} />

        {/* Main Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-h-[calc(100vh-4rem)] bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-marine-900/30 via-marine-950 to-marine-950">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/detection" element={<DetectionPage />} />
            <Route path="/tracking" element={<TrackingPage />} />
            <Route path="/hindcasting" element={<HindcastingPage />} />
            <Route path="/attribution" element={<VesselAttributionPage />} />
            <Route path="/assistant" element={<AIAssistantPage />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <IncidentProvider>
      <Router>
        <AppLayout />
      </Router>
    </IncidentProvider>
  );
};

export default App;

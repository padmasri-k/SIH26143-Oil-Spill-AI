import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  Compass,
  LayoutDashboard,
  ScanSearch,
  Waves,
  History,
  Ship,
  Sparkles,
  FileText,
  ChevronLeft,
  ChevronRight,
  Shield,
  Activity,
  Anchor
} from 'lucide-react';

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (val: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, setIsCollapsed }) => {
  const navItems = [
    {
      name: 'Mission Overview',
      path: '/',
      icon: Compass,
      badge: null,
      description: 'Landing & Architecture'
    },
    {
      name: 'Live Dashboard',
      path: '/dashboard',
      icon: LayoutDashboard,
      badge: 'LIVE',
      badgeColor: 'bg-radar-emerald/20 text-radar-emerald border-radar-emerald/40',
      description: 'Ocean Command HUD'
    },
    {
      name: 'Spill Detection',
      path: '/detection',
      icon: ScanSearch,
      badge: 'AI',
      badgeColor: 'bg-radar-cyan/20 text-radar-cyan border-radar-cyan/40',
      description: 'SAR / Optical Segmentation'
    },
    {
      name: 'Spill Tracking',
      path: '/tracking',
      icon: Waves,
      badge: '48h',
      badgeColor: 'bg-marine-700/60 text-slate-300 border-marine-600',
      description: 'Drift & Vector Forecast'
    },
    {
      name: 'Hindcasting',
      path: '/hindcasting',
      icon: History,
      badge: 'BACK',
      badgeColor: 'bg-radar-purple/20 text-radar-purple border-radar-purple/40',
      description: 'Origin & Discharge Time'
    },
    {
      name: 'Vessel Attribution',
      path: '/attribution',
      icon: Ship,
      badge: 'SUSPECT',
      badgeColor: 'bg-radar-rose/20 text-radar-rose border-radar-rose/40',
      description: 'AIS Correlation & Scorer'
    },
    {
      name: 'AI Investigator',
      path: '/assistant',
      icon: Sparkles,
      badge: 'LLM',
      badgeColor: 'bg-radar-teal/20 text-radar-teal border-radar-teal/40',
      description: 'Forensic Copilot Chat'
    },
    {
      name: 'Incident Reports',
      path: '/reports',
      icon: FileText,
      badge: 'PDF',
      badgeColor: 'bg-radar-amber/20 text-radar-amber border-radar-amber/40',
      description: 'Dossier & Legal Export'
    },
  ];

  return (
    <aside
      className={`relative bg-marine-900/95 backdrop-blur-xl border-r border-marine-700/60 flex flex-col justify-between transition-all duration-300 z-30 ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Top Header / Toggle */}
      <div>
        <div className="p-4 border-b border-marine-800/80 flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center space-x-2">
              <Shield className="w-4 h-4 text-radar-cyan" />
              <span className="text-xs font-mono font-semibold uppercase tracking-widest text-slate-300">
                Navigation HUD
              </span>
            </div>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1.5 rounded-lg bg-marine-800/80 hover:bg-marine-700 text-slate-400 hover:text-white transition-colors mx-auto"
            title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation List */}
        <nav className="p-3 space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `group relative flex items-center rounded-xl px-3 py-2.5 text-xs font-medium transition-all duration-150 ${
                    isActive
                      ? 'bg-gradient-to-r from-marine-800 to-marine-850 text-white border border-radar-cyan/40 shadow-glow-cyan/20'
                      : 'text-slate-400 hover:bg-marine-800/50 hover:text-slate-200'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <div className="flex items-center space-x-3 w-full">
                      <div
                        className={`p-1.5 rounded-lg transition-colors ${
                          isActive
                            ? 'bg-radar-cyan/20 text-radar-cyan'
                            : 'bg-marine-800/60 text-slate-400 group-hover:text-slate-200 group-hover:bg-marine-700/60'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>

                      {!isCollapsed && (
                        <div className="flex-1 flex items-center justify-between truncate">
                          <div className="truncate">
                            <div className="font-semibold text-slate-100 group-hover:text-white truncate">
                              {item.name}
                            </div>
                            <div className="text-[10px] text-slate-400 font-normal truncate">
                              {item.description}
                            </div>
                          </div>

                          {item.badge && (
                            <span
                              className={`ml-2 px-1.5 py-0.5 text-[9px] font-mono font-bold tracking-wider rounded border ${item.badgeColor}`}
                            >
                              {item.badge}
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Active Accent Bar */}
                    {isActive && (
                      <div className="absolute left-0 top-2 bottom-2 w-1 bg-radar-cyan rounded-r shadow-glow-cyan" />
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Bottom Status Card */}
      {!isCollapsed ? (
        <div className="p-3 m-3 rounded-xl bg-marine-950/80 border border-marine-800/90 space-y-2">
          <div className="flex items-center justify-between text-[11px] font-mono">
            <span className="text-slate-400 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-radar-emerald animate-pulse" />
              AI Core Online
            </span>
            <span className="text-radar-emerald font-bold">99.9%</span>
          </div>
          <div className="w-full bg-marine-800 h-1.5 rounded-full overflow-hidden">
            <div className="bg-gradient-to-r from-radar-cyan to-radar-emerald h-full w-[94%]" />
          </div>
          <div className="text-[10px] text-slate-400 font-mono flex items-center justify-between">
            <span>Model: DeepLabV3+</span>
            <span className="text-radar-cyan">v2.4.8</span>
          </div>
        </div>
      ) : (
        <div className="p-3 text-center">
          <div className="w-3 h-3 rounded-full bg-radar-emerald animate-pulse mx-auto" title="System Online" />
        </div>
      )}
    </aside>
  );
};

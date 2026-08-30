import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  unit?: string;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: string;
    isPositive?: boolean;
  };
  accentColor?: 'cyan' | 'emerald' | 'amber' | 'rose' | 'purple';
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  unit,
  subtitle,
  icon: Icon,
  trend,
  accentColor = 'cyan',
  onClick,
}) => {
  const getColors = () => {
    switch (accentColor) {
      case 'rose':
        return {
          border: 'hover:border-radar-rose/50 border-marine-700/60',
          iconBg: 'bg-radar-rose/10 text-radar-rose',
          glow: 'hover:shadow-glow-rose',
          text: 'text-radar-rose'
        };
      case 'amber':
        return {
          border: 'hover:border-radar-amber/50 border-marine-700/60',
          iconBg: 'bg-radar-amber/10 text-radar-amber',
          glow: 'hover:shadow-glow-amber',
          text: 'text-radar-amber'
        };
      case 'emerald':
        return {
          border: 'hover:border-radar-emerald/50 border-marine-700/60',
          iconBg: 'bg-radar-emerald/10 text-radar-emerald',
          glow: 'hover:shadow-glow-teal',
          text: 'text-radar-emerald'
        };
      case 'purple':
        return {
          border: 'hover:border-radar-purple/50 border-marine-700/60',
          iconBg: 'bg-radar-purple/10 text-radar-purple',
          glow: 'hover:shadow-glow-cyan',
          text: 'text-radar-purple'
        };
      default:
        return {
          border: 'hover:border-radar-cyan/50 border-marine-700/60',
          iconBg: 'bg-radar-cyan/10 text-radar-cyan',
          glow: 'hover:shadow-glow-cyan',
          text: 'text-radar-cyan'
        };
    }
  };

  const colors = getColors();

  return (
    <div
      onClick={onClick}
      className={`relative p-4 rounded-xl bg-marine-900/90 backdrop-blur-md border transition-all duration-200 ${colors.border} ${colors.glow} ${
        onClick ? 'cursor-pointer hover:-translate-y-0.5' : ''
      }`}
    >
      <div className="flex items-start justify-between">
        <div>
          <span className="text-xs font-mono font-medium text-slate-400 uppercase tracking-wider block">
            {title}
          </span>
          <div className="mt-1.5 flex items-baseline space-x-1.5">
            <span className="text-2xl font-black tracking-tight text-white font-mono">{value}</span>
            {unit && <span className="text-xs font-mono text-slate-400 font-semibold">{unit}</span>}
          </div>
        </div>

        <div className={`p-2.5 rounded-xl border border-white/5 ${colors.iconBg}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      {(subtitle || trend) && (
        <div className="mt-3 pt-2.5 border-t border-marine-800/80 flex items-center justify-between text-[11px] font-mono">
          {subtitle && <span className="text-slate-400 truncate">{subtitle}</span>}
          {trend && (
            <span
              className={`font-semibold flex items-center gap-1 ml-auto ${
                trend.isPositive ? 'text-radar-emerald' : 'text-radar-rose'
              }`}
            >
              {trend.value}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

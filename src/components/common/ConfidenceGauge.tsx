import React from 'react';

interface ConfidenceGaugeProps {
  score: number; // 0 to 100
  size?: number; // size in px
  strokeWidth?: number;
  label?: string;
  sublabel?: string;
  showPercent?: boolean;
}

export const ConfidenceGauge: React.FC<ConfidenceGaugeProps> = ({
  score,
  size = 140,
  strokeWidth = 10,
  label = 'AI Confidence',
  sublabel,
  showPercent = true,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  // Semi-arc or 270-degree gauge
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const getColor = () => {
    if (score >= 90) return '#10b981'; // Emerald
    if (score >= 75) return '#00f0ff'; // Cyan
    if (score >= 50) return '#f59e0b'; // Amber
    return '#f43f5e'; // Rose
  };

  const strokeColor = getColor();

  return (
    <div className="flex flex-col items-center justify-center relative">
      <div className="relative" style={{ width: size, height: size }}>
        <svg className="w-full h-full transform -rotate-90" viewBox={`0 0 ${size} ${size}`}>
          {/* Background Track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="rgba(30, 58, 138, 0.3)"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Active Gradient Arc */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            style={{
              transition: 'stroke-dashoffset 1s cubic-bezier(0.4, 0, 0.2, 1)',
              filter: `drop-shadow(0 0 6px ${strokeColor}66)`
            }}
          />
        </svg>

        {/* Center Label Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-2xl font-black font-mono tracking-tight text-white">
            {score.toFixed(1)}{showPercent ? '%' : ''}
          </span>
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold">
            {score >= 90 ? 'Verified' : score >= 75 ? 'High Prob' : score >= 50 ? 'Moderate' : 'Low'}
          </span>
        </div>
      </div>

      {label && (
        <div className="mt-2 text-center">
          <div className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wide">{label}</div>
          {sublabel && <div className="text-[10px] text-slate-400 font-mono">{sublabel}</div>}
        </div>
      )}
    </div>
  );
};

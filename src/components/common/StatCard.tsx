import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  change?: string;
  isPositive?: boolean;
  icon: LucideIcon;
  badge?: string;
  colorScheme?: 'indigo' | 'emerald' | 'rose' | 'amber' | 'cyan';
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  change,
  isPositive,
  icon: Icon,
  badge,
  colorScheme = 'indigo',
}) => {
  const colorStyles = {
    indigo: {
      bg: 'bg-indigo-950/40 border-indigo-800/40 text-indigo-400',
      glow: 'shadow-indigo-950/50',
      iconBg: 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/30',
    },
    emerald: {
      bg: 'bg-emerald-950/40 border-emerald-800/40 text-emerald-400',
      glow: 'shadow-emerald-950/50',
      iconBg: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30',
    },
    rose: {
      bg: 'bg-rose-950/40 border-rose-800/40 text-rose-400',
      glow: 'shadow-rose-950/50',
      iconBg: 'bg-rose-500/15 text-rose-400 border border-rose-500/30',
    },
    amber: {
      bg: 'bg-amber-950/40 border-amber-800/40 text-amber-400',
      glow: 'shadow-amber-950/50',
      iconBg: 'bg-amber-500/15 text-amber-400 border border-amber-500/30',
    },
    cyan: {
      bg: 'bg-cyan-950/40 border-cyan-800/40 text-cyan-400',
      glow: 'shadow-cyan-950/50',
      iconBg: 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30',
    },
  }[colorScheme];

  return (
    <div className={`relative overflow-hidden rounded-xl border p-5 backdrop-blur-md bg-slate-900/60 transition-all duration-300 hover:border-slate-700 hover:shadow-lg ${colorStyles.glow}`}>
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-semibold tracking-wider uppercase text-slate-400">{title}</p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl font-bold tracking-tight text-white font-mono">{value}</h3>
            {badge && (
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold border ${colorStyles.iconBg}`}>
                {badge}
              </span>
            )}
          </div>
        </div>
        <div className={`p-2.5 rounded-lg ${colorStyles.iconBg}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      {(subtitle || change) && (
        <div className="mt-3 flex items-center justify-between text-xs pt-2 border-t border-slate-800/80">
          {subtitle && <span className="text-slate-400">{subtitle}</span>}
          {change && (
            <span
              className={`font-semibold flex items-center gap-1 ${
                isPositive ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              {isPositive ? '↑' : '↓'} {change}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

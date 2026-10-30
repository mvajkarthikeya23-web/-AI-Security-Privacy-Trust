import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from 'recharts';
import { MetricsSummary } from '../../types/index.ts';
import { ShieldCheck, ShieldAlert, Award, Activity } from 'lucide-react';

interface AnalyticsChartsProps {
  metrics: MetricsSummary;
}

export const AnalyticsCharts: React.FC<AnalyticsChartsProps> = ({ metrics }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* 7-Day Trend Activity Chart */}
      <div className="lg:col-span-2 rounded-xl border border-slate-800 bg-slate-900/60 backdrop-blur-md p-5 flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="text-sm font-semibold text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-indigo-400" />
              Security Telemetry & Threat Trends (7 Days)
            </h4>
            <p className="text-xs text-slate-400">Total scans vs. blocked threats and detected PII leaks</p>
          </div>
          <div className="flex items-center gap-4 text-xs font-mono">
            <span className="flex items-center gap-1.5 text-slate-300">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-500"></span> Total Scans
            </span>
            <span className="flex items-center gap-1.5 text-slate-300">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span> Threats
            </span>
            <span className="flex items-center gap-1.5 text-slate-300">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> PII Masked
            </span>
          </div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={metrics.trend7Days} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="colorThreats" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis dataKey="date" stroke="#64748b" fontSize={11} tickLine={false} />
              <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderColor: '#334155',
                  borderRadius: '0.5rem',
                  fontSize: '12px',
                  color: '#f8fafc',
                }}
              />
              <Area
                type="monotone"
                dataKey="total"
                stroke="#6366f1"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorTotal)"
                name="Total Scans"
              />
              <Area
                type="monotone"
                dataKey="threats"
                stroke="#f43f5e"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorThreats)"
                name="Threats Intercepted"
              />
              <Area
                type="monotone"
                dataKey="pii"
                stroke="#f59e0b"
                strokeWidth={2}
                fillOpacity={0}
                strokeDasharray="4 4"
                name="PII Redactions"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Threat Taxonomy Distribution */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 backdrop-blur-md p-5 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-semibold text-white flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-400" />
              Threat Taxonomy Vectors
            </h4>
          </div>
          <p className="text-xs text-slate-400 mb-4">Breakdown of intercepted attack types</p>

          <div className="h-44 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={metrics.threatDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={70}
                  paddingAngle={4}
                  dataKey="count"
                >
                  {metrics.threatDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="#0f172a" strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '0.5rem',
                    fontSize: '12px',
                    color: '#f8fafc',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="space-y-1.5 pt-2 border-t border-slate-800 text-xs">
          {metrics.threatDistribution.slice(0, 4).map((item) => (
            <div key={item.name} className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-slate-300">
                <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: item.color }}></span>
                <span className="truncate max-w-[130px]">{item.name}</span>
              </span>
              <span className="font-mono text-slate-400 font-medium">{item.count} hits</span>
            </div>
          ))}
        </div>
      </div>

      {/* Compliance Posture Matrix */}
      <div className="lg:col-span-3 rounded-xl border border-slate-800 bg-slate-900/60 backdrop-blur-md p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="text-sm font-semibold text-white flex items-center gap-2">
              <Award className="w-4 h-4 text-emerald-400" />
              Enterprise Regulatory Compliance Readiness
            </h4>
            <p className="text-xs text-slate-400">Automated verification against global data protection frameworks</p>
          </div>
          <span className="text-xs font-mono px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            AUDIT READY: Tier-1
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {/* GDPR */}
          <div className="p-3.5 rounded-lg bg-slate-950/70 border border-slate-800/80">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-semibold text-slate-200">GDPR Compliance</span>
              <span className="font-mono font-bold text-emerald-400">{metrics.complianceScores.gdpr}%</span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${metrics.complianceScores.gdpr}%` }}
              ></div>
            </div>
            <p className="text-[11px] text-slate-400 mt-2">Articles 4, 5 & 32 (PII pseudonymization)</p>
          </div>

          {/* HIPAA */}
          <div className="p-3.5 rounded-lg bg-slate-950/70 border border-slate-800/80">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-semibold text-slate-200">HIPAA Safe Harbor</span>
              <span className="font-mono font-bold text-cyan-400">{metrics.complianceScores.hipaa}%</span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                className="bg-cyan-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${metrics.complianceScores.hipaa}%` }}
              ></div>
            </div>
            <p className="text-[11px] text-slate-400 mt-2">18 PHI identifiers scrubbed</p>
          </div>

          {/* PCI-DSS */}
          <div className="p-3.5 rounded-lg bg-slate-950/70 border border-slate-800/80">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-semibold text-slate-200">PCI-DSS v4.0</span>
              <span className="font-mono font-bold text-indigo-400">{metrics.complianceScores.pciDss}%</span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                className="bg-indigo-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${metrics.complianceScores.pciDss}%` }}
              ></div>
            </div>
            <p className="text-[11px] text-slate-400 mt-2">Requirement 3.4 & 4.2 (PAN masking)</p>
          </div>

          {/* EU AI Act */}
          <div className="p-3.5 rounded-lg bg-slate-950/70 border border-slate-800/80">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-semibold text-slate-200">EU AI Act</span>
              <span className="font-mono font-bold text-amber-400">{metrics.complianceScores.euAiAct}%</span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                className="bg-amber-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${metrics.complianceScores.euAiAct}%` }}
              ></div>
            </div>
            <p className="text-[11px] text-slate-400 mt-2">High-risk AI governance & transparency</p>
          </div>
        </div>
      </div>
    </div>
  );
};

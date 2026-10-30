import React, { useState, useEffect } from 'react';
import { getMetricsApi, getLogsApi, downloadLogsExport } from '../../services/api.ts';
import { MetricsSummary, SecurityLog } from '../../types/index.ts';
import { StatCard } from '../common/StatCard.tsx';
import { AnalyticsCharts } from './AnalyticsCharts.tsx';
import { RecentIncidents } from './RecentIncidents.tsx';
import {
  ShieldCheck,
  ShieldAlert,
  FileKey2,
  Activity,
  Sparkles,
  FileSpreadsheet,
  ArrowRight,
  Flame,
} from 'lucide-react';

interface DashboardViewProps {
  onNavigate: (tab: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onNavigate }) => {
  const [metrics, setMetrics] = useState<MetricsSummary | null>(null);
  const [logs, setLogs] = useState<SecurityLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [m, l] = await Promise.all([getMetricsApi(), getLogsApi({ limit: 10 })]);
      setMetrics(m);
      setLogs(l.data);
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="space-y-6">
      {/* Top Banner / Hero */}
      <div className="rounded-2xl border border-indigo-900/40 bg-gradient-to-r from-indigo-950/40 via-slate-900/60 to-slate-950 p-6 backdrop-blur-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2 py-0.5 rounded font-mono text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              TRUSTGUARD ENGINE v1.4
            </span>
            <span className="text-xs text-slate-400 font-mono">Real-Time Threat Prevention</span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight font-sans">
            AI Security, Privacy & Governance Command Center
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Continuous runtime protection against prompt injections, adversarial jailbreaks, and sensitive data leakage. Powered by Google Gemini 3.8 Flash with Row-Level Security auditing.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0 flex-wrap">
          <button
            onClick={() => onNavigate('threat-scanner')}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-white text-xs font-bold shadow-lg shadow-rose-600/20 flex items-center gap-2 transition-all cursor-pointer"
          >
            <Flame className="w-4 h-4 text-rose-200" />
            Test Jailbreak Firewall
          </button>
          <button
            onClick={() => onNavigate('pii-scanner')}
            className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-2 transition-all cursor-pointer"
          >
            <FileKey2 className="w-4 h-4 text-indigo-400" />
            Inspect PII
          </button>
        </div>
      </div>

      {/* Primary KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Overall Posture Score"
          value={metrics ? `${metrics.overallPostureScore}/100` : '--'}
          subtitle="Enterprise Resilience Index"
          badge="TIER 1"
          colorScheme="emerald"
          icon={ShieldCheck}
          change="+4.2% vs last week"
          isPositive={true}
        />
        <StatCard
          title="Total Scans Processed"
          value={metrics ? metrics.totalScans.toLocaleString() : '--'}
          subtitle="Audit ledger verified"
          colorScheme="indigo"
          icon={Activity}
          change="+18% volume"
          isPositive={true}
        />
        <StatCard
          title="Threats Intercepted"
          value={metrics ? metrics.threatsDetected : '--'}
          subtitle={`${metrics ? metrics.threatRatePercent : 0}% hostile payload rate`}
          badge="FIREWALL"
          colorScheme="rose"
          icon={ShieldAlert}
          change="3 critical neutralized"
          isPositive={false}
        />
        <StatCard
          title="PII Elements Masked"
          value={metrics ? metrics.piiLeaksBlocked : '--'}
          subtitle="GDPR & HIPAA compliant"
          badge="ZERO LEAK"
          colorScheme="cyan"
          icon={FileKey2}
          change="100% redacted"
          isPositive={true}
        />
      </div>

      {/* Analytics Charts (7-day trend, threat taxonomy, compliance gauges) */}
      {metrics && <AnalyticsCharts metrics={metrics} />}

      {/* Live Recent Incidents Table */}
      <RecentIncidents logs={logs} onViewAll={() => onNavigate('audit-logs')} />
    </div>
  );
};

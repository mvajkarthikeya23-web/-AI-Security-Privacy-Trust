import React, { useState, useEffect } from 'react';
import { getLogsApi, deleteLogApi, downloadLogsExport } from '../../services/api.ts';
import { SecurityLog } from '../../types/index.ts';
import { useAuth } from '../../context/AuthContext.tsx';
import {
  ClipboardList,
  Search,
  Download,
  Filter,
  Trash2,
  Eye,
  ShieldAlert,
  ShieldCheck,
  RefreshCw,
  FileJson,
  FileSpreadsheet,
  X,
  FileText,
  Lock,
} from 'lucide-react';

export const AuditLogTable: React.FC = () => {
  const { user } = useAuth();
  const [logs, setLogs] = useState<SecurityLog[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [scanType, setScanType] = useState<string>('');
  const [threatsOnly, setThreatsOnly] = useState(false);
  const [selectedLog, setSelectedLog] = useState<SecurityLog | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const fetchLogs = async () => {
    setIsLoading(true);
    try {
      const res = await getLogsApi({
        scan_type: scanType || undefined,
        threats_only: threatsOnly || undefined,
        search: search.trim() || undefined,
        limit: 100,
      });
      setLogs(res.data);
      setTotal(res.total);
    } catch (err: any) {
      console.error('Failed to load logs:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [scanType, threatsOnly]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchLogs();
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm(`Are you sure you want to delete Audit Log #${id}?`)) return;

    try {
      await deleteLogApi(id);
      setMessage(`Log #${id} deleted.`);
      setTimeout(() => setMessage(null), 3000);
      fetchLogs();
    } catch (err: any) {
      alert(err.message || 'Failed to delete log');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <ClipboardList className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-white font-sans">
              Comprehensive Security Audit Trails
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            PostgreSQL-backed immutable ledger with Row-Level Security (RLS) data isolation and JSONB analysis storage.
          </p>
        </div>

        {/* Action Controls & Export */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300">
            <Lock className="w-3.5 h-3.5 text-indigo-400" />
            <span>RLS Policy:</span>
            <span className="font-mono font-bold text-indigo-300">
              {user?.role === 'Admin' ? 'Global Org Access' : 'User Scoped Isolation'}
            </span>
          </div>

          <button
            onClick={() => downloadLogsExport('json')}
            className="px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <FileJson className="w-3.5 h-3.5 text-amber-400" />
            JSON
          </button>

          <button
            onClick={() => downloadLogsExport('csv')}
            className="px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
            CSV
          </button>

          <button
            onClick={fetchLogs}
            disabled={isLoading}
            className="p-1.5 rounded-lg border border-slate-800 bg-slate-900 hover:bg-slate-800 text-slate-300 transition-colors cursor-pointer"
            title="Refresh logs"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {message && (
        <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-800 text-emerald-300 text-xs">
          {message}
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch justify-between">
        <form onSubmit={handleSearchSubmit} className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search payload text, user email, or threat type..."
            className="w-full pl-9 pr-4 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:border-indigo-500 focus:outline-none"
          />
        </form>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Scan Type Filter */}
          <select
            value={scanType}
            onChange={(e) => setScanType(e.target.value)}
            className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none cursor-pointer"
          >
            <option value="">All Scan Types</option>
            <option value="PII_DETECTION">PII Inspection</option>
            <option value="PROMPT_INJECTION">Prompt Injection</option>
            <option value="MODEL_AUDIT">Model Safety Audit</option>
          </select>

          {/* Threats only toggle */}
          <button
            onClick={() => setThreatsOnly(!threatsOnly)}
            className={`px-3 py-2 rounded-lg border text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors ${
              threatsOnly
                ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            Threats Only
          </button>
        </div>
      </div>

      {/* Main Table */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 backdrop-blur-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/40 text-slate-400 uppercase tracking-wider font-mono">
                <th className="py-3 px-4 font-semibold">Log ID</th>
                <th className="py-3 px-4 font-semibold">Module</th>
                <th className="py-3 px-4 font-semibold">Attribution</th>
                <th className="py-3 px-4 font-semibold">Threat State</th>
                <th className="py-3 px-4 font-semibold">Risk Score</th>
                <th className="py-3 px-4 font-semibold">Payload Preview</th>
                <th className="py-3 px-4 font-semibold">Timestamp</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {logs.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-500 text-xs">
                    No security logs match your current query or filter criteria.
                  </td>
                </tr>
              ) : (
                logs.map((log) => {
                  const isThreat = log.threat_detected;
                  return (
                    <tr key={log.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-indigo-400">
                        #{log.id}
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-semibold text-slate-200 block">
                          {log.scan_type === 'PII_DETECTION'
                            ? 'PII Redaction'
                            : log.scan_type === 'PROMPT_INJECTION'
                            ? 'Firewall Sandbox'
                            : 'Model Audit'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-slate-300 block truncate max-w-[140px]">
                          {log.user_email || `User #${log.user_id}`}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {isThreat ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/30">
                            <ShieldAlert className="w-3 h-3" />
                            INTERCEPTED
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                            <ShieldCheck className="w-3 h-3" />
                            CLEAN
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`font-mono font-bold px-2 py-0.5 rounded text-[11px] ${
                            log.risk_score >= 70
                              ? 'bg-rose-500/20 text-rose-300'
                              : log.risk_score >= 35
                              ? 'bg-amber-500/20 text-amber-300'
                              : 'bg-emerald-500/20 text-emerald-300'
                          }`}
                        >
                          {log.risk_score}/100
                        </span>
                      </td>
                      <td className="py-3 px-4 max-w-[220px] truncate text-slate-400 font-mono">
                        {log.input_payload}
                      </td>
                      <td className="py-3 px-4 text-slate-500 whitespace-nowrap font-mono text-[11px]">
                        {new Date(log.created_at).toLocaleString([], {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => setSelectedLog(log)}
                            className="p-1 rounded hover:bg-slate-700/60 text-slate-400 hover:text-white transition-colors cursor-pointer"
                            title="Inspect JSON analysis"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(log.id)}
                            className="p-1 rounded hover:bg-rose-950/40 text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
                            title="Delete log record"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="px-4 py-3 border-t border-slate-800 bg-slate-950/40 flex items-center justify-between text-xs text-slate-400 font-mono">
          <span>Showing {logs.length} of {total} records</span>
          <span>Ledger: PostgreSQL security_logs</span>
        </div>
      </div>

      {/* Modal Drawer for Deep Inspection */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-3xl max-h-[85vh] overflow-y-auto rounded-xl border border-slate-700 bg-slate-900 p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-400" />
                <h3 className="font-bold text-white text-base">
                  Audit Record #{selectedLog.id} — Deep Telemetry Inspector
                </h3>
              </div>
              <button
                onClick={() => setSelectedLog(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 rounded-lg bg-slate-950 border border-slate-800">
                <div>
                  <span className="text-slate-500 block">Scan Type</span>
                  <span className="font-semibold text-slate-200">{selectedLog.scan_type}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">User Attribution</span>
                  <span className="font-semibold text-slate-200 truncate block">
                    {selectedLog.user_email || `User ${selectedLog.user_id}`}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block">Risk Score</span>
                  <span
                    className={`font-mono font-bold ${
                      selectedLog.risk_score > 50 ? 'text-rose-400' : 'text-emerald-400'
                    }`}
                  >
                    {selectedLog.risk_score} / 100
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block">Logged Timestamp</span>
                  <span className="text-slate-300">
                    {new Date(selectedLog.created_at).toLocaleString()}
                  </span>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-300 block mb-1">Raw Input Payload</label>
                <pre className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 font-mono text-[11px] whitespace-pre-wrap break-all max-h-48 overflow-y-auto">
                  {selectedLog.input_payload}
                </pre>
              </div>

              <div>
                <label className="font-semibold text-slate-300 block mb-1">
                  Full JSONB Verification & Telemetry Result
                </label>
                <pre className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-cyan-300 font-mono text-[11px] whitespace-pre-wrap break-all max-h-72 overflow-y-auto">
                  {JSON.stringify(selectedLog.analysis_result, null, 2)}
                </pre>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setSelectedLog(null)}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold cursor-pointer"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

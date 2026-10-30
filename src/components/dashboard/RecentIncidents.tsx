import React, { useState } from 'react';
import { SecurityLog } from '../../types/index.ts';
import { ShieldAlert, ShieldCheck, Eye, Terminal, FileText, X } from 'lucide-react';

interface RecentIncidentsProps {
  logs: SecurityLog[];
  onViewAll: () => void;
}

export const RecentIncidents: React.FC<RecentIncidentsProps> = ({ logs, onViewAll }) => {
  const [selectedLog, setSelectedLog] = useState<SecurityLog | null>(null);

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/60 backdrop-blur-md p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="text-sm font-semibold text-white flex items-center gap-2">
            <Terminal className="w-4 h-4 text-cyan-400" />
            Live Security Interceptions & Audit Feed
          </h4>
          <p className="text-xs text-slate-400">Stream of AI queries analyzed and firewall enforcement decisions</p>
        </div>
        <button
          onClick={onViewAll}
          className="text-xs text-indigo-400 hover:text-indigo-300 font-medium hover:underline flex items-center gap-1 cursor-pointer"
        >
          View Full Audit Trail →
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider font-mono">
              <th className="pb-3 font-semibold">Incident / Type</th>
              <th className="pb-3 font-semibold">Verdict</th>
              <th className="pb-3 font-semibold">Risk Score</th>
              <th className="pb-3 font-semibold">Payload Summary</th>
              <th className="pb-3 font-semibold">Time</th>
              <th className="pb-3 font-semibold text-right">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {logs.slice(0, 6).map((log) => {
              const isThreat = log.threat_detected;
              const isPii = log.scan_type === 'PII_DETECTION';
              const isInjection = log.scan_type === 'PROMPT_INJECTION';

              return (
                <tr key={log.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      {isThreat ? (
                        <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></div>
                      ) : (
                        <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                      )}
                      <div>
                        <span className="font-semibold text-slate-200 block">
                          {isPii ? 'PII Inspection' : isInjection ? 'LLM Firewall Test' : 'Model Output Audit'}
                        </span>
                        <span className="text-[10px] font-mono text-slate-500">LOG-#{log.id}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3">
                    {isThreat ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/30">
                        <ShieldAlert className="w-3 h-3" />
                        {isPii ? 'PII MASKED' : 'BLOCKED'}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                        <ShieldCheck className="w-3 h-3" />
                        CLEAN / ALLOWED
                      </span>
                    )}
                  </td>
                  <td className="py-3">
                    <span
                      className={`font-mono font-bold px-2 py-0.5 rounded text-[11px] ${
                        log.risk_score >= 70
                          ? 'bg-rose-500/20 text-rose-300'
                          : log.risk_score >= 40
                          ? 'bg-amber-500/20 text-amber-300'
                          : 'bg-emerald-500/20 text-emerald-300'
                      }`}
                    >
                      {log.risk_score}/100
                    </span>
                  </td>
                  <td className="py-3 max-w-[260px] truncate text-slate-400 font-mono">
                    {log.input_payload}
                  </td>
                  <td className="py-3 text-slate-500 whitespace-nowrap">
                    {new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td className="py-3 text-right">
                    <button
                      onClick={() => setSelectedLog(log)}
                      className="p-1 rounded hover:bg-slate-700/60 text-slate-400 hover:text-white transition-colors cursor-pointer"
                      title="Inspect analysis result"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Modal Drawer for Incident Details */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-xl border border-slate-700 bg-slate-900 p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-400" />
                <h3 className="font-bold text-white text-base">
                  Security Incident Report #{selectedLog.id}
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
                  <span className="text-slate-500 block">Risk Score</span>
                  <span className={`font-mono font-bold ${selectedLog.risk_score > 50 ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {selectedLog.risk_score} / 100
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block">Status</span>
                  <span className={`font-semibold ${selectedLog.threat_detected ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {selectedLog.threat_detected ? 'Threat Intercepted' : 'Clean'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block">Logged Time</span>
                  <span className="text-slate-300">{new Date(selectedLog.created_at).toLocaleString()}</span>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-300 block mb-1">Raw Input Payload</label>
                <pre className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 font-mono text-[11px] whitespace-pre-wrap break-all max-h-40 overflow-y-auto">
                  {selectedLog.input_payload}
                </pre>
              </div>

              <div>
                <label className="font-semibold text-slate-300 block mb-1">
                  Structured Analysis Result (JSONB)
                </label>
                <pre className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-indigo-300 font-mono text-[11px] whitespace-pre-wrap break-all max-h-60 overflow-y-auto">
                  {JSON.stringify(selectedLog.analysis_result, null, 2)}
                </pre>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setSelectedLog(null)}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold cursor-pointer"
              >
                Close Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

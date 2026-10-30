import React, { useState } from 'react';
import { scanPiiApi } from '../../services/api.ts';
import { PiiScanResult } from '../../types/index.ts';
import {
  FileKey2,
  ShieldCheck,
  ShieldAlert,
  Copy,
  Check,
  Download,
  RotateCcw,
  Sparkles,
  Lock,
  ArrowRight,
  Sliders,
} from 'lucide-react';

const PRESETS = [
  {
    name: 'FinTech Customer Support Ticket',
    description: 'Contains customer SSN, full credit card PAN, and personal contact email',
    text: `Customer Johnathon Vance (SSN: 342-99-8712) requested immediate chargeback assistance for transaction #TX-8921 on card 4532-8821-9043-1123.
Please refund $450.00 to his verified email john.vance@fintech-pay.com or call him at +1 (555) 234-5678.
Customer home address: 742 Evergreen Terrace, Springfield, OR.`,
  },
  {
    name: 'DevOps Secret Leakage in Log',
    description: 'Exposes AWS access keys, GitHub personal token, and internal database IPs',
    text: `[2026-10-30T04:12:00Z] ERROR worker-node-04: Failed to authenticate to S3 bucket 'prod-customer-vault'.
Using AWS_ACCESS_KEY_ID: AKIAIOSFODNN7EXAMPLE and AWS_SECRET_ACCESS_KEY: wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
GitHub Token fallback attempt: ghp_99a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2
Internal Cluster Gateway: 10.244.15.89 with DB connection pool at 192.168.1.104:5432`,
  },
  {
    name: 'Healthcare Patient Medical Note',
    description: 'PHI containing patient identifiers, diagnosis, and Medicare ID',
    text: `Patient Clinical Summary:
Patient: Eleanor Rigby (DOB: 1984-06-15, SSN: 123-45-6789)
Medicare / Medical Record # MRN-8849204
Admitted for acute respiratory distress. Primary physician Dr. Marcus Chen (m.chen@memorialhospital.org).
Prescription: 50mg Lisinopril daily. Emergency contact daughter Sarah at 415-555-0199.`,
  },
  {
    name: 'Clean Enterprise Query',
    description: 'Safe text with zero sensitive data or confidential tokens',
    text: `Please review our Q4 corporate software release roadmap and summarize the top three milestones scheduled for the cloud infrastructure migration initiative.`,
  },
];

export const PiiScannerView: React.FC<{ onLogCreated?: () => void }> = ({ onLogCreated }) => {
  const [inputText, setInputText] = useState(PRESETS[0].text);
  const [redactionMode, setRedactionMode] = useState<'token' | 'asterisk' | 'hash'>('token');
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState<PiiScanResult | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleScan = async (overrideText?: string, overrideMode?: 'token' | 'asterisk' | 'hash') => {
    const textToScan = overrideText !== undefined ? overrideText : inputText;
    const mode = overrideMode !== undefined ? overrideMode : redactionMode;

    if (!textToScan.trim()) {
      setError('Please enter or select text to scan.');
      return;
    }

    setIsScanning(true);
    setError(null);

    try {
      const response = await scanPiiApi(textToScan, mode);
      setResult(response.analysis);
      if (onLogCreated) onLogCreated();
    } catch (err: any) {
      setError(err.message || 'Scanning failed.');
    } finally {
      setIsScanning(false);
    }
  };

  const handleCopy = () => {
    if (result?.redacted_text) {
      navigator.clipboard.writeText(result.redacted_text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    if (!result?.redacted_text) return;
    const blob = new Blob([result.redacted_text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `trustguard-redacted-text-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <FileKey2 className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-white font-sans">
              PII & Sensitive Data Redaction Studio
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time regex scanning with Google Gemini semantic verification. Masks direct identifiers, PANs, SSNs, and API credentials.
          </p>
        </div>

        {/* Preset Selector */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-mono text-slate-400">Presets:</span>
          {PRESETS.map((p, idx) => (
            <button
              key={p.name}
              onClick={() => {
                setInputText(p.text);
                handleScan(p.text, redactionMode);
              }}
              className="px-2.5 py-1 rounded-md text-xs font-medium border border-slate-800 bg-slate-900 hover:border-slate-700 hover:bg-slate-800 text-slate-300 transition-colors cursor-pointer"
              title={p.description}
            >
              Preset #{idx + 1}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="p-3 rounded-lg bg-rose-950/50 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 shrink-0 text-rose-400" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Scanner Workspace: Dual-Pane */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Panel */}
        <div className="flex flex-col rounded-xl border border-slate-800 bg-slate-900/60 backdrop-blur-md overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800/80 bg-slate-950/40">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-200">Raw Input Text</span>
              <span className="text-[10px] font-mono text-slate-400">({inputText.length} chars)</span>
            </div>
            <button
              onClick={() => setInputText('')}
              className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Clear
            </button>
          </div>

          <div className="p-4 flex-1 flex flex-col">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Paste raw text, logs, support transcripts, or confidential prompts to scan for PII..."
              rows={12}
              className="w-full flex-1 p-3 rounded-lg bg-slate-950/80 border border-slate-800 focus:border-indigo-500 focus:outline-none text-slate-200 font-mono text-xs resize-none transition-colors"
            />

            {/* Redaction Mode Switcher & Scan Action */}
            <div className="mt-4 pt-3 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 font-medium">Masking Style:</span>
                <div className="inline-flex rounded-lg bg-slate-950 border border-slate-800 p-0.5 text-xs">
                  {(['token', 'asterisk', 'hash'] as const).map((m) => (
                    <button
                      key={m}
                      onClick={() => {
                        setRedactionMode(m);
                        if (result) handleScan(inputText, m);
                      }}
                      className={`px-2.5 py-1 rounded-md capitalize font-mono text-[11px] transition-colors cursor-pointer ${
                        redactionMode === m
                          ? 'bg-indigo-600 text-white font-semibold shadow'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {m === 'token' ? '[TOKEN]' : m === 'asterisk' ? '****' : 'SHA-256'}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={() => handleScan()}
                disabled={isScanning}
                className="px-5 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-60"
              >
                {isScanning ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Scanning PII...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5 text-indigo-200" />
                    Inspect & Redact
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Output Panel */}
        <div className="flex flex-col rounded-xl border border-slate-800 bg-slate-900/60 backdrop-blur-md overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800/80 bg-slate-950/40">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-200">Redacted Output</span>
              {result && (
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold border ${
                    result.has_pii
                      ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                      : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                  }`}
                >
                  {result.has_pii ? `${result.detected_entities.length} PII Masked` : 'Zero PII'}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                disabled={!result}
                className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs flex items-center gap-1 transition-colors cursor-pointer disabled:opacity-40"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
              <button
                onClick={handleDownload}
                disabled={!result}
                className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs flex items-center gap-1 transition-colors cursor-pointer disabled:opacity-40"
                title="Download as .txt"
              >
                <Download className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="p-4 flex-1 flex flex-col justify-between">
            <div className="flex-1 p-3 rounded-lg bg-slate-950/80 border border-slate-800 text-slate-200 font-mono text-xs whitespace-pre-wrap break-all overflow-y-auto min-h-[220px]">
              {result ? (
                result.redacted_text
              ) : (
                <span className="text-slate-500 italic">
                  Run the scanner to generate pseudonymized text compliant with GDPR Art 4 & HIPAA Safe Harbor.
                </span>
              )}
            </div>

            {/* Performance Metric Bar */}
            {result && (
              <div className="mt-3 flex items-center justify-between text-[11px] font-mono text-slate-400 pt-2 border-t border-slate-800/80">
                <span>Latency: {result.processing_time_ms}ms</span>
                <span className="flex items-center gap-1">
                  Risk Level:
                  <span
                    className={`font-bold ${
                      result.risk_level === 'CRITICAL'
                        ? 'text-rose-400'
                        : result.risk_level === 'HIGH'
                        ? 'text-amber-400'
                        : 'text-emerald-400'
                    }`}
                  >
                    {result.risk_level} ({result.risk_score}/100)
                  </span>
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Detected Entities & Regulatory Impact */}
      {result && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Detected Entity Chips */}
          <div className="lg:col-span-2 rounded-xl border border-slate-800 bg-slate-900/60 backdrop-blur-md p-5">
            <h4 className="text-sm font-semibold text-white mb-1 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              Detected Entities & Redaction Map ({result.detected_entities.length})
            </h4>
            <p className="text-xs text-slate-400 mb-4">
              Entities matched by token signatures and semantic entity recognition
            </p>

            {result.detected_entities.length === 0 ? (
              <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 text-center text-xs text-slate-400">
                No sensitive entities identified in this payload.
              </div>
            ) : (
              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {result.detected_entities.map((entity, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800 flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-2 overflow-hidden">
                      <span className="px-2 py-0.5 rounded font-mono font-bold text-[10px] bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 shrink-0">
                        {entity.type}
                      </span>
                      <span className="font-mono text-slate-300 truncate">{entity.value}</span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[10px] font-mono text-slate-500">
                        {Math.round(entity.confidence * 100)}% conf
                      </span>
                      {entity.complianceTags.map((tag) => (
                        <span
                          key={tag}
                          className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Compliance Impact Assessment */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 backdrop-blur-md p-5 flex flex-col justify-between">
            <div>
              <h4 className="text-sm font-semibold text-white mb-1 flex items-center gap-2">
                <Lock className="w-4 h-4 text-emerald-400" />
                Regulatory Exposure Risk
              </h4>
              <p className="text-xs text-slate-400 mb-4">Statutory liability if leaked unredacted</p>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs">
                  <span className="text-slate-300 font-medium">GDPR Exposure</span>
                  <span
                    className={`font-mono font-bold px-2 py-0.5 rounded text-[10px] ${
                      result.compliance_impact.gdpr_violation_risk === 'SEVERE'
                        ? 'bg-rose-500/20 text-rose-300'
                        : result.compliance_impact.gdpr_violation_risk === 'MODERATE'
                        ? 'bg-amber-500/20 text-amber-300'
                        : 'bg-emerald-500/20 text-emerald-300'
                    }`}
                  >
                    {result.compliance_impact.gdpr_violation_risk}
                  </span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs">
                  <span className="text-slate-300 font-medium">HIPAA Exposure</span>
                  <span
                    className={`font-mono font-bold px-2 py-0.5 rounded text-[10px] ${
                      result.compliance_impact.hipaa_violation_risk === 'SEVERE'
                        ? 'bg-rose-500/20 text-rose-300'
                        : result.compliance_impact.hipaa_violation_risk === 'MODERATE'
                        ? 'bg-amber-500/20 text-amber-300'
                        : 'bg-emerald-500/20 text-emerald-300'
                    }`}
                  >
                    {result.compliance_impact.hipaa_violation_risk}
                  </span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs">
                  <span className="text-slate-300 font-medium">PCI-DSS Exposure</span>
                  <span
                    className={`font-mono font-bold px-2 py-0.5 rounded text-[10px] ${
                      result.compliance_impact.pci_dss_violation_risk === 'SEVERE'
                        ? 'bg-rose-500/20 text-rose-300'
                        : result.compliance_impact.pci_dss_violation_risk === 'MODERATE'
                        ? 'bg-amber-500/20 text-amber-300'
                        : 'bg-emerald-500/20 text-emerald-300'
                    }`}
                  >
                    {result.compliance_impact.pci_dss_violation_risk}
                  </span>
                </div>
              </div>
            </div>

            <p className="text-[11px] text-slate-400 mt-4 pt-3 border-t border-slate-800">
              {result.compliance_impact.summary}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import { scanAuditApi } from '../../services/api.ts';
import { ModelAuditResult } from '../../types/index.ts';
import {
  Sparkles,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  RotateCcw,
  Scale,
  Brain,
  CheckCircle2,
} from 'lucide-react';

const AUDIT_PRESETS = [
  {
    name: 'Biased Hiring Recommendation',
    category: 'Gender & Age Bias',
    output: `Based on our automated screening algorithm, we recommend filtering out candidates over 45 for the fast-paced Senior DevOps Engineer role, as younger male engineers demonstrate higher sprint completion velocities in our historical dataset.`,
  },
  {
    name: 'Hallucinated Legal Citation',
    category: 'Hallucination',
    output: `According to the landmark Supreme Court ruling in Vandelay Industries v. United States (2024) 598 U.S. 312, AI service providers are granted absolute blanket immunity from all data breach liabilities under Title IV of the Digital Commerce Restoration Act.`,
  },
  {
    name: 'Toxic Content & Aggression',
    category: 'Toxicity',
    output: `You are completely incompetent for asking such a primitive question. Anyone with a basic brain would already understand how to configure a database pool without bothering an AI. Stop wasting compute time.`,
  },
  {
    name: 'Clean Compliant AI Summary',
    category: 'Clean Baseline',
    output: `To ensure robust compliance with GDPR Article 32, organizations must implement pseudonymization and encryption of personal data, regular testing of security efficacy, and rapid incident notification mechanisms within 72 hours of detection.`,
  },
];

export const ModelAuditView: React.FC<{ onLogCreated?: () => void }> = ({ onLogCreated }) => {
  const [contentInput, setContentInput] = useState(AUDIT_PRESETS[0].output);
  const [isAuditing, setIsAuditing] = useState(false);
  const [result, setResult] = useState<ModelAuditResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAudit = async (overrideContent?: string) => {
    const textToScan = overrideContent !== undefined ? overrideContent : contentInput;
    if (!textToScan.trim()) {
      setError('Please provide model output text to audit.');
      return;
    }

    setIsAuditing(true);
    setError(null);

    try {
      const response = await scanAuditApi(textToScan);
      setResult(response.analysis);
      if (onLogCreated) onLogCreated();
    } catch (err: any) {
      setError(err.message || 'Audit failed.');
    } finally {
      setIsAuditing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Scale className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-white font-sans">
              AI Trust, Bias & Output Safety Audit
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Evaluate LLM responses for algorithmic bias, hallucination risks, toxicity, and EU AI Act Title III compliance.
          </p>
        </div>

        {/* Presets */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-mono text-slate-400">Presets:</span>
          {AUDIT_PRESETS.map((p, idx) => (
            <button
              key={p.name}
              onClick={() => {
                setContentInput(p.output);
                handleAudit(p.output);
              }}
              className="px-2.5 py-1 rounded-md text-xs font-medium border border-slate-800 bg-slate-900 hover:border-slate-700 hover:bg-slate-800 text-slate-300 transition-colors cursor-pointer"
            >
              #{idx + 1} {p.category}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="p-3 rounded-lg bg-rose-950/50 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
          <span>{error}</span>
        </div>
      )}

      {/* Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Text Box */}
        <div className="flex flex-col rounded-xl border border-slate-800 bg-slate-900/60 backdrop-blur-md overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800/80 bg-slate-950/40">
            <span className="text-xs font-semibold text-slate-200">
              Generated Model Output to Audit
            </span>
            <button
              onClick={() => setContentInput('')}
              className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Clear
            </button>
          </div>

          <div className="p-4 flex-1 flex flex-col justify-between">
            <textarea
              value={contentInput}
              onChange={(e) => setContentInput(e.target.value)}
              placeholder="Paste AI generated text, agent summaries, or bot replies to test for bias, toxicity, or hallucinations..."
              rows={11}
              className="w-full p-3 rounded-lg bg-slate-950/80 border border-slate-800 focus:border-amber-500 focus:outline-none text-slate-200 font-mono text-xs resize-none"
            />

            <div className="mt-4 pt-3 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => handleAudit()}
                disabled={isAuditing}
                className="px-5 py-2 rounded-lg bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white text-xs font-bold shadow-lg shadow-amber-600/30 flex items-center gap-2 transition-all cursor-pointer disabled:opacity-60"
              >
                {isAuditing ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Auditing Output...
                  </>
                ) : (
                  <>
                    <Brain className="w-3.5 h-3.5 text-amber-200" />
                    Audit Safety & Bias
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Audit Results */}
        <div className="flex flex-col rounded-xl border border-slate-800 bg-slate-900/60 backdrop-blur-md overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800/80 bg-slate-950/40">
            <span className="text-xs font-semibold text-slate-200">
              Safety & Trust Audit Card
            </span>
          </div>

          <div className="p-5 flex-1 flex flex-col justify-between">
            {result ? (
              <div className="space-y-4">
                {/* Metric Dials */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center">
                    <span className="text-[10px] uppercase font-mono text-slate-500 block">
                      Overall Score
                    </span>
                    <span
                      className={`text-2xl font-bold font-mono ${
                        result.overall_score >= 80
                          ? 'text-emerald-400'
                          : result.overall_score >= 50
                          ? 'text-amber-400'
                          : 'text-rose-400'
                      }`}
                    >
                      {result.overall_score}
                      <span className="text-xs text-slate-500 font-normal">/100</span>
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center">
                    <span className="text-[10px] uppercase font-mono text-slate-500 block">
                      Toxicity Risk
                    </span>
                    <span
                      className={`text-2xl font-bold font-mono ${
                        result.toxicity_score > 30 ? 'text-rose-400' : 'text-emerald-400'
                      }`}
                    >
                      {result.toxicity_score}%
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center">
                    <span className="text-[10px] uppercase font-mono text-slate-500 block">
                      Hallucination
                    </span>
                    <span
                      className={`text-2xl font-bold font-mono ${
                        result.hallucination_probability > 30 ? 'text-amber-400' : 'text-emerald-400'
                      }`}
                    >
                      {result.hallucination_probability}%
                    </span>
                  </div>
                </div>

                {/* Safety Categories */}
                <div>
                  <span className="text-[11px] font-semibold text-slate-400 block mb-2">
                    Safety Category Check:
                  </span>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {Object.entries(result.safety_categories).map(([category, status]) => (
                      <div
                        key={category}
                        className="p-2 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between"
                      >
                        <span className="capitalize text-slate-300">
                          {category.replace('_', ' ')}
                        </span>
                        <span
                          className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold ${
                            status === 'CLEAN'
                              ? 'bg-emerald-500/20 text-emerald-300'
                              : status === 'WARNING'
                              ? 'bg-amber-500/20 text-amber-300'
                              : 'bg-rose-500/20 text-rose-300'
                          }`}
                        >
                          {status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bias Indicators */}
                {result.bias_indicators.length > 0 && (
                  <div>
                    <span className="text-[11px] font-semibold text-slate-400 block mb-1.5">
                      Identified Bias Vectors:
                    </span>
                    <div className="space-y-2">
                      {result.bias_indicators.map((b, i) => (
                        <div
                          key={i}
                          className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs"
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-semibold text-rose-400">{b.category}</span>
                            <span className="font-mono text-[10px] text-slate-500">
                              Severity: {b.score}/100
                            </span>
                          </div>
                          <p className="text-slate-300 text-[11px]">{b.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Recommendation */}
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs">
                  <span className="font-semibold text-indigo-300 block mb-1">
                    Remediation & Governance Advice:
                  </span>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    {result.recommendation}
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-500">
                <Sparkles className="w-12 h-12 text-slate-700 mb-3" />
                <h4 className="text-sm font-semibold text-slate-300 mb-1">
                  Model Output Audit Sandbox Ready
                </h4>
                <p className="text-xs text-slate-500 max-w-sm">
                  Run an audit on any AI generated output to receive an instant trust, bias, and hallucination evaluation.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

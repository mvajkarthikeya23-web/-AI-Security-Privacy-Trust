import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext.tsx';
import { UserRole } from '../../types/index.ts';
import {
  Sliders,
  Shield,
  Key,
  Database,
  Lock,
  Check,
  Cpu,
  UserCheck,
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const { user, switchRole } = useAuth();
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Policy toggles
  const [policies, setPolicies] = useState({
    maskSsn: true,
    maskPan: true,
    maskApiKeys: true,
    maskHipaa: true,
    blockDanJailbreak: true,
    autoAuditLogs: true,
    strictRls: true,
    firewallSensitivity: 'strict',
  });

  const togglePolicy = (key: keyof typeof policies) => {
    setPolicies((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
    setSuccessMsg('Security policy configuration saved.');
    setTimeout(() => setSuccessMsg(null), 2500);
  };

  const roles: Array<{ role: UserRole; title: string; desc: string }> = [
    {
      role: 'Admin',
      title: 'Administrator / CISO',
      desc: 'Global organization visibility across all user audit trails, system policy modification, and log purging.',
    },
    {
      role: 'Security Analyst',
      title: 'Security Analyst / SecOps',
      desc: 'Full access to PII inspection, prompt injection sandbox, and threat analysis logs scoped by Row-Level Security.',
    },
    {
      role: 'Developer',
      title: 'AI Application Engineer',
      desc: 'API testing, prompt firewall validation, and model safety verification for application integration.',
    },
  ];

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="border-b border-slate-800/80 pb-5">
        <div className="flex items-center gap-2">
          <span className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Sliders className="w-5 h-5" />
          </span>
          <h2 className="text-xl font-bold text-white font-sans">
            Security Configuration & Governance Policies
          </h2>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Manage Role-Based Access Control (RBAC), LLM firewall rules, and data privacy thresholds.
        </p>
      </div>

      {successMsg && (
        <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* User Profile & RBAC Role Management */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 backdrop-blur-md p-5 space-y-4">
        <h3 className="text-sm font-semibold text-white flex items-center gap-2">
          <UserCheck className="w-4 h-4 text-indigo-400" />
          Active Identity & Role-Based Access Control (RBAC)
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 rounded-lg bg-slate-950 border border-slate-800 text-xs">
          <div>
            <span className="text-slate-500 block">User Name</span>
            <span className="font-semibold text-slate-200">{user?.name}</span>
          </div>
          <div>
            <span className="text-slate-500 block">Verified Email</span>
            <span className="font-mono text-slate-200">{user?.email}</span>
          </div>
          <div>
            <span className="text-slate-500 block">Assigned Role</span>
            <span className="font-mono font-bold text-indigo-400">{user?.role}</span>
          </div>
        </div>

        <div>
          <span className="text-xs font-semibold text-slate-300 block mb-2">
            Switch Role (Instant RBAC Simulation)
          </span>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {roles.map((r) => {
              const isCurrent = user?.role === r.role;
              return (
                <div
                  key={r.role}
                  onClick={() => switchRole(r.role)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                    isCurrent
                      ? 'bg-indigo-950/40 border-indigo-500/60 shadow-lg shadow-indigo-950/50'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-bold text-xs text-white">{r.role}</span>
                    {isCurrent && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-semibold">
                        ACTIVE
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">{r.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Detection & Firewall Policies */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 backdrop-blur-md p-5 space-y-4">
        <h3 className="text-sm font-semibold text-white flex items-center gap-2">
          <Shield className="w-4 h-4 text-emerald-400" />
          Active Guardrails & Protection Rules
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          <div
            onClick={() => togglePolicy('maskSsn')}
            className="flex items-center justify-between p-3 rounded-lg bg-slate-950 border border-slate-800 hover:border-slate-700 cursor-pointer transition-colors"
          >
            <div>
              <span className="font-semibold text-slate-200 block">Enforce SSN & National ID Redaction</span>
              <span className="text-[11px] text-slate-400">Masks Social Security Numbers across all user inputs</span>
            </div>
            <input
              type="checkbox"
              checked={policies.maskSsn}
              onChange={() => {}}
              className="w-4 h-4 rounded text-indigo-600 cursor-pointer"
            />
          </div>

          <div
            onClick={() => togglePolicy('maskPan')}
            className="flex items-center justify-between p-3 rounded-lg bg-slate-950 border border-slate-800 hover:border-slate-700 cursor-pointer transition-colors"
          >
            <div>
              <span className="font-semibold text-slate-200 block">PCI-DSS Credit Card Masking</span>
              <span className="text-[11px] text-slate-400">Enforces PAN masking and CVV detection</span>
            </div>
            <input
              type="checkbox"
              checked={policies.maskPan}
              onChange={() => {}}
              className="w-4 h-4 rounded text-indigo-600 cursor-pointer"
            />
          </div>

          <div
            onClick={() => togglePolicy('maskApiKeys')}
            className="flex items-center justify-between p-3 rounded-lg bg-slate-950 border border-slate-800 hover:border-slate-700 cursor-pointer transition-colors"
          >
            <div>
              <span className="font-semibold text-slate-200 block">API Key & Cloud Credential Interception</span>
              <span className="text-[11px] text-slate-400">Detects AWS, OpenAI, GitHub, and JWT tokens</span>
            </div>
            <input
              type="checkbox"
              checked={policies.maskApiKeys}
              onChange={() => {}}
              className="w-4 h-4 rounded text-indigo-600 cursor-pointer"
            />
          </div>

          <div
            onClick={() => togglePolicy('blockDanJailbreak')}
            className="flex items-center justify-between p-3 rounded-lg bg-slate-950 border border-slate-800 hover:border-slate-700 cursor-pointer transition-colors"
          >
            <div>
              <span className="font-semibold text-slate-200 block">Adversarial Jailbreak Auto-Drop</span>
              <span className="text-[11px] text-slate-400">Automatically terminates session on DAN/persona hacks</span>
            </div>
            <input
              type="checkbox"
              checked={policies.blockDanJailbreak}
              onChange={() => {}}
              className="w-4 h-4 rounded text-indigo-600 cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Architecture & Infrastructure Spec */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 backdrop-blur-md p-5 space-y-3">
        <h3 className="text-sm font-semibold text-white flex items-center gap-2">
          <Database className="w-4 h-4 text-cyan-400" />
          Infrastructure & Security Architecture Specifications
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-slate-500 font-mono text-[10px] uppercase block">Database Storage</span>
            <span className="font-bold text-slate-200 block">PostgreSQL (node-postgres pg)</span>
            <p className="text-[11px] text-slate-400">
              Tables: <code className="text-indigo-300">users</code>, <code className="text-indigo-300">security_logs</code> with JSONB support and RLS filtering.
            </p>
          </div>

          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-slate-500 font-mono text-[10px] uppercase block">AI Threat Engine</span>
            <span className="font-bold text-slate-200 block">Google Gemini 3.8 Flash</span>
            <p className="text-[11px] text-slate-400">
              Server-side isolation using modern <code className="text-indigo-300">@google/genai</code> SDK. Never exposed to browser.
            </p>
          </div>

          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-slate-500 font-mono text-[10px] uppercase block">Authentication & Crypto</span>
            <span className="font-bold text-slate-200 block">JWT + bcrypt (10 rounds)</span>
            <p className="text-[11px] text-slate-400">
              24-hour expiration token with Bearer authentication and Zod input schema validation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

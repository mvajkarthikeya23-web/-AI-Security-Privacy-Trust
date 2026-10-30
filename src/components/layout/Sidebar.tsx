import React from 'react';
import {
  LayoutDashboard,
  FileKey2,
  ShieldAlert,
  ClipboardList,
  Sparkles,
  Sliders,
  Database,
  Lock,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.tsx';

interface SidebarProps {
  currentTab: string;
  onNavigate: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentTab, onNavigate }) => {
  const { user } = useAuth();

  const navItems = [
    {
      id: 'dashboard',
      label: 'Security Posture',
      icon: LayoutDashboard,
      badge: 'Live',
      badgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    },
    {
      id: 'pii-scanner',
      label: 'PII Redaction Studio',
      icon: FileKey2,
      badge: 'GDPR/HIPAA',
      badgeColor: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
    },
    {
      id: 'threat-scanner',
      label: 'Prompt Injection Firewall',
      icon: ShieldAlert,
      badge: 'LLM Defense',
      badgeColor: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
    },
    {
      id: 'model-audit',
      label: 'Bias & Safety Audit',
      icon: Sparkles,
      badge: 'EU AI Act',
      badgeColor: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    },
    {
      id: 'audit-logs',
      label: 'Incident Audit Trails',
      icon: ClipboardList,
      badge: 'RLS',
      badgeColor: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
    },
    {
      id: 'settings',
      label: 'Policy & Governance',
      icon: Sliders,
    },
  ];

  return (
    <aside className="w-64 border-r border-slate-800/80 bg-slate-950/60 backdrop-blur-md flex flex-col justify-between p-4 shrink-0 hidden md:flex">
      <div className="space-y-6">
        {/* Navigation Links */}
        <div>
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold px-3 block mb-2">
            Defense Modules
          </span>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/80'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[9px] font-mono px-1.5 py-0.5 rounded border ${
                        isActive
                          ? 'bg-white/20 text-white border-white/30'
                          : item.badgeColor
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Database & Governance Status */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-3 text-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-300 flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-cyan-400" />
              SQL Audit Ledger
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          </div>
          <div className="text-[10px] text-slate-400 font-mono space-y-1">
            <div className="flex justify-between">
              <span>Isolation:</span>
              <span className="text-indigo-400">Row-Level (RLS)</span>
            </div>
            <div className="flex justify-between">
              <span>Active Role:</span>
              <span className="text-emerald-400 font-bold">{user?.role || 'Guest'}</span>
            </div>
            <div className="flex justify-between">
              <span>AI Engine:</span>
              <span className="text-cyan-400">Gemini 3.8 Flash</span>
            </div>
          </div>
        </div>
      </div>

      {/* Security Advisory footer */}
      <div className="pt-4 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center gap-2">
        <Lock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
        <span>End-to-End Enterprise Encryption Active</span>
      </div>
    </aside>
  );
};

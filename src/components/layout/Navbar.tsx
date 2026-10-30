import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext.tsx';
import { UserRole } from '../../types/index.ts';
import {
  ShieldCheck,
  UserCheck,
  ChevronDown,
  LogOut,
  Zap,
  Sparkles,
  Lock,
} from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  onNavigate: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, onNavigate }) => {
  const { user, logout, switchRole, quickLoginDemo } = useAuth();
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showDemoMenu, setShowDemoMenu] = useState(false);

  const roles: UserRole[] = ['Admin', 'Security Analyst', 'Developer'];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md px-4 lg:px-8 py-3 flex items-center justify-between">
      {/* Brand & Status */}
      <div className="flex items-center gap-4">
        <div
          onClick={() => onNavigate('dashboard')}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 p-0.5 shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-indigo-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-white tracking-tight text-base font-sans">
                TrustGuard
              </span>
              <span className="text-[10px] px-1.5 py-0.2 rounded font-mono font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                AI
              </span>
            </div>
            <span className="text-[10px] text-slate-400 block -mt-0.5">
              Enterprise AI Security & Governance
            </span>
          </div>
        </div>

        {/* Live Defense Status Badge */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/90 border border-slate-800 text-[11px] font-mono">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-emerald-400 font-semibold tracking-wide">FIREWALL ARMED</span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-400">Gemini 3.8 Flash Active</span>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Quick Demo Accounts Switcher */}
        <div className="relative">
          <button
            onClick={() => {
              setShowDemoMenu(!showDemoMenu);
              setShowRoleMenu(false);
            }}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-indigo-500/30 bg-indigo-950/30 text-indigo-300 hover:bg-indigo-900/40 text-xs font-semibold cursor-pointer transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden md:inline">Demo Profiles</span>
            <ChevronDown className="w-3.5 h-3.5" />
          </button>

          {showDemoMenu && (
            <div className="absolute right-0 mt-2 w-64 rounded-xl border border-slate-800 bg-slate-900/95 backdrop-blur-xl p-2 shadow-2xl z-50">
              <div className="px-3 py-2 border-b border-slate-800 text-[11px] text-slate-400">
                <span className="font-semibold text-white block">Switch RBAC Persona</span>
                Instant 1-click test login for different security roles:
              </div>
              <div className="py-1 space-y-1">
                <button
                  onClick={() => {
                    quickLoginDemo('admin@trustguard.ai');
                    setShowDemoMenu(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-800 transition-colors flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="font-semibold text-slate-200 block">Sarah Connor</span>
                    <span className="text-[10px] text-slate-400">admin@trustguard.ai</span>
                  </div>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                    Admin
                  </span>
                </button>

                <button
                  onClick={() => {
                    quickLoginDemo('analyst@trustguard.ai');
                    setShowDemoMenu(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-800 transition-colors flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="font-semibold text-slate-200 block">Alex Rivera</span>
                    <span className="text-[10px] text-slate-400">analyst@trustguard.ai</span>
                  </div>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    Analyst
                  </span>
                </button>

                <button
                  onClick={() => {
                    quickLoginDemo('dev@trustguard.ai');
                    setShowDemoMenu(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-800 transition-colors flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="font-semibold text-slate-200 block">Jordan Lee</span>
                    <span className="text-[10px] text-slate-400">dev@trustguard.ai</span>
                  </div>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                    Developer
                  </span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User Role Badge & Dropdown */}
        {user ? (
          <div className="relative">
            <button
              onClick={() => {
                setShowRoleMenu(!showRoleMenu);
                setShowDemoMenu(false);
              }}
              className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-lg border border-slate-800 bg-slate-900 hover:bg-slate-800/80 transition-colors cursor-pointer"
            >
              <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-indigo-500 to-cyan-500 flex items-center justify-center text-xs font-bold text-white uppercase">
                {user.name.charAt(0)}
              </div>
              <div className="text-left hidden sm:block">
                <span className="text-xs font-semibold text-slate-200 block leading-tight">
                  {user.name.split(' ')[0]}
                </span>
                <span className="text-[10px] font-mono text-indigo-400 block -mt-0.5">
                  {user.role}
                </span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {showRoleMenu && (
              <div className="absolute right-0 mt-2 w-56 rounded-xl border border-slate-800 bg-slate-900/95 backdrop-blur-xl p-2 shadow-2xl z-50">
                <div className="px-3 py-2 border-b border-slate-800 text-xs">
                  <span className="font-semibold text-white block">{user.name}</span>
                  <span className="text-[10px] font-mono text-slate-400">{user.email}</span>
                </div>

                <div className="py-2 border-b border-slate-800">
                  <span className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold px-3 block mb-1">
                    Toggle RBAC Role
                  </span>
                  {roles.map((r) => (
                    <button
                      key={r}
                      onClick={() => {
                        switchRole(r);
                        setShowRoleMenu(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 rounded-md text-xs font-medium flex items-center justify-between ${
                        user.role === r
                          ? 'bg-indigo-600/20 text-indigo-300 font-semibold'
                          : 'text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <span>{r}</span>
                      {user.role === r && <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => {
                    logout();
                    setShowRoleMenu(false);
                  }}
                  className="w-full text-left px-3 py-2 mt-1 rounded-md text-xs text-rose-400 hover:bg-rose-950/30 flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Sign Out
                </button>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={() => onNavigate('login')}
            className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold cursor-pointer shadow-md shadow-indigo-600/30 transition-all"
          >
            Sign In
          </button>
        )}
      </div>
    </header>
  );
};

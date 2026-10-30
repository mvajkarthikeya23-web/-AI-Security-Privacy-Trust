import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext.tsx';
import { ShieldCheck, Lock, Mail, ArrowRight, Sparkles, AlertCircle } from 'lucide-react';

interface LoginViewProps {
  onNavigate: (tab: string) => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onNavigate }) => {
  const { login, quickLoginDemo } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await login(email, password);
      onNavigate('dashboard');
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickDemo = async (demoEmail: string) => {
    setError(null);
    setIsLoading(true);
    try {
      await quickLoginDemo(demoEmail);
      onNavigate('dashboard');
    } catch (err: any) {
      setError(err.message || 'Demo login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Card Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-cyan-400 p-0.5 mx-auto shadow-xl shadow-indigo-600/20">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-indigo-400" />
            </div>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white font-sans">
            TrustGuard AI Portal
          </h1>
          <p className="text-xs text-slate-400">
            Enterprise Security, Privacy & AI Governance Platform
          </p>
        </div>

        {/* Login Box */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 backdrop-blur-xl p-6 shadow-2xl space-y-5">
          {error && (
            <div className="p-3 rounded-lg bg-rose-950/50 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Corporate Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="analyst@trustguard.ai"
                  className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:border-indigo-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:border-indigo-500 focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-60"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Logins */}
          <div className="pt-4 border-t border-slate-800">
            <span className="text-[11px] font-mono text-slate-400 block mb-2.5 flex items-center gap-1.5 font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              1-Click Demo Profiles:
            </span>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <button
                type="button"
                onClick={() => handleQuickDemo('admin@trustguard.ai')}
                className="p-2 rounded-lg bg-slate-950 border border-slate-800 hover:border-rose-500/50 hover:bg-rose-950/20 text-slate-300 hover:text-white transition-colors cursor-pointer text-center"
              >
                <span className="font-bold text-[11px] text-rose-400 block">Admin</span>
                <span className="text-[9px] text-slate-500">CISO</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemo('analyst@trustguard.ai')}
                className="p-2 rounded-lg bg-slate-950 border border-slate-800 hover:border-amber-500/50 hover:bg-amber-950/20 text-slate-300 hover:text-white transition-colors cursor-pointer text-center"
              >
                <span className="font-bold text-[11px] text-amber-400 block">Analyst</span>
                <span className="text-[9px] text-slate-500">SecOps</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemo('dev@trustguard.ai')}
                className="p-2 rounded-lg bg-slate-950 border border-slate-800 hover:border-cyan-500/50 hover:bg-cyan-950/20 text-slate-300 hover:text-white transition-colors cursor-pointer text-center"
              >
                <span className="font-bold text-[11px] text-cyan-400 block">Dev</span>
                <span className="text-[9px] text-slate-500">Engineer</span>
              </button>
            </div>
          </div>
        </div>

        {/* Link to Register */}
        <p className="text-center text-xs text-slate-400">
          Need a new security account?{' '}
          <button
            onClick={() => onNavigate('register')}
            className="text-indigo-400 hover:underline font-semibold cursor-pointer"
          >
            Register new user
          </button>
        </p>
      </div>
    </div>
  );
};

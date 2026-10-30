import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext.tsx';
import { Navbar } from './components/layout/Navbar.tsx';
import { Sidebar } from './components/layout/Sidebar.tsx';
import { DashboardView } from './components/dashboard/DashboardView.tsx';
import { PiiScannerView } from './components/scanner/PiiScannerView.tsx';
import { ThreatScannerView } from './components/scanner/ThreatScannerView.tsx';
import { ModelAuditView } from './components/scanner/ModelAuditView.tsx';
import { AuditLogTable } from './components/audit/AuditLogTable.tsx';
import { SettingsView } from './components/settings/SettingsView.tsx';
import { LoginView } from './components/auth/LoginView.tsx';
import { RegisterView } from './components/auth/RegisterView.tsx';
import {
  LayoutDashboard,
  FileKey2,
  ShieldAlert,
  ClipboardList,
  Sparkles,
  Sliders,
} from 'lucide-react';

function MainApp() {
  const { user, isLoading } = useAuth();
  const [currentTab, setCurrentTab] = useState<string>('dashboard');

  // Handle URL hash changes for easy bookmarking and navigation
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#/', '').replace('#', '');
      if (['dashboard', 'pii-scanner', 'threat-scanner', 'model-audit', 'audit-logs', 'settings', 'login', 'register'].includes(hash)) {
        setCurrentTab(hash);
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateTo = (tab: string) => {
    setCurrentTab(tab);
    window.location.hash = `#/${tab}`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-400 font-mono text-xs gap-3">
        <div className="w-8 h-8 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin"></div>
        <span>INITIALIZING TRUSTGUARD AI FIREWALL...</span>
      </div>
    );
  }

  // Render standalone auth portals if selected
  if (currentTab === 'login') {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col">
        <Navbar currentTab={currentTab} onNavigate={navigateTo} />
        <main className="flex-1 flex items-center justify-center p-4">
          <LoginView onNavigate={navigateTo} />
        </main>
      </div>
    );
  }

  if (currentTab === 'register') {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col">
        <Navbar currentTab={currentTab} onNavigate={navigateTo} />
        <main className="flex-1 flex items-center justify-center p-4">
          <RegisterView onNavigate={navigateTo} />
        </main>
      </div>
    );
  }

  const mobileNavItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'pii-scanner', label: 'PII', icon: FileKey2 },
    { id: 'threat-scanner', label: 'Threats', icon: ShieldAlert },
    { id: 'model-audit', label: 'Safety', icon: Sparkles },
    { id: 'audit-logs', label: 'Logs', icon: ClipboardList },
    { id: 'settings', label: 'Policy', icon: Sliders },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Top Enterprise Header */}
      <Navbar currentTab={currentTab} onNavigate={navigateTo} />

      {/* Main Layout Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Collapsible Sidebar */}
        <Sidebar currentTab={currentTab} onNavigate={navigateTo} />

        {/* Dynamic Center Stage Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 pb-20 md:pb-8">
          <div className="max-w-7xl mx-auto">
            {currentTab === 'dashboard' && <DashboardView onNavigate={navigateTo} />}
            {currentTab === 'pii-scanner' && <PiiScannerView />}
            {currentTab === 'threat-scanner' && <ThreatScannerView />}
            {currentTab === 'model-audit' && <ModelAuditView />}
            {currentTab === 'audit-logs' && <AuditLogTable />}
            {currentTab === 'settings' && <SettingsView />}
          </div>
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 border-t border-slate-800 backdrop-blur-lg px-2 py-2 flex items-center justify-around">
        {mobileNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => navigateTo(item.id)}
              className={`flex flex-col items-center gap-1 py-1 px-2 rounded-lg text-[10px] font-medium transition-colors ${
                isActive ? 'text-indigo-400 font-bold' : 'text-slate-400'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}

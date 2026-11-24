import React from 'react';
import { 
  Layers, Search, CheckCircle, Network, MapPin, 
  Settings, Zap, ShieldCheck, FileText, Activity 
} from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, onLaunchDemo, apiOnline }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Layers, badge: null },
    { id: 'convergence', label: 'Convergence Studio', icon: Network, badge: 'Core MVP' },
    { id: 'database', label: 'Scheme Database', icon: Search, badge: '25 Schemes' },
    { id: 'eligibility', label: 'Eligibility Checker', icon: CheckCircle, badge: null },
    { id: 'district', label: 'District (Sehore, MP)', icon: MapPin, badge: 'Pilot' },
    { id: 'admin', label: 'Admin Panel', icon: Settings, badge: null }
  ];

  return (
    <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur-md sticky top-0 z-50">
      {/* Top National Strip */}
      <div className="h-1 w-full bg-gradient-to-r from-amber-500 via-white to-emerald-600" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-800 flex items-center justify-center shadow-lg shadow-blue-500/20 border border-blue-400/30">
              <Network className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-blue-400 via-indigo-200 to-emerald-400 bg-clip-text text-transparent">
                  SchemeConnect AI
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-950 text-blue-400 border border-blue-800 font-mono">
                  SEG-6
                </span>
              </div>
              <p className="text-[11px] text-slate-400 leading-tight">
                Government Scheme Intelligence & Convergence Engine
              </p>
            </div>
          </div>

          {/* Quick Demo Scenario Trigger */}
          <div className="hidden lg:flex items-center gap-3">
            <button
              onClick={onLaunchDemo}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-semibold shadow-md shadow-emerald-900/40 border border-emerald-400/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
              title="Launch Live Demonstration: Sehore Agricultural Convergence"
            >
              <Zap className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
              <span>⚡ Live Demo: Sehore Farmer Convergence</span>
            </button>

            {/* API Status Pill */}
            <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border ${
              apiOnline 
                ? 'bg-emerald-950/60 text-emerald-400 border-emerald-800/60' 
                : 'bg-amber-950/60 text-amber-400 border-amber-800/60'
            }`}>
              <span className={`w-2 h-2 rounded-full ${apiOnline ? 'bg-emerald-500 animate-ping' : 'bg-amber-500'}`} />
              <span>{apiOnline ? 'Engine Online' : 'Connecting Engine...'}</span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 overflow-x-auto py-2 scrollbar-none border-t border-slate-800/60">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
                {item.badge && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    isActive 
                      ? 'bg-blue-800 text-blue-100' 
                      : 'bg-slate-800 text-slate-300 border border-slate-700'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

      </div>
    </header>
  );
}

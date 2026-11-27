import React from 'react';
import { 
  Layers, Search, Check, Network, MapPin, 
  Settings, Zap, Shield, Database 
} from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, onLaunchDemo, apiOnline }) {
  const navItems = [
    { id: 'convergence', label: 'Convergence Studio', icon: Network, badge: 'Core MVP' },
    { id: 'dashboard', label: 'Executive Dashboard', icon: Layers, badge: null },
    { id: 'database', label: 'Scheme Database', icon: Search, badge: '25 Schemes' },
    { id: 'eligibility', label: 'Eligibility Checker', icon: Check, badge: null },
    { id: 'district', label: 'District Pilot (Sehore)', icon: MapPin, badge: null },
    { id: 'admin', label: 'Admin Panel', icon: Settings, badge: null }
  ];

  return (
    <header className="border-b border-[rgba(104,93,84,0.45)] bg-[#232323]/95 backdrop-blur-md sticky top-0 z-50">
      {/* 1px Taupe Accent Hairline at ~35% Opacity */}
      <div className="h-[1px] w-full bg-[#A39382]/35" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-[10px] bg-[#383634] border border-[#685D54]/70 flex items-center justify-center text-[#E5DED2] shrink-0">
              <Network className="w-4 h-4" strokeWidth={1.5} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-lg tracking-[-0.02em] text-[#FBF7F4]">
                  CIVORA
                </span>
                <span className="text-xs text-[#A39382] font-normal hidden sm:inline">
                  • SchemeConnect AI
                </span>
              </div>
              <p className="text-[11px] text-[#A39382] leading-none mt-0.5">
                Centralized Scheme Intelligence & Strategic Convergence
              </p>
            </div>
          </div>

          {/* Quick Demo Scenario Trigger & Status */}
          <div className="flex items-center gap-4">
            {/* Ghost Button: Sehore Farmer Live Convergence */}
            <button
              onClick={onLaunchDemo}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[10px] border border-[#A39382]/70 text-[#E5DED2] bg-transparent hover:bg-[#E5DED2]/10 hover:border-[#E5DED2] text-xs font-medium transition-all"
              title="Launch Live Demonstration: Sehore Agricultural Convergence"
            >
              <Zap className="w-3.5 h-3.5 text-[#E5DED2]" strokeWidth={1.5} />
              <span>Sehore Farmer Live Convergence</span>
            </button>

            {/* API Status: Small Dot + Text, No Pill Border */}
            <div className="flex items-center gap-2 text-xs font-mono text-[#E5DED2]">
              <span className={`w-2 h-2 rounded-full ${apiOnline ? 'bg-[#6FCF97]' : 'bg-[#A39382]'} animate-pulse`} />
              <span>{apiOnline ? 'System Online' : 'Connecting...'}</span>
            </div>
          </div>
        </div>

        {/* Tab Navigation: Underline-style with Accent Underline, Scrollbar Hidden */}
        <div className="flex space-x-6 overflow-x-auto scrollbar-none border-t border-[rgba(104,93,84,0.45)]">
          {navItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 pb-3 pt-3 text-xs whitespace-nowrap transition-colors border-b-2 -mb-[1px] ${
                  isActive
                    ? 'border-[#E5DED2] text-[#FBF7F4] font-semibold'
                    : 'border-transparent text-[#A39382] hover:text-[#E5DED2] font-normal'
                }`}
              >
                <IconComponent className={`w-3.5 h-3.5 ${isActive ? 'text-[#E5DED2]' : 'text-[#A39382]'}`} strokeWidth={1.5} />
                <span>{item.label}</span>
                {item.badge && (
                  <span className="text-[11px] text-[#A39382] font-normal ml-0.5">
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

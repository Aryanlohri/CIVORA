import React from 'react';
import { 
  Network, ArrowRight, CheckCircle2, ShieldCheck, 
  Users, MapPin, Zap, Building2, TrendingUp, Layers, ExternalLink
} from 'lucide-react';

export default function DashboardView({ summaryData, onLaunchDemo, onNavigateTab }) {
  const kpis = summaryData?.kpis || {
    total_schemes_active: 25,
    convergence_links_mapped: 13,
    development_objectives: 4,
    total_direct_benefit_pool_inr: 2248000,
    pilot_district: "Sehore, Madhya Pradesh",
    pilot_convergence_readiness: "94.5%"
  };

  const sectors = summaryData?.sector_distribution || [
    { sector: 'Agriculture', count: 11 },
    { sector: 'Rural Development', count: 4 },
    { sector: 'Women & Child', count: 3 },
    { sector: 'Financial Inclusion & MSME', count: 4 },
    { sector: 'Health', count: 1 },
    { sector: 'Water & Sanitation', count: 1 },
    { sector: 'Skill & Employment', count: 1 }
  ];

  const departments = summaryData?.department_distribution || [
    { department: 'Department of Agriculture & Farmers Welfare', count: 8 },
    { department: 'Department of Rural Development', count: 4 },
    { department: 'Department of MSME', count: 3 },
    { department: 'Department of Revenue & Farmers Welfare MP', count: 1 },
    { department: 'Women & Child Development Department MP', count: 1 },
    { department: 'Ministry of Jal Shakti', count: 1 },
    { department: 'Department of Renewable Energy', count: 1 }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Hero Showcase Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-900/80 via-indigo-950/90 to-slate-900 border border-blue-500/30 p-8 shadow-2xl">
        {/* Glow circles */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 text-xs font-semibold mb-4">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping" />
            <span>SEG-6 Recommended MVP Scope • SchemeConnect AI</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
            Centralized Scheme Intelligence & <br />
            <span className="bg-gradient-to-r from-blue-400 via-teal-300 to-emerald-400 bg-clip-text text-transparent">
              Strategic Convergence Mapping Platform
            </span>
          </h1>

          <p className="mt-3 text-slate-300 text-sm sm:text-base leading-relaxed max-w-3xl">
            Solves fragmented scheme governance by bridging departments, discovering verified citizen eligibility, 
            and mapping how multiple complementary government schemes work together to achieve unified development objectives.
          </p>

          {/* Demonstration Action CTA */}
          <div className="mt-6 flex flex-wrap items-center gap-4">
            <button
              onClick={onLaunchDemo}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold text-sm shadow-lg shadow-emerald-950/50 flex items-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98] border border-emerald-300/30"
            >
              <Zap className="w-4 h-4 text-amber-300 animate-pulse" />
              <span>Launch Sehore Agri-Convergence Demo</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onNavigateTab('convergence')}
              className="px-5 py-3 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 font-semibold text-sm border border-slate-700 flex items-center gap-2 transition-colors"
            >
              <Network className="w-4 h-4 text-blue-400" />
              <span>Open Convergence Studio</span>
            </button>

            <button
              onClick={() => onNavigateTab('database')}
              className="px-5 py-3 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 font-semibold text-sm border border-slate-700 flex items-center gap-2 transition-colors"
            >
              <span>Explore 25 Verified Schemes</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Verified Schemes</span>
            <div className="p-2 rounded-xl bg-blue-950/80 text-blue-400 border border-blue-800/60">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">{kpis.total_schemes_active}</span>
            <span className="text-xs text-blue-400 font-semibold">Central + MP State</span>
          </div>
          <p className="mt-1 text-xs text-slate-400">100% verified against official ministry gazettes</p>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Convergence Links</span>
            <div className="p-2 rounded-xl bg-emerald-950/80 text-emerald-400 border border-emerald-800/60">
              <Network className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">{kpis.convergence_links_mapped}+</span>
            <span className="text-xs text-emerald-400 font-semibold">Synergy Rules</span>
          </div>
          <p className="mt-1 text-xs text-slate-400">Co-funding, complementary & sequential links</p>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pilot District Readiness</span>
            <div className="p-2 rounded-xl bg-indigo-950/80 text-indigo-400 border border-indigo-800/60">
              <MapPin className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">{kpis.pilot_convergence_readiness}</span>
            <span className="text-xs text-indigo-400 font-semibold">Sehore (M.P.)</span>
          </div>
          <p className="mt-1 text-xs text-slate-400">Bhopal Division • 138.4k farming families</p>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Strategic Objectives</span>
            <div className="p-2 rounded-xl bg-purple-950/80 text-purple-400 border border-purple-800/60">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">{kpis.development_objectives}</span>
            <span className="text-xs text-purple-400 font-semibold">Action Clusters</span>
          </div>
          <p className="mt-1 text-xs text-slate-400">Farmer, Women, Habitat & Artisan packages</p>
        </div>

      </div>

      {/* Sector & Department Distribution Grids */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Sector Distribution */}
        <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Sector-Wise Scheme Distribution
              </h3>
            </div>
            <span className="text-xs text-slate-400 font-mono">7 Key Sectors</span>
          </div>

          <div className="space-y-3">
            {sectors.map((s, idx) => {
              const pct = Math.round((s.count / 25) * 100);
              return (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-300 font-medium">{s.sector}</span>
                    <span className="text-slate-400 font-mono">{s.count} schemes ({pct}%)</span>
                  </div>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Department Distribution */}
        <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Departmental Coverage & Stakeholders
              </h3>
            </div>
            <span className="text-xs text-slate-400 font-mono">Ministries</span>
          </div>

          <div className="space-y-3">
            {departments.slice(0, 6).map((d, idx) => {
              return (
                <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs">
                  <span className="text-slate-200 font-medium truncate max-w-[280px]" title={d.department}>
                    {d.department}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800/60 font-mono font-bold">
                    {d.count} Schemes
                  </span>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Team Division & Deliverables Banner */}
      <div className="bg-slate-900/60 border border-slate-800/80 p-6 rounded-2xl shadow-lg">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
          <Users className="w-4 h-4 text-blue-400" />
          Project Team Structure & Core Deliverables (5 Members)
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
          <div className="bg-slate-950/60 border border-slate-800 p-3.5 rounded-xl">
            <div className="font-bold text-white">Aryan Lohri</div>
            <div className="text-blue-400 font-medium text-[11px]">Frontend Development</div>
            <p className="text-slate-400 mt-1 text-[11px]">Unified Dashboard, search & interactive UI</p>
          </div>
          <div className="bg-slate-950/60 border border-slate-800 p-3.5 rounded-xl">
            <div className="font-bold text-white">Abhiraj Kumar</div>
            <div className="text-blue-400 font-medium text-[11px]">Backend Development</div>
            <p className="text-slate-400 mt-1 text-[11px]">FastAPI endpoints, REST schemas & security</p>
          </div>
          <div className="bg-slate-950/60 border border-emerald-800/60 p-3.5 rounded-xl bg-emerald-950/10">
            <div className="font-bold text-emerald-400">Milan Kohli</div>
            <div className="text-emerald-300 font-medium text-[11px]">ML / Data Science</div>
            <p className="text-slate-400 mt-1 text-[11px]">Convergence engine, synergy logic & conflict detector</p>
          </div>
          <div className="bg-slate-950/60 border border-slate-800 p-3.5 rounded-xl">
            <div className="font-bold text-white">Kamal Gangwar</div>
            <div className="text-blue-400 font-medium text-[11px]">Database & Data Collection</div>
            <p className="text-slate-400 mt-1 text-[11px]">25+ verified schemes, PostgreSQL & cleaning</p>
          </div>
          <div className="bg-slate-950/60 border border-slate-800 p-3.5 rounded-xl">
            <div className="font-bold text-white">Arsalan</div>
            <div className="text-blue-400 font-medium text-[11px]">Visualization & Integration</div>
            <p className="text-slate-400 mt-1 text-[11px]">Convergence graph, maps & PDF reports</p>
          </div>
        </div>
      </div>

    </div>
  );
}

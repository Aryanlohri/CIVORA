import React, { useState, useEffect } from 'react';
import { 
  MapPin, Building2, Users, TrendingUp, CheckCircle2, 
  Layers, Droplets, ShieldCheck, Sprout, ArrowRight, Zap, Phone
} from 'lucide-react';
import { api } from '../api';

export default function DistrictDashboardView({ onLaunchDemo }) {
  const [district, setDistrict] = useState('Sehore');
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadDistrictData(district);
  }, [district]);

  const loadDistrictData = async (distName) => {
    setLoading(true);
    try {
      const data = await api.getDistrictProfile(distName);
      if (data) setProfile(data);
    } catch (err) {
      console.error("Failed to load district:", err);
    } finally {
      setLoading(false);
    }
  };

  const sehoreBlocks = [
    { name: 'Ashta', families: 41200, smallMarginalPct: 78.4, priority: 'Wheat & Soybean Intensive, High Drip Need', convergenceRate: '95%' },
    { name: 'Sehore', families: 32400, smallMarginalPct: 75.2, priority: 'Peri-urban Vegetables & Micro-Enterprises', convergenceRate: '96%' },
    { name: 'Ichhawar', families: 23100, smallMarginalPct: 81.0, priority: 'Rainfed Pulses & Watershed Soil Rejuvenation', convergenceRate: '92%' },
    { name: 'Nasrullaganj (Bherunda)', families: 21900, smallMarginalPct: 74.8, priority: 'Narmada Basin Irrigation & Solar Pumps', convergenceRate: '94%' },
    { name: 'Budhni', families: 19800, smallMarginalPct: 72.5, priority: 'Farm Mechanization & Agribusiness Incubation', convergenceRate: '93%' }
  ];

  const saturationIndicators = [
    { name: 'Direct Cash Transfer (PM-KISAN + MMKKY)', coverage: 94, status: 'Near Universal', icon: TrendingUp, color: 'emerald' },
    { name: 'Soil Health Card Profiling (SHC)', coverage: 85, status: 'High Saturation', icon: Sprout, color: 'blue' },
    { name: 'Crop Insurance Underwriting (PMFBY)', coverage: 78, status: 'Substantial', icon: ShieldCheck, color: 'indigo' },
    { name: 'Micro-Irrigation (PMKSY Drip & Sprinkler)', coverage: 46, status: 'Prime Convergence Gap', icon: Droplets, color: 'amber' },
    { name: 'Solar Agriculture Pumps (PM-KUSUM)', coverage: 29, status: 'High Growth Opportunity', icon: Zap, color: 'rose' }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-blue-950 text-blue-400 border border-blue-800 uppercase tracking-wider font-mono">
              Module 5 • District Implementation Analytics
            </span>
          </div>
          <h2 className="text-2xl font-extrabold text-white mt-1 tracking-tight flex items-center gap-2">
            <MapPin className="w-6 h-6 text-emerald-400" />
            <span>Sehore District Convergence Dashboard</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Madhya Pradesh • Bhopal Division • Administrative Command Center
          </p>
        </div>

        {/* District Switcher */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-medium">Switch District:</span>
          <select
            value={district}
            onChange={e => setDistrict(e.target.value)}
            className="p-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 text-xs font-semibold focus:outline-none focus:border-blue-500"
          >
            <option value="Sehore">Sehore (Pilot Demo)</option>
            <option value="Bhopal">Bhopal</option>
            <option value="Raisen">Raisen</option>
            <option value="Vidisha">Vidisha</option>
          </select>
        </div>
      </div>

      {/* Top Indicators */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-lg">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Farming Families</span>
          <div className="text-2xl font-extrabold text-white mt-1">
            {profile?.farming_families_count?.toLocaleString() || '138,400'}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Active agricultural households</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-lg">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Small & Marginal Farmers</span>
          <div className="text-2xl font-extrabold text-emerald-400 mt-1">
            {profile?.small_marginal_pct || 76.8}%
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Landholding under 5.0 acres</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-lg">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Convergence Readiness Index</span>
          <div className="text-2xl font-extrabold text-blue-400 mt-1">
            {profile?.convergence_readiness_score || 94.5}%
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Inter-departmental alignment grade</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-lg">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Active Convergence Schemes</span>
          <div className="text-2xl font-extrabold text-purple-400 mt-1">
            {profile?.active_schemes_count || 25} Schemes
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Central and MP State combined</p>
        </div>
      </div>

      {/* Sehore Agrarian Pilot Showcase Banner */}
      <div className="bg-gradient-to-r from-emerald-950/60 via-slate-900 to-slate-900 border border-emerald-500/40 p-6 rounded-3xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-mono font-bold uppercase mb-2">
            Target Demonstration Scenario
          </div>
          <h3 className="text-lg font-bold text-white">
            Transforming Smallholder Agriculture in Sehore District
          </h3>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Sehore’s 76.8% smallholder density makes it the prime candidate for SEG-6 convergence. 
            By connecting PM-KISAN cash flows with PMKSY micro-irrigation and PMFBY crop insurance, 
            district authorities can lift family net incomes by 35-40% while mitigating climate risks.
          </p>
        </div>
        <button
          onClick={onLaunchDemo}
          className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-950/50 flex items-center justify-center gap-2 transition-colors shrink-0"
        >
          <Zap className="w-4 h-4 text-amber-300" />
          <span>Launch Convergence in Sehore</span>
        </button>
      </div>

      {/* Scheme Saturation & Gap Indicators */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl">
        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-4 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-blue-400" />
          Scheme Coverage Saturation vs. Convergence Gaps in Sehore
        </h3>

        <div className="space-y-4">
          {saturationIndicators.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-200 font-semibold flex items-center gap-2">
                    <Icon className="w-3.5 h-3.5 text-blue-400" />
                    <span>{item.name}</span>
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 font-mono font-bold">{item.coverage}%</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                      item.coverage > 75 
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' 
                        : (item.coverage > 40 ? 'bg-amber-950 text-amber-300 border border-amber-800' : 'bg-rose-950 text-rose-300 border border-rose-800')
                    }`}>
                      {item.status}
                    </span>
                  </div>
                </div>
                <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                  <div 
                    className={`h-full rounded-full ${
                      item.coverage > 75 
                        ? 'bg-emerald-500' 
                        : (item.coverage > 40 ? 'bg-amber-500' : 'bg-blue-500')
                    }`}
                    style={{ width: `${item.coverage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Block-Level Convergence Saturation Table */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl">
        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-4 flex items-center gap-2">
          <Layers className="w-4 h-4 text-emerald-400" />
          Block-Level Convergence Priorities (Sehore District)
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="pb-3 font-semibold">Block Name</th>
                <th className="pb-3 font-semibold">Farming Families</th>
                <th className="pb-3 font-semibold">Small/Marginal Share</th>
                <th className="pb-3 font-semibold">Priority Development Need</th>
                <th className="pb-3 font-semibold text-right">Convergence Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {sehoreBlocks.map((b, idx) => (
                <tr key={idx} className="hover:bg-slate-950/40">
                  <td className="py-3 font-bold text-white">{b.name}</td>
                  <td className="py-3 text-slate-300 font-mono">{b.families.toLocaleString()}</td>
                  <td className="py-3 text-emerald-400 font-bold">{b.smallMarginalPct}%</td>
                  <td className="py-3 text-slate-300">{b.priority}</td>
                  <td className="py-3 text-right">
                    <span className="px-2 py-0.5 rounded bg-blue-950 text-blue-300 font-mono font-bold border border-blue-800/60">
                      {b.convergenceRate}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* District Authority Directory */}
      <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl shadow-lg">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
          <Building2 className="w-4 h-4 text-blue-400" />
          Lead Nodal Convergence Authorities in Sehore District
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="bg-slate-950/60 border border-slate-800 p-3.5 rounded-xl">
            <span className="text-[10px] text-blue-400 font-bold uppercase">Apex Leadership</span>
            <div className="font-bold text-white mt-1">Office of the District Collector & Magistrate</div>
            <p className="text-slate-400 text-[11px] mt-0.5">District Collectorate, Sehore (M.P.)</p>
          </div>

          <div className="bg-slate-950/60 border border-slate-800 p-3.5 rounded-xl">
            <span className="text-[10px] text-emerald-400 font-bold uppercase">Nodal Department</span>
            <div className="font-bold text-white mt-1">Deputy Director of Agriculture</div>
            <p className="text-slate-400 text-[11px] mt-0.5">Kisan Bhawan, Sehore (M.P.)</p>
          </div>

          <div className="bg-slate-950/60 border border-slate-800 p-3.5 rounded-xl">
            <span className="text-[10px] text-purple-400 font-bold uppercase">Rural Execution</span>
            <div className="font-bold text-white mt-1">Chief Executive Officer, Zila Panchayat</div>
            <p className="text-slate-400 text-[11px] mt-0.5">Zila Panchayat Sehore (M.P.)</p>
          </div>
        </div>
      </div>

    </div>
  );
}

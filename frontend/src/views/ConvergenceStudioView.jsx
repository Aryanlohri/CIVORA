import React, { useState, useEffect } from 'react';
import { 
  Network, Download, Sparkles, CheckCircle2, ShieldAlert, 
  MapPin, Users, Award, Droplets, Banknote, ShieldCheck, Sprout,
  ArrowRight, FileText, ChevronRight, Layers, RefreshCw
} from 'lucide-react';
import ConvergenceGraph from '../components/ConvergenceGraph';
import { api } from '../api';

export default function ConvergenceStudioView({ onSelectScheme, initialObjectiveKey = 'farmer_development' }) {
  const [objectives, setObjectives] = useState([]);
  const [selectedObjectiveKey, setSelectedObjectiveKey] = useState(initialObjectiveKey);
  const [selectedDistrict, setSelectedDistrict] = useState('Sehore');
  const [selectedBlock, setSelectedBlock] = useState('All Blocks');
  const [targetPersona, setTargetPersona] = useState('Small and Marginal Farmers (< 5 acres)');
  
  const [loading, setLoading] = useState(false);
  const [downloadingPdf, setDownloadingPdf] = useState(false);
  const [convergenceResult, setConvergenceResult] = useState(null);

  // Load objectives on mount
  useEffect(() => {
    async function loadData() {
      const objs = await api.getObjectives();
      if (objs && objs.length > 0) {
        setObjectives(objs);
      }
      // Run initial convergence
      runConvergence(initialObjectiveKey, 'Sehore');
    }
    loadData();
  }, []);

  const runConvergence = async (objKey = selectedObjectiveKey, dist = selectedDistrict) => {
    setLoading(true);
    try {
      const res = await api.calculateConvergence({
        objective_key: objKey,
        state: 'Madhya Pradesh',
        division: 'Bhopal',
        district: dist,
        target_group: targetPersona
      });
      if (res) {
        setConvergenceResult(res);
      }
    } catch (err) {
      console.error("Convergence calculation error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleObjectiveChange = (key) => {
    setSelectedObjectiveKey(key);
    // Auto adjust persona based on objective
    if (key === 'farmer_development') {
      setTargetPersona('Small and Marginal Farmers (< 5 acres)');
    } else if (key === 'women_empowerment') {
      setTargetPersona('Rural Women SHG Members (Aged 21-60)');
    } else if (key === 'rural_livelihoods') {
      setTargetPersona('Landless Rural Laborers & Houseless Families');
    } else if (key === 'artisan_support') {
      setTargetPersona('Traditional Village Artisans & Craftsmen');
    }
    runConvergence(key, selectedDistrict);
  };

  const handleDownloadPdf = async () => {
    setDownloadingPdf(true);
    try {
      await api.downloadConvergencePdf({
        objective_key: selectedObjectiveKey,
        state: 'Madhya Pradesh',
        division: 'Bhopal',
        district: selectedDistrict,
        target_group: targetPersona
      });
    } catch (err) {
      console.error("PDF download error:", err);
      alert("Failed to generate PDF. Make sure FastAPI backend is running.");
    } finally {
      setDownloadingPdf(false);
    }
  };

  const currentObj = objectives.find(o => o.key === selectedObjectiveKey);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Header & Main Differentiator Banner */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 uppercase tracking-wider font-mono">
              Core Innovation • Module 4
            </span>
            <span className="text-xs text-slate-400">Rule-Based Convergence Intelligence</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1.5 tracking-tight">
            Scheme Convergence Engine & Studio
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Goes beyond individual scheme search by evaluating target group overlap, calculating multi-pillar benefits,
            detecting conflicting rules, and generating an interconnected implementation graph for district administrators.
          </p>
        </div>

        {/* PDF Download Button */}
        <button
          onClick={handleDownloadPdf}
          disabled={downloadingPdf || !convergenceResult}
          className="px-5 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-blue-900/40 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98] border border-blue-400/30 shrink-0 disabled:opacity-50"
        >
          {downloadingPdf ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : (
            <Download className="w-4 h-4" />
          )}
          <span>{downloadingPdf ? 'Generating PDF...' : 'Download Official PDF Dossier'}</span>
        </button>
      </div>

      {/* Control Panel: Objective & Location Selection */}
      <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl shadow-lg space-y-5">
        
        {/* Step 1: Objective Selector */}
        <div>
          <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2 mb-2.5">
            <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[11px]">1</span>
            <span>Select Strategic Development Objective</span>
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { 
                key: 'farmer_development', 
                title: 'Farmer Development & Income', 
                desc: 'PM-KISAN + MMKKY + PMKSY + PMFBY + Soil Health Card',
                badge: 'Live Showcase' 
              },
              { 
                key: 'women_empowerment', 
                title: 'Women Empowerment & SHGs', 
                desc: 'Ladli Behna + Lakhpati Didi + Mudra + Ayushman',
                badge: 'Livelihoods' 
              },
              { 
                key: 'rural_livelihoods', 
                title: 'Rural Habitat & Employment', 
                desc: 'MGNREGA + PMAY-G + Jal Jeevan + PKVY Organic',
                badge: 'Infrastructure' 
              },
              { 
                key: 'artisan_support', 
                title: 'Artisan & MSME Modernization', 
                desc: 'PM Vishwakarma + Mudra + MP Udyam Kranti',
                badge: 'Enterprise' 
              }
            ].map(item => (
              <button
                key={item.key}
                onClick={() => handleObjectiveChange(item.key)}
                className={`p-4 rounded-xl text-left border transition-all relative ${
                  selectedObjectiveKey === item.key
                    ? 'bg-blue-950/60 border-blue-500 shadow-md shadow-blue-950/80 text-white ring-1 ring-blue-500'
                    : 'bg-slate-950/50 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                    selectedObjectiveKey === item.key ? 'bg-blue-800 text-blue-200' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {item.badge}
                  </span>
                  {selectedObjectiveKey === item.key && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  )}
                </div>
                <div className="font-bold text-xs text-slate-100">{item.title}</div>
                <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">{item.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Step 2: Location & Persona Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-800/80 text-xs">
          
          <div>
            <label className="text-slate-400 font-medium block mb-1.5 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-blue-400" />
              <span>Location Hierarchy</span>
            </label>
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 font-semibold">
              <span className="text-slate-400">Madhya Pradesh</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
              <span className="text-slate-400">Bhopal</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
              <span className="text-emerald-400">Sehore</span>
            </div>
          </div>

          <div>
            <label className="text-slate-400 font-medium block mb-1.5 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-indigo-400" />
              <span>Block-Level Filter (Sehore)</span>
            </label>
            <select
              value={selectedBlock}
              onChange={e => setSelectedBlock(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 font-semibold focus:outline-none focus:border-blue-500"
            >
              <option value="All Blocks">All Blocks (District Saturation)</option>
              <option value="Sehore">Sehore Block</option>
              <option value="Ashta">Ashta Block (High Agrarian)</option>
              <option value="Ichhawar">Ichhawar Block</option>
              <option value="Budhni">Budhni Block (Industrial/Agrarian)</option>
              <option value="Bherunda">Nasrullaganj (Bherunda)</option>
            </select>
          </div>

          <div>
            <label className="text-slate-400 font-medium block mb-1.5 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-emerald-400" />
              <span>Target Beneficiary Persona</span>
            </label>
            <input
              type="text"
              value={targetPersona}
              onChange={e => setTargetPersona(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 font-semibold focus:outline-none focus:border-blue-500"
            />
          </div>

        </div>

      </div>

      {/* Main Results Container */}
      {convergenceResult && (
        <div className="space-y-6">
          
          {/* Executive Synergy Meter & Impact Scorecard */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            <div className="bg-gradient-to-br from-emerald-950/60 to-slate-900 border border-emerald-500/40 p-5 rounded-2xl shadow-lg flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center shrink-0">
                <Sparkles className="w-7 h-7 text-emerald-400" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
                  Convergence Synergy Score
                </span>
                <div className="text-2xl sm:text-3xl font-extrabold text-white">
                  {convergenceResult.convergence_synergy_score}%
                </div>
                <p className="text-[11px] text-emerald-300 font-medium">
                  Optimal Cross-Departmental Synergy
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-950/60 to-slate-900 border border-blue-500/40 p-5 rounded-2xl shadow-lg flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-blue-500/20 border border-blue-400/40 flex items-center justify-center shrink-0">
                <Award className="w-7 h-7 text-blue-400" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider">
                  Est. Combined Value / Household
                </span>
                <div className="text-2xl sm:text-3xl font-extrabold text-white">
                  ₹{convergenceResult.estimated_annual_combined_value_inr.toLocaleString()}
                </div>
                <p className="text-[11px] text-blue-300 font-medium">
                  Direct Cash + Subsidized Assets Stack
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-950/60 to-slate-900 border border-purple-500/40 p-5 rounded-2xl shadow-lg flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-purple-500/20 border border-purple-400/40 flex items-center justify-center shrink-0">
                <Layers className="w-7 h-7 text-purple-400" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider">
                  Convergent Portfolio
                </span>
                <div className="text-2xl sm:text-3xl font-extrabold text-white">
                  {convergenceResult.total_schemes_count} Schemes
                </div>
                <p className="text-[11px] text-purple-300 font-medium">
                  Covering 4 Strategic Pillars
                </p>
              </div>
            </div>

          </div>

          {/* Interactive Network Graph Visualizer */}
          <ConvergenceGraph 
            graphData={convergenceResult.graph}
            onSelectScheme={onSelectScheme}
          />

          {/* 4-Pillar Functional Benefit Convergence */}
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Award className="w-4 h-4 text-emerald-400" />
                  4-Pillar Functional Benefit Convergence Matrix
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  How different schemes complement each other to solve liquidity, assets, risk, and advisory
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {convergenceResult.complementary_benefits.map((pillar, idx) => (
                <div 
                  key={idx}
                  className="bg-slate-950/70 border border-slate-800 p-4 rounded-xl flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded uppercase font-mono" style={{ backgroundColor: `${pillar.color}20`, color: pillar.color }}>
                        Pillar {idx + 1}
                      </span>
                      <span className="text-xs font-bold text-white font-mono">
                        ₹{pillar.combined_value_inr.toLocaleString()}
                      </span>
                    </div>

                    <h4 className="text-xs font-extrabold text-slate-100">{pillar.pillar_id.toUpperCase()}</h4>
                    <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">{pillar.description}</p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-800/80">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                      Participating Schemes:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {pillar.schemes.map((s, sIdx) => (
                        <span 
                          key={sIdx}
                          className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-200 font-mono font-medium border border-slate-700"
                        >
                          {s.scheme_code}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Common Eligibility & Duplication Safeguards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Common Intersecting Eligibility */}
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-400" />
                Common Intersecting Eligibility (Single-Window Camp)
              </h3>

              <div className="space-y-3 text-xs bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-400">Harmonized Age Range:</span>
                  <span className="text-slate-200 font-bold">{convergenceResult.common_eligibility.age_bracket}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-400">Recommended Income Ceiling:</span>
                  <span className="text-slate-200 font-bold">Up to ₹{convergenceResult.common_eligibility.recommended_income_ceiling_inr.toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-400">Max Landholding Limit:</span>
                  <span className="text-slate-200 font-bold">Up to {convergenceResult.common_eligibility.max_landholding_acres} Acres (Small & Marginal)</span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-1">Universal Single-Window Documents:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {convergenceResult.common_eligibility.common_documents.map((doc, dIdx) => (
                      <span key={dIdx} className="text-[11px] px-2 py-0.5 rounded bg-blue-950/80 text-blue-300 border border-blue-800/60 font-medium">
                        ✓ {doc}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Duplication & Conflict Detection */}
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-amber-400" />
                Duplication Detection & Safeguard Rules
              </h3>

              <div className="space-y-3">
                {convergenceResult.duplications_and_conflicts.length > 0 ? (
                  convergenceResult.duplications_and_conflicts.map((conf, cIdx) => (
                    <div key={cIdx} className="bg-amber-950/20 border border-amber-800/40 p-3.5 rounded-xl text-xs">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-900/60 text-amber-200">
                          {conf.severity}
                        </span>
                        <span className="text-[11px] text-slate-400 font-mono">
                          {conf.schemes_involved?.join(' + ')}
                        </span>
                      </div>
                      <div className="font-bold text-amber-200 mt-1">{conf.title}</div>
                      <p className="text-slate-300 mt-1 text-[11px]">{conf.details}</p>
                      <div className="mt-2 text-[11px] text-emerald-300 bg-slate-950/60 p-2 rounded border border-slate-800">
                        <b>Safeguard:</b> {conf.safeguard_action}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400">No overlapping policy duplications detected.</p>
                )}
              </div>
            </div>

          </div>

          {/* Joint District Implementation SOP */}
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-400" />
              Standard Operating Procedure (SOP) for Sehore District Administration
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {convergenceResult.joint_implementation_sop.map((step, idx) => (
                <div key={idx} className="bg-slate-950/60 border border-slate-800 p-4 rounded-xl flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800 font-mono">
                      {step.timeline}
                    </span>
                    <h4 className="text-xs font-bold text-white mt-2">{step.phase}</h4>
                    <p className="text-[11px] text-slate-400 mt-1"><b>Lead:</b> {step.nodal_agency}</p>
                    
                    <ul className="mt-3 space-y-1.5 text-[11px] text-slate-300">
                      {step.actions.map((act, aIdx) => (
                        <li key={aIdx} className="flex items-start gap-1.5">
                          <span className="text-emerald-400 mt-0.5">•</span>
                          <span>{act}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

    </div>
  );
}

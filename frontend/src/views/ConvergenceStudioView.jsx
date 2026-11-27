import React, { useState, useEffect } from 'react';
import { 
  Network, Download, Check, Shield, MapPin, 
  Layers, Users, Award, RefreshCw, ChevronRight 
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

  useEffect(() => {
    async function loadData() {
      const objs = await api.getObjectives();
      if (objs && objs.length > 0) {
        setObjectives(objs);
      }
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
      alert("Failed to generate PDF. Please ensure the backend service is running.");
    } finally {
      setDownloadingPdf(false);
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-200">
      
      {/* Studio Hero with Faint Radial Glow & 1px Inner Highlight */}
      <div 
        className="relative rounded-[14px] p-6 sm:p-8 border border-[rgba(104,93,84,0.45)] overflow-hidden"
        style={{
          background: 'linear-gradient(180deg, #2B2A29 0%, #232323 100%)',
          boxShadow: 'inset 0 1px 0 rgba(251, 247, 244, 0.06)'
        }}
      >
        <div 
          className="absolute inset-0 pointer-events-none" 
          style={{ background: 'radial-gradient(600px at 20% 0%, rgba(163,147,130,0.09), transparent)' }}
        />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs uppercase tracking-[0.08em] text-[#A39382] font-medium">
                STRATEGIC CONVERGENCE ENGINE
              </span>
              <span className="text-[#A39382]">•</span>
              <span className="text-xs text-[#E5DED2]">Multi-Pillar Synergy Mapping</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-[-0.02em] text-[#FBF7F4]">
              Scheme Convergence Studio
            </h1>
            <p className="text-[15px] text-[#E5DED2] leading-relaxed mt-2">
              Calculates how Central and State welfare programs bundle across four core pillars (Liquidity, Irrigation Assets, Risk Shields, and Soil Health), identifies policy frictions, and outputs an actionable convergence dossier for district authorities.
            </p>
          </div>

          {/* Exactly ONE solid-filled button per screen (Oat #E5DED2 on Charcoal #232323) */}
          <button
            onClick={handleDownloadPdf}
            disabled={downloadingPdf || !convergenceResult}
            className="px-4 py-2.5 rounded-[10px] bg-[#E5DED2] hover:bg-[#FBF7F4] text-[#232323] text-xs font-semibold shadow-sm flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5 active:translate-y-0 shrink-0 disabled:opacity-50"
          >
            {downloadingPdf ? (
              <RefreshCw className="w-4 h-4 animate-spin text-[#232323]" strokeWidth={1.5} />
            ) : (
              <Download className="w-4 h-4 text-[#232323]" strokeWidth={1.5} />
            )}
            <span>{downloadingPdf ? 'Compiling Dossier...' : 'Download Official PDF Report'}</span>
          </button>
        </div>
      </div>

      {/* Control Panel: Objective & Location Selection */}
      <div 
        className="rounded-[14px] border border-[rgba(104,93,84,0.45)] p-6 space-y-6"
        style={{
          background: 'linear-gradient(180deg, #2B2A29 0%, #232323 100%)',
          boxShadow: 'inset 0 1px 0 rgba(251, 247, 244, 0.06)'
        }}
      >
        
        {/* Step 1: Objective Selector */}
        <div>
          <span className="text-xs uppercase tracking-[0.08em] text-[#A39382] font-medium block mb-3">
            SELECT STRATEGIC DEVELOPMENT OBJECTIVE
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { 
                key: 'farmer_development', 
                title: 'Farmer Productivity & Income', 
                desc: 'PM-KISAN + MMKKY + PMKSY + PMFBY + Soil Health Card',
                badge: 'Live Demo' 
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
                badge: 'Habitat' 
              },
              { 
                key: 'artisan_support', 
                title: 'Artisan & MSME Modernization', 
                desc: 'PM Vishwakarma + Mudra + MP Udyam Kranti',
                badge: 'Enterprise' 
              }
            ].map(item => {
              const isSelected = selectedObjectiveKey === item.key;
              return (
                <button
                  key={item.key}
                  onClick={() => handleObjectiveChange(item.key)}
                  className={`p-4 rounded-[14px] text-left transition-all relative ${
                    isSelected
                      ? 'border border-[#A39382]/50 shadow-[0_0_20px_rgba(163,147,130,0.12)] bg-[#2B2A29]'
                      : 'border border-[rgba(104,93,84,0.45)] bg-[#2B2A29] hover:border-[#A39382]/40 hover:-translate-y-0.5'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] px-2 py-0.5 rounded-[6px] bg-[#383634] text-[#A39382] border border-[rgba(104,93,84,0.45)] font-mono">
                      {item.badge}
                    </span>
                    {isSelected && (
                      <span className="text-[#E5DED2]">
                        <Check className="w-3.5 h-3.5" strokeWidth={1.5} />
                      </span>
                    )}
                  </div>
                  <div className="font-semibold text-xs text-[#FBF7F4] tracking-[-0.01em]">{item.title}</div>
                  <p className="text-[11px] text-[#E5DED2] mt-1.5 line-clamp-2 leading-relaxed">{item.desc}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 2: Three Filter Fields Sharing Same Height (40px), Border, and Radius (10px) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-[rgba(104,93,84,0.45)] text-xs">
          
          <div>
            <label className="text-xs uppercase tracking-[0.08em] text-[#A39382] font-medium block mb-1.5">
              ADMINISTRATIVE LOCATION HIERARCHY
            </label>
            <div className="h-10 px-3 rounded-[10px] bg-[#383634] border border-[rgba(104,93,84,0.45)] flex items-center gap-1.5 text-xs text-[#E5DED2]">
              <span>Madhya Pradesh</span>
              <span className="text-[#A39382]">›</span>
              <span>Bhopal</span>
              <span className="text-[#A39382]">›</span>
              <span className="text-[#FBF7F4] font-medium">Sehore District</span>
            </div>
          </div>

          <div>
            <label className="text-xs uppercase tracking-[0.08em] text-[#A39382] font-medium block mb-1.5">
              BLOCK-LEVEL SATURATION FOCUS
            </label>
            <select
              value={selectedBlock}
              onChange={e => setSelectedBlock(e.target.value)}
              className="w-full h-10 px-3 rounded-[10px] bg-[#383634] border border-[rgba(104,93,84,0.45)] text-[#FBF7F4] text-xs font-medium focus:outline-none focus:border-[#E5DED2]/60 transition-colors"
            >
              <option value="All Blocks">All 5 Blocks (District Saturation)</option>
              <option value="Sehore">Sehore Block</option>
              <option value="Ashta">Ashta Block (High Agrarian)</option>
              <option value="Ichhawar">Ichhawar Block</option>
              <option value="Budhni">Budhni Block (Industrial/Agrarian)</option>
              <option value="Bherunda">Nasrullaganj (Bherunda)</option>
            </select>
          </div>

          <div>
            <label className="text-xs uppercase tracking-[0.08em] text-[#A39382] font-medium block mb-1.5">
              TARGET BENEFICIARY PERSONA
            </label>
            <input
              type="text"
              value={targetPersona}
              onChange={e => setTargetPersona(e.target.value)}
              className="w-full h-10 px-3 rounded-[10px] bg-[#383634] border border-[rgba(104,93,84,0.45)] text-[#FBF7F4] text-xs font-medium focus:outline-none focus:border-[#E5DED2]/60 transition-colors"
            />
          </div>

        </div>

      </div>

      {/* Main Results Container */}
      {convergenceResult && (
        <div className="space-y-8">
          
          {/* Executive Synergy Meter & Impact Scorecard */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            <div 
              className="p-5 rounded-[14px] border border-[rgba(104,93,84,0.45)] flex items-center gap-4"
              style={{
                background: 'linear-gradient(180deg, #2B2A29 0%, #232323 100%)',
                boxShadow: 'inset 0 1px 0 rgba(251, 247, 244, 0.06)'
              }}
            >
              <div className="w-14 h-14 rounded-[10px] bg-[#383634] border border-[rgba(104,93,84,0.45)] flex flex-col items-center justify-center shrink-0">
                <span className="text-lg font-mono font-semibold text-[#E5DED2]">
                  {convergenceResult.convergence_synergy_score}%
                </span>
                <span className="text-[9px] uppercase tracking-wider text-[#A39382]">INDEX</span>
              </div>
              <div>
                <span className="text-[11px] uppercase tracking-[0.08em] text-[#A39382] font-medium block">
                  SYNERGY EFFICIENCY INDEX
                </span>
                <div className="text-base font-semibold text-[#FBF7F4] mt-0.5">
                  Optimal Multi-Scheme Stack
                </div>
                <p className="text-xs text-[#E5DED2] mt-0.5">Synchronized Liquidity + Assets + Risk Coverage</p>
              </div>
            </div>

            <div 
              className="p-5 rounded-[14px] border border-[rgba(104,93,84,0.45)] flex items-center gap-4"
              style={{
                background: 'linear-gradient(180deg, #2B2A29 0%, #232323 100%)',
                boxShadow: 'inset 0 1px 0 rgba(251, 247, 244, 0.06)'
              }}
            >
              <div className="w-14 h-14 rounded-[10px] bg-[#383634] border border-[rgba(104,93,84,0.45)] flex items-center justify-center shrink-0 text-[#E5DED2] font-mono text-xl font-semibold">
                ₹
              </div>
              <div>
                <span className="text-[11px] uppercase tracking-[0.08em] text-[#A39382] font-medium block">
                  COMBINED ANNUAL PACKAGE / HOUSEHOLD
                </span>
                <div className="text-xl font-semibold font-mono text-[#FBF7F4] mt-0.5">
                  ₹{convergenceResult.estimated_annual_combined_value_inr.toLocaleString()}
                </div>
                <p className="text-xs text-[#E5DED2] mt-0.5">Direct Cash Transfer + Asset Subsidies</p>
              </div>
            </div>

            <div 
              className="p-5 rounded-[14px] border border-[rgba(104,93,84,0.45)] flex items-center gap-4"
              style={{
                background: 'linear-gradient(180deg, #2B2A29 0%, #232323 100%)',
                boxShadow: 'inset 0 1px 0 rgba(251, 247, 244, 0.06)'
              }}
            >
              <div className="w-14 h-14 rounded-[10px] bg-[#383634] border border-[rgba(104,93,84,0.45)] flex items-center justify-center shrink-0 text-[#FBF7F4] font-mono text-xl font-semibold">
                {convergenceResult.total_schemes_count}
              </div>
              <div>
                <span className="text-[11px] uppercase tracking-[0.08em] text-[#A39382] font-medium block">
                  FLAGSHIP SCHEMES UNIFIED
                </span>
                <div className="text-base font-semibold text-[#FBF7F4] mt-0.5">
                  4 Strategic Development Pillars
                </div>
                <p className="text-xs text-[#E5DED2] mt-0.5">Central & Madhya Pradesh State Synchronized</p>
              </div>
            </div>

          </div>

          {/* Interactive Network Graph Visualizer */}
          <ConvergenceGraph 
            graphData={convergenceResult.graph}
            onSelectScheme={onSelectScheme}
          />

          {/* 4-Pillar Functional Benefit Convergence Matrix */}
          <div 
            className="rounded-[14px] border border-[rgba(104,93,84,0.45)] p-6 sm:p-8 space-y-5"
            style={{
              background: 'linear-gradient(180deg, #2B2A29 0%, #232323 100%)',
              boxShadow: 'inset 0 1px 0 rgba(251, 247, 244, 0.06)'
            }}
          >
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs uppercase tracking-[0.08em] text-[#A39382] font-medium block">
                  FUNCTIONAL PORTFOLIO CONVERGENCE
                </span>
                <h3 className="text-base font-semibold text-[#FBF7F4] mt-0.5">
                  4-Pillar Strategic Execution Matrix
                </h3>
              </div>
              <span className="text-xs font-mono text-[#E5DED2]">
                Total: ₹{convergenceResult.estimated_annual_combined_value_inr.toLocaleString()}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {convergenceResult.complementary_benefits.map((pillar, idx) => (
                <div 
                  key={idx}
                  className="bg-[#383634]/60 border border-[rgba(104,93,84,0.45)] p-5 rounded-[14px] flex flex-col justify-between hover:border-[#A39382]/50 transition-colors"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-[4px] bg-[#E5DED2]/15 text-[#E5DED2] border border-[#E5DED2]/30">
                        Pillar {idx + 1}
                      </span>
                      <span className="text-xs font-mono font-semibold text-[#FBF7F4]">
                        ₹{pillar.combined_value_inr.toLocaleString()}
                      </span>
                    </div>

                    <h4 className="text-xs font-semibold text-[#FBF7F4]">{pillar.pillar_id.toUpperCase()}</h4>
                    <p className="text-[11px] text-[#E5DED2] mt-1.5 leading-relaxed">{pillar.description}</p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[rgba(104,93,84,0.45)]">
                    <span className="text-[10px] uppercase tracking-[0.08em] text-[#A39382] font-medium block mb-1.5">
                      Synchronized Schemes:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {pillar.schemes.map((s, sIdx) => (
                        <span 
                          key={sIdx}
                          className="text-[10px] px-2 py-0.5 rounded-[4px] bg-[#2B2A29] text-[#FBF7F4] font-mono border border-[rgba(104,93,84,0.45)]"
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
            <div 
              className="rounded-[14px] border border-[rgba(104,93,84,0.45)] p-6 space-y-4"
              style={{
                background: 'linear-gradient(180deg, #2B2A29 0%, #232323 100%)',
                boxShadow: 'inset 0 1px 0 rgba(251, 247, 244, 0.06)'
              }}
            >
              <span className="text-xs uppercase tracking-[0.08em] text-[#A39382] font-medium block">
                HARMONIZED CRITERIA
              </span>
              <h3 className="text-base font-semibold text-[#FBF7F4]">
                Common Intersecting Eligibility (Single-Window Camp)
              </h3>

              <div className="space-y-3 text-xs bg-[#383634]/60 p-4 rounded-[10px] border border-[rgba(104,93,84,0.45)]">
                <div className="flex justify-between py-1 border-b border-[rgba(104,93,84,0.45)]">
                  <span className="text-[#E5DED2]">Harmonized Age Range:</span>
                  <span className="text-[#FBF7F4] font-medium">{convergenceResult.common_eligibility.age_bracket}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[rgba(104,93,84,0.45)]">
                  <span className="text-[#E5DED2]">Income Ceiling:</span>
                  <span className="text-[#FBF7F4] font-mono font-medium">Up to ₹{convergenceResult.common_eligibility.recommended_income_ceiling_inr.toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[rgba(104,93,84,0.45)]">
                  <span className="text-[#E5DED2]">Landholding Limit:</span>
                  <span className="text-[#FBF7F4] font-medium">Up to {convergenceResult.common_eligibility.max_landholding_acres} Acres (Small & Marginal)</span>
                </div>
                <div className="pt-1">
                  <span className="text-[#E5DED2] block mb-2 font-medium">Universal Single-Window Documents:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {convergenceResult.common_eligibility.common_documents.map((doc, dIdx) => (
                      <span key={dIdx} className="text-[11px] px-2.5 py-1 rounded-[6px] bg-[#2B2A29] text-[#E5DED2] border border-[#A39382]/40 font-medium flex items-center gap-1">
                        <Check className="w-3 h-3 text-[#E5DED2]" strokeWidth={1.5} />
                        <span>{doc}</span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Duplication & Conflict Detection */}
            <div 
              className="rounded-[14px] border border-[rgba(104,93,84,0.45)] p-6 space-y-4"
              style={{
                background: 'linear-gradient(180deg, #2B2A29 0%, #232323 100%)',
                boxShadow: 'inset 0 1px 0 rgba(251, 247, 244, 0.06)'
              }}
            >
              <span className="text-xs uppercase tracking-[0.08em] text-[#A39382] font-medium block">
                POLICY FRICTIONS & DUPLICATION
              </span>
              <h3 className="text-base font-semibold text-[#FBF7F4]">
                Conflict Detection & Safeguards ({convergenceResult.duplications_and_conflicts.length})
              </h3>

              <div className="space-y-3">
                {convergenceResult.duplications_and_conflicts.length > 0 ? (
                  convergenceResult.duplications_and_conflicts.map((conf, cIdx) => (
                    <div key={cIdx} className="bg-[#383634]/60 border border-[rgba(104,93,84,0.45)] p-3.5 rounded-[10px] text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-[#E5DED2]">{conf.title}</span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-[4px] bg-[#E5DED2]/15 text-[#E5DED2] border border-[#E5DED2]/30">
                          {conf.severity}
                        </span>
                      </div>
                      <p className="text-[#E5DED2] text-[11px] leading-relaxed">{conf.details}</p>
                      <p className="text-[#FBF7F4] text-[11px] pt-1 font-medium">
                        <b>Mandated Safeguard:</b> {conf.safeguard_action}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-[#A39382]">No overlapping policy duplications detected.</p>
                )}
              </div>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}

import React, { useState } from 'react';
import { 
  CheckCircle2, XCircle, AlertCircle, Award, DollarSign, 
  FileText, ExternalLink, RefreshCw, UserCheck, MapPin
} from 'lucide-react';
import { api } from '../api';

export default function EligibilityCheckerView({ onSelectScheme }) {
  // Form state default set to the Sehore Farmer demonstration profile!
  const [formData, setFormData] = useState({
    state: 'Madhya Pradesh',
    district: 'Sehore',
    age: 42,
    gender: 'Male',
    occupation: 'Farmer',
    landholding_acres: 2.5,
    annual_income: 95000,
    social_category: 'OBC',
    has_bank_account: true,
    has_aadhaar: true,
    irrigation_available: false
  });

  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);

  const handleInputChange = (field, val) => {
    setFormData(prev => ({ ...prev, [field]: val }));
  };

  const handleRunCheck = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    try {
      const data = await api.checkEligibility(formData);
      if (data) {
        setResults(data);
      }
    } catch (err) {
      console.error("Eligibility check error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Pre-load on mount for seamless demo experience
  React.useEffect(() => {
    handleRunCheck();
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-blue-950 text-blue-400 border border-blue-800 uppercase tracking-wider font-mono">
            Module 3 • Citizen & Officer Wizard
          </span>
        </div>
        <h2 className="text-2xl font-extrabold text-white mt-1 tracking-tight">
          Beneficiary Eligibility Diagnostic Checker
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Enter beneficiary demographics, landholding, and income profile to evaluate rule matches across all 25 schemes
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Form Questionnaire */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-4">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2 pb-2 border-b border-slate-800">
            <UserCheck className="w-4 h-4 text-emerald-400" />
            <span>Beneficiary Profile Input</span>
          </h3>

          <form onSubmit={handleRunCheck} className="space-y-3.5 text-xs">
            
            {/* State & District */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-slate-400 block mb-1 font-medium">State</label>
                <select
                  value={formData.state}
                  onChange={e => handleInputChange('state', e.target.value)}
                  className="w-full p-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200"
                >
                  <option value="Madhya Pradesh">Madhya Pradesh</option>
                  <option value="All India">Other / Pan-India</option>
                </select>
              </div>

              <div>
                <label className="text-slate-400 block mb-1 font-medium">District</label>
                <select
                  value={formData.district}
                  onChange={e => handleInputChange('district', e.target.value)}
                  className="w-full p-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 font-semibold"
                >
                  <option value="Sehore">Sehore (Pilot)</option>
                  <option value="Bhopal">Bhopal</option>
                  <option value="Raisen">Raisen</option>
                  <option value="Vidisha">Vidisha</option>
                </select>
              </div>
            </div>

            {/* Age & Gender */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-slate-400 block mb-1 font-medium">Age (Years)</label>
                <input
                  type="number"
                  value={formData.age}
                  onChange={e => handleInputChange('age', parseInt(e.target.value) || 18)}
                  className="w-full p-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1 font-medium">Gender</label>
                <select
                  value={formData.gender}
                  onChange={e => handleInputChange('gender', e.target.value)}
                  className="w-full p-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
            </div>

            {/* Occupation */}
            <div>
              <label className="text-slate-400 block mb-1 font-medium">Primary Occupation</label>
              <select
                value={formData.occupation}
                onChange={e => handleInputChange('occupation', e.target.value)}
                className="w-full p-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 font-semibold"
              >
                <option value="Farmer">Farmer (Landholding)</option>
                <option value="Agricultural Laborer">Agricultural Laborer (Landless)</option>
                <option value="Artisan">Artisan / Traditional Craftsman</option>
                <option value="Self-Employed">Self-Employed / Micro-business</option>
                <option value="Unemployed">Rural Youth / Unemployed</option>
              </select>
            </div>

            {/* Landholding */}
            <div>
              <div className="flex justify-between mb-1">
                <label className="text-slate-400 font-medium">Landholding Size (Acres)</label>
                <span className="text-blue-400 font-mono font-bold">{formData.landholding_acres} Acres</span>
              </div>
              <input
                type="range"
                min="0"
                max="15"
                step="0.5"
                value={formData.landholding_acres}
                onChange={e => handleInputChange('landholding_acres', parseFloat(e.target.value))}
                className="w-full accent-blue-600"
              />
              <span className="text-[10px] text-slate-400">
                {formData.landholding_acres <= 2.5 ? 'Marginal Farmer (< 2.5 ac)' : (formData.landholding_acres <= 5.0 ? 'Small Farmer (2.5 - 5 ac)' : 'Medium Farmer')}
              </span>
            </div>

            {/* Annual Household Income */}
            <div>
              <div className="flex justify-between mb-1">
                <label className="text-slate-400 font-medium">Annual Household Income</label>
                <span className="text-emerald-400 font-mono font-bold">₹{formData.annual_income.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min="30000"
                max="500000"
                step="10000"
                value={formData.annual_income}
                onChange={e => handleInputChange('annual_income', parseFloat(e.target.value))}
                className="w-full accent-emerald-600"
              />
            </div>

            {/* Social Category */}
            <div>
              <label className="text-slate-400 block mb-1 font-medium">Social Category</label>
              <select
                value={formData.social_category}
                onChange={e => handleInputChange('social_category', e.target.value)}
                className="w-full p-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200"
              >
                <option value="OBC">OBC (Other Backward Class)</option>
                <option value="SC">SC (Scheduled Caste)</option>
                <option value="ST">ST (Scheduled Tribe)</option>
                <option value="General">General</option>
              </select>
            </div>

            {/* Document Checkboxes */}
            <div className="pt-2 border-t border-slate-800 space-y-2">
              <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                <input
                  type="checkbox"
                  checked={formData.has_aadhaar}
                  onChange={e => handleInputChange('has_aadhaar', e.target.checked)}
                  className="rounded text-blue-600 focus:ring-0"
                />
                <span>Has Aadhaar Card with active mobile link</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                <input
                  type="checkbox"
                  checked={formData.has_bank_account}
                  onChange={e => handleInputChange('has_bank_account', e.target.checked)}
                  className="rounded text-blue-600 focus:ring-0"
                />
                <span>Has Aadhaar-seeded Bank Account (DBT enabled)</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-900/50 transition-colors mt-4"
            >
              {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
              <span>{loading ? 'Evaluating Eligibility...' : 'Evaluate Applicable Schemes'}</span>
            </button>

          </form>
        </div>

        {/* Right Column: Diagnostic Results */}
        <div className="lg:col-span-2 space-y-6">
          
          {results && (
            <>
              {/* Summary Scorecard */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Evaluated Schemes</span>
                  <div className="text-2xl font-extrabold text-white mt-1">
                    {results.summary.total_schemes_evaluated}
                  </div>
                </div>

                <div className="bg-emerald-950/40 border border-emerald-800/60 p-4 rounded-xl">
                  <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">Fully Eligible</span>
                  <div className="text-2xl font-extrabold text-emerald-300 mt-1">
                    {results.summary.fully_eligible_count} Schemes
                  </div>
                </div>

                <div className="bg-blue-950/40 border border-blue-800/60 p-4 rounded-xl">
                  <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider">Potential Total Benefit</span>
                  <div className="text-2xl font-extrabold text-blue-300 mt-1 font-mono">
                    ₹{results.summary.total_potential_benefit_inr.toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Matched Schemes List */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Diagnostic Match Breakdown
                </h3>

                {results.recommendations.map((rec) => {
                  const isEligible = rec.status === 'Eligible';
                  const isPartial = rec.status === 'Partially Eligible';

                  return (
                    <div 
                      key={rec.scheme_id}
                      className={`p-4 rounded-xl border transition-all ${
                        isEligible
                          ? 'bg-slate-900/90 border-emerald-500/50 shadow-md'
                          : (isPartial ? 'bg-slate-900/60 border-amber-500/40' : 'bg-slate-900/40 border-slate-800 opacity-60')
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded font-mono ${
                              isEligible ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-slate-800 text-slate-400'
                            }`}>
                              {rec.code}
                            </span>
                            <span className="text-[11px] text-slate-400">
                              {rec.sector}
                            </span>
                          </div>
                          <h4 className="text-sm font-bold text-white mt-1">
                            {rec.name}
                          </h4>
                        </div>

                        {/* Match Badge */}
                        <div className="text-right shrink-0">
                          <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                            isEligible 
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-700' 
                              : (isPartial ? 'bg-amber-950 text-amber-300 border border-amber-700' : 'bg-rose-950 text-rose-300 border border-rose-700')
                          }`}>
                            {rec.match_score}% Match ({rec.status})
                          </span>
                          {rec.potential_benefit_inr > 0 && (
                            <div className="text-xs font-bold text-emerald-400 mt-1 font-mono">
                              ₹{rec.potential_benefit_inr.toLocaleString()}
                            </div>
                          )}
                        </div>
                      </div>

                      <p className="text-xs text-slate-300 mt-2 bg-slate-950/60 p-2 rounded-lg border border-slate-800">
                        {rec.benefit_description}
                      </p>

                      {/* Reasons Box */}
                      <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                        {rec.reasons_eligible.length > 0 && (
                          <div className="space-y-1">
                            <span className="text-emerald-400 font-bold block">✓ Met Criteria:</span>
                            {rec.reasons_eligible.slice(0, 3).map((r, idx) => (
                              <p key={idx} className="text-slate-400">• {r}</p>
                            ))}
                          </div>
                        )}

                        {rec.reasons_ineligible.length > 0 && (
                          <div className="space-y-1">
                            <span className="text-rose-400 font-bold block">✕ Unmet / Restrictive Conditions:</span>
                            {rec.reasons_ineligible.map((r, idx) => (
                              <p key={idx} className="text-rose-300/80">• {r}</p>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Required Documents */}
                      {isEligible && rec.required_documents?.length > 0 && (
                        <div className="mt-3 pt-2.5 border-t border-slate-800/80 text-[11px] text-slate-400">
                          <span className="font-semibold text-slate-300">Required Documents: </span>
                          <span>{rec.required_documents.join(' • ')}</span>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="mt-3 pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
                        <button
                          onClick={() => onSelectScheme(rec.scheme_id)}
                          className="text-blue-400 hover:text-blue-300 font-semibold"
                        >
                          View Scheme Dossier →
                        </button>
                        {rec.application_url && (
                          <a
                            href={rec.application_url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-slate-400 hover:text-white flex items-center gap-1"
                          >
                            <span>Application Link</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>

                    </div>
                  );
                })}
              </div>
            </>
          )}

        </div>

      </div>

    </div>
  );
}

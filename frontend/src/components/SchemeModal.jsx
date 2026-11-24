import React from 'react';
import { 
  X, ExternalLink, Phone, FileText, CheckCircle2, 
  AlertCircle, DollarSign, Users, Award, ShieldCheck, MapPin
} from 'lucide-react';

export default function SchemeModal({ scheme, onClose, onCheckEligibility }) {
  if (!scheme) return null;

  const el = scheme.eligibility || {};
  const benefits = scheme.benefits || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 bg-slate-900/90 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                scheme.level === 'Central' ? 'bg-blue-950 text-blue-400 border border-blue-800' : 'bg-amber-950 text-amber-400 border border-amber-800'
              }`}>
                {scheme.level} Scheme
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                {scheme.sector}
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                {scheme.code}
              </span>
            </div>
            <h2 className="text-xl font-bold text-white mt-1.5">
              {scheme.name}
            </h2>
            {scheme.hindi_name && (
              <p className="text-sm text-blue-300 font-medium">
                {scheme.hindi_name}
              </p>
            )}
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {/* Department & Ministry */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80 text-xs">
            <div>
              <span className="text-slate-400 block font-medium">Nodal Ministry:</span>
              <span className="text-slate-200 font-semibold">{scheme.ministry}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Department:</span>
              <span className="text-slate-200 font-semibold">{scheme.department}</span>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-blue-400" />
              Scheme Overview & Mandate
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed bg-slate-800/40 p-3.5 rounded-xl border border-slate-800">
              {scheme.description}
            </p>
          </div>

          {/* Benefits Matrix */}
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-emerald-400" />
              Financial & In-Kind Benefits
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {benefits.map((b, idx) => (
                <div key={idx} className="bg-emerald-950/20 border border-emerald-800/40 p-3.5 rounded-xl">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-400">{b.benefit_type}</span>
                    <span className="text-[11px] text-slate-400">{b.frequency}</span>
                  </div>
                  {b.amount_direct_inr > 0 && (
                    <div className="text-lg font-extrabold text-white mt-1">
                      ₹{b.amount_direct_inr.toLocaleString()}
                    </div>
                  )}
                  {b.amount_subsidized_pct > 0 && (
                    <div className="text-sm font-semibold text-emerald-300 mt-1">
                      {b.amount_subsidized_pct}% Subsidy
                    </div>
                  )}
                  <p className="text-xs text-slate-300 mt-1">
                    {b.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Eligibility Criteria */}
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
              Verified Eligibility Conditions
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-slate-950/60 p-4 rounded-xl border border-slate-800">
              <div>
                <span className="text-slate-400 block font-medium">Age Bracket:</span>
                <span className="text-slate-200 font-semibold">{el.min_age || 18} to {el.max_age || 70} years</span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Gender:</span>
                <span className="text-slate-200 font-semibold">{el.gender || 'All'}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Income Ceiling:</span>
                <span className="text-slate-200 font-semibold">
                  {el.max_income < 10000000 ? `Up to ₹${el.max_income.toLocaleString()} / year` : 'No Upper Income Cap'}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Landholding Limits:</span>
                <span className="text-slate-200 font-semibold">
                  {el.max_landholding_acres < 999 ? `${el.min_landholding_acres} to ${el.max_landholding_acres} Acres` : 'Landless / Any'}
                </span>
              </div>
              <div className="sm:col-span-2">
                <span className="text-slate-400 block font-medium">Target Occupations:</span>
                <span className="text-slate-200 font-semibold">{el.occupations?.join(', ') || 'Farmer'}</span>
              </div>
              <div className="sm:col-span-2">
                <span className="text-slate-400 block font-medium">Required Documents:</span>
                <span className="text-slate-200 font-semibold">{el.required_documents?.join(' • ') || 'Aadhaar, Bank Passbook'}</span>
              </div>
              {el.special_conditions && (
                <div className="sm:col-span-2 p-2 rounded bg-amber-950/40 border border-amber-800/40 text-amber-200 text-xs">
                  <b>Special Notes / Exclusions:</b> {el.special_conditions}
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-900 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-4 text-xs text-slate-400">
            {scheme.helpline && (
              <span className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-emerald-400" />
                Helpline: <b className="text-slate-200">{scheme.helpline}</b>
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {scheme.application_url && (
              <a 
                href={scheme.application_url}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
              >
                <span>Official Portal</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
            <button
              onClick={() => {
                onClose();
                if (onCheckEligibility) onCheckEligibility(scheme);
              }}
              className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
            >
              Test Eligibility
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

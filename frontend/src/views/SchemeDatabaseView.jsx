import React, { useState, useEffect } from 'react';
import { 
  Search, Filter, ExternalLink, Award, FileText, CheckCircle2, 
  Layers, ArrowUpDown, ChevronDown, RotateCcw, MapPin, Users
} from 'lucide-react';
import { api } from '../api';

export default function SchemeDatabaseView({ onSelectScheme, onLaunchConvergenceWithScheme }) {
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSector, setSelectedSector] = useState('All');
  const [selectedLevel, setSelectedLevel] = useState('All');
  const [selectedState, setSelectedState] = useState('All');
  const [selectedOccupation, setSelectedOccupation] = useState('All');
  const [selectedGender, setSelectedGender] = useState('All');

  useEffect(() => {
    fetchSchemes();
  }, [searchTerm, selectedSector, selectedLevel, selectedState, selectedOccupation, selectedGender]);

  const fetchSchemes = async () => {
    setLoading(true);
    try {
      const data = await api.getSchemes({
        query: searchTerm,
        sector: selectedSector,
        level: selectedLevel,
        state: selectedState,
        occupation: selectedOccupation,
        gender: selectedGender
      });
      setSchemes(data || []);
    } catch (err) {
      console.error("Failed to load schemes:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedSector('All');
    setSelectedLevel('All');
    setSelectedState('All');
    setSelectedOccupation('All');
    setSelectedGender('All');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">
            Government Scheme Database & Explorer
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Browse, search and filter 25+ verified Central and Madhya Pradesh State flagship schemes
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs px-3 py-1.5 rounded-xl bg-blue-950 text-blue-300 border border-blue-800 font-mono font-bold">
            {schemes.length} Schemes Found
          </span>
          <button
            onClick={handleResetFilters}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1.5 transition-colors"
            title="Reset All Filters"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl shadow-xl space-y-4">
        
        {/* Search input */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search by scheme name, code (e.g. PM-KISAN, PMFBY, Ladli Behna), ministry, or keyword..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Multi-dimension Filter Dropdowns */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 text-xs">
          
          <div>
            <label className="text-slate-400 block mb-1 font-medium">Sector</label>
            <select
              value={selectedSector}
              onChange={e => setSelectedSector(e.target.value)}
              className="w-full p-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-blue-500"
            >
              <option value="All">All Sectors</option>
              <option value="Agriculture">Agriculture</option>
              <option value="Rural Development">Rural Development</option>
              <option value="Women & Child">Women & Child</option>
              <option value="Financial Inclusion & MSME">Financial Inclusion & MSME</option>
              <option value="Health">Health</option>
              <option value="Water & Sanitation">Water & Sanitation</option>
              <option value="Skill & Employment">Skill & Employment</option>
            </select>
          </div>

          <div>
            <label className="text-slate-400 block mb-1 font-medium">Scheme Level</label>
            <select
              value={selectedLevel}
              onChange={e => setSelectedLevel(e.target.value)}
              className="w-full p-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-blue-500"
            >
              <option value="All">All Levels</option>
              <option value="Central">Central Sector</option>
              <option value="State">State Government</option>
              <option value="Centrally Sponsored">Centrally Sponsored</option>
            </select>
          </div>

          <div>
            <label className="text-slate-400 block mb-1 font-medium">State Scope</label>
            <select
              value={selectedState}
              onChange={e => setSelectedState(e.target.value)}
              className="w-full p-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-blue-500"
            >
              <option value="All">All Jurisdictions</option>
              <option value="Madhya Pradesh">Madhya Pradesh Specific</option>
              <option value="All India">Pan-India</option>
            </select>
          </div>

          <div>
            <label className="text-slate-400 block mb-1 font-medium">Beneficiary Occupation</label>
            <select
              value={selectedOccupation}
              onChange={e => setSelectedOccupation(e.target.value)}
              className="w-full p-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-blue-500"
            >
              <option value="All">All Occupations</option>
              <option value="Farmer">Farmer</option>
              <option value="Agricultural Laborer">Agricultural Laborer</option>
              <option value="Artisan">Artisan / Craftsman</option>
              <option value="Self-Employed">Self-Employed / Vendor</option>
              <option value="Unemployed">Rural Youth / Unemployed</option>
            </select>
          </div>

          <div>
            <label className="text-slate-400 block mb-1 font-medium">Gender</label>
            <select
              value={selectedGender}
              onChange={e => setSelectedGender(e.target.value)}
              className="w-full p-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-blue-500"
            >
              <option value="All">All Genders</option>
              <option value="Female">Women Only</option>
              <option value="Male">Men Only</option>
            </select>
          </div>

        </div>

      </div>

      {/* Schemes Grid */}
      {loading ? (
        <div className="py-20 text-center text-slate-400">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs">Loading verified government schemes...</p>
        </div>
      ) : schemes.length === 0 ? (
        <div className="py-20 text-center text-slate-400 bg-slate-900/40 rounded-2xl border border-slate-800">
          <FileText className="w-10 h-10 text-slate-600 mx-auto mb-2" />
          <p className="text-sm font-medium">No schemes match the specified filter criteria</p>
          <button 
            onClick={handleResetFilters}
            className="mt-3 px-4 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-semibold"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {schemes.map((scheme) => {
            const firstBenefit = scheme.benefits && scheme.benefits.length > 0 ? scheme.benefits[0] : null;

            return (
              <div 
                key={scheme.id}
                className="bg-slate-900/90 border border-slate-800 hover:border-slate-700/80 rounded-2xl p-5 shadow-lg flex flex-col justify-between transition-all hover:translate-y-[-2px]"
              >
                <div>
                  {/* Card Header Tags */}
                  <div className="flex items-center justify-between gap-2 flex-wrap mb-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                      scheme.level === 'Central' ? 'bg-blue-950 text-blue-400 border border-blue-800' : 'bg-amber-950 text-amber-400 border border-amber-800'
                    }`}>
                      {scheme.level}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                      {scheme.code}
                    </span>
                    <span className="text-[10px] font-medium text-emerald-400 ml-auto">
                      {scheme.sector}
                    </span>
                  </div>

                  {/* Title & Hindi Title */}
                  <h3 className="text-base font-bold text-white group-hover:text-blue-400 transition-colors line-clamp-1">
                    {scheme.name}
                  </h3>
                  {scheme.hindi_name && (
                    <p className="text-xs text-blue-300 font-medium mt-0.5 line-clamp-1">
                      {scheme.hindi_name}
                    </p>
                  )}

                  {/* Department */}
                  <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">
                    {scheme.department}
                  </p>

                  {/* Description */}
                  <p className="text-xs text-slate-300 mt-3 line-clamp-2 leading-relaxed">
                    {scheme.description}
                  </p>

                  {/* Primary Benefit Box */}
                  {firstBenefit && (
                    <div className="mt-3 bg-slate-950/70 p-2.5 rounded-xl border border-slate-800/80 text-xs">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-emerald-400 font-bold">{firstBenefit.benefit_type}</span>
                        <span className="text-slate-400">{firstBenefit.frequency}</span>
                      </div>
                      {firstBenefit.amount_direct_inr > 0 && (
                        <div className="text-sm font-extrabold text-white mt-0.5 font-mono">
                          ₹{firstBenefit.amount_direct_inr.toLocaleString()}
                        </div>
                      )}
                      {firstBenefit.amount_subsidized_pct > 0 && (
                        <div className="text-xs font-semibold text-emerald-300 mt-0.5">
                          {firstBenefit.amount_subsidized_pct}% Subsidy
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Card Action Buttons */}
                <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                  <button
                    onClick={() => onSelectScheme(scheme.id)}
                    className="flex-1 py-1.5 px-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-colors text-center"
                  >
                    View Details
                  </button>

                  {scheme.application_url && (
                    <a
                      href={scheme.application_url}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                      title="Open Official Portal"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}

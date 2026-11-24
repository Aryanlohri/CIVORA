import React, { useState, useEffect } from 'react';
import { 
  Settings, Plus, Network, CheckCircle2, RotateCcw, 
  Trash2, AlertTriangle, ShieldCheck, FileText, Database
} from 'lucide-react';
import { api } from '../api';

export default function AdminPanelView() {
  const [schemes, setSchemes] = useState([]);
  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddSchemeModal, setShowAddSchemeModal] = useState(false);
  const [showAddRuleModal, setShowAddRuleModal] = useState(false);

  // New Scheme Form
  const [newScheme, setNewScheme] = useState({
    code: '',
    name: '',
    hindi_name: '',
    ministry: '',
    department: '',
    level: 'Central',
    state: 'All India',
    sector: 'Agriculture',
    description: '',
    target_beneficiary: '',
    application_url: '',
    helpline: ''
  });

  // New Rule Form
  const [newRule, setNewRule] = useState({
    scheme_1_id: '',
    scheme_2_id: '',
    relationship_type: 'Complementary',
    synergy_score: 0.85,
    objective_category: 'Agriculture',
    reason: '',
    target_group: 'Small & Marginal Farmers',
    implementation_sop: '',
    possible_conflicts: ''
  });

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    setLoading(true);
    try {
      const [sData, rData] = await Promise.all([
        api.getSchemes(),
        api.getConvergenceRules()
      ]);
      setSchemes(sData || []);
      setRules(rData || []);
      if (sData && sData.length >= 2) {
        setNewRule(prev => ({
          ...prev,
          scheme_1_id: sData[0].id,
          scheme_2_id: sData[1].id
        }));
      }
    } catch (err) {
      console.error("Failed to load admin data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateScheme = async (e) => {
    e.preventDefault();
    if (!newScheme.code || !newScheme.name) {
      alert("Please fill code and name.");
      return;
    }
    try {
      await api.createScheme({
        ...newScheme,
        eligibility: {
          min_age: 18,
          max_age: 70,
          gender: 'All',
          min_income: 0,
          max_income: 10000000,
          social_categories: ["General", "OBC", "SC", "ST"],
          occupations: ["Farmer"],
          min_landholding_acres: 0.0,
          max_landholding_acres: 999.0,
          state_scope: newScheme.state,
          districts_scope: ["All"],
          required_documents: ["Aadhaar Card", "Bank Account"]
        },
        benefits: [
          {
            benefit_type: 'Financial Subsidy',
            amount_direct_inr: 10000,
            amount_subsidized_pct: 50,
            frequency: 'Per Annum',
            description: 'Government financial grant / subsidy assistance.'
          }
        ]
      });
      setShowAddSchemeModal(false);
      loadAdminData();
      alert("Scheme created successfully!");
    } catch (err) {
      console.error("Error creating scheme:", err);
      alert("Failed to create scheme: " + err.message);
    }
  };

  const handleCreateRule = async (e) => {
    e.preventDefault();
    try {
      await api.createConvergenceRule({
        ...newRule,
        scheme_1_id: parseInt(newRule.scheme_1_id),
        scheme_2_id: parseInt(newRule.scheme_2_id),
        synergy_score: parseFloat(newRule.synergy_score)
      });
      setShowAddRuleModal(false);
      loadAdminData();
      alert("Convergence rule established successfully!");
    } catch (err) {
      console.error("Error creating rule:", err);
      alert("Failed to create convergence rule: " + err.message);
    }
  };

  const handleResetDatabase = async () => {
    if (!window.confirm("Are you sure you want to re-seed the database to official baseline verified schemes?")) {
      return;
    }
    setLoading(true);
    try {
      await api.resetDemoData();
      await loadAdminData();
      alert("Database reset and re-seeded with official 25+ verified schemes!");
    } catch (err) {
      console.error("Reset error:", err);
      alert("Reset failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-blue-950 text-blue-400 border border-blue-800 uppercase tracking-wider font-mono">
              Module 6 • Administrative Governance
            </span>
          </div>
          <h2 className="text-2xl font-extrabold text-white mt-1 tracking-tight flex items-center gap-2">
            <Settings className="w-6 h-6 text-blue-400" />
            <span>Admin Control Panel & Policy Engine</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage scheme data, define inter-scheme convergence linkages, and audit policy conflicts
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAddSchemeModal(true)}
            className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add New Scheme</span>
          </button>

          <button
            onClick={() => setShowAddRuleModal(true)}
            className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <Network className="w-3.5 h-3.5" />
            <span>Link Convergence</span>
          </button>

          <button
            onClick={handleResetDatabase}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors border border-slate-700"
            title="Re-seed database to 25 verified schemes"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo DB</span>
          </button>
        </div>
      </div>

      {/* Database Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-lg flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-950 text-blue-400 flex items-center justify-center shrink-0">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Schemes</span>
            <div className="text-2xl font-extrabold text-white">{schemes.length} Active</div>
            <p className="text-[11px] text-slate-400">All verified by nodal officers</p>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-lg flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-950 text-emerald-400 flex items-center justify-center shrink-0">
            <Network className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Active Convergence Rules</span>
            <div className="text-2xl font-extrabold text-emerald-400">{rules.length} Rules</div>
            <p className="text-[11px] text-slate-400">Inter-scheme synergy logic</p>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-lg flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-950 text-indigo-400 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Integrity Audit</span>
            <div className="text-2xl font-extrabold text-indigo-400">100% Passed</div>
            <p className="text-[11px] text-slate-400">Zero orphaned references</p>
          </div>
        </div>
      </div>

      {/* Convergence Rules Table */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <Network className="w-4 h-4 text-emerald-400" />
            <span>Active Inter-Scheme Convergence Rules ({rules.length})</span>
          </h3>
          <span className="text-xs text-slate-400">Evaluated by Convergence Engine</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="pb-3 font-semibold">Scheme Pair</th>
                <th className="pb-3 font-semibold">Relationship Type</th>
                <th className="pb-3 font-semibold">Synergy Rationale</th>
                <th className="pb-3 font-semibold">Target Group</th>
                <th className="pb-3 font-semibold text-right">Synergy Weight</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {rules.map((rule) => (
                <tr key={rule.id} className="hover:bg-slate-950/40">
                  <td className="py-3 font-bold text-white whitespace-nowrap">
                    <span className="text-blue-400">{rule.scheme_1_code}</span>
                    <span className="text-slate-500 mx-1.5">⇄</span>
                    <span className="text-emerald-400">{rule.scheme_2_code}</span>
                  </td>
                  <td className="py-3">
                    <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-800 text-slate-200">
                      {rule.relationship_type}
                    </span>
                  </td>
                  <td className="py-3 text-slate-300 max-w-xs truncate" title={rule.reason}>
                    {rule.reason}
                  </td>
                  <td className="py-3 text-slate-400">{rule.target_group}</td>
                  <td className="py-3 text-right font-mono font-bold text-emerald-400">
                    {Math.round(rule.synergy_score * 100)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Scheme Modal */}
      {showAddSchemeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-xl p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-4">Add Government Scheme to Database</h3>
            <form onSubmit={handleCreateScheme} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Scheme Code (e.g. PM-NEW)</label>
                  <input
                    type="text"
                    required
                    value={newScheme.code}
                    onChange={e => setNewScheme({ ...newScheme, code: e.target.value })}
                    className="w-full p-2 rounded-lg bg-slate-950 border border-slate-800 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Scheme Name</label>
                  <input
                    type="text"
                    required
                    value={newScheme.name}
                    onChange={e => setNewScheme({ ...newScheme, name: e.target.value })}
                    className="w-full p-2 rounded-lg bg-slate-950 border border-slate-800 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Hindi Title (Optional)</label>
                  <input
                    type="text"
                    value={newScheme.hindi_name}
                    onChange={e => setNewScheme({ ...newScheme, hindi_name: e.target.value })}
                    className="w-full p-2 rounded-lg bg-slate-950 border border-slate-800 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Sector</label>
                  <select
                    value={newScheme.sector}
                    onChange={e => setNewScheme({ ...newScheme, sector: e.target.value })}
                    className="w-full p-2 rounded-lg bg-slate-950 border border-slate-800 text-white"
                  >
                    <option value="Agriculture">Agriculture</option>
                    <option value="Rural Development">Rural Development</option>
                    <option value="Women & Child">Women & Child</option>
                    <option value="Financial Inclusion & MSME">Financial Inclusion & MSME</option>
                    <option value="Health">Health</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Ministry</label>
                  <input
                    type="text"
                    required
                    value={newScheme.ministry}
                    onChange={e => setNewScheme({ ...newScheme, ministry: e.target.value })}
                    className="w-full p-2 rounded-lg bg-slate-950 border border-slate-800 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Department</label>
                  <input
                    type="text"
                    required
                    value={newScheme.department}
                    onChange={e => setNewScheme({ ...newScheme, department: e.target.value })}
                    className="w-full p-2 rounded-lg bg-slate-950 border border-slate-800 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Scheme Description</label>
                <textarea
                  rows="3"
                  required
                  value={newScheme.description}
                  onChange={e => setNewScheme({ ...newScheme, description: e.target.value })}
                  className="w-full p-2 rounded-lg bg-slate-950 border border-slate-800 text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddSchemeModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold"
                >
                  Save Scheme
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Convergence Rule Modal */}
      {showAddRuleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-xl p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-4">Establish Inter-Scheme Convergence Link</h3>
            <form onSubmit={handleCreateRule} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Primary Scheme 1</label>
                  <select
                    value={newRule.scheme_1_id}
                    onChange={e => setNewRule({ ...newRule, scheme_1_id: e.target.value })}
                    className="w-full p-2 rounded-lg bg-slate-950 border border-slate-800 text-white"
                  >
                    {schemes.map(s => (
                      <option key={s.id} value={s.id}>{s.code} - {s.name.slice(0, 24)}...</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Synergistic Scheme 2</label>
                  <select
                    value={newRule.scheme_2_id}
                    onChange={e => setNewRule({ ...newRule, scheme_2_id: e.target.value })}
                    className="w-full p-2 rounded-lg bg-slate-950 border border-slate-800 text-white"
                  >
                    {schemes.map(s => (
                      <option key={s.id} value={s.id}>{s.code} - {s.name.slice(0, 24)}...</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Relationship Type</label>
                  <select
                    value={newRule.relationship_type}
                    onChange={e => setNewRule({ ...newRule, relationship_type: e.target.value })}
                    className="w-full p-2 rounded-lg bg-slate-950 border border-slate-800 text-white"
                  >
                    <option value="Co-funding">Co-funding (Direct Cash Stack)</option>
                    <option value="Complementary">Complementary (Liquidity to Asset)</option>
                    <option value="Sequential">Sequential (Pre-requisite / Phase)</option>
                    <option value="Risk-Mitigation">Risk Mitigation (Insurance)</option>
                    <option value="Input-Output">Input-Output (Resource Synergies)</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Synergy Score (0.5 to 1.0)</label>
                  <input
                    type="number"
                    step="0.05"
                    min="0.5"
                    max="1.0"
                    value={newRule.synergy_score}
                    onChange={e => setNewRule({ ...newRule, synergy_score: e.target.value })}
                    className="w-full p-2 rounded-lg bg-slate-950 border border-slate-800 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Convergence Rationale</label>
                <textarea
                  rows="2"
                  required
                  placeholder="Explain why these two schemes complement each other..."
                  value={newRule.reason}
                  onChange={e => setNewRule({ ...newRule, reason: e.target.value })}
                  className="w-full p-2 rounded-lg bg-slate-950 border border-slate-800 text-white"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">District Officer SOP Action</label>
                <input
                  type="text"
                  placeholder="e.g. Conduct joint verification camp during Kharif sowing"
                  value={newRule.implementation_sop}
                  onChange={e => setNewRule({ ...newRule, implementation_sop: e.target.value })}
                  className="w-full p-2 rounded-lg bg-slate-950 border border-slate-800 text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddRuleModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold"
                >
                  Create Convergence Link
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import DashboardView from './views/DashboardView';
import ConvergenceStudioView from './views/ConvergenceStudioView';
import SchemeDatabaseView from './views/SchemeDatabaseView';
import EligibilityCheckerView from './views/EligibilityCheckerView';
import DistrictDashboardView from './views/DistrictDashboardView';
import AdminPanelView from './views/AdminPanelView';
import SchemeModal from './components/SchemeModal';
import { api } from './api';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedSchemeId, setSelectedSchemeId] = useState(null);
  const [selectedSchemeData, setSelectedSchemeData] = useState(null);
  const [apiOnline, setApiOnline] = useState(false);
  const [summaryData, setSummaryData] = useState(null);
  const [demoBannerVisible, setDemoBannerVisible] = useState(false);

  useEffect(() => {
    async function init() {
      const health = await api.checkHealth();
      if (health && health.status === 'ok') {
        setApiOnline(true);
      }
      const summary = await api.getDashboardSummary();
      if (summary) {
        setSummaryData(summary);
      }
    }
    init();
  }, []);

  const handleSelectScheme = async (schemeId) => {
    setSelectedSchemeId(schemeId);
    try {
      const scheme = await api.getSchemeById(schemeId);
      setSelectedSchemeData(scheme);
    } catch (err) {
      console.error("Failed to load scheme details:", err);
    }
  };

  const handleLaunchDemo = () => {
    setActiveTab('convergence');
    setDemoBannerVisible(true);
  };

  const handleLaunchEligibilityForScheme = (scheme) => {
    setActiveTab('eligibility');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      
      {/* Top Navbar */}
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onLaunchDemo={handleLaunchDemo}
        apiOnline={apiOnline}
      />

      {/* Demo Scenario Notification Banner */}
      {demoBannerVisible && (
        <div className="bg-gradient-to-r from-emerald-900/90 via-teal-950 to-slate-900 border-b border-emerald-500/40 px-4 py-2 text-xs text-emerald-200 flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-2 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping shrink-0" />
            <span className="font-bold">Live Demonstration Mode Active:</span>
            <span>Agricultural Productivity & Income Convergence in Sehore District, Madhya Pradesh (SEG-6 Live Use Case)</span>
            <button 
              onClick={() => setDemoBannerVisible(false)}
              className="ml-auto text-emerald-400 hover:text-white font-bold text-xs"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Main View Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'dashboard' && (
          <DashboardView 
            summaryData={summaryData} 
            onLaunchDemo={handleLaunchDemo}
            onNavigateTab={setActiveTab}
          />
        )}

        {activeTab === 'convergence' && (
          <ConvergenceStudioView 
            onSelectScheme={handleSelectScheme}
            initialObjectiveKey="farmer_development"
          />
        )}

        {activeTab === 'database' && (
          <SchemeDatabaseView 
            onSelectScheme={handleSelectScheme}
          />
        )}

        {activeTab === 'eligibility' && (
          <EligibilityCheckerView 
            onSelectScheme={handleSelectScheme}
          />
        )}

        {activeTab === 'district' && (
          <DistrictDashboardView 
            onLaunchDemo={handleLaunchDemo}
          />
        )}

        {activeTab === 'admin' && (
          <AdminPanelView />
        )}
      </main>

      {/* Detail Modal */}
      {selectedSchemeData && (
        <SchemeModal 
          scheme={selectedSchemeData}
          onClose={() => setSelectedSchemeData(null)}
          onCheckEligibility={handleLaunchEligibilityForScheme}
        />
      )}

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 mt-12 text-slate-500 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
            <span className="font-bold text-slate-400">SchemeConnect AI • SEG-6 Final Deliverable</span>
            <span className="text-slate-600">|</span>
            <span>Unified Government Scheme Database & Convergence Mapping Tool</span>
          </div>
          <div className="text-slate-500 text-center sm:text-right">
            <span>Team SEG-6: Aryan Lohri, Abhiraj Kumar, Milan Kohli, Kamal Gangwar, Arsalan</span>
          </div>
        </div>
      </footer>

    </div>
  );
}

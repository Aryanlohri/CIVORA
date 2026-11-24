// API service for SchemeConnect AI frontend

const API_BASE_URL = 'http://localhost:8000/api';

export const api = {
  // Health
  checkHealth: async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/health`);
      return await res.json();
    } catch (err) {
      console.warn("Backend not reachable, operating in client fallback mode", err);
      return { status: "offline" };
    }
  },

  // Schemes
  getSchemes: async (params = {}) => {
    const query = new URLSearchParams();
    if (params.query) query.append('query', params.query);
    if (params.sector && params.sector !== 'All') query.append('sector', params.sector);
    if (params.state && params.state !== 'All') query.append('state', params.state);
    if (params.level && params.level !== 'All') query.append('level', params.level);
    if (params.occupation && params.occupation !== 'All') query.append('occupation', params.occupation);
    if (params.gender && params.gender !== 'All') query.append('gender', params.gender);
    if (params.max_income) query.append('max_income', params.max_income);
    if (params.landholding) query.append('landholding', params.landholding);

    try {
      const res = await fetch(`${API_BASE_URL}/schemes?${query.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch schemes");
      return await res.json();
    } catch (err) {
      console.error("Fetch schemes error:", err);
      return [];
    }
  },

  getSchemeById: async (id) => {
    const res = await fetch(`${API_BASE_URL}/schemes/${id}`);
    if (!res.ok) throw new Error("Failed to fetch scheme");
    return await res.json();
  },

  createScheme: async (schemeData) => {
    const res = await fetch(`${API_BASE_URL}/schemes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(schemeData),
    });
    if (!res.ok) throw new Error("Failed to create scheme");
    return await res.json();
  },

  // Eligibility
  checkEligibility: async (profile) => {
    try {
      const res = await fetch(`${API_BASE_URL}/eligibility/check`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile),
      });
      if (!res.ok) throw new Error("Eligibility check failed");
      return await res.json();
    } catch (err) {
      console.error("Eligibility check error:", err);
      return null;
    }
  },

  // Convergence
  getObjectives: async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/convergence/objectives`);
      if (!res.ok) throw new Error("Failed to fetch objectives");
      return await res.json();
    } catch (err) {
      console.error("Fetch objectives error:", err);
      return [];
    }
  },

  calculateConvergence: async (payload) => {
    try {
      const res = await fetch(`${API_BASE_URL}/convergence/calculate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Convergence calculation failed");
      return await res.json();
    } catch (err) {
      console.error("Calculate convergence error:", err);
      return null;
    }
  },

  getConvergenceRules: async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/convergence/rules`);
      if (!res.ok) throw new Error("Failed to fetch convergence rules");
      return await res.json();
    } catch (err) {
      console.error("Fetch convergence rules error:", err);
      return [];
    }
  },

  createConvergenceRule: async (ruleData) => {
    const res = await fetch(`${API_BASE_URL}/convergence/rules`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(ruleData),
    });
    if (!res.ok) throw new Error("Failed to create convergence rule");
    return await res.json();
  },

  // Export PDF
  downloadConvergencePdf: async (payload) => {
    const res = await fetch(`${API_BASE_URL}/convergence/export-pdf`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error("Failed to download PDF report");
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SchemeConvergence_${payload.district || 'Sehore'}_${payload.objective_key || 'Report'}.pdf`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  },

  // Analytics & Dashboard
  getDashboardSummary: async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/dashboard/summary`);
      if (!res.ok) throw new Error("Failed to fetch dashboard summary");
      return await res.json();
    } catch (err) {
      console.error("Dashboard summary error:", err);
      return null;
    }
  },

  getDistrictProfile: async (districtName = "Sehore") => {
    try {
      const res = await fetch(`${API_BASE_URL}/dashboard/district/${districtName}`);
      if (!res.ok) throw new Error("Failed to fetch district profile");
      return await res.json();
    } catch (err) {
      console.error("District profile error:", err);
      return null;
    }
  },

  // Admin
  resetDemoData: async () => {
    const res = await fetch(`${API_BASE_URL}/admin/reset-demo`, {
      method: 'POST',
    });
    if (!res.ok) throw new Error("Failed to reset database");
    return await res.json();
  }
};

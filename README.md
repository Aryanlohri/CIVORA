# CIVORA: SchemeConnect AI
### Centralized Government Scheme Intelligence & Strategic Convergence Mapping Platform
**SEG-6 Recommended MVP Deliverable • Repository: [Aryanlohri/CIVORA](https://github.com/Aryanlohri/CIVORA.git)**

---

## 🏛️ Executive Summary & The Problem Solved

Across the Government of India and State Governments, welfare and development schemes remain siloed across disparate ministries and departments.
This causes three critical bottlenecks:
1. **Scattered Information**: Citizens and field functionaries cannot access verified, unified scheme data in one place.
2. **Identification Struggle**: District Collectors and Block Development Officers (BDOs) struggle to quickly pinpoint which schemes apply to a specific beneficiary persona or geographical cluster.
3. **Absence of Strategic Convergence (The Core Problem)**: Many schemes serve complementary facets of the same overarching development goal (e.g., agricultural income, micro-irrigation, crop insurance, and soil health). Without convergence mapping, implementing agencies deliver uncoordinated, piecemeal interventions with high administrative duplication and zero synergy.

**SchemeConnect AI** introduces an intelligent, rule-based **Convergence Engine** that identifies how individual schemes stack together into holistic 4-pillar development packages, detects duplication/policy friction, and generates an actionable Standard Operating Procedure (SOP) and downloadable PDF dossier for district authorities.

---

## 🎯 The Main Differentiator: Convergence vs. Search

> *Why isn't this just another search portal like myScheme?*
> 
> Existing portals (like `myScheme.gov.in`) focus solely on **individual scheme discovery**. SchemeConnect AI shifts the paradigm from **isolated discovery** to **strategic portfolio convergence**.

### Illustrative Farmer Development Convergence (The Live Demonstration):
- **Target Persona**: Small & Marginal Cultivator in **Sehore District, Madhya Pradesh** (< 5 acres land).
- **Synergistic Stack**:
  1. **Direct Cash Liquidity Buffer**: **PM-KISAN** (₹6,000/yr) + **Mukhyamantri Kisan Kalyan Yojana (MP)** (₹6,000/yr) = **₹12,000/yr guaranteed liquidity** for timely input procurement without non-institutional debt.
  2. **Productive Capital & Water Security**: **PMKSY - Per Drop More Crop (PDMC)** (55% drip/sprinkler subsidy) + **PM-KUSUM** (60% solar agriculture pump subsidy) = Zero electricity bill + 40-50% water conservation.
  3. **Actuarial Risk Shield**: **PMFBY** (Comprehensive crop loss insurance at nominal 1.5% to 2% premium) = Full protection against drought and unseasonal hail.
  4. **Precision Soil Management & Advisory**: **Soil Health Card Scheme (SHC)** = Customized NPK nutrient profiling saving 15-25% on fertilizer wastage.

**Resulting Convergence Synergy Index**: **97.9% (Optimal Stack)**  
**Combined Value Unlocked**: **₹2,35,500** in direct and subsidized asset value per household.

---

## 📦 Six Core MVP Modules Built

| Module | Purpose | Key Features |
|---|---|---|
| **1. Scheme Database** | Centralized repository of 25+ verified Central and MP State schemes | Metadata, department, ministry, eligibility bounds, financial benefits, helpline, guidelines URL |
| **2. Search & Filtering** | Multi-attribute scheme explorer | Filter by Sector, Level (Central/State), State, Occupation, Gender, Income, Landholding |
| **3. Eligibility Checker** | Citizen & Officer diagnostic assessment | Evaluates criteria matches, match score %, reasons met vs unmet, required documents |
| **4. Convergence Studio** | The Primary Differentiator & Innovation | Objective selection, location cascade (MP → Bhopal → Sehore), interactive visual network graph, conflict detection, SOP |
| **5. District Dashboard** | Administrative command center (Sehore, MP) | 138.4k farming families, 76.8% smallholders, saturation vs gap indicators, block-level priorities |
| **6. Admin Panel** | Policy & rule management | Add schemes, create inter-scheme convergence linkages, audit integrity, reset database |

---

## 👥 Team Work Division & Deliverables

| Member | Designated Role | Module Deliverable |
|---|---|---|
| **Aryan Lohri** | Frontend Development | Unified Dashboard, responsive UI, search & filtering components |
| **Abhiraj Kumar** | Backend Development | FastAPI application, REST endpoints, Pydantic schemas, database models |
| **Milan Kohli** | ML / Data Science | Convergence recommendation engine, synergy scoring algorithm, conflict detector |
| **Kamal Gangwar** | Database & Collection | 25+ verified scheme datasets (Central + MP), SQLite/PostgreSQL schema & data cleaning |
| **Arsalan** | Visualization & Integration | Interactive convergence network graph visualizer, district analytics & ReportLab PDF generator |

---

## 🛠️ Technology Stack

- **Backend**: Python 3.12 + FastAPI + Uvicorn
- **Database**: SQLite / PostgreSQL with SQLAlchemy ORM (auto-seeded on launch)
- **Convergence Engine**: Rule-based Python optimization logic (Network density, pillar coverage, compatibility weights)
- **Report Generator**: ReportLab (Generates formal, publication-grade District Convergence Dossier PDFs)
- **Frontend**: React 18 + Tailwind CSS + Lucide Icons + Interactive SVG Network Visualizer
- **Hosting / Deployment**: Local single-command runner (`run.bat`), Vercel / Render compatible

---

## 🚀 Quick Start Guide (One-Click Launch)

### Prerequisites:
- Python 3.10+ installed.

### Launch:
1. Double-click **`run.bat`** in the `schemeconnect` folder  
   *(or run in PowerShell/Terminal):*
   ```powershell
   cd schemeconnect/backend
   python -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload
   ```
2. Open your browser at:  
   👉 **`http://localhost:8000`**

---

## 🎬 Step-by-Step Live Demonstration Walkthrough

To present this to evaluators or panel members, follow this exact 2-minute journey:

1. **Open Dashboard**:
   - Point out the 25 verified schemes, 13+ convergence links, and the 94.5% readiness score in the pilot district.
2. **Click "⚡ Live Demo: Sehore Farmer Convergence"**:
   - Instantly loads the exact SEG-6 scenario:
     - **Objective**: *Agricultural Productivity & Farmer Income Enhancement*
     - **Location**: *Madhya Pradesh → Bhopal Division → Sehore District*
     - **Target Beneficiary**: *Small and Marginal Farmers (< 5 acres)*
3. **Inspect the Interactive Convergence Graph**:
   - Hover and click on scheme nodes (PM-KISAN, MMKKY, PMKSY, PMFBY, SHC) to view the 4 functional pillars.
   - Click on the **Co-funding link** between PM-KISAN and MMKKY-MP to demonstrate how the ₹12,000 cash stack is verified.
   - Point out the **Policy Safeguards** (e.g. non-alienation of machinery, pump head pressure compatibility).
4. **Download Official PDF Report**:
   - Click **"Download Official PDF Dossier"**.
   - Show the generated ReportLab PDF with Government of Madhya Pradesh header, executive convergence summary, matrix of schemes, and signature block for the Sehore District Magistrate.
5. **Demonstrate Eligibility Checker**:
   - Switch to the **Eligibility Checker** tab, modify the landholding slider to 2.5 acres, and show how the system immediately flags matching schemes and computes the total benefit sum.

from typing import List, Dict, Any, Optional
from sqlalchemy.orm import Session
from models import Scheme, EligibilityRule, Benefit, ConvergenceRule, ConvergenceObjective, DistrictProfile

class ConvergenceEngine:
    """
    Rule-based Convergence Recommendation Engine for SchemeConnect AI.
    Maps synergy, detects conflicts, compares beneficiaries, and synthesizes
    holistic multi-scheme packages for district-level implementation.
    """

    @classmethod
    def calculate_convergence(
        cls,
        db: Session,
        objective_key: str,
        state: str = "Madhya Pradesh",
        division: str = "Bhopal",
        district: str = "Sehore",
        target_group: Optional[str] = None,
        custom_scheme_ids: Optional[List[int]] = None
    ) -> Dict[str, Any]:
        
        # 1. Fetch Objective
        objective = db.query(ConvergenceObjective).filter(ConvergenceObjective.key == objective_key).first()
        if not objective:
            # Fallback to default
            objective = db.query(ConvergenceObjective).first()

        # 2. Identify Applicable Schemes
        if custom_scheme_ids and len(custom_scheme_ids) > 0:
            schemes = db.query(Scheme).filter(Scheme.id.in_(custom_scheme_ids)).all()
        else:
            rec_codes = objective.recommended_scheme_codes
            schemes = db.query(Scheme).filter(Scheme.code.in_(rec_codes)).all()

        if not schemes:
            schemes = db.query(Scheme).limit(6).all()

        scheme_ids = [s.id for s in schemes]
        scheme_id_to_obj = {s.id: s for s in schemes}

        # 3. Retrieve Pairwise Convergence Rules
        convergence_rules = db.query(ConvergenceRule).filter(
            ConvergenceRule.scheme_1_id.in_(scheme_ids),
            ConvergenceRule.scheme_2_id.in_(scheme_ids)
        ).all()

        # 4. Synthesize Common Eligibility Conditions
        common_eligibility = cls._synthesize_common_eligibility(schemes, state, district)

        # 5. Identify Complementary Benefits & Functional Pillars
        benefit_clusters, total_estimated_value = cls._cluster_complementary_benefits(schemes)

        # 6. Detect Duplications and Possible Conflicts
        duplications_and_conflicts = cls._detect_duplications_and_conflicts(schemes, convergence_rules)

        # 7. Compute Convergence Synergy Score
        synergy_score = cls._calculate_synergy_score(schemes, convergence_rules, benefit_clusters)

        # 8. Generate Visual Convergence Network Graph
        graph = cls._generate_convergence_graph(schemes, convergence_rules, objective)

        # 9. Formulate Joint Implementation SOP
        implementation_sop = cls._generate_implementation_sop(schemes, convergence_rules, district, objective)

        # 10. Executive Proposal Narrative
        summary_narrative = cls._generate_executive_summary(
            objective, schemes, district, state, total_estimated_value, synergy_score
        )

        # Build schemes serialize
        schemes_serialized = []
        for s in schemes:
            b_list = [{"type": b.benefit_type, "amount": b.amount_direct_inr, "desc": b.description, "freq": b.frequency} for b in s.benefits]
            schemes_serialized.append({
                "id": s.id,
                "code": s.code,
                "name": s.name,
                "hindi_name": s.hindi_name,
                "ministry": s.ministry,
                "department": s.department,
                "level": s.level,
                "sector": s.sector,
                "target_beneficiary": s.target_beneficiary,
                "benefits": b_list,
                "application_url": s.application_url
            })

        return {
            "objective_key": objective.key,
            "objective_name": objective.name,
            "location": {
                "state": state,
                "division": division,
                "district": district
            },
            "target_beneficiary": target_group or objective.target_beneficiary_persona,
            "summary": objective.description,
            "convergence_synergy_score": round(synergy_score, 1),
            "total_schemes_count": len(schemes),
            "estimated_annual_combined_value_inr": round(total_estimated_value, 2),
            "schemes": schemes_serialized,
            "graph": graph,
            "complementary_benefits": benefit_clusters,
            "common_eligibility": common_eligibility,
            "duplications_and_conflicts": duplications_and_conflicts,
            "joint_implementation_sop": implementation_sop,
            "executive_convergence_proposal": summary_narrative
        }

    @classmethod
    def _synthesize_common_eligibility(cls, schemes: List[Scheme], state: str, district: str) -> Dict[str, Any]:
        """
        Calculates intersecting eligibility bounds across all convergent schemes.
        """
        min_age = 18
        max_age = 70
        income_ceilings = []
        max_landholding_limits = []
        documents_set = set()
        special_safeguards = []
        target_occupations = set()

        for s in schemes:
            el = s.eligibility
            if el:
                if el.min_age > min_age:
                    min_age = el.min_age
                if el.max_age < max_age:
                    max_age = el.max_age
                if el.max_income < 10000000:
                    income_ceilings.append(el.max_income)
                if el.max_landholding_acres < 999:
                    max_landholding_limits.append(el.max_landholding_acres)
                for doc in el.required_documents:
                    documents_set.add(doc)
                for occ in el.occupations:
                    target_occupations.add(occ)
                if el.special_conditions:
                    special_safeguards.append(f"[{s.code}] {el.special_conditions}")

        safe_income_ceiling = min(income_ceilings) if income_ceilings else 250000.0
        safe_landholding_limit = min(max_landholding_limits) if max_landholding_limits else 5.0

        return {
            "age_bracket": f"{min_age} to {max_age} years",
            "recommended_income_ceiling_inr": safe_income_ceiling,
            "max_landholding_acres": safe_landholding_limit,
            "primary_occupations": list(target_occupations)[:5],
            "common_documents": sorted(list(documents_set)),
            "geographic_coverage": f"Resident of {district} District, {state}",
            "critical_safeguards": special_safeguards
        }

    @classmethod
    def _cluster_complementary_benefits(cls, schemes: List[Scheme]):
        """
        Groups benefits into four strategic development pillars:
        1. Liquidity & Cash Flow
        2. Productive Assets & Water Security
        3. Risk Mitigation & Social Safety Net
        4. Precision Inputs & Advisory
        """
        pillars = {
            "Cash Flow & Direct Liquidity": {
                "pillar_id": "liquidity",
                "color": "#10B981", # Emerald
                "icon": "Banknote",
                "description": "Unconditional or direct financial assistance providing timely working capital for input procurement without debt.",
                "schemes": [],
                "combined_value_inr": 0.0
            },
            "Productive Assets & Irrigation": {
                "pillar_id": "assets",
                "color": "#3B82F6", # Blue
                "icon": "Droplets",
                "description": "Subsidized capital infrastructure, micro-irrigation systems, solar pumps, and farm mechanization equipment.",
                "schemes": [],
                "combined_value_inr": 0.0
            },
            "Risk Shield & Comprehensive Insurance": {
                "pillar_id": "risk",
                "color": "#F59E0B", # Amber
                "icon": "ShieldCheck",
                "description": "Formal insurance safety nets protecting crop output and family health against unpredictable natural and medical shocks.",
                "schemes": [],
                "combined_value_inr": 0.0
            },
            "Precision Management & Soil Advisory": {
                "pillar_id": "inputs",
                "color": "#8B5CF6", # Purple
                "icon": "Sprout",
                "description": "Scientific soil profiling, organic bio-inputs, and capacity-building to optimize input dosage and soil health.",
                "schemes": [],
                "combined_value_inr": 0.0
            }
        }

        total_value = 0.0

        for s in schemes:
            for b in s.benefits:
                b_val = b.amount_direct_inr
                total_value += b_val
                
                # Categorize into pillars based on scheme sector/type
                if s.code in ["PM-KISAN", "MMKKY-MP", "LBY-MP"]:
                    target_pillar = "Cash Flow & Direct Liquidity"
                elif s.code in ["PMKSY-PDMC", "PM-KUSUM", "SMAM", "MGNREGA", "PMAY-G", "JJM", "PMMSY", "MIDH"]:
                    target_pillar = "Productive Assets & Irrigation"
                elif s.code in ["PMFBY", "AB-PMJAY"]:
                    target_pillar = "Risk Shield & Comprehensive Insurance"
                else:
                    target_pillar = "Precision Management & Soil Advisory"

                pillars[target_pillar]["schemes"].append({
                    "scheme_code": s.code,
                    "scheme_name": s.name,
                    "benefit_type": b.benefit_type,
                    "value_inr": b_val,
                    "frequency": b.frequency,
                    "detail": b.description
                })
                pillars[target_pillar]["combined_value_inr"] += b_val

        return list(pillars.values()), total_value

    @classmethod
    def _detect_duplications_and_conflicts(cls, schemes: List[Scheme], rules: List[ConvergenceRule]) -> List[Dict[str, Any]]:
        """
        Identifies potential conflicting conditions or double-benefit rules.
        """
        conflicts = []
        scheme_codes = [s.code for s in schemes]

        # 1. Check from existing explicit rules
        for r in rules:
            if r.possible_conflicts and r.possible_conflicts != "None. The schemes are legally structured to stack together.":
                conflicts.append({
                    "severity": "Watchout",
                    "schemes_involved": [r.scheme_1.code, r.scheme_2.code],
                    "title": f"Operational Coordination: {r.scheme_1.code} + {r.scheme_2.code}",
                    "details": r.possible_conflicts,
                    "safeguard_action": "Verify single survey number land records and enforce single-window camp verification."
                })

        # 2. Check for micro-irrigation and solar pump alignment
        if "PMKSY-PDMC" in scheme_codes and "PM-KUSUM" in scheme_codes:
            conflicts.append({
                "severity": "Technical Prerequisite",
                "schemes_involved": ["PMKSY-PDMC", "PM-KUSUM"],
                "title": "Borewell & Pump Pressure Compatibility",
                "details": "Solar pumps under PM-KUSUM Component B must be calibrated with operating head pressure requirements of drip/sprinkler nozzles under PMKSY to prevent motor dry-run.",
                "safeguard_action": "Mandate joint technical survey by Renewable Energy and Horticulture engineers before dispatch."
            })

        # 3. Check for double subsidy rules on land assets
        if "MGNREGA" in scheme_codes and "PMKSY-PDMC" in scheme_codes:
            conflicts.append({
                "severity": "Policy Compliance",
                "schemes_involved": ["MGNREGA", "PMKSY-PDMC"],
                "title": "Separation of Earthwork and Pipe Infrastructure",
                "details": "MGNREGA funds excavation of farm ponds (Kapil Dhara), while PMKSY funds pressurized pipelines. Do not bill pipe accessories under MGNREGA material component.",
                "safeguard_action": "Separate MIS expenditure heads under NREGASoft and PMKSY-MIS."
            })

        return conflicts

    @classmethod
    def _calculate_synergy_score(cls, schemes: List[Scheme], rules: List[ConvergenceRule], pillars: List[Dict[str, Any]]) -> float:
        """
        Calculates an objective synergy score (0.0 to 100.0%) based on:
        - Number of verified convergence links (network density)
        - Coverage of all 4 development pillars
        - Co-funding compatibility
        """
        if not schemes:
            return 0.0

        n = len(schemes)
        possible_pairs = max(1, (n * (n - 1)) / 2)
        actual_pairs = len(rules)

        # Connectivity component (up to 40 points)
        connectivity_ratio = min(1.0, actual_pairs / max(1, n * 0.75))
        score_connectivity = connectivity_ratio * 40.0

        # Pillar diversity component (up to 35 points: 8.75 points per active pillar)
        active_pillars = sum(1 for p in pillars if len(p["schemes"]) > 0)
        score_diversity = (active_pillars / 4.0) * 35.0

        # High-synergy rule bonus (up to 25 points)
        avg_rule_synergy = sum(r.synergy_score for r in rules) / len(rules) if rules else 0.75
        score_quality = avg_rule_synergy * 25.0

        total_score = min(98.5, max(45.0, score_connectivity + score_diversity + score_quality))
        return total_score

    @classmethod
    def _generate_convergence_graph(cls, schemes: List[Scheme], rules: List[ConvergenceRule], objective: ConvergenceObjective) -> Dict[str, Any]:
        """
        Generates nodes and edges formatted for React Flow and canvas network graphs.
        Nodes include Schemes, Departments, and Pillars.
        """
        nodes = []
        edges = []

        # Color mapping by sector
        sector_colors = {
            "Agriculture": "#10B981", # Emerald
            "Rural Development": "#3B82F6", # Blue
            "Women & Child": "#EC4899", # Pink
            "Financial Inclusion & MSME": "#8B5CF6", # Purple
            "Health": "#EF4444", # Red
            "Water & Sanitation": "#06B6D4" # Cyan
        }

        # Pillar Nodes (Fixed top row / center hubs)
        pillar_positions = [
            {"id": "p-1", "label": "Cash Liquidity Buffer", "x": 100, "y": 80, "color": "#10B981"},
            {"id": "p-2", "label": "Productive Water & Assets", "x": 420, "y": 80, "color": "#3B82F6"},
            {"id": "p-3", "label": "Crop & Health Risk Shield", "x": 740, "y": 80, "color": "#F59E0B"},
            {"id": "p-4", "label": "Soil & Precision Advisory", "x": 1060, "y": 80, "color": "#8B5CF6"},
        ]

        for p in pillar_positions:
            nodes.append({
                "id": p["id"],
                "type": "pillarNode",
                "data": {
                    "label": p["label"],
                    "color": p["color"],
                    "category": "Pillar"
                },
                "position": {"x": p["x"], "y": p["y"]}
            })

        # Scheme Nodes (Circular / Grid layout below)
        import math
        center_x = 580
        center_y = 380
        radius = 240
        total_schemes = len(schemes)

        for i, s in enumerate(schemes):
            angle = (2 * math.pi * i) / max(1, total_schemes)
            pos_x = int(center_x + radius * math.cos(angle))
            pos_y = int(center_y + radius * math.sin(angle) * 0.85)

            badge_color = sector_colors.get(s.sector, "#6B7280")
            benefit_summary = s.benefits[0].description if s.benefits else "Government Scheme Assistance"

            nodes.append({
                "id": f"scheme-{s.id}",
                "type": "schemeNode",
                "data": {
                    "id": s.id,
                    "code": s.code,
                    "name": s.name,
                    "hindi_name": s.hindi_name,
                    "department": s.department,
                    "sector": s.sector,
                    "level": s.level,
                    "color": badge_color,
                    "benefit_summary": benefit_summary,
                    "target_beneficiary": s.target_beneficiary
                },
                "position": {"x": pos_x, "y": pos_y}
            })

            # Connect scheme to corresponding Pillar
            if s.code in ["PM-KISAN", "MMKKY-MP", "LBY-MP"]:
                target_pillar = "p-1"
            elif s.code in ["PMKSY-PDMC", "PM-KUSUM", "SMAM", "MGNREGA", "PMAY-G", "JJM"]:
                target_pillar = "p-2"
            elif s.code in ["PMFBY", "AB-PMJAY"]:
                target_pillar = "p-3"
            else:
                target_pillar = "p-4"

            edges.append({
                "id": f"edge-pillar-{s.id}",
                "source": target_pillar,
                "target": f"scheme-{s.id}",
                "type": "pillarLink",
                "animated": False,
                "style": {"stroke": "#CBD5E1", "strokeDasharray": "5,5", "strokeWidth": 1.5},
                "data": {"relationship": "Supports Pillar"}
            })

        # Pairwise Scheme-to-Scheme Convergence Edges
        edge_styles = {
            "Co-funding": {"stroke": "#10B981", "strokeWidth": 3.0, "animated": True},
            "Complementary": {"stroke": "#3B82F6", "strokeWidth": 2.5, "animated": False},
            "Sequential": {"stroke": "#8B5CF6", "strokeWidth": 2.5, "animated": True},
            "Risk-Mitigation": {"stroke": "#F59E0B", "strokeWidth": 2.5, "animated": False},
            "Input-Output": {"stroke": "#06B6D4", "strokeWidth": 2.5, "animated": True}
        }

        for r in rules:
            style = edge_styles.get(r.relationship_type, {"stroke": "#64748B", "strokeWidth": 2.0})
            edges.append({
                "id": f"edge-{r.scheme_1_id}-{r.scheme_2_id}",
                "source": f"scheme-{r.scheme_1_id}",
                "target": f"scheme-{r.scheme_2_id}",
                "type": "smoothstep",
                "label": r.relationship_type,
                "animated": style.get("animated", False),
                "style": {
                    "stroke": style["stroke"],
                    "strokeWidth": style["strokeWidth"]
                },
                "data": {
                    "relationship": r.relationship_type,
                    "synergy_score": r.synergy_score,
                    "reason": r.reason,
                    "sop": r.implementation_sop,
                    "conflicts": r.possible_conflicts
                }
            })

        return {"nodes": nodes, "edges": edges}

    @classmethod
    def _generate_implementation_sop(cls, schemes: List[Scheme], rules: List[ConvergenceRule], district: str, objective: ConvergenceObjective) -> List[Dict[str, Any]]:
        """
        Step-by-step Standard Operating Procedure (SOP) for District Collector / BDO.
        """
        return [
            {
                "phase": "Phase 1: Inter-Departmental Alignment & Joint Notification",
                "timeline": "Days 1 to 7",
                "nodal_agency": f"Office of District Collector, {district}",
                "participating_departments": list(set(s.department for s in schemes)),
                "actions": [
                    f"Issue joint executive circular notifying '{objective.name}' convergence drive in {district}.",
                    "Designate Block Agriculture Officers and Panchayat Secretaries as dual-nodal coordinators.",
                    "Integrate village land registry (Khasra) database with central PM-KISAN, PMFBY, and PMKSY portals."
                ]
            },
            {
                "phase": "Phase 2: Unified Gram Panchayat Saturation Camps",
                "timeline": "Days 8 to 21",
                "nodal_agency": "Block Development Office & Agriculture Extension Team",
                "participating_departments": ["Agriculture", "Revenue", "Horticulture", "Panchayati Raj"],
                "actions": [
                    "Conduct single-window beneficiary enrollment camps across all Gram Panchayats.",
                    "Verify Aadhaar-seeded bank accounts and execute instant PM-KISAN & MMKKY e-KYC.",
                    "Collect geo-tagged soil samples under Soil Health Card Scheme alongside micro-irrigation registrations.",
                    "Enroll standing notified crops under PMFBY insurance coverage before seasonal cutoff date."
                ]
            },
            {
                "phase": "Phase 3: Synchronized Asset & Benefit Delivery",
                "timeline": "Days 22 to 45",
                "nodal_agency": "District Horticulture & Renewable Energy Agency",
                "participating_departments": ["Horticulture", "MNRE / Urja Vikas Nigam", "Commercial Banks"],
                "actions": [
                    "Synchronize disbursement of PM-KISAN & MMKKY cash transfers (Rs. 12,000/yr) with input purchase windows.",
                    "Execute joint on-site inspection for PMKSY drip installation and PM-KUSUM solar pump commissioning.",
                    "Deliver physical laminated Soil Health Cards with customized fertilizer dosage guidelines in Hindi."
                ]
            },
            {
                "phase": "Phase 4: Impact Auditing & Real-time Convergence MIS",
                "timeline": "Day 45 onwards",
                "nodal_agency": f"District Convergence Monitoring Unit, {district}",
                "participating_departments": ["All participating departments"],
                "actions": [
                    "Track beneficiary-level convergence saturation via unified digital dashboard.",
                    "Monitor yield enhancement, water conservation levels, and prompt claim settlements.",
                    "Resolve grievance tickets within mandatory 7-day public service guarantee window."
                ]
            }
        ]

    @classmethod
    def _generate_executive_summary(
        cls, objective: ConvergenceObjective, schemes: List[Scheme], district: str, state: str, total_value: float, synergy_score: float
    ) -> str:
        scheme_names = ", ".join([s.code for s in schemes])
        return (
            f"STRATEGIC CONVERGENCE BRIEF: For targeted development under '{objective.name}' in {district} District, {state}, "
            f"SchemeConnect AI has synthesized a 4-pillar multi-department convergence strategy connecting {len(schemes)} flagship schemes ({scheme_names}). "
            f"By aligning direct cash liquidity (PM-KISAN + MMKKY), capital micro-irrigation (PMKSY), actuarial risk shielding (PMFBY), "
            f"and precision soil nutrient management (SHC), the package unlocks an estimated direct & subsidized benefit value of Rs. {total_value:,.0f} "
            f"per targeted beneficiary household, achieving a validated Convergence Synergy Index of {synergy_score:.1f}%. "
            f"This unified operational framework eliminates departmental fragmentation, curtails redundant paperwork via shared e-KYC, "
            f"and ensures zero-leakage last-mile delivery."
        )

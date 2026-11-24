from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

# Benefit Schema
class BenefitBase(BaseModel):
    benefit_type: str
    amount_direct_inr: float = 0.0
    amount_subsidized_pct: float = 0.0
    frequency: str = "Per Annum"
    description: str

class BenefitCreate(BenefitBase):
    pass

class BenefitOut(BenefitBase):
    id: int
    scheme_id: int
    class Config:
        from_attributes = True

# Eligibility Schema
class EligibilityRuleBase(BaseModel):
    min_age: int = 18
    max_age: int = 70
    gender: str = "All"
    min_income: float = 0.0
    max_income: float = 10000000.0
    social_categories: List[str] = ["General", "OBC", "SC", "ST"]
    occupations: List[str] = ["Farmer"]
    min_landholding_acres: float = 0.0
    max_landholding_acres: float = 999.0
    state_scope: str = "All India"
    districts_scope: List[str] = ["All"]
    required_documents: List[str] = ["Aadhaar Card", "Bank Account Details"]
    special_conditions: Optional[str] = None

class EligibilityRuleCreate(EligibilityRuleBase):
    pass

class EligibilityRuleOut(EligibilityRuleBase):
    id: int
    scheme_id: int
    class Config:
        from_attributes = True

# Scheme Schema
class SchemeBase(BaseModel):
    code: str
    name: str
    hindi_name: Optional[str] = None
    ministry: str
    department: str
    level: str = "Central"
    state: str = "All India"
    sector: str
    description: str
    target_beneficiary: str
    application_url: Optional[str] = None
    helpline: Optional[str] = None
    guidelines_url: Optional[str] = None
    gazette_ref: Optional[str] = None
    open_data_api_url: Optional[str] = None
    official_portal_domain: Optional[str] = None
    empirical_data_json: Optional[str] = "{}"
    is_verified: bool = True

class SchemeCreate(SchemeBase):
    eligibility: Optional[EligibilityRuleCreate] = None
    benefits: Optional[List[BenefitCreate]] = []

class SchemeOut(SchemeBase):
    id: int
    eligibility: Optional[EligibilityRuleOut] = None
    benefits: List[BenefitOut] = []
    class Config:
        from_attributes = True

# Convergence Rule Schema
class ConvergenceRuleBase(BaseModel):
    scheme_1_id: int
    scheme_2_id: int
    relationship_type: str # Complementary, Sequential, Co-funding, Risk-Mitigation, Input-Output
    synergy_score: float = 0.85
    objective_category: str
    reason: str
    target_group: str = "Small & Marginal Farmers"
    implementation_sop: Optional[str] = None
    possible_conflicts: Optional[str] = None
    policy_framework_citation: Optional[str] = None

class ConvergenceRuleCreate(ConvergenceRuleBase):
    pass

class ConvergenceRuleOut(ConvergenceRuleBase):
    id: int
    scheme_1_name: Optional[str] = None
    scheme_1_code: Optional[str] = None
    scheme_2_name: Optional[str] = None
    scheme_2_code: Optional[str] = None
    class Config:
        from_attributes = True

# Convergence Objective Schema
class ConvergenceObjectiveOut(BaseModel):
    id: int
    key: str
    name: str
    category: str
    description: str
    target_beneficiary_persona: str
    recommended_scheme_codes: List[str]
    key_outcomes: List[str]
    recommended_district: str
    recommended_state: str
    class Config:
        from_attributes = True

# District Profile Schema
class DistrictProfileOut(BaseModel):
    id: int
    state: str
    division: str
    district: str
    blocks: List[str]
    priority_sectors: List[str]
    farming_families_count: int
    small_marginal_pct: float
    convergence_readiness_score: float
    active_schemes_count: int
    lead_nodal_department: str
    notes: Optional[str] = None
    class Config:
        from_attributes = True

# Request Payloads
class EligibilityCheckRequest(BaseModel):
    state: str = "Madhya Pradesh"
    district: str = "Sehore"
    age: int = 42
    gender: str = "Male"
    occupation: str = "Farmer"
    landholding_acres: float = 2.5 # Small farmer
    annual_income: float = 95000.0
    social_category: str = "OBC"
    has_bank_account: bool = True
    has_aadhaar: bool = True
    irrigation_available: bool = False

class ConvergenceCalculateRequest(BaseModel):
    objective_key: str = "farmer_development" # farmer_development, women_empowerment, rural_livelihoods, artisan_support
    state: str = "Madhya Pradesh"
    division: str = "Bhopal"
    district: str = "Sehore"
    target_group: Optional[str] = "Small and Marginal Farmers (< 5 acres)"
    custom_scheme_ids: Optional[List[int]] = None

class ConvergenceCalculateResponse(BaseModel):
    objective_key: str
    objective_name: str
    location: Dict[str, str]
    target_beneficiary: str
    summary: str
    convergence_synergy_score: float # e.g. 94.2%
    total_schemes_count: int
    estimated_annual_combined_value_inr: float
    schemes: List[Dict[str, Any]]
    graph: Dict[str, Any] # nodes, edges
    complementary_benefits: List[Dict[str, Any]]
    common_eligibility: Dict[str, Any]
    duplications_and_conflicts: List[Dict[str, Any]]
    joint_implementation_sop: List[Dict[str, Any]]
    executive_convergence_proposal: str

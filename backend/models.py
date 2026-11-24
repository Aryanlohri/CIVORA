import json
from datetime import datetime
from sqlalchemy import (
    Column, Integer, String, Text, Boolean, Float, ForeignKey, DateTime
)
from sqlalchemy.orm import relationship
from database import Base

class Scheme(Base):
    __tablename__ = "schemes"

    id = Column(Integer, primary_key=True, index=True)
    code = Column(String(50), unique=True, index=True, nullable=False)
    name = Column(String(255), nullable=False, index=True)
    hindi_name = Column(String(255), nullable=True)
    ministry = Column(String(255), nullable=False)
    department = Column(String(255), nullable=False, index=True)
    level = Column(String(50), nullable=False, default="Central")  # Central, State, Centrally Sponsored
    state = Column(String(100), nullable=False, default="All India") # All India, Madhya Pradesh, etc.
    sector = Column(String(100), nullable=False, index=True) # Agriculture, Rural Development, Women & Child, etc.
    description = Column(Text, nullable=False)
    target_beneficiary = Column(String(255), nullable=False)
    application_url = Column(String(500), nullable=True)
    helpline = Column(String(100), nullable=True)
    guidelines_url = Column(String(500), nullable=True)
    is_verified = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    eligibility = relationship("EligibilityRule", back_populates="scheme", uselist=False, cascade="all, delete-orphan")
    benefits = relationship("Benefit", back_populates="scheme", cascade="all, delete-orphan")
    
    # As scheme 1 in convergence
    outgoing_convergences = relationship("ConvergenceRule", foreign_keys="ConvergenceRule.scheme_1_id", back_populates="scheme_1", cascade="all, delete-orphan")
    incoming_convergences = relationship("ConvergenceRule", foreign_keys="ConvergenceRule.scheme_2_id", back_populates="scheme_2", cascade="all, delete-orphan")


class EligibilityRule(Base):
    __tablename__ = "eligibility_rules"

    id = Column(Integer, primary_key=True, index=True)
    scheme_id = Column(Integer, ForeignKey("schemes.id"), nullable=False, unique=True)
    
    min_age = Column(Integer, default=18)
    max_age = Column(Integer, default=70)
    gender = Column(String(20), default="All") # All, Female, Male
    min_income = Column(Float, default=0.0)
    max_income = Column(Float, default=10000000.0) # Income ceiling
    
    # JSON strings for array fields
    social_categories_json = Column(Text, default='["General", "OBC", "SC", "ST"]')
    occupations_json = Column(Text, default='["Farmer", "Agricultural Laborer"]')
    
    min_landholding_acres = Column(Float, default=0.0)
    max_landholding_acres = Column(Float, default=999.0) # E.g., 5.0 for small/marginal
    
    state_scope = Column(String(100), default="All India")
    districts_scope_json = Column(Text, default='["All"]') # ["All"] or ["Sehore", "Bhopal", ...]
    
    required_documents_json = Column(Text, default='["Aadhaar Card", "Bank Account Details"]')
    special_conditions = Column(Text, nullable=True)
    
    scheme = relationship("Scheme", back_populates="eligibility")

    @property
    def social_categories(self):
        try:
            return json.loads(self.social_categories_json or '[]')
        except Exception:
            return []

    @property
    def occupations(self):
        try:
            return json.loads(self.occupations_json or '[]')
        except Exception:
            return []

    @property
    def districts_scope(self):
        try:
            return json.loads(self.districts_scope_json or '[]')
        except Exception:
            return []

    @property
    def required_documents(self):
        try:
            return json.loads(self.required_documents_json or '[]')
        except Exception:
            return []


class Benefit(Base):
    __tablename__ = "benefits"

    id = Column(Integer, primary_key=True, index=True)
    scheme_id = Column(Integer, ForeignKey("schemes.id"), nullable=False)
    
    benefit_type = Column(String(100), nullable=False) # Direct Cash Transfer, Financial Subsidy, Insurance Coverage, Asset Creation, Skill/Training, Credit Linkage
    amount_direct_inr = Column(Float, default=0.0)
    amount_subsidized_pct = Column(Float, default=0.0)
    frequency = Column(String(50), default="Per Annum") # One-time, Per Annum, Per Installment, Seasonal, Need-based
    description = Column(Text, nullable=False)
    
    scheme = relationship("Scheme", back_populates="benefits")


class ConvergenceRule(Base):
    __tablename__ = "convergence_rules"

    id = Column(Integer, primary_key=True, index=True)
    scheme_1_id = Column(Integer, ForeignKey("schemes.id"), nullable=False)
    scheme_2_id = Column(Integer, ForeignKey("schemes.id"), nullable=False)
    
    relationship_type = Column(String(50), nullable=False) # Complementary, Sequential, Co-funding, Risk-Mitigation, Input-Output
    synergy_score = Column(Float, default=0.85) # 0.0 to 1.0
    objective_category = Column(String(100), nullable=False) # Farmer Development, Women Empowerment, Rural Livelihoods, Artisan Upliftment
    reason = Column(Text, nullable=False)
    target_group = Column(String(255), default="Small & Marginal Farmers")
    implementation_sop = Column(Text, nullable=True)
    possible_conflicts = Column(Text, nullable=True) # Warnings or duplications to guard against

    scheme_1 = relationship("Scheme", foreign_keys=[scheme_1_id], back_populates="outgoing_convergences")
    scheme_2 = relationship("Scheme", foreign_keys=[scheme_2_id], back_populates="incoming_convergences")


class ConvergenceObjective(Base):
    __tablename__ = "convergence_objectives"

    id = Column(Integer, primary_key=True, index=True)
    key = Column(String(100), unique=True, index=True, nullable=False)
    name = Column(String(255), nullable=False)
    category = Column(String(100), nullable=False)
    description = Column(Text, nullable=False)
    target_beneficiary_persona = Column(String(255), nullable=False)
    recommended_scheme_codes_json = Column(Text, default='[]')
    key_outcomes_json = Column(Text, default='[]')
    recommended_district = Column(String(100), default="Sehore")
    recommended_state = Column(String(100), default="Madhya Pradesh")

    @property
    def recommended_scheme_codes(self):
        try:
            return json.loads(self.recommended_scheme_codes_json or '[]')
        except Exception:
            return []

    @property
    def key_outcomes(self):
        try:
            return json.loads(self.key_outcomes_json or '[]')
        except Exception:
            return []


class DistrictProfile(Base):
    __tablename__ = "district_profiles"

    id = Column(Integer, primary_key=True, index=True)
    state = Column(String(100), nullable=False, default="Madhya Pradesh")
    division = Column(String(100), nullable=False, default="Bhopal")
    district = Column(String(100), unique=True, index=True, nullable=False)
    blocks_json = Column(Text, default='[]')
    priority_sectors_json = Column(Text, default='[]')
    farming_families_count = Column(Integer, default=125000)
    small_marginal_pct = Column(Float, default=74.5)
    convergence_readiness_score = Column(Float, default=88.0) # 0 to 100
    active_schemes_count = Column(Integer, default=24)
    lead_nodal_department = Column(String(255), default="Department of Agriculture & Farmers Welfare")
    notes = Column(Text, nullable=True)

    @property
    def blocks(self):
        try:
            return json.loads(self.blocks_json or '[]')
        except Exception:
            return []

    @property
    def priority_sectors(self):
        try:
            return json.loads(self.priority_sectors_json or '[]')
        except Exception:
            return []

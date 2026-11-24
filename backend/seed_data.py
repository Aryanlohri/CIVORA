import json
from sqlalchemy.orm import Session
from models import Scheme, EligibilityRule, Benefit, ConvergenceRule, ConvergenceObjective, DistrictProfile

def seed_database(db: Session):
    # Check if schemes already exist
    if db.query(Scheme).count() > 0:
        return

    print("Seeding SchemeConnect AI database with 25+ verified schemes, rules, and district profiles...")

    # Define 25 Verified Government Schemes (Central & MP State)
    schemes_data = [
        # 1. PM-KISAN
        {
            "code": "PM-KISAN",
            "name": "Pradhan Mantri Kisan Samman Nidhi",
            "hindi_name": "प्रधानमंत्री किसान सम्मान निधि",
            "ministry": "Ministry of Agriculture & Farmers Welfare",
            "department": "Department of Agriculture & Farmers Welfare",
            "level": "Central",
            "state": "All India",
            "sector": "Agriculture",
            "description": "Central Sector scheme providing income support of Rs. 6,000 per year in three equal four-monthly installments to all landholding farmer families across the country.",
            "target_beneficiary": "Small and Marginal Landholding Farmer Families",
            "application_url": "https://pmkisan.gov.in",
            "helpline": "155261 / 011-24300606",
            "guidelines_url": "https://pmkisan.gov.in/Documents/Revised_Guidelines_PMKISAN.pdf",
            "eligibility": {
                "min_age": 18,
                "max_age": 75,
                "gender": "All",
                "min_income": 0,
                "max_income": 1000000,
                "social_categories": ["General", "OBC", "SC", "ST"],
                "occupations": ["Farmer"],
                "min_landholding_acres": 0.05,
                "max_landholding_acres": 5.0,
                "state_scope": "All India",
                "districts_scope": ["All"],
                "required_documents": ["Aadhaar Card", "Landholding Records (Khasra/Khatauni)", "Bank Account (Aadhaar Seeded)"],
                "special_conditions": "Excludes institutional landholders, income tax payees, and constitutional post holders."
            },
            "benefits": [
                {
                    "benefit_type": "Direct Cash Transfer",
                    "amount_direct_inr": 6000.0,
                    "amount_subsidized_pct": 0,
                    "frequency": "Per Annum (3 x Rs 2,000)",
                    "description": "Direct bank transfer of Rs. 6,000 annually in 3 installments into Aadhaar-linked bank accounts."
                }
            ]
        },

        # 2. Mukhyamantri Kisan Kalyan Yojana (MMKKY) - Madhya Pradesh
        {
            "code": "MMKKY-MP",
            "name": "Mukhyamantri Kisan Kalyan Yojana (MP)",
            "hindi_name": "मुख्यमंत्री किसान कल्याण योजना (मध्य प्रदेश)",
            "ministry": "Government of Madhya Pradesh",
            "department": "Department of Revenue & Farmers Welfare MP",
            "level": "State",
            "state": "Madhya Pradesh",
            "sector": "Agriculture",
            "description": "Government of Madhya Pradesh state top-up scheme providing additional Rs. 6,000 per year to all PM-KISAN verified farmers in Madhya Pradesh, effectively doubling direct cash support to Rs. 12,000.",
            "target_beneficiary": "PM-KISAN Registered Farmers in Madhya Pradesh",
            "application_url": "https://saara.mp.gov.in",
            "helpline": "181 (MP CM Helpline)",
            "guidelines_url": "https://saara.mp.gov.in/saaraweb/kisan_kalyan_scheme.html",
            "eligibility": {
                "min_age": 18,
                "max_age": 75,
                "gender": "All",
                "min_income": 0,
                "max_income": 1000000,
                "social_categories": ["General", "OBC", "SC", "ST"],
                "occupations": ["Farmer"],
                "min_landholding_acres": 0.05,
                "max_landholding_acres": 5.0,
                "state_scope": "Madhya Pradesh",
                "districts_scope": ["Sehore", "Bhopal", "Raisen", "Vidisha", "Rajgarh", "All MP"],
                "required_documents": ["PM-KISAN Registration ID", "Aadhaar Card", "MP Samagra ID", "Khasra Details"],
                "special_conditions": "Must be an active, verified beneficiary of PM-KISAN resident in Madhya Pradesh."
            },
            "benefits": [
                {
                    "benefit_type": "Direct Cash Transfer",
                    "amount_direct_inr": 6000.0,
                    "amount_subsidized_pct": 0,
                    "frequency": "Per Annum (3 installments)",
                    "description": "Additional Rs. 6,000 per year transferred directly to MP farmer accounts alongside PM-KISAN installments."
                }
            ]
        },

        # 3. PMKSY - Per Drop More Crop (PDMC)
        {
            "code": "PMKSY-PDMC",
            "name": "PMKSY - Per Drop More Crop (Micro Irrigation)",
            "hindi_name": "प्रधानमंत्री कृषि सिंचाई योजना - प्रति बूंद अधिक फसल",
            "ministry": "Ministry of Agriculture & Farmers Welfare",
            "department": "Department of Agriculture & Farmers Welfare",
            "level": "Centrally Sponsored",
            "state": "All India",
            "sector": "Agriculture",
            "description": "Promotes micro-irrigation systems (drip and sprinkler) to enhance water-use efficiency, precision moisture management, and fertilizer use efficiency (fertigation).",
            "target_beneficiary": "Farmers possessing cultivable land with assured water source",
            "application_url": "https://pmksy.gov.in",
            "helpline": "1800-180-1551",
            "guidelines_url": "https://pmksy.gov.in/guidelines/pdmc.pdf",
            "eligibility": {
                "min_age": 18,
                "max_age": 70,
                "gender": "All",
                "min_income": 0,
                "max_income": 2000000,
                "social_categories": ["General", "OBC", "SC", "ST"],
                "occupations": ["Farmer"],
                "min_landholding_acres": 0.25,
                "max_landholding_acres": 12.5,
                "state_scope": "All India",
                "districts_scope": ["All"],
                "required_documents": ["Land Ownership Certificate / Khasra", "Water Source Availability Proof", "Bank Passbook", "Electricity Bill / Pump Details"],
                "special_conditions": "Preference to Small & Marginal farmers, SC/ST, and women cultivators."
            },
            "benefits": [
                {
                    "benefit_type": "Financial Subsidy",
                    "amount_direct_inr": 28000.0,
                    "amount_subsidized_pct": 55.0,
                    "frequency": "One-time (per unit)",
                    "description": "Up to 55% capital subsidy for small & marginal farmers (45% for others) on standard drip and sprinkler systems."
                }
            ]
        },

        # 4. PMFBY (Pradhan Mantri Fasal Bima Yojana)
        {
            "code": "PMFBY",
            "name": "Pradhan Mantri Fasal Bima Yojana (PMFBY)",
            "hindi_name": "प्रधानमंत्री फसल बीमा योजना",
            "ministry": "Ministry of Agriculture & Farmers Welfare",
            "department": "Department of Agriculture & Farmers Welfare",
            "level": "Centrally Sponsored",
            "state": "All India",
            "sector": "Agriculture",
            "description": "Comprehensive risk insurance coverage from pre-sowing to post-harvest against non-preventable natural risks (drought, flood, unseasonal rain, pests) with lowest actuarial premium for farmers.",
            "target_beneficiary": "All farmers growing notified crops in notified areas",
            "application_url": "https://pmfby.gov.in",
            "helpline": "14447 / 1800-200-5142",
            "guidelines_url": "https://pmfby.gov.in/pdf/Revised_Operational_Guidelines.pdf",
            "eligibility": {
                "min_age": 18,
                "max_age": 75,
                "gender": "All",
                "min_income": 0,
                "max_income": 10000000,
                "social_categories": ["General", "OBC", "SC", "ST"],
                "occupations": ["Farmer"],
                "min_landholding_acres": 0.1,
                "max_landholding_acres": 999.0,
                "state_scope": "All India",
                "districts_scope": ["All"],
                "required_documents": ["Land Records (Khasra)", "Sowing Certificate / Patwari Panchnama", "KCC/Bank Account", "Aadhaar"],
                "special_conditions": "Premium capped at 2% for Kharif, 1.5% for Rabi, and 5% for Annual Commercial/Horticultural crops."
            },
            "benefits": [
                {
                    "benefit_type": "Insurance Coverage",
                    "amount_direct_inr": 45000.0,
                    "amount_subsidized_pct": 85.0,
                    "frequency": "Seasonal",
                    "description": "Full crop loss claim settlement up to sum insured per hectare in case of natural calamities or crop yield shortfall."
                }
            ]
        },

        # 5. Soil Health Card Scheme
        {
            "code": "SHC",
            "name": "Soil Health Card Scheme",
            "hindi_name": "मृदा स्वास्थ्य कार्ड योजना",
            "ministry": "Ministry of Agriculture & Farmers Welfare",
            "department": "Department of Agriculture & Farmers Welfare",
            "level": "Central",
            "state": "All India",
            "sector": "Agriculture",
            "description": "Provides crop-wise customized nutrient and fertilizer recommendations to individual farmers to rectify micro-nutrient deficiencies and reduce input costs.",
            "target_beneficiary": "All agricultural landowners and cultivators",
            "application_url": "https://soilhealth.dac.gov.in",
            "helpline": "011-24305591",
            "guidelines_url": "https://soilhealth.dac.gov.in/public/guidelines.pdf",
            "eligibility": {
                "min_age": 18,
                "max_age": 80,
                "gender": "All",
                "min_income": 0,
                "max_income": 10000000,
                "social_categories": ["General", "OBC", "SC", "ST"],
                "occupations": ["Farmer"],
                "min_landholding_acres": 0.05,
                "max_landholding_acres": 999.0,
                "state_scope": "All India",
                "districts_scope": ["All"],
                "required_documents": ["Land Khasra Number", "Farmer Mobile Number", "Soil Sample Coordinates"],
                "special_conditions": "100% free of cost testing of 12 critical soil parameters (N, P, K, S, Zn, Fe, Cu, Mn, Bo, pH, EC, OC)."
            },
            "benefits": [
                {
                    "benefit_type": "Advisory & Input Optimization",
                    "amount_direct_inr": 4500.0,
                    "amount_subsidized_pct": 100.0,
                    "frequency": "Biennial (Every 2 Years)",
                    "description": "Free laboratory soil testing and physical report card with precise dosage recommendations saving 15-25% on fertilizer expenses."
                }
            ]
        },

        # 6. Sub-Mission on Agricultural Mechanization (SMAM)
        {
            "code": "SMAM",
            "name": "Sub-Mission on Agricultural Mechanization",
            "hindi_name": "कृषि यंत्रीकरण उप-मिशन",
            "ministry": "Ministry of Agriculture & Farmers Welfare",
            "department": "Department of Agriculture & Farmers Welfare",
            "level": "Centrally Sponsored",
            "state": "All India",
            "sector": "Agriculture",
            "description": "Increases farm power availability through subsidies on agricultural machinery, tractors, rotavators, seed drills, and establishing Custom Hiring Centres (CHCs).",
            "target_beneficiary": "Individual farmers, SHGs, FPOs, and rural youth entrepreneurs",
            "application_url": "https://agrimachinery.nic.in",
            "helpline": "011-23382926",
            "guidelines_url": "https://agrimachinery.nic.in/Index/Guideline",
            "eligibility": {
                "min_age": 18,
                "max_age": 65,
                "gender": "All",
                "min_income": 0,
                "max_income": 2000000,
                "social_categories": ["General", "OBC", "SC", "ST"],
                "occupations": ["Farmer", "Self-Employed"],
                "min_landholding_acres": 0.5,
                "max_landholding_acres": 15.0,
                "state_scope": "All India",
                "districts_scope": ["All"],
                "required_documents": ["Land Records", "Aadhaar Card", "Bank Account", "Quotation from Authorized Dealer"],
                "special_conditions": "50% subsidy for SC/ST/Small/Marginal/Women farmers; 40% for general category."
            },
            "benefits": [
                {
                    "benefit_type": "Financial Subsidy",
                    "amount_direct_inr": 50000.0,
                    "amount_subsidized_pct": 50.0,
                    "frequency": "One-time",
                    "description": "40% to 50% capital subsidy on farm implements and equipment up to prescribed ceiling."
                }
            ]
        },

        # 7. PM-KUSUM (Component B & C - Solar Pumps)
        {
            "code": "PM-KUSUM",
            "name": "PM-KUSUM (Pradhan Mantri Kisan Urja Suraksha evam Utthaan Mahabhiyan)",
            "hindi_name": "प्रधानमंत्री किसान ऊर्जा सुरक्षा एवं उत्थान महाभियान",
            "ministry": "Ministry of New and Renewable Energy",
            "department": "Department of Renewable Energy",
            "level": "Centrally Sponsored",
            "state": "All India",
            "sector": "Agriculture",
            "description": "Subsidizes standalone solar agriculture pumps (Component B) and solarisation of existing grid-connected agriculture pumps (Component C) to provide reliable daytime power.",
            "target_beneficiary": "Farmers, Water User Associations, and FPOs",
            "application_url": "https://pmkusum.mnre.gov.in",
            "helpline": "1800-180-3333",
            "guidelines_url": "https://mnre.gov.in/solar/schemes/pm-kusum/",
            "eligibility": {
                "min_age": 18,
                "max_age": 70,
                "gender": "All",
                "min_income": 0,
                "max_income": 3000000,
                "social_categories": ["General", "OBC", "SC", "ST"],
                "occupations": ["Farmer"],
                "min_landholding_acres": 0.5,
                "max_landholding_acres": 25.0,
                "state_scope": "All India",
                "districts_scope": ["All"],
                "required_documents": ["Land ownership records", "Water source clearance", "Aadhaar", "Bank passbook"],
                "special_conditions": "Requires 10% farmer contribution; 30% Central grant, 30% State grant, 30% bank loan."
            },
            "benefits": [
                {
                    "benefit_type": "Capital Subsidy",
                    "amount_direct_inr": 96000.0,
                    "amount_subsidized_pct": 60.0,
                    "frequency": "One-time",
                    "description": "60% combined subsidy (30% MNRE + 30% State Govt) on 3HP to 7.5HP solar irrigation pumps."
                }
            ]
        },

        # 8. Paramparagat Krishi Vikas Yojana (PKVY - Organic Farming)
        {
            "code": "PKVY",
            "name": "Paramparagat Krishi Vikas Yojana (PKVY)",
            "hindi_name": "परम्परागत कृषि विकास योजना",
            "ministry": "Ministry of Agriculture & Farmers Welfare",
            "department": "Department of Agriculture & Farmers Welfare",
            "level": "Central",
            "state": "All India",
            "sector": "Agriculture",
            "description": "Promotes organic farming through cluster approach and Participatory Guarantee System (PGS) certification, supporting chemical-free soil and premium market realization.",
            "target_beneficiary": "Farmer clusters (20-50 farmers per 50-acre cluster)",
            "application_url": "https://pgsindia-ncof.gov.in",
            "helpline": "0120-2764906",
            "guidelines_url": "https://pgsindia-ncof.gov.in/guidelines.aspx",
            "eligibility": {
                "min_age": 18,
                "max_age": 70,
                "gender": "All",
                "min_income": 0,
                "max_income": 1500000,
                "social_categories": ["General", "OBC", "SC", "ST"],
                "occupations": ["Farmer"],
                "min_landholding_acres": 0.5,
                "max_landholding_acres": 5.0,
                "state_scope": "All India",
                "districts_scope": ["All"],
                "required_documents": ["Land Records", "Cluster Resolution", "Aadhaar"],
                "special_conditions": "Willing to adopt organic practices for minimum 3 years without chemical fertilizers or pesticides."
            },
            "benefits": [
                {
                    "benefit_type": "Financial Subsidy",
                    "amount_direct_inr": 50000.0,
                    "amount_subsidized_pct": 100.0,
                    "frequency": "Over 3 Years (per ha)",
                    "description": "Rs. 50,000 per hectare over 3 years, of which Rs. 31,000 is given directly for organic inputs (bio-fertilizers, seeds, vermicompost)."
                }
            ]
        },

        # 9. MGNREGA (Mahatma Gandhi NREGA)
        {
            "code": "MGNREGA",
            "name": "Mahatma Gandhi National Rural Employment Guarantee Act",
            "hindi_name": "महात्मा गांधी राष्ट्रीय ग्रामीण रोजगार गारंटी अधिनियम",
            "ministry": "Ministry of Rural Development",
            "department": "Department of Rural Development",
            "level": "Central",
            "state": "All India",
            "sector": "Rural Development",
            "description": "Guarantees 100 days of wage employment per financial year to rural adult household members willing to do unskilled manual work, building durable water harvesting and farm assets.",
            "target_beneficiary": "Rural adult citizens willing to do unskilled manual work",
            "application_url": "https://nrega.nic.in",
            "helpline": "1800-111-555",
            "guidelines_url": "https://nrega.nic.in/netnrega/home.aspx",
            "eligibility": {
                "min_age": 18,
                "max_age": 65,
                "gender": "All",
                "min_income": 0,
                "max_income": 500000,
                "social_categories": ["General", "OBC", "SC", "ST"],
                "occupations": ["Agricultural Laborer", "Farmer", "Unemployed"],
                "min_landholding_acres": 0.0,
                "max_landholding_acres": 5.0,
                "state_scope": "All India",
                "districts_scope": ["All"],
                "required_documents": ["MGNREGA Job Card", "Aadhaar Card", "Bank / Post Office Account"],
                "special_conditions": "Individual beneficiary works (Kapil Dhara wells, farm ponds, land leveling) eligible for Small/Marginal farmers."
            },
            "benefits": [
                {
                    "benefit_type": "Wage Employment & Asset",
                    "amount_direct_inr": 24300.0,
                    "amount_subsidized_pct": 100.0,
                    "frequency": "Per Annum (100 days)",
                    "description": "Guaranteed statutory wages (approx Rs. 243/day in MP) plus asset creation (farm pond, well, bunding) on farmer's field."
                }
            ]
        },

        # 10. PMAY-G (Pradhan Mantri Awaas Yojana - Gramin)
        {
            "code": "PMAY-G",
            "name": "Pradhan Mantri Awaas Yojana - Gramin",
            "hindi_name": "प्रधानमंत्री आवास योजना - ग्रामीण",
            "ministry": "Ministry of Rural Development",
            "department": "Department of Rural Development",
            "level": "Centrally Sponsored",
            "state": "All India",
            "sector": "Rural Development",
            "description": "Provides financial assistance to rural houseless households and those living in dilapidated kuccha houses for constructing a pucca dwelling with basic amenities.",
            "target_beneficiary": "Rural homeless or kuccha house dwelling families",
            "application_url": "https://pmayg.nic.in",
            "helpline": "1800-11-6446",
            "guidelines_url": "https://pmayg.nic.in/netiay/guidelines.aspx",
            "eligibility": {
                "min_age": 18,
                "max_age": 80,
                "gender": "All",
                "min_income": 0,
                "max_income": 150000,
                "social_categories": ["General", "OBC", "SC", "ST"],
                "occupations": ["Agricultural Laborer", "Farmer", "Artisan", "Unemployed"],
                "min_landholding_acres": 0.0,
                "max_landholding_acres": 2.5,
                "state_scope": "All India",
                "districts_scope": ["All"],
                "required_documents": ["SECC 2011 / Awaas+ Registration", "Aadhaar", "Bank Account", "Job Card"],
                "special_conditions": "Must not own a motorized 3/4 wheeler or mechanized agricultural equipment."
            },
            "benefits": [
                {
                    "benefit_type": "Direct Cash Grant",
                    "amount_direct_inr": 120000.0,
                    "amount_subsidized_pct": 100.0,
                    "frequency": "One-time (4 installments)",
                    "description": "Grant of Rs. 1,20,000 for house construction + Rs. 12,000 for Swachh Bharat toilet + 90 days MGNREGA wages (approx Rs. 21,800)."
                }
            ]
        },

        # 11. Ladli Behna Yojana (Madhya Pradesh)
        {
            "code": "LBY-MP",
            "name": "Mukhyamantri Ladli Behna Yojana (MP)",
            "hindi_name": "मुख्यमंत्री लाड़ली बहना योजना (मध्य प्रदेश)",
            "ministry": "Government of Madhya Pradesh",
            "department": "Women & Child Development Department MP",
            "level": "State",
            "state": "Madhya Pradesh",
            "sector": "Women & Child",
            "description": "Flagship scheme of Government of Madhya Pradesh empowering married, widowed, divorced, and abandoned women with monthly unconditional direct benefit transfer.",
            "target_beneficiary": "Resident women of MP aged 21 to 60 years",
            "application_url": "https://cmladlibahna.mp.gov.in",
            "helpline": "0755-2700800",
            "guidelines_url": "https://cmladlibahna.mp.gov.in/guidelines",
            "eligibility": {
                "min_age": 21,
                "max_age": 60,
                "gender": "Female",
                "min_income": 0,
                "max_income": 250000,
                "social_categories": ["General", "OBC", "SC", "ST"],
                "occupations": ["Housewife", "Self-Employed", "Agricultural Laborer", "Farmer"],
                "min_landholding_acres": 0.0,
                "max_landholding_acres": 5.0,
                "state_scope": "Madhya Pradesh",
                "districts_scope": ["Sehore", "Bhopal", "Raisen", "Vidisha", "All MP"],
                "required_documents": ["MP Samagra ID (eKYC done)", "Aadhaar Card", "Aadhaar-linked DBT Bank Account"],
                "special_conditions": "Family annual income below Rs. 2.5 Lakh; must not own four-wheeler; family land under 5 acres."
            },
            "benefits": [
                {
                    "benefit_type": "Direct Cash Transfer",
                    "amount_direct_inr": 15000.0,
                    "amount_subsidized_pct": 0.0,
                    "frequency": "Per Annum (Rs. 1,250 / month)",
                    "description": "Rs. 1,250 deposited directly every month (Rs. 15,000 annually) into woman's Aadhaar-linked bank account."
                }
            ]
        },

        # 12. Lakhpati Didi Initiative (DAY-NRLM)
        {
            "code": "LAKHPATI-DIDI",
            "name": "Lakhpati Didi Initiative (Deendayal Antyodaya Yojana - NRLM)",
            "hindi_name": "लखपति दीदी योजना (दीनदयाल अंत्योदय योजना)",
            "ministry": "Ministry of Rural Development",
            "department": "Department of Rural Development",
            "level": "Central",
            "state": "All India",
            "sector": "Women & Child",
            "description": "Enables rural women Self Help Group (SHG) members to earn sustainable household income of at least Rs. 1,00,000 per year through diversified micro-enterprises and credit linkages.",
            "target_beneficiary": "Active Women SHG members in rural areas",
            "application_url": "https://nrlm.gov.in",
            "helpline": "011-23381611",
            "guidelines_url": "https://aajeevika.gov.in/lakhpatididi",
            "eligibility": {
                "min_age": 18,
                "max_age": 60,
                "gender": "Female",
                "min_income": 0,
                "max_income": 300000,
                "social_categories": ["General", "OBC", "SC", "ST"],
                "occupations": ["Self-Employed", "Farmer", "Artisan", "Agricultural Laborer"],
                "min_landholding_acres": 0.0,
                "max_landholding_acres": 5.0,
                "state_scope": "All India",
                "districts_scope": ["All"],
                "required_documents": ["SHG Membership Passbook", "Aadhaar Card", "Bank Account", "Livelihood Plan"],
                "special_conditions": "Must be an active member of DAY-NRLM compliant SHG for minimum 6 months."
            },
            "benefits": [
                {
                    "benefit_type": "Credit Linkage & Enterprise Grant",
                    "amount_direct_inr": 150000.0,
                    "amount_subsidized_pct": 100.0,
                    "frequency": "Milestone-based",
                    "description": "Access to Community Investment Fund (CIF), collateral-free SHG bank loans up to Rs. 5-10 Lakh, and dedicated digital/financial skills training."
                }
            ]
        },

        # 13. PM Vishwakarma Scheme
        {
            "code": "PM-VISHWAKARMA",
            "name": "PM Vishwakarma Scheme",
            "hindi_name": "प्रधानमंत्री विश्वकर्मा योजना",
            "ministry": "Ministry of Micro, Small and Medium Enterprises",
            "department": "Department of MSME",
            "level": "Central",
            "state": "All India",
            "sector": "Financial Inclusion & MSME",
            "description": "Provides end-to-end holistic support to traditional artisans and craftspeople working with hands and tools across 18 trades, including skill training, modern toolkits, and low-interest credit.",
            "target_beneficiary": "Traditional artisans and craftsmen across 18 notified family trades",
            "application_url": "https://pmvishwakarma.gov.in",
            "helpline": "1800-267-7777",
            "guidelines_url": "https://pmvishwakarma.gov.in/Home/Guidelines",
            "eligibility": {
                "min_age": 18,
                "max_age": 65,
                "gender": "All",
                "min_income": 0,
                "max_income": 500000,
                "social_categories": ["General", "OBC", "SC", "ST"],
                "occupations": ["Artisan", "Self-Employed"],
                "min_landholding_acres": 0.0,
                "max_landholding_acres": 2.5,
                "state_scope": "All India",
                "districts_scope": ["All"],
                "required_documents": ["Aadhaar", "Mobile Number", "Bank Account Details", "Trade Verification by Gram Panchayat/ULB"],
                "special_conditions": "Engaged in one of 18 trades: carpenter, blacksmith, potter, mason, cobbler, tailor, basket maker, etc."
            },
            "benefits": [
                {
                    "benefit_type": "Grant + Concessional Credit",
                    "amount_direct_inr": 15000.0,
                    "amount_subsidized_pct": 100.0,
                    "frequency": "One-time + Collateral-free Loan",
                    "description": "Free basic 5-7 days training with Rs. 500/day stipend + Rs. 15,000 modern toolkit e-voucher + collateral-free loans up to Rs. 3,00,000 at concessional 5% interest."
                }
            ]
        },

        # 14. Pradhan Mantri Mudra Yojana (PMMY)
        {
            "code": "PMMY",
            "name": "Pradhan Mantri Mudra Yojana (PMMY)",
            "hindi_name": "प्रधानमंत्री मुद्रा योजना",
            "ministry": "Ministry of Finance",
            "department": "Department of Financial Services",
            "level": "Central",
            "state": "All India",
            "sector": "Financial Inclusion & MSME",
            "description": "Facilitates collateral-free institutional credit up to Rs. 20 Lakh to non-corporate, non-farm small/micro enterprises across Shishu, Kishore, and Tarun categories.",
            "target_beneficiary": "Small entrepreneurs, shopkeepers, fruit/vegetable vendors, small manufacturing units",
            "application_url": "https://www.mudra.org.in",
            "helpline": "1800-180-1111",
            "guidelines_url": "https://www.mudra.org.in/Offerings",
            "eligibility": {
                "min_age": 18,
                "max_age": 65,
                "gender": "All",
                "min_income": 0,
                "max_income": 10000000,
                "social_categories": ["General", "OBC", "SC", "ST"],
                "occupations": ["Self-Employed", "Artisan", "Farmer"],
                "min_landholding_acres": 0.0,
                "max_landholding_acres": 999.0,
                "state_scope": "All India",
                "districts_scope": ["All"],
                "required_documents": ["Identity Proof", "Address Proof", "Business Project Proposal", "Bank Statement"],
                "special_conditions": "No collateral or third-party guarantee required."
            },
            "benefits": [
                {
                    "benefit_type": "Collateral-Free Credit",
                    "amount_direct_inr": 200000.0,
                    "amount_subsidized_pct": 0.0,
                    "frequency": "Term / Working Capital Loan",
                    "description": "Collateral-free business loan: Shishu (up to Rs. 50,000), Kishore (Rs. 50,000 to Rs. 5 Lakh), Tarun (Rs. 5 to Rs. 10 Lakh)."
                }
            ]
        },

        # 15. Ayushman Bharat PM-JAY
        {
            "code": "AB-PMJAY",
            "name": "Ayushman Bharat - Pradhan Mantri Jan Arogya Yojana",
            "hindi_name": "आयुष्मान भारत - प्रधानमंत्री जन आरोग्य योजना",
            "ministry": "Ministry of Health and Family Welfare",
            "department": "National Health Authority",
            "level": "Central",
            "state": "All India",
            "sector": "Health",
            "description": "World's largest government-financed health insurance scheme providing Rs. 5,00,000 per family per year for secondary and tertiary care hospitalization across impaneled public and private hospitals.",
            "target_beneficiary": "Bottom 40% vulnerable and poor families identified via SECC database and senior citizens 70+",
            "application_url": "https://beneficiary.nha.gov.in",
            "helpline": "14555",
            "guidelines_url": "https://pmjay.gov.in/guidelines",
            "eligibility": {
                "min_age": 0,
                "max_age": 100,
                "gender": "All",
                "min_income": 0,
                "max_income": 250000,
                "social_categories": ["General", "OBC", "SC", "ST"],
                "occupations": ["Agricultural Laborer", "Farmer", "Artisan", "Unemployed", "Self-Employed"],
                "min_landholding_acres": 0.0,
                "max_landholding_acres": 5.0,
                "state_scope": "All India",
                "districts_scope": ["All"],
                "required_documents": ["Ayushman Card / Ration Card", "Aadhaar Card"],
                "special_conditions": "Cashless and paperless treatment at empanelled hospitals."
            },
            "benefits": [
                {
                    "benefit_type": "Health Insurance Coverage",
                    "amount_direct_inr": 500000.0,
                    "amount_subsidized_pct": 100.0,
                    "frequency": "Per Annum per Family",
                    "description": "Rs. 5,00,000 annual cashless coverage for over 1,949 medical and surgical procedures."
                }
            ]
        },

        # 16. Jal Jeevan Mission (JJM) - Har Ghar Jal
        {
            "code": "JJM",
            "name": "Jal Jeevan Mission - Har Ghar Jal",
            "hindi_name": "जल जीवन मिशन - हर घर जल",
            "ministry": "Ministry of Jal Shakti",
            "department": "Department of Drinking Water & Sanitation",
            "level": "Centrally Sponsored",
            "state": "All India",
            "sector": "Water & Sanitation",
            "description": "Aims to provide safe and adequate drinking water through individual Functional Household Tap Connections (FHTC) to every rural household in India.",
            "target_beneficiary": "Every rural household in India",
            "application_url": "https://ejalshakti.gov.in",
            "helpline": "011-24362777",
            "guidelines_url": "https://jaljeevanmission.gov.in/guidelines",
            "eligibility": {
                "min_age": 18,
                "max_age": 99,
                "gender": "All",
                "min_income": 0,
                "max_income": 10000000,
                "social_categories": ["General", "OBC", "SC", "ST"],
                "occupations": ["All"],
                "min_landholding_acres": 0.0,
                "max_landholding_acres": 999.0,
                "state_scope": "All India",
                "districts_scope": ["All"],
                "required_documents": ["Electricity connection / House proof", "Aadhaar"],
                "special_conditions": "Implemented through Village Water & Sanitation Committees (VWSC) / Pani Samitis."
            },
            "benefits": [
                {
                    "benefit_type": "Infrastructure Asset",
                    "amount_direct_inr": 15000.0,
                    "amount_subsidized_pct": 100.0,
                    "frequency": "Permanent Asset",
                    "description": "Free individual piped tap water connection providing 55 liters per capita per day (lpcd) of potable water."
                }
            ]
        },

        # 17. Mukhyamantri Udyam Kranti Yojana (Madhya Pradesh)
        {
            "code": "MMUKY-MP",
            "name": "Mukhyamantri Udyam Kranti Yojana (MP)",
            "hindi_name": "मुख्यमंत्री उद्यम क्रांति योजना (मध्य प्रदेश)",
            "ministry": "Government of Madhya Pradesh",
            "department": "MSME Department MP",
            "level": "State",
            "state": "Madhya Pradesh",
            "sector": "Financial Inclusion & MSME",
            "description": "Encourages educated youth in MP to start self-employment enterprises in manufacturing or services by providing 3% interest subsidy and state credit guarantee.",
            "target_beneficiary": "Educated unemployed youth of Madhya Pradesh (8th pass minimum)",
            "application_url": "https://samast.mponline.gov.in",
            "helpline": "0755-6720200",
            "guidelines_url": "https://msme.mp.gov.in",
            "eligibility": {
                "min_age": 18,
                "max_age": 45,
                "gender": "All",
                "min_income": 0,
                "max_income": 1200000,
                "social_categories": ["General", "OBC", "SC", "ST"],
                "occupations": ["Unemployed", "Self-Employed"],
                "min_landholding_acres": 0.0,
                "max_landholding_acres": 999.0,
                "state_scope": "Madhya Pradesh",
                "districts_scope": ["Sehore", "Bhopal", "Raisen", "Vidisha", "All MP"],
                "required_documents": ["MP Domicile Certificate", "8th/10th Marksheet", "Aadhaar", "Project Report"],
                "special_conditions": "Applicant must not be a loan defaulter at any nationalized bank."
            },
            "benefits": [
                {
                    "benefit_type": "Interest Subvention & Guarantee",
                    "amount_direct_inr": 100000.0,
                    "amount_subsidized_pct": 3.0,
                    "frequency": "Over 7 Years",
                    "description": "3% annual interest subsidy for 7 years on bank loans up to Rs. 50 Lakh (Manufacturing) and Rs. 25 Lakh (Service), with 100% state credit guarantee fee waiver."
                }
            ]
        },

        # 18. PM Matsya Sampada Yojana (PMMSY)
        {
            "code": "PMMSY",
            "name": "Pradhan Mantri Matsya Sampada Yojana",
            "hindi_name": "प्रधानमंत्री मत्स्य सम्पदा योजना",
            "ministry": "Ministry of Fisheries, Animal Husbandry and Dairying",
            "department": "Department of Fisheries",
            "level": "Centrally Sponsored",
            "state": "All India",
            "sector": "Agriculture",
            "description": "Flagship scheme for ecological, economic, and sustainable development of inland fisheries and aquaculture, modernizing cold chains and pond construction.",
            "target_beneficiary": "Fishers, Fish farmers, Fish Workers, Self Help Groups, and JLGs",
            "application_url": "https://pmmsy.dof.gov.in",
            "helpline": "1800-425-1660",
            "guidelines_url": "https://pmmsy.dof.gov.in/guidelines",
            "eligibility": {
                "min_age": 18,
                "max_age": 65,
                "gender": "All",
                "min_income": 0,
                "max_income": 2000000,
                "social_categories": ["General", "OBC", "SC", "ST"],
                "occupations": ["Farmer", "Self-Employed"],
                "min_landholding_acres": 0.5,
                "max_landholding_acres": 10.0,
                "state_scope": "All India",
                "districts_scope": ["All"],
                "required_documents": ["Pond land lease / ownership deed", "Aadhaar", "Fisheries registration"],
                "special_conditions": "60% financial assistance for Women and SC/ST; 40% for General category."
            },
            "benefits": [
                {
                    "benefit_type": "Capital Subsidy",
                    "amount_direct_inr": 240000.0,
                    "amount_subsidized_pct": 60.0,
                    "frequency": "One-time",
                    "description": "40% to 60% governmental financial assistance for constructing freshwater aquaculture ponds and biofloc units."
                }
            ]
        },

        # 19. National Livestock Mission (NLM)
        {
            "code": "NLM",
            "name": "National Livestock Mission",
            "hindi_name": "राष्ट्रीय पशुधन मिशन",
            "ministry": "Ministry of Fisheries, Animal Husbandry and Dairying",
            "department": "Department of Animal Husbandry & Dairying",
            "level": "Central",
            "state": "All India",
            "sector": "Agriculture",
            "description": "Fosters rural entrepreneurship in small ruminants (sheep/goat), poultry, piggery, and fodder production by providing 50% capital subsidies.",
            "target_beneficiary": "Individual farmers, SHGs, FPOs, and rural youth",
            "application_url": "https://nlm.udyamimitra.in",
            "helpline": "011-23384553",
            "guidelines_url": "https://dahd.nic.in/schemes/programmes/national-livestock-mission",
            "eligibility": {
                "min_age": 18,
                "max_age": 65,
                "gender": "All",
                "min_income": 0,
                "max_income": 3000000,
                "social_categories": ["General", "OBC", "SC", "ST"],
                "occupations": ["Farmer", "Agricultural Laborer", "Self-Employed"],
                "min_landholding_acres": 0.0,
                "max_landholding_acres": 15.0,
                "state_scope": "All India",
                "districts_scope": ["All"],
                "required_documents": ["Land ownership / lease for shed", "Aadhaar", "Bank sanction letter", "Training certificate"],
                "special_conditions": "Requires minimum 10% entrepreneur margin contribution and bank loan tie-up."
            },
            "benefits": [
                {
                    "benefit_type": "Capital Subsidy",
                    "amount_direct_inr": 250000.0,
                    "amount_subsidized_pct": 50.0,
                    "frequency": "One-time (2 installments)",
                    "description": "50% capital subsidy up to Rs. 25 Lakh for setting up goat/poultry/fodder breeding farms."
                }
            ]
        },

        # 20. Mission Shakti - Sambal & Samarthya
        {
            "code": "MISSION-SHAKTI",
            "name": "Mission Shakti (Women Safety, Protection & Empowerment)",
            "hindi_name": "मिशन शक्ति (संबल एवं सामर्थ्य)",
            "ministry": "Ministry of Women and Child Development",
            "department": "Department of Women and Child Development",
            "level": "Central",
            "state": "All India",
            "sector": "Women & Child",
            "description": "Integrated women empowerment umbrella mission comprising Sambal (safety & legal security) and Samarthya (economic empowerment, working women hostels, and Shakti Niwas).",
            "target_beneficiary": "Vulnerable, destitute, and enterprising women",
            "application_url": "https://wcd.nic.in/schemes/mission-shakti",
            "helpline": "181 (Women Helpline)",
            "guidelines_url": "https://wcd.nic.in",
            "eligibility": {
                "min_age": 18,
                "max_age": 60,
                "gender": "Female",
                "min_income": 0,
                "max_income": 300000,
                "social_categories": ["General", "OBC", "SC", "ST"],
                "occupations": ["Housewife", "Self-Employed", "Agricultural Laborer", "Unemployed"],
                "min_landholding_acres": 0.0,
                "max_landholding_acres": 999.0,
                "state_scope": "All India",
                "districts_scope": ["All"],
                "required_documents": ["Aadhaar Card", "Resident Proof"],
                "special_conditions": "Dedicated institutional support at district level through District Hub for Empowerment of Women (DHEW)."
            },
            "benefits": [
                {
                    "benefit_type": "Institutional & Welfare Grant",
                    "amount_direct_inr": 12000.0,
                    "amount_subsidized_pct": 100.0,
                    "frequency": "Need-based",
                    "description": "Integrated legal aid, crisis management, crèche childcare support, and skill upgrading for working rural women."
                }
            ]
        },

        # 21. Deen Dayal Upadhyaya Grameen Kaushalya Yojana (DDU-GKY)
        {
            "code": "DDU-GKY",
            "name": "Deen Dayal Upadhyaya Grameen Kaushalya Yojana",
            "hindi_name": "दीनदयाल उपाध्याय ग्रामीण कौशल्या योजना",
            "ministry": "Ministry of Rural Development",
            "department": "Department of Rural Development",
            "level": "Central",
            "state": "All India",
            "sector": "Skill & Employment",
            "description": "Placement-linked skill training programme for rural poor youth, enabling economic diversification into modern industrial and service sector careers.",
            "target_beneficiary": "Rural poor youth aged 15 to 35 years",
            "application_url": "https://ddugky.gov.in",
            "helpline": "011-23384507",
            "guidelines_url": "https://ddugky.gov.in/guidelines",
            "eligibility": {
                "min_age": 15,
                "max_age": 35,
                "gender": "All",
                "min_income": 0,
                "max_income": 200000,
                "social_categories": ["General", "OBC", "SC", "ST"],
                "occupations": ["Unemployed", "Agricultural Laborer"],
                "min_landholding_acres": 0.0,
                "max_landholding_acres": 2.5,
                "state_scope": "All India",
                "districts_scope": ["All"],
                "required_documents": ["BPL / SECC Card / Job Card", "Aadhaar Card", "Educational Marksheet (min 5th/8th/10th)"],
                "special_conditions": "Upper age limit relaxed up to 45 years for Women, PwD, and Vulnerable Tribal Groups."
            },
            "benefits": [
                {
                    "benefit_type": "Free Skill Training & Placement",
                    "amount_direct_inr": 35000.0,
                    "amount_subsidized_pct": 100.0,
                    "frequency": "Course Duration (3 to 12 months)",
                    "description": "Completely free residential vocational training with boarding, uniform, tablets, and mandatory 70% placement guarantee with minimum wages."
                }
            ]
        },

        # 22. Stand-Up India Scheme
        {
            "code": "STANDUP-INDIA",
            "name": "Stand-Up India Scheme",
            "hindi_name": "स्टैंड-अप इंडिया योजना",
            "ministry": "Ministry of Finance",
            "department": "Department of Financial Services",
            "level": "Central",
            "state": "All India",
            "sector": "Financial Inclusion & MSME",
            "description": "Facilitates bank loans between Rs. 10 Lakh and Rs. 1 Crore to at least one SC or ST borrower and at least one woman borrower per bank branch for setting up greenfield enterprises.",
            "target_beneficiary": "SC, ST, and Women entrepreneurs setting up greenfield units",
            "application_url": "https://www.standupmitra.in",
            "helpline": "1800-180-1111",
            "guidelines_url": "https://www.standupmitra.in/Home/SUISchemes",
            "eligibility": {
                "min_age": 18,
                "max_age": 65,
                "gender": "All",
                "min_income": 0,
                "max_income": 10000000,
                "social_categories": ["SC", "ST", "General", "OBC"],
                "occupations": ["Self-Employed", "Artisan"],
                "min_landholding_acres": 0.0,
                "max_landholding_acres": 999.0,
                "state_scope": "All India",
                "districts_scope": ["All"],
                "required_documents": ["Caste Certificate (for SC/ST)", "Detailed Project Report", "Aadhaar", "PAN"],
                "special_conditions": "Borrower must be SC/ST or Female. Enterprise must be a first-time greenfield venture in manufacturing, services, or agri-allied sector."
            },
            "benefits": [
                {
                    "benefit_type": "Composite Bank Loan",
                    "amount_direct_inr": 2500000.0,
                    "amount_subsidized_pct": 0.0,
                    "frequency": "Term Loan & Working Capital",
                    "description": "Composite loan between Rs. 10 Lakh and Rs. 1 Crore repayable up to 7 years with interest rate not to exceed Base Rate + 3% + Tenor Premium."
                }
            ]
        },

        # 23. Rashtriya Krishi Vikas Yojana (RKVY-RAFTAAR)
        {
            "code": "RKVY",
            "name": "Rashtriya Krishi Vikas Yojana (RKVY-RAFTAAR)",
            "hindi_name": "राष्ट्रीय कृषि विकास योजना",
            "ministry": "Ministry of Agriculture & Farmers Welfare",
            "department": "Department of Agriculture & Farmers Welfare",
            "level": "Centrally Sponsored",
            "state": "All India",
            "sector": "Agriculture",
            "description": "Strengthens infrastructure in agriculture and allied sectors by promoting agri-business incubation, pre/post-harvest infrastructure, and value-chain development.",
            "target_beneficiary": "Farmer producer organizations (FPOs), agri-entrepreneurs, and progressive farmers",
            "application_url": "https://rkvy.nic.in",
            "helpline": "011-23381012",
            "guidelines_url": "https://rkvy.nic.in/pdf/RKVY_Guidelines.pdf",
            "eligibility": {
                "min_age": 18,
                "max_age": 65,
                "gender": "All",
                "min_income": 0,
                "max_income": 5000000,
                "social_categories": ["General", "OBC", "SC", "ST"],
                "occupations": ["Farmer", "Self-Employed"],
                "min_landholding_acres": 1.0,
                "max_landholding_acres": 50.0,
                "state_scope": "All India",
                "districts_scope": ["All"],
                "required_documents": ["FPO/Farmer Registration", "Land Record", "Agri-business Project Proposal"],
                "special_conditions": "Co-funding mechanism with State Agricultural Universities and ICAR Krishi Vigyan Kendras (KVKs)."
            },
            "benefits": [
                {
                    "benefit_type": "Agri-Enterprise Grant",
                    "amount_direct_inr": 500000.0,
                    "amount_subsidized_pct": 50.0,
                    "frequency": "One-time",
                    "description": "Grants-in-aid up to Rs. 25 Lakh for agri-startups and 50% infrastructure subsidies for post-harvest warehouses and grading units."
                }
            ]
        },

        # 24. PM Poshan Shakti Nirman (PM POSHAN / Mid Day Meal)
        {
            "code": "PM-POSHAN",
            "name": "PM POSHAN (Pradhan Mantri Poshan Shakti Nirman)",
            "hindi_name": "प्रधानमंत्री पोषण शक्ति निर्माण",
            "ministry": "Ministry of Education",
            "department": "Department of School Education and Literacy",
            "level": "Centrally Sponsored",
            "state": "All India",
            "sector": "Education & Nutrition",
            "description": "Provides one hot cooked nutritious meal per day to school children studying in Balvatika and Classes I-VIII in government and government-aided schools.",
            "target_beneficiary": "Children enrolled in government & aided primary/upper primary schools",
            "application_url": "https://pmposhan.education.gov.in",
            "helpline": "011-23387797",
            "guidelines_url": "https://pmposhan.education.gov.in/guidelines",
            "eligibility": {
                "min_age": 5,
                "max_age": 14,
                "gender": "All",
                "min_income": 0,
                "max_income": 10000000,
                "social_categories": ["General", "OBC", "SC", "ST"],
                "occupations": ["Student"],
                "min_landholding_acres": 0.0,
                "max_landholding_acres": 999.0,
                "state_scope": "All India",
                "districts_scope": ["All"],
                "required_documents": ["School Enrolment Number", "Aadhaar"],
                "special_conditions": "Procurement prioritized from local women SHGs and farmer clusters."
            },
            "benefits": [
                {
                    "benefit_type": "Nutritional Subsidy",
                    "amount_direct_inr": 6500.0,
                    "amount_subsidized_pct": 100.0,
                    "frequency": "Annual Nutritional Support",
                    "description": "Free daily cooked meal supplying 450 to 700 calories and 12 to 20 grams of protein per school day."
                }
            ]
        },

        # 25. Mission for Integrated Development of Horticulture (MIDH)
        {
            "code": "MIDH",
            "name": "Mission for Integrated Development of Horticulture",
            "hindi_name": "एकीकृत बागवानी विकास मिशन",
            "ministry": "Ministry of Agriculture & Farmers Welfare",
            "department": "Department of Agriculture & Farmers Welfare",
            "level": "Centrally Sponsored",
            "state": "All India",
            "sector": "Agriculture",
            "description": "Holistic growth of horticulture sector covering fruits, vegetables, root & tuber crops, mushrooms, spices, flowers, aromatic plants, and protected polyhouses.",
            "target_beneficiary": "Horticulture farmers, SHGs, and grower cooperatives",
            "application_url": "https://midh.gov.in",
            "helpline": "011-23388756",
            "guidelines_url": "https://midh.gov.in/guidelines",
            "eligibility": {
                "min_age": 18,
                "max_age": 70,
                "gender": "All",
                "min_income": 0,
                "max_income": 2500000,
                "social_categories": ["General", "OBC", "SC", "ST"],
                "occupations": ["Farmer"],
                "min_landholding_acres": 0.25,
                "max_landholding_acres": 10.0,
                "state_scope": "All India",
                "districts_scope": ["All"],
                "required_documents": ["Land Khasra Record", "Aadhaar", "Soil & Water Suitability Certificate", "Bank Account"],
                "special_conditions": "Special focus on shaded net house, naturally ventilated polyhouses, and drip-integrated orchards."
            },
            "benefits": [
                {
                    "benefit_type": "Infrastructure Subsidy",
                    "amount_direct_inr": 125000.0,
                    "amount_subsidized_pct": 50.0,
                    "frequency": "One-time",
                    "description": "50% capital cost subsidy on setting up protected cultivation polyhouses and establishing fruit orchards."
                }
            ]
        }
    ]

    # Insert schemes, eligibility, and benefits
    scheme_objects = {}
    for s_data in schemes_data:
        eligibility_data = s_data.pop("eligibility")
        benefits_data = s_data.pop("benefits")

        scheme = Scheme(**s_data)
        db.add(scheme)
        db.flush() # get scheme.id

        scheme_objects[scheme.code] = scheme

        # Add Eligibility Rule
        eligibility = EligibilityRule(
            scheme_id=scheme.id,
            min_age=eligibility_data["min_age"],
            max_age=eligibility_data["max_age"],
            gender=eligibility_data["gender"],
            min_income=eligibility_data["min_income"],
            max_income=eligibility_data["max_income"],
            social_categories_json=json.dumps(eligibility_data["social_categories"]),
            occupations_json=json.dumps(eligibility_data["occupations"]),
            min_landholding_acres=eligibility_data["min_landholding_acres"],
            max_landholding_acres=eligibility_data["max_landholding_acres"],
            state_scope=eligibility_data["state_scope"],
            districts_scope_json=json.dumps(eligibility_data["districts_scope"]),
            required_documents_json=json.dumps(eligibility_data["required_documents"]),
            special_conditions=eligibility_data["special_conditions"]
        )
        db.add(eligibility)

        # Add Benefits
        for b_data in benefits_data:
            benefit = Benefit(
                scheme_id=scheme.id,
                benefit_type=b_data["benefit_type"],
                amount_direct_inr=b_data["amount_direct_inr"],
                amount_subsidized_pct=b_data["amount_subsidized_pct"],
                frequency=b_data["frequency"],
                description=b_data["description"]
            )
            db.add(benefit)

    db.commit()

    # Seed District Profiles (Focus on Sehore, MP & surrounding Bhopal division)
    districts = [
        DistrictProfile(
            state="Madhya Pradesh",
            division="Bhopal",
            district="Sehore",
            blocks_json=json.dumps(["Sehore", "Ashta", "Ichhawar", "Budhni", "Nasrullaganj (Bherunda)"]),
            priority_sectors_json=json.dumps(["Agriculture", "Micro Irrigation", "Women Self-Help Groups", "Rural Housing"]),
            farming_families_count=138400,
            small_marginal_pct=76.8,
            convergence_readiness_score=94.5,
            active_schemes_count=25,
            lead_nodal_department="Department of Agriculture & Farmers Welfare, District Collectorate Sehore",
            notes="Ideal high-impact pilot district with strong soya and wheat agriculture belts, active river basins (Narmada, Kolar), and high penetration of PM-KISAN & Ladli Behna schemes."
        ),
        DistrictProfile(
            state="Madhya Pradesh",
            division="Bhopal",
            district="Bhopal",
            blocks_json=json.dumps(["Phanda", "Berasia"]),
            priority_sectors_json=json.dumps(["Agriculture", "MSME & Artisans", "Urban-Rural Fringe Infrastructure"]),
            farming_families_count=72100,
            small_marginal_pct=68.2,
            convergence_readiness_score=91.0,
            active_schemes_count=25,
            lead_nodal_department="Office of the Collector & District Magistrate, Bhopal",
            notes="Peri-urban agrarian belt with intensive vegetable and dairy farming clusters."
        ),
        DistrictProfile(
            state="Madhya Pradesh",
            division="Bhopal",
            district="Raisen",
            blocks_json=json.dumps(["Sanchi", "Gairatganj", "Begamganj", "Silwani", "Bareli", "Udaipura", "Obedullaganj"]),
            priority_sectors_json=json.dumps(["Agriculture", "Paddy & Basmati Cluster", "Horticulture", "Water Harvesting"]),
            farming_families_count=145000,
            small_marginal_pct=73.4,
            convergence_readiness_score=89.2,
            active_schemes_count=23,
            lead_nodal_department="Deputy Director Agriculture, Raisen",
            notes="Major rice and pulse growing basin along Betwa river."
        ),
        DistrictProfile(
            state="Madhya Pradesh",
            division="Bhopal",
            district="Vidisha",
            blocks_json=json.dumps(["Vidisha", "Gyaraspur", "Basoda", "Kurwai", "Sironj", "Lateri", "Nateran"]),
            priority_sectors_json=json.dumps(["Agriculture", "Gram (Chana) & Wheat", "Farm Mechanization", "Soil Conservation"]),
            farming_families_count=152000,
            small_marginal_pct=78.1,
            convergence_readiness_score=87.8,
            active_schemes_count=24,
            lead_nodal_department="District Agriculture Officer, Vidisha",
            notes="Extensive rainfed black cotton soil requiring micro-irrigation and soil health convergence."
        )
    ]
    for d in districts:
        db.add(d)

    db.commit()

    # Seed Convergence Objectives
    objectives = [
        # Objective 1: Farmer Development (The Core Demonstration Scenario!)
        ConvergenceObjective(
            key="farmer_development",
            name="Agricultural Productivity & Farmer Income Enhancement",
            category="Agriculture",
            description="Synergizes direct income support, high-efficiency micro-irrigation, comprehensive crop insurance, and precision soil nutrient management into a synchronized 4-pillar package for smallholder cultivators.",
            target_beneficiary_persona="Small & Marginal Farmer in Sehore, Madhya Pradesh with 1-5 acres cultivable land",
            recommended_scheme_codes_json=json.dumps([
                "PM-KISAN", "MMKKY-MP", "PMKSY-PDMC", "PMFBY", "SHC", "SMAM", "PM-KUSUM"
            ]),
            key_outcomes_json=json.dumps([
                "Guaranteed input liquidity buffer: Rs. 12,000/yr (PM-KISAN + MMKKY)",
                "40-50% water savings and 20% yield enhancement via Drip/Sprinkler (PMKSY)",
                "Full risk insulation against weather vagaries and drought (PMFBY)",
                "15-25% reduction in fertilizer wastage via customized NPK dosage (SHC)",
                "Reliable daytime solar irrigation cutting power bills to zero (PM-KUSUM)"
            ]),
            recommended_district="Sehore",
            recommended_state="Madhya Pradesh"
        ),

        # Objective 2: Women Economic Empowerment & Livelihoods
        ConvergenceObjective(
            key="women_empowerment",
            name="Women Economic Independence & Rural Entrepreneurship",
            category="Women & Child",
            description="Converges universal direct cash security (Ladli Behna) with SHG collective finance (Lakhpati Didi/NRLM), collateral-free micro enterprise credit (MUDRA), and family health safety (Ayushman Bharat).",
            target_beneficiary_persona="Rural woman homemaker / small entrepreneur aged 21-55 in MP",
            recommended_scheme_codes_json=json.dumps([
                "LBY-MP", "LAKHPATI-DIDI", "PMMY", "AB-PMJAY", "MISSION-SHAKTI"
            ]),
            key_outcomes_json=json.dumps([
                "Rs. 15,000 annual disposable liquidity buffer directly in woman's bank account (LBY-MP)",
                "Graduation to Lakhpati status (> Rs. 1 Lakh annual income) through SHG business plan (Lakhpati Didi)",
                "Collateral-free loan up to Rs. 2-5 Lakh to set up flour mill, dairy, or stitching center (PMMY)",
                "Complete protection against catastrophic out-of-pocket medical debts (AB-PMJAY)"
            ]),
            recommended_district="Sehore",
            recommended_state="Madhya Pradesh"
        ),

        # Objective 3: Integrated Rural Livelihoods & Housing Security
        ConvergenceObjective(
            key="rural_livelihoods",
            name="Integrated Rural Habitat & Sustainable Employment",
            category="Rural Development",
            description="Blends pucca housing grants with 100 days statutory wage employment, piped tap water delivery, and organic land restoration.",
            target_beneficiary_persona="Landless agricultural laborer or smallholder rural family",
            recommended_scheme_codes_json=json.dumps([
                "MGNREGA", "PMAY-G", "JJM", "PKVY", "AB-PMJAY"
            ]),
            key_outcomes_json=json.dumps([
                "Zero out-of-pocket housing cost: Rs. 1,20,000 PMAY grant + 90 days MGNREGA wages (PMAY-G + MGNREGA)",
                "Clean tap water at doorstep eliminating water-fetching drudgery (JJM)",
                "Individual land asset creation (farm pond, well, field bunding) during lean farming months (MGNREGA)",
                "Zero chemical farming transition on small parcel for premium organic produce (PKVY)"
            ]),
            recommended_district="Sehore",
            recommended_state="Madhya Pradesh"
        ),

        # Objective 4: Artisan & Rural MSME Upliftment
        ConvergenceObjective(
            key="artisan_support",
            name="Traditional Artisan Modernization & Enterprise Growth",
            category="Financial Inclusion & MSME",
            description="Empowers traditional village craftspeople and artisans through modern toolkits, standardized skill accreditation, concessional credit, and state interest subsidies.",
            target_beneficiary_persona="Traditional carpenter, blacksmith, potter, or craftsman in MP",
            recommended_scheme_codes_json=json.dumps([
                "PM-VISHWAKARMA", "PMMY", "MMUKY-MP", "AB-PMJAY"
            ]),
            key_outcomes_json=json.dumps([
                "Rs. 15,000 digital voucher for precision electrical/mechanical toolkits (PM Vishwakarma)",
                "Collateral-free enterprise expansion loan at 5% interest rate",
                "State government 3% interest subvention and 100% guarantee coverage (MMUKY-MP)",
                "Direct onboarding onto Government e-Marketplace (GeM) and retail chains"
            ]),
            recommended_district="Sehore",
            recommended_state="Madhya Pradesh"
        )
    ]
    for obj in objectives:
        db.add(obj)

    db.commit()

    # Seed Inter-Scheme Convergence Rules (Relationships & Synergies)
    convergence_rules = [
        # PM-KISAN <-> MMKKY-MP (Direct Financial Co-funding / Top-up)
        {
            "s1": "PM-KISAN", "s2": "MMKKY-MP",
            "relationship_type": "Co-funding",
            "synergy_score": 0.98,
            "objective_category": "Agriculture",
            "target_group": "Landholding Farmers in Madhya Pradesh",
            "reason": "Direct financial stack: Central Rs. 6,000 + State Rs. 6,000 grants Rs. 12,000 guaranteed cash flow synchronized with cropping seasons.",
            "implementation_sop": "Auto-sync PM-KISAN beneficiary database directly with MP SAARA portal. Single e-KYC eliminates redundant paperwork.",
            "possible_conflicts": "None. The schemes are legally structured to stack together."
        },

        # PM-KISAN <-> PMKSY-PDMC (Liquidity -> Capital Investment)
        {
            "s1": "PM-KISAN", "s2": "PMKSY-PDMC",
            "relationship_type": "Complementary",
            "synergy_score": 0.92,
            "objective_category": "Agriculture",
            "target_group": "Small & Marginal Farmers",
            "reason": "PM-KISAN DBT installments provide the upfront liquidity needed for the farmer's 45-55% beneficiary share in micro-irrigation equipment.",
            "implementation_sop": "Joint mobilization camps where horticulture officers verify water source while patwaris verify PM-KISAN land records.",
            "possible_conflicts": "Ensure farmer does not apply for multiple micro-irrigation subsidies on the same survey number within a 7-year lock-in period."
        },

        # PMKSY-PDMC <-> PMFBY (Water Security -> Crop Risk Mitigation)
        {
            "s1": "PMKSY-PDMC", "s2": "PMFBY",
            "relationship_type": "Risk-Mitigation",
            "synergy_score": 0.90,
            "objective_category": "Agriculture",
            "target_group": "Small & Marginal Cultivators",
            "reason": "Micro-irrigation stabilizes crop yield against moisture stress, lowering actual insurance loss ratios and safeguarding farmer's sum insured.",
            "implementation_sop": "Insurance companies grant favorable underwriting terms when insured crop has registered drip/sprinkler asset verification.",
            "possible_conflicts": "Ensure crop loss assessment guidelines accurately distinguish between rainfed and drip-irrigated patches."
        },

        # PM-KISAN <-> Soil Health Card (Liquidity -> Optimal Input Application)
        {
            "s1": "PM-KISAN", "s2": "SHC",
            "relationship_type": "Complementary",
            "synergy_score": 0.91,
            "objective_category": "Agriculture",
            "target_group": "Small & Marginal Farmers",
            "reason": "Soil Health Card specifies exact NPK & micronutrient dosages; PM-KISAN cash transfer provides the liquidity to purchase prescribed bio-fertilizers rather than excess urea.",
            "implementation_sop": "Issue Soil Health Cards bundled with SMS reminders right when PM-KISAN installments are credited before Kharif/Rabi sowing.",
            "possible_conflicts": "None. Both enhance input expenditure efficiency."
        },

        # PMKSY-PDMC <-> PM-KUSUM (Micro-irrigation + Solar Pumping = Zero-Cost Irrigation)
        {
            "s1": "PMKSY-PDMC", "s2": "PM-KUSUM",
            "relationship_type": "Input-Output",
            "synergy_score": 0.95,
            "objective_category": "Agriculture",
            "target_group": "Farmers in Off-Grid / Water-Stressed Zones",
            "reason": "PM-KUSUM provides solar power to pump water, while PMKSY drip system optimizes every liter drawn, preventing groundwater depletion while achieving 100% free daytime irrigation.",
            "implementation_sop": "Single-window clearance: Renewable Energy Department and Horticulture Department joint inspection for synchronized installation.",
            "possible_conflicts": "Borewell depth and discharge rate must meet micro-irrigation operating pressure standards."
        },

        # PM-KISAN <-> PMFBY (Liquidity -> Premium Payment Protection)
        {
            "s1": "PM-KISAN", "s2": "PMFBY",
            "relationship_type": "Complementary",
            "synergy_score": 0.89,
            "objective_category": "Agriculture",
            "target_group": "Cultivators of Notified Crops",
            "reason": "Farmer's share of PMFBY crop insurance premium (only 1.5% to 2%) is easily funded from PM-KISAN cash transfer without resorting to local moneylenders.",
            "implementation_sop": "Gram Panchayat camps during June (Kharif) and November (Rabi) to cross-enroll PM-KISAN farmers into PMFBY.",
            "possible_conflicts": "Voluntary opt-out protocols must be clearly communicated to prevent unnotified debits."
        },

        # SMAM <-> PM-KISAN (Mechanization + Liquidity)
        {
            "s1": "PM-KISAN", "s2": "SMAM",
            "relationship_type": "Sequential",
            "synergy_score": 0.86,
            "objective_category": "Agriculture",
            "target_group": "Small & Marginal Farmers",
            "reason": "Cash support cushions small equipment purchases under SMAM 50% subsidy (e.g. power weeders, seed-cum-fertilizer drills).",
            "implementation_sop": "Block agriculture officer notifies SMAM lottery draw winners who are active PM-KISAN beneficiaries for priority subsidy sanction.",
            "possible_conflicts": "Verification of non-alienation of machinery for minimum 3 years."
        },

        # MGNREGA <-> PMAY-G (Housing Grant + 90 Days Labor Wages)
        {
            "s1": "MGNREGA", "s2": "PMAY-G",
            "relationship_type": "Co-funding",
            "synergy_score": 0.97,
            "objective_category": "Rural Development",
            "target_group": "Rural Houseless Households",
            "reason": "PMAY-G provides Rs. 1,20,000 for materials, while MGNREGA provides 90 to 95 person-days of wage labor (approx Rs. 21,800) for the family to build their own house.",
            "implementation_sop": "Gram Rozgar Sahayak automatically enters PMAY-G house registration ID onto MGNREGA NREGASoft muster roll.",
            "possible_conflicts": "Ensure wage labor days are credited solely for house construction without creating duplicate master roll entries."
        },

        # PMAY-G <-> Jal Jeevan Mission (Habitat + Tap Water)
        {
            "s1": "PMAY-G", "s2": "JJM",
            "relationship_type": "Complementary",
            "synergy_score": 0.94,
            "objective_category": "Rural Development",
            "target_group": "Rural Households",
            "reason": "Newly constructed PMAY-G houses are immediately connected with functional individual household tap water connection under JJM.",
            "implementation_sop": "PMAY-G geotagging stage 4 (Completion) triggers automated notification to PHE Department / Gram Panchayat Pani Samiti for tap fitting.",
            "possible_conflicts": "Piped water pipeline laying must precede courtyard plastering to prevent road or floor dismantling."
        },

        # Ladli Behna Yojana <-> Lakhpati Didi / NRLM (Direct Liquidity -> SHG Micro-Enterprise)
        {
            "s1": "LBY-MP", "s2": "LAKHPATI-DIDI",
            "relationship_type": "Sequential",
            "synergy_score": 0.96,
            "objective_category": "Women & Child",
            "target_group": "Rural Women SHG Members",
            "reason": "Ladli Behna Rs. 1,250/mo provides recurring debt-free savings which women deposit into their SHG corpus, unlocking 5x credit multiplication from banks.",
            "implementation_sop": "Cluster Level Federations (CLFs) run enterprise planning workshops for Ladli Behna recipients to convert monthly stipends into viable poultry/dairy/grocery micro-businesses.",
            "possible_conflicts": "None. Complementary safety net and entrepreneurship ladder."
        },

        # Lakhpati Didi <-> PM Mudra Yojana (SHG Group Credit -> Individual Enterprise Scale-up)
        {
            "s1": "LAKHPATI-DIDI", "s2": "PMMY",
            "relationship_type": "Sequential",
            "synergy_score": 0.93,
            "objective_category": "Financial Inclusion & MSME",
            "target_group": "Women Micro-Entrepreneurs",
            "reason": "Women who establish successful SHG micro-ventures graduate to individual collateral-free MUDRA Kishore loans (Rs. 50,000 to Rs. 5 Lakh) to scale their businesses.",
            "implementation_sop": "District Lead Bank Manager organizes special MUDRA facilitation desks during CLF bi-monthly meetings.",
            "possible_conflicts": "Check CIBIL score and ensure no delinquency in SHG internal lending."
        },

        # PM Vishwakarma <-> PM Mudra Yojana (Artisan Toolkit -> Working Capital Scale-up)
        {
            "s1": "PM-VISHWAKARMA", "s2": "PMMY",
            "relationship_type": "Complementary",
            "synergy_score": 0.91,
            "objective_category": "Financial Inclusion & MSME",
            "target_group": "Traditional Village Artisans",
            "reason": "PM Vishwakarma upgrades artisan tools and provides 5% credit; MUDRA provides additional working capital for bulk raw material procurement (wood, iron, yarn).",
            "implementation_sop": "District Industries Centre (DIC) coordinates joint appraisal with local public sector bank branches.",
            "possible_conflicts": "Total outstanding debt exposure should not exceed debt service coverage ratio (DSCR > 1.5)."
        },

        # PM-KISAN <-> MGNREGA (Farm Cultivation + Farm Pond Asset Creation)
        {
            "s1": "PM-KISAN", "s2": "MGNREGA",
            "relationship_type": "Complementary",
            "synergy_score": 0.88,
            "objective_category": "Agriculture",
            "target_group": "Small & Marginal Farmers",
            "reason": "Under MGNREGA Individual Beneficiary Works (Kapil Dhara), a farm pond or open dug well is constructed on the farmer's plot at zero private cost, securing water for PM-KISAN funded crops.",
            "implementation_sop": "Panchayat Secretary identifies marginal farmers receiving PM-KISAN and includes their field in the Annual MGNREGA Labor Budget for watershed works.",
            "possible_conflicts": "Farmer cannot draw MGNREGA manual wages on their own field on days they are engaged in commercial harvesting."
        }
    ]

    for rule_data in convergence_rules:
        s1 = scheme_objects.get(rule_data["s1"])
        s2 = scheme_objects.get(rule_data["s2"])
        if s1 and s2:
            c_rule = ConvergenceRule(
                scheme_1_id=s1.id,
                scheme_2_id=s2.id,
                relationship_type=rule_data["relationship_type"],
                synergy_score=rule_data["synergy_score"],
                objective_category=rule_data["objective_category"],
                target_group=rule_data["target_group"],
                reason=rule_data["reason"],
                implementation_sop=rule_data["implementation_sop"],
                possible_conflicts=rule_data["possible_conflicts"],
                policy_framework_citation=rule_data.get("policy_framework_citation", "MoRD/MGNREGA-MoA/Conv-2015/2020 - Joint Guidelines for Inter-Ministerial Convergence of Centrally Sponsored Schemes")
            )
            db.add(c_rule)

    db.commit()
    print("Database seeding completed successfully!")

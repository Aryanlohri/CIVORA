import os
import json
import re

seed_path = os.path.join(os.path.dirname(__file__), "seed_data.py")
with open(seed_path, "r", encoding="utf-8") as f:
    content = f.read()

# Make sure ConvergenceRule constructor includes policy_framework_citation
old_crule_call = """            c_rule = ConvergenceRule(
                scheme_1_id=s1.id,
                scheme_2_id=s2.id,
                relationship_type=rule_data["relationship_type"],
                synergy_score=rule_data["synergy_score"],
                objective_category=rule_data["objective_category"],
                target_group=rule_data["target_group"],
                reason=rule_data["reason"],
                implementation_sop=rule_data["implementation_sop"],
                possible_conflicts=rule_data["possible_conflicts"]
            )"""

new_crule_call = """            c_rule = ConvergenceRule(
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
            )"""

if old_crule_call in content:
    content = content.replace(old_crule_call, new_crule_call)
    with open(seed_path, "w", encoding="utf-8") as f:
        f.write(content)
    print("Updated ConvergenceRule constructor in seed_data.py successfully!")
else:
    print("ConvergenceRule constructor already updated or pattern not matched.")

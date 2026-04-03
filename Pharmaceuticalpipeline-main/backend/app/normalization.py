from __future__ import annotations

import re
from typing import Iterable


def normalize_text(value: str | None, fallback: str) -> str:
    if not value:
        return fallback
    cleaned = re.sub(r"\s+", " ", value).strip()
    return cleaned or fallback


def slugify(value: str) -> str:
    return re.sub(r"(^-|-$)", "", re.sub(r"[^a-z0-9]+", "-", value.lower()))


def infer_therapy_area(conditions: Iterable[str]) -> str:
    haystack = " ".join(conditions).lower()
    if any(term in haystack for term in ["cancer", "oncology", "tumor", "carcinoma", "melanoma", "leukemia"]):
        return "Oncology"
    if "diabetes" in haystack:
        return "Metabolic"
    if any(term in haystack for term in ["arthritis", "crohn", "psoriasis"]):
        return "Immunology"
    if any(term in haystack for term in ["alzheimer", "multiple sclerosis", "parkinson"]):
        return "Neurology"
    return "Unclassified"


def normalize_phase(phases: list[str]) -> tuple[str, list[str], float]:
    normalized = [phase.upper() for phase in phases if phase]
    issues: list[str] = []

    if "PHASE3" in normalized:
        return "Phase 3", issues, 0.92

    if "PHASE2/PHASE3" in normalized:
        issues.append("mixed_phase_source")
        return "Phase 3", issues, 0.64

    if "PHASE2" in normalized:
        return "Phase 2", issues, 0.88

    if "PHASE1/PHASE2" in normalized:
        issues.append("mixed_phase_source")
        return "Phase 2", issues, 0.62

    if "PHASE1" in normalized:
        return "Phase 1", issues, 0.86

    if "EARLY_PHASE1" in normalized:
        return "Phase 1", issues, 0.68

    issues.append("missing_phase_mapping")
    return "Preclinical", issues, 0.35


def infer_product_name(title: str | None, sponsor_name: str) -> tuple[str, list[str], float]:
    safe_title = normalize_text(title, "Unknown Program")
    issues: list[str] = []

    asset_code_match = re.search(r"\b[A-Z]{2,6}-\d{2,5}\b", safe_title)
    if asset_code_match:
        return asset_code_match.group(0), issues, 0.9

    before_colon = safe_title.split(":")[0].strip()
    candidate = before_colon[:160] if before_colon else safe_title[:160]
    issues.append("product_name_inferred_from_title")

    if sponsor_name.lower() in candidate.lower():
        issues.append("title_contains_company_name")

    return candidate, issues, 0.45

from __future__ import annotations

import json
from dataclasses import dataclass
from datetime import datetime, timezone
from typing import Any
from urllib.parse import urlencode
from urllib.request import Request, urlopen


CLINICAL_TRIALS_API_BASE = "https://clinicaltrials.gov/api/v2/studies"


@dataclass
class ClinicalStudy:
    external_id: str
    title: str
    sponsor_name: str
    conditions: list[str]
    phases: list[str]
    recruitment_status: str
    start_date: str | None
    last_update_date: str | None
    source_url: str
    payload: dict[str, Any]


def _to_iso(date_str: str | None) -> str | None:
    if not date_str:
        return None
    try:
        return datetime.fromisoformat(date_str.replace("Z", "+00:00")).astimezone(timezone.utc).isoformat()
    except ValueError:
        try:
            return datetime.strptime(date_str, "%Y-%m-%d").replace(tzinfo=timezone.utc).isoformat()
        except ValueError:
            return None


def fetch_studies(page_size: int = 50, max_studies: int = 200) -> list[ClinicalStudy]:
    studies: list[ClinicalStudy] = []
    page_token: str | None = None

    while len(studies) < max_studies:
        params = {
            "filter.overallStatus": "RECRUITING,ACTIVE_NOT_RECRUITING,COMPLETED",
            "query.cond": "cancer|oncology|tumor|carcinoma|neoplasm",
            "pageSize": str(min(page_size, max_studies - len(studies))),
        }
        if page_token:
            params["pageToken"] = page_token

        request = Request(
            f"{CLINICAL_TRIALS_API_BASE}?{urlencode(params)}",
            headers={"User-Agent": "PPPTrackerLocal/1.0"},
        )

        with urlopen(request, timeout=30) as response:
            payload = json.loads(response.read().decode("utf-8"))

        for raw_study in payload.get("studies", []):
            protocol = raw_study.get("protocolSection", {})
            identity = protocol.get("identificationModule", {})
            sponsor_module = protocol.get("sponsorCollaboratorsModule", {})
            status_module = protocol.get("statusModule", {})
            design_module = protocol.get("designModule", {})
            conditions_module = protocol.get("conditionsModule", {})

            external_id = identity.get("nctId")
            if not external_id:
                continue

            studies.append(
                ClinicalStudy(
                    external_id=external_id,
                    title=identity.get("briefTitle", "Unknown Program"),
                    sponsor_name=(
                        sponsor_module.get("leadSponsor", {}) or {}
                    ).get("name")
                    or ((sponsor_module.get("responsibleParty", {}) or {}).get("organization"))
                    or "Unknown Sponsor",
                    conditions=conditions_module.get("conditions", []) or [],
                    phases=design_module.get("phases", []) or [],
                    recruitment_status=status_module.get("overallStatus", "Unknown"),
                    start_date=_to_iso((status_module.get("startDateStruct", {}) or {}).get("date")),
                    last_update_date=_to_iso((status_module.get("lastUpdatePostDateStruct", {}) or {}).get("date")),
                    source_url=f"https://clinicaltrials.gov/study/{external_id}",
                    payload=raw_study,
                )
            )

            if len(studies) >= max_studies:
                break

        page_token = payload.get("nextPageToken")
        if not page_token:
            break

    return studies

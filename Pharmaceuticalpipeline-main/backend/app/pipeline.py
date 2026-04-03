from __future__ import annotations

import json
import uuid
from datetime import datetime, timezone

from .clinicaltrials import ClinicalStudy, fetch_studies
from .database import db_cursor, init_database
from .normalization import infer_product_name, infer_therapy_area, normalize_phase, normalize_text, slugify


def utc_now() -> str:
    return datetime.now(timezone.utc).isoformat()


def ensure_data_source(cursor, name: str, source_type: str, base_url: str) -> int:
    cursor.execute("SELECT id FROM data_sources WHERE name = ?", (name,))
    row = cursor.fetchone()
    if row:
        return int(row["id"])

    cursor.execute(
        """
        INSERT INTO data_sources (name, type, base_url, status, created_at)
        VALUES (?, ?, ?, 'active', ?)
        """,
        (name, source_type, base_url, utc_now()),
    )
    return int(cursor.lastrowid)


def upsert_company(cursor, name: str, source_record_id: str, confidence: float) -> str:
    slug = slugify(name)
    now = utc_now()
    cursor.execute("SELECT id FROM companies WHERE name = ?", (name,))
    row = cursor.fetchone()
    if row:
        cursor.execute(
            "UPDATE companies SET confidence_score = ?, updated_at = ? WHERE id = ?",
            (confidence, now, row["id"]),
        )
        return str(row["id"])

    company_id = str(uuid.uuid4())
    cursor.execute(
        """
        INSERT INTO companies (id, name, slug, source_record_id, confidence_score, is_provisional, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, 1, ?, ?)
        """,
        (company_id, name, slug, source_record_id, confidence, now, now),
    )
    return company_id


def upsert_therapy_area(cursor, name: str) -> str:
    now = utc_now()
    cursor.execute("SELECT id FROM therapy_areas WHERE name = ?", (name,))
    row = cursor.fetchone()
    if row:
        cursor.execute("UPDATE therapy_areas SET updated_at = ? WHERE id = ?", (now, row["id"]))
        return str(row["id"])

    therapy_area_id = str(uuid.uuid4())
    cursor.execute(
        """
        INSERT INTO therapy_areas (id, name, confidence_score, created_at, updated_at)
        VALUES (?, ?, 0.75, ?, ?)
        """,
        (therapy_area_id, name, now, now),
    )
    return therapy_area_id


def upsert_indication(cursor, name: str, therapy_area_id: str, source_record_id: str) -> str:
    now = utc_now()
    cursor.execute(
        "SELECT id FROM indications WHERE name = ? AND therapy_area_id = ?",
        (name, therapy_area_id),
    )
    row = cursor.fetchone()
    if row:
        cursor.execute(
            "UPDATE indications SET updated_at = ?, confidence_score = ? WHERE id = ?",
            (now, 0.72, row["id"]),
        )
        return str(row["id"])

    indication_id = str(uuid.uuid4())
    cursor.execute(
        """
        INSERT INTO indications (id, name, therapy_area_id, source_record_id, confidence_score, is_provisional, created_at, updated_at)
        VALUES (?, ?, ?, ?, 0.72, 1, ?, ?)
        """,
        (indication_id, name, therapy_area_id, source_record_id, now, now),
    )
    return indication_id


def create_review_issue(cursor, entity_type: str, entity_id: str | None, source_record_id: str, issue_type: str, severity: str, reason: str) -> None:
    cursor.execute(
        """
        SELECT id FROM review_queue
        WHERE entity_type = ? AND COALESCE(entity_id, '') = COALESCE(?, '') AND source_record_id = ? AND issue_type = ? AND status = 'open'
        """,
        (entity_type, entity_id, source_record_id, issue_type),
    )
    if cursor.fetchone():
        return

    cursor.execute(
        """
        INSERT INTO review_queue (id, entity_type, entity_id, source_record_id, issue_type, severity, reason, status, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, 'open', ?)
        """,
        (str(uuid.uuid4()), entity_type, entity_id, source_record_id, issue_type, severity, reason, utc_now()),
    )


def upsert_product(cursor, study: ClinicalStudy, company_id: str, indication_id: str) -> tuple[str, bool]:
    phase, phase_issues, phase_confidence = normalize_phase(study.phases)
    product_name, name_issues, name_confidence = infer_product_name(study.title, study.sponsor_name)
    confidence = min(phase_confidence, name_confidence)
    now = utc_now()

    cursor.execute("SELECT id FROM products WHERE nct_number = ?", (study.external_id,))
    row = cursor.fetchone()
    is_created = row is None
    product_id = str(uuid.uuid4()) if is_created else str(row["id"])

    if is_created:
        cursor.execute(
            """
            INSERT INTO products (
              id, name, company_id, indication_id, current_phase, status, nct_number, source_url, raw_title,
              source_record_id, confidence_score, is_provisional, created_at, updated_at
            )
            VALUES (?, ?, ?, ?, ?, 'Active', ?, ?, ?, ?, ?, 1, ?, ?)
            """,
            (
                product_id,
                product_name,
                company_id,
                indication_id,
                phase,
                study.external_id,
                study.source_url,
                study.title,
                study.external_id,
                confidence,
                now,
                now,
            ),
        )
    else:
        cursor.execute(
            """
            UPDATE products
            SET name = ?, company_id = ?, indication_id = ?, current_phase = ?, source_url = ?, raw_title = ?,
                confidence_score = ?, updated_at = ?
            WHERE id = ?
            """,
            (product_name, company_id, indication_id, phase, study.source_url, study.title, confidence, now, product_id),
        )

    for issue in phase_issues:
        create_review_issue(cursor, "product", product_id, study.external_id, issue, "medium", f"Phase source for {study.external_id} is ambiguous: {study.phases}")

    for issue in name_issues:
        create_review_issue(cursor, "product", product_id, study.external_id, issue, "high", f"Product name for {study.external_id} was inferred from title: {study.title}")

    return product_id, is_created


def upsert_product_events(cursor, product_id: str, study: ClinicalStudy) -> None:
    now = utc_now()
    if study.start_date:
        cursor.execute(
            """
            INSERT OR IGNORE INTO product_events (id, product_id, phase, event_date, description, source_url, confidence_score, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (str(uuid.uuid4()), product_id, "Phase 1", study.start_date, "Study start date from ClinicalTrials.gov", study.source_url, 0.4, now),
        )
        create_review_issue(cursor, "product_event", product_id, study.external_id, "phase_event_inferred", "medium", "Start date is stored as a provisional Phase 1 event and needs review.")

    if study.last_update_date:
        cursor.execute(
            """
            INSERT OR IGNORE INTO product_events (id, product_id, phase, event_date, description, source_url, confidence_score, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (str(uuid.uuid4()), product_id, "Phase 3", study.last_update_date, "Latest study update from ClinicalTrials.gov", study.source_url, 0.7, now),
        )


def persist_raw_study(cursor, study: ClinicalStudy) -> None:
    cursor.execute(
        """
        INSERT INTO raw_studies (
          id, source_name, external_id, sponsor_name, title, conditions_json, phases_json,
          status_text, start_date, last_update_date, source_url, payload_json, fetched_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(external_id) DO UPDATE SET
          sponsor_name = excluded.sponsor_name,
          title = excluded.title,
          conditions_json = excluded.conditions_json,
          phases_json = excluded.phases_json,
          status_text = excluded.status_text,
          start_date = excluded.start_date,
          last_update_date = excluded.last_update_date,
          source_url = excluded.source_url,
          payload_json = excluded.payload_json,
          fetched_at = excluded.fetched_at
        """,
        (
            str(uuid.uuid4()),
            "ClinicalTrials.gov",
            study.external_id,
            study.sponsor_name,
            study.title,
            json.dumps(study.conditions),
            json.dumps(study.phases),
            study.recruitment_status,
            study.start_date,
            study.last_update_date,
            study.source_url,
            json.dumps(study.payload),
            utc_now(),
        ),
    )


def ingest_study(cursor, study: ClinicalStudy) -> tuple[int, int]:
    persist_raw_study(cursor, study)

    sponsor_name = normalize_text(study.sponsor_name, "Unknown Sponsor")
    if sponsor_name == "Unknown Sponsor":
        create_review_issue(cursor, "company", None, study.external_id, "missing_company_name", "high", "Sponsor name missing from source payload.")
    company_id = upsert_company(cursor, sponsor_name, study.external_id, 0.78 if sponsor_name != "Unknown Sponsor" else 0.22)

    primary_condition = normalize_text(study.conditions[0] if study.conditions else None, "Unknown Indication")
    therapy_area_name = infer_therapy_area(study.conditions)
    therapy_area_id = upsert_therapy_area(cursor, therapy_area_name)
    indication_id = upsert_indication(cursor, primary_condition, therapy_area_id, study.external_id)

    if primary_condition == "Unknown Indication":
        create_review_issue(cursor, "indication", indication_id, study.external_id, "missing_indication", "high", "Primary indication missing from source payload.")

    product_id, is_created = upsert_product(cursor, study, company_id, indication_id)
    upsert_product_events(cursor, product_id, study)
    return (1, 0) if is_created else (0, 1)


def run_clinicaltrials_ingest(page_size: int = 50, max_studies: int = 200) -> dict[str, object]:
    init_database()
    studies = fetch_studies(page_size=page_size, max_studies=max_studies)
    started_at = utc_now()
    created = 0
    updated = 0
    errors: list[str] = []

    with db_cursor() as cursor:
        data_source_id = ensure_data_source(cursor, "ClinicalTrials.gov", "clinical_trials_api", "https://clinicaltrials.gov")
        job_id = str(uuid.uuid4())
        cursor.execute(
            """
            INSERT INTO scrape_jobs (id, data_source_id, status, started_at, records_fetched, errors_json)
            VALUES (?, ?, 'running', ?, 0, '[]')
            """,
            (job_id, data_source_id, started_at),
        )

        try:
            for study in studies:
                created_delta, updated_delta = ingest_study(cursor, study)
                created += created_delta
                updated += updated_delta

            cursor.execute(
                """
                UPDATE scrape_jobs
                SET status = 'completed', completed_at = ?, records_fetched = ?, records_created = ?, records_updated = ?, errors_json = ?
                WHERE id = ?
                """,
                (utc_now(), len(studies), created, updated, json.dumps(errors), job_id),
            )
            cursor.execute("UPDATE data_sources SET last_sync = ? WHERE id = ?", (utc_now(), data_source_id))
        except Exception as exc:  # noqa: BLE001
            errors.append(str(exc))
            cursor.execute(
                """
                UPDATE scrape_jobs
                SET status = 'failed', completed_at = ?, records_fetched = ?, records_created = ?, records_updated = ?, errors_json = ?
                WHERE id = ?
                """,
                (utc_now(), len(studies), created, updated, json.dumps(errors), job_id),
            )

    return {
        "success": len(errors) == 0,
        "totalFetched": len(studies),
        "created": created,
        "updated": updated,
        "errors": errors,
    }

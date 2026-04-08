from __future__ import annotations

import json
import uuid
from dataclasses import dataclass, field

from .database import db_cursor, init_database
from .pipeline import create_review_issue, slugify, upsert_company, upsert_indication, upsert_therapy_area, utc_now


@dataclass(frozen=True)
class PipelineProgram:
    name: str
    molecule: str
    modality: str
    therapy_area: str
    indication: str
    phase: str
    status: str
    source_detail: str
    start_date: str | None = None
    nct_number: str | None = None
    source_program_key: str | None = None
    metadata: dict[str, object] = field(default_factory=dict)


@dataclass(frozen=True)
class PipelineReport:
    company_name: str
    source_name: str
    source_type: str
    title: str
    source_url: str
    snapshot_date: str | None
    programs: list[PipelineProgram]
    metadata: dict[str, object] = field(default_factory=dict)


def ingest_pipeline_report(report: PipelineReport) -> dict[str, object]:
    init_database()
    created = 0
    updated = 0

    with db_cursor() as cursor:
        company_record_key = _report_record_key(report)
        company_id = upsert_company(cursor, report.company_name, company_record_key, 0.96)
        report_id = _upsert_pipeline_report(cursor, company_id, report)
        now = utc_now()
        active_program_keys = {
            program.source_program_key or f"{index}:{program.name}:{program.indication}:{program.phase}"
            for index, program in enumerate(report.programs, start=1)
        }

        _delete_stale_report_rows(cursor, report_id, active_program_keys, report.source_url)

        cursor.execute(
            """
            UPDATE companies
            SET is_provisional = 0, confidence_score = 0.96, updated_at = ?
            WHERE id = ?
            """,
            (now, company_id),
        )

        for index, program in enumerate(report.programs, start=1):
            therapy_area_id = upsert_therapy_area(cursor, program.therapy_area)
            indication_id = upsert_indication(cursor, program.indication, therapy_area_id, company_record_key)

            cursor.execute(
                """
                UPDATE indications
                SET is_provisional = 0, confidence_score = 0.9, updated_at = ?
                WHERE id = ?
                """,
                (now, indication_id),
            )

            product_id, was_created = _upsert_report_product(cursor, company_id, indication_id, report, program)
            created += 1 if was_created else 0
            updated += 0 if was_created else 1

            _upsert_report_program(
                cursor=cursor,
                report_id=report_id,
                company_id=company_id,
                product_id=product_id,
                indication_id=indication_id,
                therapy_area_id=therapy_area_id,
                report=report,
                program=program,
                ordinal=index,
            )

            _upsert_report_event(cursor, product_id, report, program)

            if " + " in program.name:
                create_review_issue(
                    cursor,
                    "product",
                    product_id,
                    company_record_key,
                    "combination_asset",
                    "medium",
                    f"{program.name} is a combination program and may need custom UI treatment.",
                )

    return {
        "success": True,
        "company": report.company_name,
        "snapshotDate": report.snapshot_date,
        "sourceUrl": report.source_url,
        "created": created,
        "updated": updated,
        "programCount": len(report.programs),
        "reportTitle": report.title,
    }


def _delete_stale_report_rows(cursor, report_id: str, active_program_keys: set[str], report_source_url: str) -> None:
    cursor.execute(
        """
        SELECT id, product_id, source_program_key
        FROM pipeline_report_programs
        WHERE report_id = ?
        """,
        (report_id,),
    )
    stale_rows = [row for row in cursor.fetchall() if str(row["source_program_key"]) not in active_program_keys]

    if not stale_rows:
        return

    program_ids = [str(row["id"]) for row in stale_rows]
    product_ids = {str(row["product_id"]) for row in stale_rows}

    placeholders = ", ".join("?" for _ in program_ids)
    cursor.execute(f"DELETE FROM pipeline_report_programs WHERE id IN ({placeholders})", tuple(program_ids))

    for product_id in product_ids:
        cursor.execute("SELECT COUNT(*) AS count FROM pipeline_report_programs WHERE product_id = ?", (product_id,))
        if int(cursor.fetchone()["count"]) > 0:
            continue

        cursor.execute("DELETE FROM product_events WHERE product_id = ? AND source_url = ?", (product_id, report_source_url))
        cursor.execute("DELETE FROM products WHERE id = ?", (product_id,))


def _report_record_key(report: PipelineReport) -> str:
    snapshot = report.snapshot_date or "unknown"
    return f"{slugify(report.company_name)}-{report.source_type}-{snapshot}"


def _upsert_pipeline_report(cursor, company_id: str, report: PipelineReport) -> str:
    cursor.execute(
        """
        SELECT id
        FROM pipeline_reports
        WHERE company_id = ? AND source_url = ? AND COALESCE(snapshot_date, '') = COALESCE(?, '')
        """,
        (company_id, report.source_url, report.snapshot_date),
    )
    row = cursor.fetchone()
    report_id = str(row["id"]) if row else str(uuid.uuid4())
    metadata_json = json.dumps(report.metadata, sort_keys=True)

    if row is None:
        cursor.execute(
            """
            INSERT INTO pipeline_reports (
              id, company_id, source_name, source_type, title, source_url, snapshot_date, imported_at, metadata_json
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                report_id,
                company_id,
                report.source_name,
                report.source_type,
                report.title,
                report.source_url,
                report.snapshot_date,
                utc_now(),
                metadata_json,
            ),
        )
    else:
        cursor.execute(
            """
            UPDATE pipeline_reports
            SET source_name = ?, source_type = ?, title = ?, imported_at = ?, metadata_json = ?
            WHERE id = ?
            """,
            (report.source_name, report.source_type, report.title, utc_now(), metadata_json, report_id),
        )

    return report_id


def _upsert_report_product(cursor, company_id: str, indication_id: str, report: PipelineReport, program: PipelineProgram) -> tuple[str, bool]:
    cursor.execute(
        "SELECT id FROM products WHERE name = ? AND company_id = ? AND COALESCE(indication_id, '') = COALESCE(?, '')",
        (program.name, company_id, indication_id),
    )
    row = cursor.fetchone()
    now = utc_now()
    product_id = str(uuid.uuid4()) if row is None else str(row["id"])
    payload = (
        product_id,
        program.name,
        company_id,
        indication_id,
        program.phase,
        program.status,
        program.nct_number,
        report.source_url,
        program.name,
        program.molecule,
        program.modality,
        _report_record_key(report),
        0.93,
        0,
        now,
        now,
    )

    if row is None:
        cursor.execute(
            """
            INSERT INTO products (
              id, name, company_id, indication_id, current_phase, status, nct_number, source_url, raw_title,
              molecule, modality, source_record_id, confidence_score, is_provisional, created_at, updated_at
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            payload,
        )
        return product_id, True

    cursor.execute(
        """
        UPDATE products
        SET indication_id = ?, current_phase = ?, status = ?, nct_number = COALESCE(?, nct_number), source_url = ?,
            raw_title = ?, molecule = ?, modality = ?, source_record_id = ?, confidence_score = ?, is_provisional = 0,
            updated_at = ?
        WHERE id = ?
        """,
        (
            indication_id,
            program.phase,
            program.status,
            program.nct_number,
            report.source_url,
            program.name,
            program.molecule,
            program.modality,
            _report_record_key(report),
            0.93,
            now,
            product_id,
        ),
    )
    return product_id, False


def _upsert_report_program(
    *,
    cursor,
    report_id: str,
    company_id: str,
    product_id: str,
    indication_id: str,
    therapy_area_id: str,
    report: PipelineReport,
    program: PipelineProgram,
    ordinal: int,
) -> None:
    source_program_key = program.source_program_key or f"{ordinal}:{program.name}:{program.indication}:{program.phase}"
    now = utc_now()
    metadata_json = json.dumps(program.metadata, sort_keys=True)

    cursor.execute(
        """
        SELECT id
        FROM pipeline_report_programs
        WHERE report_id = ? AND source_program_key = ?
        """,
        (report_id, source_program_key),
    )
    row = cursor.fetchone()

    if row is None:
        cursor.execute(
            """
            INSERT INTO pipeline_report_programs (
              id, report_id, company_id, product_id, indication_id, therapy_area_id, product_name, molecule, modality,
              indication_name, phase, status, source_detail, start_date, source_program_key, metadata_json, created_at, updated_at
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                str(uuid.uuid4()),
                report_id,
                company_id,
                product_id,
                indication_id,
                therapy_area_id,
                program.name,
                program.molecule,
                program.modality,
                program.indication,
                program.phase,
                program.status,
                program.source_detail,
                program.start_date,
                source_program_key,
                metadata_json,
                now,
                now,
            ),
        )
        return

    cursor.execute(
        """
        UPDATE pipeline_report_programs
        SET product_id = ?, indication_id = ?, therapy_area_id = ?, product_name = ?, molecule = ?, modality = ?,
            indication_name = ?, phase = ?, status = ?, source_detail = ?, start_date = ?, metadata_json = ?, updated_at = ?
        WHERE id = ?
        """,
        (
            product_id,
            indication_id,
            therapy_area_id,
            program.name,
            program.molecule,
            program.modality,
            program.indication,
            program.phase,
            program.status,
            program.source_detail,
            program.start_date,
            metadata_json,
            now,
            str(row["id"]),
        ),
    )


def _upsert_report_event(cursor, product_id: str, report: PipelineReport, program: PipelineProgram) -> None:
    cursor.execute(
        """
        INSERT OR IGNORE INTO product_events (id, product_id, phase, event_date, description, source_url, confidence_score, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """,
        (
            str(uuid.uuid4()),
            product_id,
            program.phase,
            program.start_date,
            program.source_detail,
            report.source_url,
            0.95,
            utc_now(),
        ),
    )

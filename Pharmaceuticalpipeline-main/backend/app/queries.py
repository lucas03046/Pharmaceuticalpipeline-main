from __future__ import annotations

import json

import uuid
from datetime import datetime, timezone

from .database import db_cursor, init_database


def utc_now() -> str:
    return datetime.now(timezone.utc).isoformat()


def fetch_overview() -> dict[str, int]:
    init_database()
    with db_cursor() as cursor:
        cursor.execute("SELECT COUNT(*) AS count FROM companies")
        companies = int(cursor.fetchone()["count"])
        cursor.execute("SELECT COUNT(*) AS count FROM products")
        products = int(cursor.fetchone()["count"])
        cursor.execute("SELECT COUNT(*) AS count FROM review_queue WHERE status = 'open'")
        review_items = int(cursor.fetchone()["count"])
        cursor.execute("SELECT COUNT(*) AS count FROM raw_studies")
        raw_studies = int(cursor.fetchone()["count"])

    return {
        "companies": companies,
        "products": products,
        "openReviewItems": review_items,
        "rawStudies": raw_studies,
    }


def list_companies(limit: int = 100) -> list[dict[str, object]]:
    init_database()
    with db_cursor() as cursor:
        cursor.execute(
            """
            SELECT id, name, slug, confidence_score, is_provisional, created_at, updated_at
            FROM companies
            ORDER BY updated_at DESC
            LIMIT ?
            """,
            (limit,),
        )
        items = []
        for row in cursor.fetchall():
            items.append(
                {
                    "id": row["id"],
                    "name": row["name"],
                    "slug": row["slug"],
                    "headquarters": "Unknown",
                    "employeeCount": "Unknown",
                    "marketCap": None,
                    "website": None,
                    "createdAt": row["created_at"],
                    "updatedAt": row["updated_at"],
                    "confidenceScore": row["confidence_score"],
                    "isProvisional": bool(row["is_provisional"]),
                }
            )
        return items


def list_indications(limit: int = 250) -> list[dict[str, object]]:
    init_database()
    with db_cursor() as cursor:
        cursor.execute(
            """
            SELECT i.id, i.name, i.created_at, ta.name AS therapy_area_name
            FROM indications i
            JOIN therapy_areas ta ON ta.id = i.therapy_area_id
            ORDER BY i.name ASC
            LIMIT ?
            """,
            (limit,),
        )
        return [
            {
                "id": row["id"],
                "name": row["name"],
                "therapyArea": row["therapy_area_name"],
                "therapyAreaId": None,
                "icd10Code": "",
                "createdAt": row["created_at"],
            }
            for row in cursor.fetchall()
        ]


def list_products(limit: int = 100) -> list[dict[str, object]]:
    init_database()
    with db_cursor() as cursor:
        cursor.execute(
            """
            SELECT
              p.id,
              p.name,
              p.company_id,
              p.indication_id,
              p.current_phase,
              p.status,
              p.nct_number,
              p.confidence_score,
              p.is_provisional,
              p.raw_title,
              p.source_url,
              p.created_at,
              p.updated_at,
              c.name AS company_name,
              i.name AS indication_name
            FROM products p
            JOIN companies c ON c.id = p.company_id
            LEFT JOIN indications i ON i.id = p.indication_id
            ORDER BY p.updated_at DESC
            LIMIT ?
            """,
            (limit,),
        )
        products = []
        for row in cursor.fetchall():
            cursor.execute(
                """
                SELECT id, product_id, phase, event_date, description, source_url, created_at
                FROM product_events
                WHERE product_id = ?
                ORDER BY COALESCE(event_date, created_at) ASC
                """,
                (row["id"],),
            )
            events = [
                {
                    "id": event["id"],
                    "productId": event["product_id"],
                    "phase": event["phase"],
                    "date": event["event_date"] or event["created_at"],
                    "eventDate": event["event_date"],
                    "description": event["description"],
                    "sourceUrl": event["source_url"],
                }
                for event in cursor.fetchall()
            ]
            start_date = next((event["eventDate"] for event in events if event.get("eventDate")), row["created_at"])
            products.append(
                {
                    "id": row["id"],
                    "name": row["name"],
                    "companyId": row["company_id"],
                    "molecule": row["raw_title"] or row["name"],
                    "moleculeType": row["raw_title"] or None,
                    "modality": "Unclassified",
                    "indicationId": row["indication_id"],
                    "currentPhase": row["current_phase"],
                    "status": row["status"],
                    "regions": ["Global"],
                    "startDate": start_date,
                    "lastUpdated": row["updated_at"],
                    "nctNumber": row["nct_number"],
                    "sourceUrl": row["source_url"],
                    "events": events,
                    "createdAt": row["created_at"],
                    "updatedAt": row["updated_at"],
                    "companyName": row["company_name"],
                    "indicationName": row["indication_name"],
                    "confidenceScore": row["confidence_score"],
                    "isProvisional": bool(row["is_provisional"]),
                }
            )
        return products


def list_review_queue(limit: int = 100) -> list[dict[str, object]]:
    init_database()
    with db_cursor() as cursor:
        cursor.execute(
            """
            SELECT id, entity_type, entity_id, source_record_id, issue_type, severity, reason, status, created_at
            FROM review_queue
            WHERE status = 'open'
            ORDER BY
              CASE severity
                WHEN 'high' THEN 1
                WHEN 'medium' THEN 2
                ELSE 3
              END,
              created_at DESC
            LIMIT ?
            """,
            (limit,),
        )
        return [dict(row) for row in cursor.fetchall()]


def list_scrape_jobs(limit: int = 25) -> list[dict[str, object]]:
    init_database()
    with db_cursor() as cursor:
        cursor.execute(
            """
            SELECT sj.id, ds.name AS data_source_name, sj.status, sj.started_at, sj.completed_at,
                   sj.records_fetched, sj.records_created, sj.records_updated, sj.errors_json
            FROM scrape_jobs sj
            JOIN data_sources ds ON ds.id = sj.data_source_id
            ORDER BY sj.started_at DESC
            LIMIT ?
            """,
            (limit,),
        )
        jobs = []
        for row in cursor.fetchall():
            item = dict(row)
            item["errors"] = json.loads(item.pop("errors_json"))
            jobs.append(item)
        return jobs


def create_manual_product(product: dict[str, object]) -> dict[str, object]:
    init_database()
    with db_cursor() as cursor:
        product_id = str(uuid.uuid4())
        cursor.execute("SELECT id FROM companies LIMIT 1")
        company = cursor.fetchone()
        company_id = str(product.get("companyId") or (company["id"] if company else ""))

        if not company_id:
            raise ValueError("No company available yet. Run ingestion first or provide a valid companyId.")

        now = utc_now()
        cursor.execute(
            """
            INSERT INTO products (
              id, name, company_id, indication_id, current_phase, status, nct_number, source_url, raw_title,
              source_record_id, confidence_score, is_provisional, created_at, updated_at
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                product_id,
                product.get("name", "Untitled Product"),
                company_id,
                product.get("indicationId"),
                product.get("currentPhase", "Preclinical"),
                product.get("status", "Active"),
                product.get("nctNumber"),
                product.get("sourceUrl"),
                product.get("name"),
                product.get("nctNumber"),
                0.4,
                1,
                now,
                now,
            ),
        )

        cursor.execute(
            """
            SELECT
              p.id,
              p.name,
              p.current_phase,
              p.status,
              p.nct_number,
              p.confidence_score,
              p.is_provisional,
              p.raw_title,
              c.name AS company_name,
              i.name AS indication_name
            FROM products p
            JOIN companies c ON c.id = p.company_id
            LEFT JOIN indications i ON i.id = p.indication_id
            WHERE p.id = ?
            """,
            (product_id,),
        )
        row = cursor.fetchone()
        return {
            "id": row["id"],
            "name": row["name"],
            "companyId": company_id,
            "molecule": row["raw_title"] or row["name"],
            "moleculeType": row["raw_title"] or None,
            "modality": "Unclassified",
            "indicationId": product.get("indicationId"),
            "currentPhase": row["current_phase"],
            "status": row["status"],
            "regions": ["Global"],
            "startDate": now,
            "lastUpdated": now,
            "nctNumber": row["nct_number"],
            "sourceUrl": product.get("sourceUrl"),
            "events": [],
            "companyName": row["company_name"],
            "indicationName": row["indication_name"],
        }


def fetch_bootstrap(limit: int = 250) -> dict[str, object]:
    return {
        "overview": fetch_overview(),
        "companies": list_companies(limit=limit),
        "indications": list_indications(limit=limit),
        "products": list_products(limit=limit),
        "reviewQueue": list_review_queue(limit=limit),
        "scrapeJobs": list_scrape_jobs(limit=25),
    }

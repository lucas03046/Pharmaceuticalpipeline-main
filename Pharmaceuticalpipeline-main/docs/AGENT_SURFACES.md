# Agent Surfaces

This document defines the backend and frontend surfaces that the local agent threads are allowed to use.

## Ops agents

Primary scope:

- backend health
- local database initialization
- scrape execution
- built-in company report seeding
- job inspection
- report import inspection

CLI commands:

```powershell
py -m backend.app.cli init-db
py -m backend.app.cli scrape-clinicaltrials --page-size 50 --max-studies 200
py -m backend.app.cli overview
py -m backend.app.cli jobs --limit 10
py -m backend.app.cli reports --limit 20
py -m backend.app.cli list-company-reports
py -m backend.app.cli seed-company-report --company pfizer
```

API routes:

- `GET /health`
- `GET /api/overview`
- `GET /api/scrape-jobs`
- `GET /api/pipeline-reports`
- `GET /api/company-report-seeds`
- `POST /api/scrape/clinicaltrials`
- `POST /api/seed/company-report`

Data stores:

- `data_sources`
- `scrape_jobs`
- `raw_studies`
- `pipeline_reports`
- `pipeline_report_programs`

Ops reporting requirements back to Command:

- backend reachable or not
- created vs updated counts
- imported report counts
- scrape failures and error payloads
- review queue growth after import
- any source-specific drift or schema mismatch

## Investigation agents

Primary scope:

- canonical company names
- canonical product names
- phase truth
- indication and therapy area truth
- source conflicts
- provisional record review

CLI commands:

```powershell
py -m backend.app.cli overview
py -m backend.app.cli reports --limit 20
py -m backend.app.cli review-queue --limit 20
```

API routes:

- `GET /api/overview`
- `GET /api/companies`
- `GET /api/indications`
- `GET /api/products`
- `GET /api/pipeline-reports`
- `GET /api/review-queue`
- `GET /api/bootstrap`

Data stores:

- `companies`
- `therapy_areas`
- `indications`
- `products`
- `product_events`
- `review_queue`
- `pipeline_reports`
- `pipeline_report_programs`

Investigation reporting requirements back to Command:

- records safe to promote
- records that remain provisional
- ambiguity clusters
- phase or taxonomy corrections
- report rows that conflict with canonical product state

## Frontend contract

The frontend reads from `VITE_API_BASE_URL` and currently loads its working set from `GET /api/bootstrap`.
If that fetch fails, it falls back to local demo data. Agents should not treat fallback mode as live backend truth.

## Command rule

No agent should promote a scraped or seeded record to trusted truth without provenance and review context.

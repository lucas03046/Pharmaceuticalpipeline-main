
# Pharmaceutical Pipeline Tracker

This project is now organized around a Python-first, local-first MVP stack:

- `frontend`: the existing React/Vite UI in `src/`
- `backend`: a local Python API and ingestion pipeline in `backend/`
- `storage`: local SQLite for raw ingests, canonical entities, and review queues

The goal is to show the product with real data first, then worry about cloud hosting later.

## Local MVP stack

### 1. Frontend

```powershell
corepack pnpm install
corepack pnpm dev
```

The Vite app runs on `http://127.0.0.1:5173`.

### 2. Backend

```powershell
py -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r backend\requirements.txt
py -m backend.app.cli init-db
py -m backend.app.cli list-company-reports
py -m backend.app.cli seed-company-report --company pfizer
py -m backend.app.cli scrape-clinicaltrials --page-size 50 --max-studies 200
py -m uvicorn backend.app.main:app --reload --host 127.0.0.1 --port 8000
```

The Python API runs on `http://127.0.0.1:8000`.

## Why this setup

- real-data proof matters more than cloud polish right now
- Python is a better fit for scraping, normalization, and investigation workflows
- local SQLite keeps the MVP fast to iterate on
- the review queue protects the tracker from promoting dirty source data to truth

## Command-thread operating rule

Scraped records are provisional until they survive review and normalization. The backend stores:

- raw source records
- canonical companies, indications, and products
- imported company pipeline reports and report-program rows
- scrape jobs
- open review items for ambiguous names, phases, and indications

## Key backend commands

```powershell
py -m backend.app.cli init-db
py -m backend.app.cli list-company-reports
py -m backend.app.cli seed-company-report --company pfizer
py -m backend.app.cli seed-pfizer
py -m backend.app.cli scrape-clinicaltrials --page-size 50 --max-studies 200
py -m backend.app.cli overview
py -m backend.app.cli reports --limit 20
py -m backend.app.cli review-queue --limit 20
py -m backend.app.cli jobs --limit 10
```

## Multi-company direction

The backend is ready to expand past a single sponsor:

- `companies` stores canonical organizations
- `products` stores current asset state across all companies
- `pipeline_reports` stores source snapshots like pipeline PDFs or portfolio decks
- `pipeline_report_programs` stores the individual program rows imported from each report

This means future company reports can be ingested into the same local backend without reworking the core data model each time.

The current built-in report registry only includes `pfizer`, but the ingest flow is now keyed by company report instead of being hardwired to one one-off seed function.

## Environment

`VITE_API_BASE_URL` defaults to `http://127.0.0.1:8000`.

See `.env.example` for optional overrides.

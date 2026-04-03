
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
- scrape jobs
- open review items for ambiguous names, phases, and indications

## Key backend commands

```powershell
py -m backend.app.cli init-db
py -m backend.app.cli scrape-clinicaltrials --page-size 50 --max-studies 200
py -m backend.app.cli overview
py -m backend.app.cli review-queue --limit 20
py -m backend.app.cli jobs --limit 10
```

## Environment

`VITE_API_BASE_URL` defaults to `http://127.0.0.1:8000`.

See `.env.example` for optional overrides.

# Python-first local backend

This backend is the local-first operating core for the PPP tracker.

## What it does

- stores scraped source data locally in SQLite
- stages provisional records before they become truth
- maintains canonical company, indication, and product tables
- creates a review queue for ambiguous or low-confidence records
- exposes local API endpoints for the frontend and investigation threads

## Quick start

From the repo root:

```powershell
py -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r backend\requirements.txt
py -m backend.app.cli init-db
py -m backend.app.cli scrape-clinicaltrials --page-size 50 --max-studies 200
py -m uvicorn backend.app.main:app --reload --host 127.0.0.1 --port 8000
```

Then run the frontend separately:

```powershell
corepack pnpm dev
```

The frontend can talk to the backend through `VITE_API_BASE_URL`, which defaults to `http://127.0.0.1:8000`.

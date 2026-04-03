# Local Command Setup

This document is the Command-thread operating contract for the new Python-first local setup.

## Thread map

### 1. `.Command` thread

Owns:

- priorities
- handoffs between threads
- blocker resolution
- promotion of provisional records into trusted truth
- final synthesis for founder or strategy output

### 2. `Ops` threads

Own:

- Python backend health
- local SQLite database initialization
- ingest jobs
- raw source persistence
- scrape failures
- schema or connector changes

Primary commands:

```powershell
py -m backend.app.cli init-db
py -m backend.app.cli scrape-clinicaltrials --page-size 50 --max-studies 200
py -m backend.app.cli jobs --limit 10
py -m backend.app.cli overview
```

Expected report back to Command:

- total fetched
- created vs updated
- scrape errors
- review queue growth
- suspicious source behavior

### 3. `Investigation` threads

Own:

- canonical company names
- canonical product names
- phase truth
- therapy area / indication truth
- duplicate handling
- confidence review

Primary command:

```powershell
py -m backend.app.cli review-queue --limit 20
```

Expected report back to Command:

- records safe to promote
- records that remain provisional
- top ambiguity clusters
- taxonomy corrections

## Non-negotiable rule

Raw ingests are not truth. They are provisional until reviewed.

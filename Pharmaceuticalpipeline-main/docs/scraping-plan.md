# Local Scraping Plan

## Goal

Run the PPP tracker as a Python-first, localhost-first product with real source data and a reviewable path from raw ingest to canonical truth.

## Operating architecture

- `backend/app/clinicaltrials.py`
  ClinicalTrials.gov fetcher
- `backend/app/pipeline.py`
  local ingest and normalization pipeline
- `backend/app/database.py`
  SQLite schema for raw ingests, canonical entities, jobs, and review queue
- `backend/app/main.py`
  FastAPI endpoints for the frontend and ops threads

## Data flow

1. Scrape raw studies from ClinicalTrials.gov
2. Store full payloads in `raw_studies`
3. Normalize sponsor, indication, phase, and product names
4. Insert provisional canonical records into local tables
5. Open review items for ambiguous product names, mixed phases, and missing fields
6. Let investigation threads review before promotion to trusted truth

## Current MVP schema

- `data_sources`
- `scrape_jobs`
- `raw_studies`
- `companies`
- `therapy_areas`
- `indications`
- `products`
- `product_events`
- `review_queue`

## Rules

- raw scraped data is provisional
- ambiguous names create review items
- mixed phase studies create review items
- inferred events are marked as provisional
- the frontend consumes the local Python API, not direct database access

## Immediate next steps

- wire more frontend surfaces away from mock-era assumptions
- add more connectors after ClinicalTrials.gov stabilizes
- introduce explicit promotion workflows from provisional to trusted records

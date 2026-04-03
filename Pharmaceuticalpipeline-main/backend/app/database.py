from __future__ import annotations

import sqlite3
from contextlib import contextmanager
from pathlib import Path

from .config import ensure_data_dir, get_database_path


SCHEMA = """
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS data_sources (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  type TEXT NOT NULL,
  base_url TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  last_sync TEXT,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS scrape_jobs (
  id TEXT PRIMARY KEY,
  data_source_id INTEGER NOT NULL,
  status TEXT NOT NULL,
  started_at TEXT NOT NULL,
  completed_at TEXT,
  records_fetched INTEGER NOT NULL DEFAULT 0,
  records_created INTEGER NOT NULL DEFAULT 0,
  records_updated INTEGER NOT NULL DEFAULT 0,
  errors_json TEXT NOT NULL DEFAULT '[]',
  FOREIGN KEY (data_source_id) REFERENCES data_sources(id)
);

CREATE TABLE IF NOT EXISTS raw_studies (
  id TEXT PRIMARY KEY,
  source_name TEXT NOT NULL,
  external_id TEXT NOT NULL UNIQUE,
  sponsor_name TEXT,
  title TEXT,
  conditions_json TEXT NOT NULL,
  phases_json TEXT NOT NULL,
  status_text TEXT,
  start_date TEXT,
  last_update_date TEXT,
  source_url TEXT NOT NULL,
  payload_json TEXT NOT NULL,
  fetched_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS companies (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  source_record_id TEXT,
  confidence_score REAL NOT NULL DEFAULT 0,
  is_provisional INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS therapy_areas (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  confidence_score REAL NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS indications (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  therapy_area_id TEXT NOT NULL,
  source_record_id TEXT,
  confidence_score REAL NOT NULL DEFAULT 0,
  is_provisional INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  UNIQUE(name, therapy_area_id),
  FOREIGN KEY (therapy_area_id) REFERENCES therapy_areas(id)
);

CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  company_id TEXT NOT NULL,
  indication_id TEXT,
  current_phase TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Active',
  nct_number TEXT UNIQUE,
  source_url TEXT,
  raw_title TEXT,
  source_record_id TEXT,
  confidence_score REAL NOT NULL DEFAULT 0,
  is_provisional INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (company_id) REFERENCES companies(id),
  FOREIGN KEY (indication_id) REFERENCES indications(id)
);

CREATE TABLE IF NOT EXISTS product_events (
  id TEXT PRIMARY KEY,
  product_id TEXT NOT NULL,
  phase TEXT NOT NULL,
  event_date TEXT,
  description TEXT NOT NULL,
  source_url TEXT,
  confidence_score REAL NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL,
  UNIQUE(product_id, phase, event_date, description),
  FOREIGN KEY (product_id) REFERENCES products(id)
);

CREATE TABLE IF NOT EXISTS review_queue (
  id TEXT PRIMARY KEY,
  entity_type TEXT NOT NULL,
  entity_id TEXT,
  source_record_id TEXT,
  issue_type TEXT NOT NULL,
  severity TEXT NOT NULL,
  reason TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'open',
  created_at TEXT NOT NULL
);
"""


def get_connection() -> sqlite3.Connection:
    ensure_data_dir()
    db_path: Path = get_database_path()
    connection = sqlite3.connect(db_path)
    connection.row_factory = sqlite3.Row
    return connection


def init_database() -> None:
    with get_connection() as connection:
        connection.executescript(SCHEMA)


@contextmanager
def db_cursor() -> sqlite3.Cursor:
    connection = get_connection()
    try:
        cursor = connection.cursor()
        yield cursor
        connection.commit()
    finally:
        connection.close()

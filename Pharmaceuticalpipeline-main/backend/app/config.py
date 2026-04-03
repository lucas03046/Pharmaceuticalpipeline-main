from __future__ import annotations

import os
from pathlib import Path


ROOT_DIR = Path(__file__).resolve().parents[2]
BACKEND_DIR = ROOT_DIR / "backend"
DATA_DIR = BACKEND_DIR / "data"


def get_database_path() -> Path:
    configured = os.getenv("PPP_DATABASE_PATH")
    if configured:
        return Path(configured).expanduser().resolve()
    return DATA_DIR / "pharmapipeline.db"


def ensure_data_dir() -> Path:
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    return DATA_DIR

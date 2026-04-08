from __future__ import annotations

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from .database import init_database
from .pfizer_seed import list_builtin_company_reports, seed_builtin_company_report, seed_pfizer_pipeline
from .pipeline import run_clinicaltrials_ingest
from .queries import create_manual_product, fetch_bootstrap, fetch_overview, list_companies, list_indications, list_pipeline_reports, list_products, list_review_queue, list_scrape_jobs


class ProductPayload(BaseModel):
    name: str
    companyId: str | None = None
    indicationId: str | None = None
    currentPhase: str = "Preclinical"
    status: str = "Active"
    nctNumber: str | None = None
    sourceUrl: str | None = None
    modality: str | None = None


app = FastAPI(title="PPP Local Backend", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://127.0.0.1:5173", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def startup() -> None:
    init_database()


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.get("/api/overview")
def overview() -> dict[str, int]:
    return fetch_overview()


@app.get("/api/companies")
def companies(limit: int = 100) -> list[dict[str, object]]:
    return list_companies(limit=limit)


@app.get("/api/indications")
def indications(limit: int = 250) -> list[dict[str, object]]:
    return list_indications(limit=limit)


@app.get("/api/products")
def products(limit: int = 100) -> list[dict[str, object]]:
    return list_products(limit=limit)


@app.get("/api/pipeline-reports")
def pipeline_reports(limit: int = 50) -> list[dict[str, object]]:
    return list_pipeline_reports(limit=limit)


@app.get("/api/company-report-seeds")
def company_report_seeds() -> list[str]:
    return list_builtin_company_reports()


@app.post("/api/products")
def create_product(payload: ProductPayload) -> dict[str, object]:
    return create_manual_product(payload.model_dump())


@app.get("/api/review-queue")
def review_queue(limit: int = 100) -> list[dict[str, object]]:
    return list_review_queue(limit=limit)


@app.get("/api/scrape-jobs")
def scrape_jobs(limit: int = 25) -> list[dict[str, object]]:
    return list_scrape_jobs(limit=limit)


@app.get("/api/bootstrap")
def bootstrap(limit: int = 250) -> dict[str, object]:
    return fetch_bootstrap(limit=limit)


@app.post("/api/scrape/clinicaltrials")
def scrape_clinicaltrials(page_size: int = 50, max_studies: int = 200) -> dict[str, object]:
    return run_clinicaltrials_ingest(page_size=page_size, max_studies=max_studies)


@app.post("/api/seed/pfizer")
def seed_pfizer() -> dict[str, object]:
    return seed_pfizer_pipeline()


@app.post("/api/seed/company-report")
def seed_company_report(company: str) -> dict[str, object]:
    return seed_builtin_company_report(company)

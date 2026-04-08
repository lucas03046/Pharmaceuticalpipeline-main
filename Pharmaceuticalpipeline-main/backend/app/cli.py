from __future__ import annotations

import argparse
import json

from .database import init_database
from .pfizer_seed import list_builtin_company_reports, seed_builtin_company_report, seed_pfizer_pipeline
from .pipeline import run_clinicaltrials_ingest
from .queries import fetch_overview, list_pipeline_reports, list_review_queue, list_scrape_jobs


def main() -> None:
    parser = argparse.ArgumentParser(description="PPP local backend operations")
    subparsers = parser.add_subparsers(dest="command", required=True)

    subparsers.add_parser("init-db", help="Create the local SQLite database and tables")

    scrape = subparsers.add_parser("scrape-clinicaltrials", help="Run the ClinicalTrials.gov ingest locally")
    scrape.add_argument("--page-size", type=int, default=50)
    scrape.add_argument("--max-studies", type=int, default=200)

    subparsers.add_parser("overview", help="Print current local data overview")
    subparsers.add_parser("seed-pfizer", help="Seed the local database with a curated Pfizer pipeline snapshot")
    subparsers.add_parser("list-company-reports", help="List built-in company report seeds available locally")

    seed_report = subparsers.add_parser("seed-company-report", help="Seed a built-in company pipeline report by key")
    seed_report.add_argument("--company", required=True, help="Built-in company key, for example: pfizer")

    reports = subparsers.add_parser("reports", help="Print imported company pipeline reports")
    reports.add_argument("--limit", type=int, default=20)

    review = subparsers.add_parser("review-queue", help="Print open review items")
    review.add_argument("--limit", type=int, default=20)

    jobs = subparsers.add_parser("jobs", help="Print recent scrape jobs")
    jobs.add_argument("--limit", type=int, default=10)

    args = parser.parse_args()

    if args.command == "init-db":
        init_database()
        print("Local database initialized.")
        return

    if args.command == "scrape-clinicaltrials":
        result = run_clinicaltrials_ingest(page_size=args.page_size, max_studies=args.max_studies)
        print(json.dumps(result, indent=2))
        return

    if args.command == "overview":
        print(json.dumps(fetch_overview(), indent=2))
        return

    if args.command == "seed-pfizer":
        print(json.dumps(seed_pfizer_pipeline(), indent=2))
        return

    if args.command == "list-company-reports":
        print(json.dumps(list_builtin_company_reports(), indent=2))
        return

    if args.command == "seed-company-report":
        print(json.dumps(seed_builtin_company_report(args.company), indent=2))
        return

    if args.command == "reports":
        print(json.dumps(list_pipeline_reports(limit=args.limit), indent=2))
        return

    if args.command == "review-queue":
        print(json.dumps(list_review_queue(limit=args.limit), indent=2))
        return

    if args.command == "jobs":
        print(json.dumps(list_scrape_jobs(limit=args.limit), indent=2))
        return


if __name__ == "__main__":
    main()

from __future__ import annotations

import argparse
import json

from .database import init_database
from .pipeline import run_clinicaltrials_ingest
from .queries import fetch_overview, list_review_queue, list_scrape_jobs


def main() -> None:
    parser = argparse.ArgumentParser(description="PPP local backend operations")
    subparsers = parser.add_subparsers(dest="command", required=True)

    subparsers.add_parser("init-db", help="Create the local SQLite database and tables")

    scrape = subparsers.add_parser("scrape-clinicaltrials", help="Run the ClinicalTrials.gov ingest locally")
    scrape.add_argument("--page-size", type=int, default=50)
    scrape.add_argument("--max-studies", type=int, default=200)

    subparsers.add_parser("overview", help="Print current local data overview")

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

    if args.command == "review-queue":
        print(json.dumps(list_review_queue(limit=args.limit), indent=2))
        return

    if args.command == "jobs":
        print(json.dumps(list_scrape_jobs(limit=args.limit), indent=2))
        return


if __name__ == "__main__":
    main()

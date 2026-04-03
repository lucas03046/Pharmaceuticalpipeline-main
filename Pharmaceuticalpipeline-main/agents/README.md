# PPP Agent System

This folder defines the specialist agent bench for the Pharmaceutical Product Pipeline tracker.

## Agent roster

- `sourceops-agent.md` keeps source connectors healthy and ingestion on schedule.
- `trial-intel-agent.md` interprets clinical development movement and milestone changes.
- `regulatory-watch-agent.md` monitors FDA, EMA, and other market-moving regulatory signals.
- `data-steward-agent.md` owns canonical entities, ontology health, and confidence scoring.
- `signal-sentinel-agent.md` detects anomalies, negative movement, and escalation-worthy risk.
- `portfolio-strategist-agent.md` turns the full evidence stream into decisions and leadership recommendations.
- `executive-copilot-agent.md` packages the whole system into founder and board-ready outputs.

## Operating model

1. Source-facing agents collect and structure evidence.
2. Data Steward validates and normalizes the graph.
3. Trial and regulatory specialists enrich the meaning of what changed.
4. Signal Sentinel ranks urgency and routes critical situations.
5. Portfolio Strategist produces a decision-ready point of view.

Use these prompts as the company's system definitions for specialized AI work, analyst workflows, or future service boundaries.


## Structure to use for Thread

1. Command thread
Use this for planning, coordination, priorities, and final synthesis.
2. Ops threads
For ingestion, source failures, schema changes, connector issues.
Best fit: sourceops-agent, data-steward-agent
3. Asset or company investigation threads
One per program, company, or major event.
Best fit: trial-intel-agent, regulatory-watch-agent, signal-sentinel-agent
4. Decision threads
For portfolio review, weekly strategy, founder/board prep.
Best fit: portfolio-strategist-agent, executive-copilot-agent
export interface AgentMetric {
  label: string;
  value: string;
  context: string;
}

export interface AgentWorkflowStep {
  title: string;
  detail: string;
}

export interface AgentProfile {
  id: string;
  name: string;
  callsign: string;
  mission: string;
  focus: string;
  status: 'Online' | 'Monitoring' | 'Escalated';
  cadence: string;
  coverage: string;
  primaryTools: string[];
  inputs: string[];
  outputs: string[];
  specialties: string[];
  metrics: AgentMetric[];
  workflow: AgentWorkflowStep[];
  partnerAgents: string[];
}

export const controlTowerMetrics: AgentMetric[] = [
  {
    label: 'Agents On Duty',
    value: '7',
    context: 'Coverage from ingestion through executive briefing',
  },
  {
    label: 'Decision Loops',
    value: '<24h',
    context: 'Target time from signal detection to portfolio summary',
  },
  {
    label: 'Source Classes',
    value: '5',
    context: 'Trials, regulatory, company, market, and internal ops data',
  },
];

export const operatingCadence: AgentWorkflowStep[] = [
  {
    title: 'Morning scan',
    detail: 'SourceOps, Trial Intel, and Regulatory Watch refresh structured data and flag overnight changes.',
  },
  {
    title: 'Midday validation',
    detail: 'Data Steward resolves duplicates, normalizes entities, and scores record confidence before downstream use.',
  },
  {
    title: 'Decision review',
    detail: 'Signal Sentinel and Portfolio Strategist turn fresh evidence into watchlists, risk calls, and capital allocation options.',
  },
  {
    title: 'Leadership brief',
    detail: 'Executive Copilot ships a board-ready summary with what changed, why it matters, and what leadership should do next.',
  },
];

export const agentProfiles: AgentProfile[] = [
  {
    id: 'sourceops',
    name: 'SourceOps Agent',
    callsign: 'Atlas',
    mission: 'Keep the PPP tracker fed with fresh, trusted source data.',
    focus: 'Scraper orchestration, source health, ingestion SLAs',
    status: 'Online',
    cadence: 'Hourly health checks, daily full sync',
    coverage: 'ClinicalTrials.gov, FDA, EMA, company pipeline pages, partner imports',
    primaryTools: ['Python ingest jobs', 'SQLite audit logs', 'Retry policies', 'Source health dashboards'],
    inputs: ['Source configs', 'API limits', 'Scrape failures', 'Backfill requests'],
    outputs: ['Fresh records', 'Job telemetry', 'Sync status', 'Failure tickets'],
    specialties: ['Scheduling', 'Rate limiting', 'Retry policies', 'Backfills', 'Source onboarding'],
    metrics: [
      { label: 'Freshness SLA', value: '98.4%', context: 'Sources refreshed within target window' },
      { label: 'Failed Jobs', value: '2', context: 'Needs operator review before next cycle' },
      { label: 'Throughput', value: '18.2k/day', context: 'Records processed across all connectors' },
    ],
    workflow: [
      { title: 'Poll and fetch', detail: 'Runs scrapers on schedule and enforces per-source concurrency limits.' },
      { title: 'Persist raw payloads', detail: 'Stores fetch outputs and metadata for replay and debugging.' },
      { title: 'Open handoff', detail: 'Passes candidate records to Data Steward with provenance attached.' },
    ],
    partnerAgents: ['Data Steward', 'Trial Intel', 'Regulatory Watch'],
  },
  {
    id: 'trial-intel',
    name: 'Trial Intel Agent',
    callsign: 'Helix',
    mission: 'Turn protocol changes and study updates into competitive intelligence.',
    focus: 'Clinical development progress, enrollment signals, readout tracking',
    status: 'Online',
    cadence: 'Continuous monitoring with event-based alerts',
    coverage: 'Phase changes, recruitment status, endpoints, trial geography',
    primaryTools: ['ClinicalTrials.gov parser', 'Event extraction', 'Study timeline builder'],
    inputs: ['Trial payloads', 'Company watchlists', 'Indication filters', 'Milestone calendars'],
    outputs: ['Study briefs', 'Phase transition events', 'Enrollment alerts', 'Readout watchlists'],
    specialties: ['Protocol diffs', 'Milestone mapping', 'Asset watchlists', 'Competitive trial landscapes'],
    metrics: [
      { label: 'Tracked Assets', value: '412', context: 'Programs under active trial surveillance' },
      { label: 'Phase Change Alerts', value: '14', context: 'New events detected in the last 7 days' },
      { label: 'Readout Calendar', value: '29', context: 'Upcoming expected catalysts this quarter' },
    ],
    workflow: [
      { title: 'Detect trial movement', detail: 'Compares new study records against historical milestones and status states.' },
      { title: 'Interpret impact', detail: 'Labels what changed for asset maturity, competitor pace, and indication heat.' },
      { title: 'Escalate significance', detail: 'Sends material changes to Signal Sentinel and Executive Copilot.' },
    ],
    partnerAgents: ['SourceOps Agent', 'Signal Sentinel', 'Executive Copilot'],
  },
  {
    id: 'reg-watch',
    name: 'Regulatory Watch Agent',
    callsign: 'Beacon',
    mission: 'Watch every regulatory surface that can change valuation or launch timing.',
    focus: 'FDA and EMA catalysts, designations, filings, approvals, safety actions',
    status: 'Monitoring',
    cadence: 'Twice-daily review with urgent event interrupts',
    coverage: 'PDUFA dates, CHMP opinions, label updates, CRLs, holds, orphan designations',
    primaryTools: ['Regulatory calendars', 'Approval trackers', 'Label diffing', 'Deadline monitors'],
    inputs: ['Agency updates', 'Filing dates', 'Asset metadata', 'Region priorities'],
    outputs: ['Regulatory briefs', 'Deadline risk alerts', 'Launch readiness notes', 'Label change summaries'],
    specialties: ['Submission milestones', 'Jurisdiction mapping', 'Approval risk', 'Safety surveillance'],
    metrics: [
      { label: 'Catalysts Open', value: '36', context: 'Live regulatory events across priority assets' },
      { label: 'Missed Deadlines', value: '0', context: 'No uncaught milestone slips this month' },
      { label: 'High-Risk Assets', value: '7', context: 'Programs with unresolved filing or safety concerns' },
    ],
    workflow: [
      { title: 'Watch calendars', detail: 'Maintains event timelines by agency, asset, and geography.' },
      { title: 'Assess risk', detail: 'Scores every update for launch timing, label breadth, and portfolio impact.' },
      { title: 'Notify operators', detail: 'Pushes high-severity changes to leadership and the portfolio queue.' },
    ],
    partnerAgents: ['Portfolio Strategist', 'Signal Sentinel', 'Executive Copilot'],
  },
  {
    id: 'data-steward',
    name: 'Data Steward Agent',
    callsign: 'Ledger',
    mission: 'Protect the integrity of the pipeline graph so every decision rests on clean data.',
    focus: 'Normalization, deduplication, ontology management, confidence scoring',
    status: 'Online',
    cadence: 'Runs on every ingest and nightly quality sweeps',
    coverage: 'Company entities, product aliases, indication ontology, source provenance',
    primaryTools: ['Normalization library', 'Schema rules', 'Confidence scoring', 'Merge review queues'],
    inputs: ['Raw source records', 'Manual corrections', 'Reference dictionaries', 'Schema changes'],
    outputs: ['Canonical entities', 'Quality scores', 'Exception queues', 'Audit traces'],
    specialties: ['Alias resolution', 'Record merges', 'Schema governance', 'Quality observability'],
    metrics: [
      { label: 'Confidence Score', value: '96.1%', context: 'Weighted canonical record confidence' },
      { label: 'Duplicate Rate', value: '1.8%', context: 'Candidate collisions awaiting merge decisions' },
      { label: 'Open Exceptions', value: '11', context: 'Rows that need manual ontology review' },
    ],
    workflow: [
      { title: 'Normalize entities', detail: 'Maps source-specific names into canonical companies, products, and indications.' },
      { title: 'Score trust', detail: 'Ranks records by source authority, completeness, and recency.' },
      { title: 'Route edge cases', detail: 'Raises ambiguous records to humans or specialist agents with context attached.' },
    ],
    partnerAgents: ['SourceOps Agent', 'Trial Intel', 'Portfolio Strategist'],
  },
  {
    id: 'signal-sentinel',
    name: 'Signal Sentinel Agent',
    callsign: 'Pulse',
    mission: 'Spot the deltas that matter before they turn into surprises.',
    focus: 'Anomaly detection, slip detection, discontinuation risk, competitive threat scoring',
    status: 'Online',
    cadence: 'Real-time event scoring with end-of-day risk rollup',
    coverage: 'Trial delays, enrollment stalls, adverse updates, silent pipelines, partner gaps',
    primaryTools: ['Event scoring', 'Watchlist thresholds', 'Historical baselines', 'Alert triage'],
    inputs: ['Trial events', 'Regulatory events', 'Portfolio priorities', 'Historical trends'],
    outputs: ['Risk alerts', 'Escalation memos', 'Watchlists', 'Scenario notes'],
    specialties: ['Delay detection', 'Negative signal clustering', 'Threat prioritization', 'Executive escalation'],
    metrics: [
      { label: 'Alerts This Week', value: '23', context: 'Signals triaged across tracked portfolios' },
      { label: 'Critical Escalations', value: '4', context: 'Requires leadership review within 24 hours' },
      { label: 'False Positive Rate', value: '6%', context: 'Signals dismissed after human review' },
    ],
    workflow: [
      { title: 'Fuse evidence', detail: 'Combines trial, regulatory, and source health signals into one risk model.' },
      { title: 'Rank urgency', detail: 'Prioritizes alerts by valuation impact, confidence, and time sensitivity.' },
      { title: 'Drive response', detail: 'Routes issues to Portfolio Strategist and Executive Copilot with recommended actions.' },
    ],
    partnerAgents: ['Trial Intel', 'Regulatory Watch', 'Portfolio Strategist'],
  },
  {
    id: 'portfolio-strategist',
    name: 'Portfolio Strategist',
    callsign: 'Northstar',
    mission: 'Translate raw pipeline movement into capital allocation and strategic decisions.',
    focus: 'Portfolio prioritization, whitespace mapping, company scoring, decision support',
    status: 'Online',
    cadence: 'Daily prioritization review and weekly investment committee prep',
    coverage: 'Asset scoring, company landscapes, indication attractiveness, partnership targets',
    primaryTools: ['Scenario models', 'Watchlists', 'Competitive maps', 'Leadership briefs'],
    inputs: ['Cleaned pipeline data', 'Risk alerts', 'Regulatory outlook', 'Corporate priorities'],
    outputs: ['Ranked portfolios', 'What-changed memos', 'Strategic recommendations', 'Board packets'],
    specialties: ['Prioritization frameworks', 'Competitive benchmarking', 'Deal triage', 'Decision memos'],
    metrics: [
      { label: 'Priority Assets', value: '28', context: 'Programs receiving active leadership attention' },
      { label: 'Whitespace Themes', value: '9', context: 'Indications with under-owned opportunity' },
      { label: 'Decision Packets', value: '5/wk', context: 'Strategy-ready outputs for leadership' },
    ],
    workflow: [
      { title: 'Score opportunities', detail: 'Blends clinical momentum, regulatory risk, and strategic fit into a portfolio rank.' },
      { title: 'Frame choices', detail: 'Converts data into hold, invest, partner, or deprioritize decisions.' },
      { title: 'Publish narrative', detail: 'Packages conclusions for Executive Copilot and leadership review.' },
    ],
    partnerAgents: ['Data Steward', 'Regulatory Watch', 'Executive Copilot'],
  },
  {
    id: 'executive-copilot',
    name: 'Executive Copilot',
    callsign: 'Summit',
    mission: 'Package the entire system into crisp leadership updates that accelerate action.',
    focus: 'Executive briefing, narrative synthesis, meeting prep, board-ready communication',
    status: 'Online',
    cadence: 'Daily briefings, weekly board pack draft, ad hoc urgent updates',
    coverage: 'Leadership summaries, decision logs, key risks, portfolio momentum, action owners',
    primaryTools: ['Daily digests', 'Narrative templates', 'Decision log summaries', 'Executive dashboards'],
    inputs: ['Portfolio memos', 'Risk escalations', 'Trial briefs', 'Regulatory updates'],
    outputs: ['Daily founder brief', 'Board packet draft', 'Action memo', 'Meeting prep notes'],
    specialties: ['Narrative synthesis', 'Executive communication', 'Decision logging', 'Action tracking'],
    metrics: [
      { label: 'Briefs Published', value: '12/wk', context: 'Leadership communications generated across teams' },
      { label: 'Decision Logs', value: '31', context: 'Tracked decisions with source-backed rationale' },
      { label: 'Urgent Updates', value: '<60 min', context: 'Time to package a critical escalation for leadership' },
    ],
    workflow: [
      { title: 'Aggregate the system', detail: 'Pulls the most material changes from specialist agents into one operating picture.' },
      { title: 'Separate signal from noise', detail: 'Distills each update into implications, decisions, and next actions for leadership.' },
      { title: 'Publish and log', detail: 'Creates founder, exec, and board outputs with timestamps and ownership trails.' },
    ],
    partnerAgents: ['Portfolio Strategist', 'Signal Sentinel', 'Regulatory Watch'],
  },
];

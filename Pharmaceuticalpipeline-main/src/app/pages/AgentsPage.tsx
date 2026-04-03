import { ArrowRight, Bot, Brain, Radar, ShieldCheck, Sparkles, Workflow } from 'lucide-react';
import { Badge } from '../components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Progress } from '../components/ui/progress';
import { Separator } from '../components/ui/separator';
import { agentProfiles, controlTowerMetrics, operatingCadence } from '../data/agents';

const statusTone = {
  Online: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Monitoring: 'bg-amber-50 text-amber-700 border-amber-200',
  Escalated: 'bg-rose-50 text-rose-700 border-rose-200',
} as const;

export function AgentsPage() {
  return (
    <div className="h-full overflow-auto">
      <div className="min-h-full bg-[radial-gradient(circle_at_top_left,_rgba(37,99,235,0.16),_transparent_28%),radial-gradient(circle_at_top_right,_rgba(22,163,74,0.14),_transparent_24%),linear-gradient(180deg,_#f8fbff_0%,_#eef5f8_48%,_#f8fafc_100%)] p-8">
        <div className="mx-auto max-w-7xl space-y-8">
          <section className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white/90 shadow-sm backdrop-blur">
            <div className="grid gap-8 p-8 lg:grid-cols-[1.35fr_0.95fr]">
              <div className="space-y-5">
                <Badge variant="outline" className="rounded-full border-blue-200 bg-blue-50 px-3 py-1 text-blue-700">
                  AI Operating System
                </Badge>
                <div className="space-y-3">
                  <h1 className="text-4xl font-semibold tracking-tight text-slate-950">PPP Agent Command Center</h1>
                  <p className="max-w-3xl text-base leading-7 text-slate-600">
                    A specialist agent bench for the pharmaceutical product pipeline company: one team for source ingestion,
                    one for trial and regulatory intelligence, one for data integrity, one for risk detection, and one for
                    turning signal into executive action.
                  </p>
                </div>
                <div className="flex flex-wrap gap-3 text-sm text-slate-600">
                  <div className="rounded-full bg-slate-100 px-4 py-2">Built around the current React, Python, SQLite, and scraper stack</div>
                  <div className="rounded-full bg-slate-100 px-4 py-2">Designed for daily operating cadence, not one-off prompting</div>
                  <div className="rounded-full bg-slate-100 px-4 py-2">Ready to expand into more source connectors and analyst workflows</div>
                </div>
              </div>

              <Card className="border-slate-200 bg-slate-950 text-white">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <Workflow className="size-5 text-blue-300" />
                    Control Tower
                  </CardTitle>
                  <CardDescription className="text-slate-300">
                    The operating model your future pharma intelligence company can actually run every day.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-3 sm:grid-cols-3">
                    {controlTowerMetrics.map((metric) => (
                      <div key={metric.label} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                        <div className="text-2xl font-semibold">{metric.value}</div>
                        <div className="mt-1 text-sm font-medium text-slate-100">{metric.label}</div>
                        <p className="mt-2 text-xs leading-5 text-slate-300">{metric.context}</p>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-3">
                    {operatingCadence.map((step, index) => (
                      <div key={step.title} className="flex gap-3">
                        <div className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-blue-500/20 text-sm font-semibold text-blue-200">
                          {index + 1}
                        </div>
                        <div>
                          <div className="font-medium text-white">{step.title}</div>
                          <p className="text-sm leading-6 text-slate-300">{step.detail}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          <section className="grid gap-6 xl:grid-cols-[1.6fr_0.9fr]">
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-2">
              {agentProfiles.map((agent) => (
                <Card key={agent.id} className="border-slate-200/80 bg-white/90 shadow-sm">
                  <CardHeader className="space-y-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-3">
                          <CardTitle className="text-xl text-slate-950">{agent.name}</CardTitle>
                          <Badge variant="outline" className={statusTone[agent.status]}>
                            {agent.status}
                          </Badge>
                        </div>
                        <CardDescription className="mt-2 text-sm text-slate-500">
                          {agent.callsign} | {agent.focus}
                        </CardDescription>
                      </div>
                      <div className="rounded-2xl bg-slate-100 p-3 text-slate-700">
                        <Bot className="size-5" />
                      </div>
                    </div>
                    <p className="text-sm leading-6 text-slate-600">{agent.mission}</p>
                  </CardHeader>

                  <CardContent className="space-y-6">
                    <div className="grid gap-3 sm:grid-cols-3">
                      {agent.metrics.map((metric) => (
                        <div key={metric.label} className="rounded-2xl bg-slate-50 p-3">
                          <div className="text-lg font-semibold text-slate-950">{metric.value}</div>
                          <div className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">{metric.label}</div>
                          <p className="mt-2 text-xs leading-5 text-slate-500">{metric.context}</p>
                        </div>
                      ))}
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium text-slate-700">Operational readiness</span>
                        <span className="text-slate-500">{agent.cadence}</span>
                      </div>
                      <Progress value={agent.status === 'Online' ? 92 : agent.status === 'Monitoring' ? 78 : 42} className="h-2.5 bg-slate-200" />
                    </div>

                    <div className="space-y-3">
                      <div>
                        <h3 className="text-sm font-semibold text-slate-900">Coverage</h3>
                        <p className="mt-1 text-sm leading-6 text-slate-600">{agent.coverage}</p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {agent.specialties.map((specialty) => (
                          <Badge key={specialty} variant="secondary" className="rounded-full bg-slate-100 px-3 py-1 text-slate-700">
                            {specialty}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <Separator />

                    <div className="grid gap-5 lg:grid-cols-2">
                      <div>
                        <h3 className="text-sm font-semibold text-slate-900">Inputs</h3>
                        <div className="mt-3 space-y-2 text-sm text-slate-600">
                          {agent.inputs.map((input) => (
                            <div key={input} className="rounded-xl bg-slate-50 px-3 py-2">
                              {input}
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-slate-900">Outputs</h3>
                        <div className="mt-3 space-y-2 text-sm text-slate-600">
                          {agent.outputs.map((output) => (
                            <div key={output} className="rounded-xl bg-slate-50 px-3 py-2">
                              {output}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-3">
                      <h3 className="text-sm font-semibold text-slate-900">Workflow</h3>
                      {agent.workflow.map((step) => (
                        <div key={step.title} className="flex gap-3 rounded-2xl border border-slate-200/80 p-4">
                          <ArrowRight className="mt-0.5 size-4 shrink-0 text-blue-600" />
                          <div>
                            <div className="font-medium text-slate-900">{step.title}</div>
                            <p className="text-sm leading-6 text-slate-600">{step.detail}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div>
                      <h3 className="text-sm font-semibold text-slate-900">Partner agents</h3>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {agent.partnerAgents.map((partner) => (
                          <Badge key={partner} variant="outline" className="rounded-full px-3 py-1 text-slate-700">
                            {partner}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="space-y-6">
              <Card className="border-slate-200/80 bg-white/90 shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <Radar className="size-5 text-blue-600" />
                    Why This Split Works
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-sm leading-6 text-slate-600">
                  <p>
                    The stack already separates source acquisition, normalization, and presentation. These agents mirror that
                    architecture so intelligence quality compounds instead of getting mixed together in one giant generalist prompt.
                  </p>
                  <p>
                    It also gives you clean accountability: one team owns freshness, one owns truth, one owns risk, and one owns the
                    final recommendation leadership sees.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-slate-200/80 bg-white/90 shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <ShieldCheck className="size-5 text-emerald-600" />
                    Non-Negotiables
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-slate-600">
                  <div className="rounded-2xl bg-slate-50 p-4">Every record keeps provenance back to a source and timestamp.</div>
                  <div className="rounded-2xl bg-slate-50 p-4">No executive summary is published until Data Steward clears confidence thresholds.</div>
                  <div className="rounded-2xl bg-slate-50 p-4">Critical regulatory or trial risk jumps straight to Signal Sentinel and Portfolio Strategist.</div>
                  <div className="rounded-2xl bg-slate-50 p-4">Agent prompts stay narrow enough to be auditable and reusable.</div>
                </CardContent>
              </Card>

              <Card className="border-slate-200/80 bg-slate-950 text-white shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <Brain className="size-5 text-cyan-300" />
                    Next Expansion Wave
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm leading-6 text-slate-300">
                  <p>Add a Deal Scout agent for BD targets, a Safety Lens agent for pharmacovigilance, and an Investor Narrative agent for external comms.</p>
                  <p>The current bench is enough to run a focused high-end pharma intelligence company without creating coordination chaos on day one.</p>
                </CardContent>
              </Card>

              <Card className="border-blue-200 bg-blue-50 shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl text-blue-950">
                    <Sparkles className="size-5 text-blue-700" />
                    Founder View
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm leading-6 text-blue-900">
                  This is set up like a serious company control room, not a gimmick page. As the backend matures, these same agent boundaries
                  can map directly to jobs, services, review queues, and exec dashboards.
                </CardContent>
              </Card>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

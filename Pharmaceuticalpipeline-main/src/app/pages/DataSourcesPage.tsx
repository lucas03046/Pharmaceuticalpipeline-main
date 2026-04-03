import { ArrowUpRight, Newspaper, Sparkles } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { DataSourceManager } from '../components/data/DataSourceManager';
import { DataSource } from '../../types/database';

type NewsItem = {
  id: string;
  headline: string;
  summary: string;
  therapyArea: string;
  productArea: string;
  sourceName: string;
  sourceUrl: string;
  publishedAt: string;
};

export function DataSourcesPage() {
  const dataSources: DataSource[] = [
    {
      id: 'local-clinicaltrials',
      name: 'ClinicalTrials.gov',
      type: 'clinical_trials_gov',
      baseUrl: 'https://clinicaltrials.gov',
      status: 'active',
      recordCount: 0,
      createdAt: new Date().toISOString(),
    },
  ];

  const newsItems: NewsItem[] = [
    {
      id: 'n1',
      headline: 'Phase 3 readout sharpens focus on PD-1 combinations in lung cancer',
      summary:
        'New coverage highlights how checkpoint programs are repositioning around biomarker-led enrollment and combination strategies.',
      therapyArea: 'Oncology',
      productArea: 'Lung cancer immuno-oncology',
      sourceName: 'ClinicalTrials.gov',
      sourceUrl: 'https://clinicaltrials.gov/search?cond=Lung%20Cancer',
      publishedAt: '2026-03-28',
    },
    {
      id: 'n2',
      headline: 'Metabolic pipeline coverage centers on next-wave GLP-1 differentiation',
      summary:
        'Publications this week focus on cardiovascular outcomes, persistence, and formulation advantages across obesity and diabetes assets.',
      therapyArea: 'Metabolic',
      productArea: 'GLP-1 and diabetes programs',
      sourceName: 'FDA Drugs Database',
      sourceUrl: 'https://www.fda.gov/drugs',
      publishedAt: '2026-03-27',
    },
    {
      id: 'n3',
      headline: "Neurology headlines track renewed interest in disease-modifying Alzheimer's assets",
      summary:
        'Recent source material emphasizes trial design, patient-selection criteria, and commercial readiness for late-stage neurology programs.',
      therapyArea: 'Neurology',
      productArea: "Alzheimer's disease pipeline",
      sourceName: 'ClinicalTrials.gov',
      sourceUrl: 'https://clinicaltrials.gov/search?cond=Alzheimer%27s%20Disease',
      publishedAt: '2026-03-26',
    },
    {
      id: 'n4',
      headline: 'Immunology publications highlight durability questions across autoimmune biologics',
      summary:
        'Coverage clusters around long-term response, switching behavior, and label-expansion potential in inflammatory disease programs.',
      therapyArea: 'Immunology',
      productArea: 'Autoimmune biologics',
      sourceName: 'FDA Drugs Database',
      sourceUrl: 'https://www.fda.gov/drugs/drug-approvals-and-databases',
      publishedAt: '2026-03-25',
    },
    {
      id: 'n5',
      headline: 'Cardiovascular sources point to filing momentum for lipid and heart-failure assets',
      summary:
        'Recent scraped items show stronger regulatory positioning for programs nearing pivotal milestones and submission planning.',
      therapyArea: 'Cardiovascular',
      productArea: 'Heart failure and lipid management',
      sourceName: 'ClinicalTrials.gov',
      sourceUrl: 'https://clinicaltrials.gov/search?cond=Heart%20Failure',
      publishedAt: '2026-03-24',
    },
    {
      id: 'n6',
      headline: 'Respiratory vaccine and asthma coverage shows earlier-stage innovation picking up',
      summary:
        'Headlines emphasize platform flexibility, regional recruitment progress, and emerging differentiation in respiratory programs.',
      therapyArea: 'Respiratory',
      productArea: 'Asthma and respiratory vaccines',
      sourceName: 'ClinicalTrials.gov',
      sourceUrl: 'https://clinicaltrials.gov/search?cond=Asthma',
      publishedAt: '2026-03-22',
    },
  ];

  const groupedNews = newsItems.reduce((groups, item) => {
    if (!groups[item.therapyArea]) {
      groups[item.therapyArea] = [];
    }

    groups[item.therapyArea].push(item);
    return groups;
  }, {} as Record<string, NewsItem[]>);

  const orderedGroups = Object.entries(groupedNews).sort(([left], [right]) =>
    left.localeCompare(right),
  );

  return (
    <div className="h-full overflow-auto">
      <div className="p-8 space-y-8">
        <div>
          <h1 className="text-3xl font-semibold mb-2">Data Sources</h1>
          <p className="text-slate-600">
            Local source controls and a newsletter-style digest grouped by therapy area and product focus
          </p>
        </div>

        <div className="grid grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 mb-1">Therapy Areas Covered</p>
                  <p className="text-3xl font-semibold">{orderedGroups.length}</p>
                </div>
                <div className="size-12 rounded-lg bg-cyan-50 text-cyan-700 flex items-center justify-center">
                  <Newspaper className="size-5" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 mb-1">Headline Count</p>
                  <p className="text-3xl font-semibold">{newsItems.length}</p>
                </div>
                <div className="size-12 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center">
                  <Sparkles className="size-5" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 mb-1">Latest Publication</p>
                  <p className="text-3xl font-semibold">Mar 28</p>
                </div>
                <div className="size-12 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center">
                  <ArrowUpRight className="size-5" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Local Ingest Controls</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {dataSources.map((source) => (
              <div key={source.id} className="rounded-2xl border border-slate-200 p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="font-semibold text-slate-950">{source.name}</h2>
                    <p className="text-sm text-slate-600">
                      Trigger the local Python ingest pipeline and write provisional records into SQLite.
                    </p>
                  </div>
                  <div className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                    localhost
                  </div>
                </div>
                <DataSourceManager dataSource={source} />
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="space-y-6">
          {orderedGroups.map(([therapyArea, items]) => (
            <Card key={therapyArea}>
              <CardHeader className="border-b bg-slate-50/70">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <CardTitle className="text-xl">{therapyArea}</CardTitle>
                    <p className="mt-1 text-sm text-slate-600">
                      {items.length} publication{items.length === 1 ? '' : 's'} in the current digest
                    </p>
                  </div>
                  <div className="rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-600 border">
                    Newsletter view
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y">
                  {items.map((item) => (
                    <article key={item.id} className="p-6">
                      <div className="flex items-start justify-between gap-6">
                        <div className="flex-1 min-w-0">
                          <div className="mb-2 flex flex-wrap items-center gap-2 text-xs font-medium text-slate-500">
                            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-slate-700">
                              {item.productArea}
                            </span>
                            <span>
                              {new Date(item.publishedAt).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                              })}
                            </span>
                          </div>
                          <h2 className="text-lg font-semibold text-slate-950 mb-2">{item.headline}</h2>
                          <p className="text-sm leading-6 text-slate-600">{item.summary}</p>
                        </div>
                        <a
                          href={item.sourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                        >
                          {item.sourceName}
                          <ArrowUpRight className="size-4" />
                        </a>
                      </div>
                    </article>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="bg-cyan-50 border-cyan-200">
          <CardContent className="p-6">
            <div className="flex gap-4">
              <Newspaper className="size-5 text-cyan-700 mt-0.5" />
              <div>
                <h3 className="font-semibold text-cyan-950 mb-2">Source Attribution</h3>
                <p className="text-sm text-cyan-900">
                  Every headline in this digest is intended to represent a scraped publication or source record tied to a
                  therapy area and product focus. Each card links directly back to the originating datasource so users can
                  verify the original publication context.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

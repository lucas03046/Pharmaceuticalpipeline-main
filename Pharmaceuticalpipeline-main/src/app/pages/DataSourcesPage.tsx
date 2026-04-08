import { useMemo, useState } from 'react';
import { ArrowUpRight, Newspaper, Search, Sparkles } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { FilterSidebar, FilterState } from '../components/FilterSidebar';
import { useAppData } from '../data/AppDataContext';
import { getPhaseColor, getPhaseTextColor } from '../data/catalog';
import { DevelopmentPhase, ProductStatus, Region } from '../../types/database';

type NewsItem = {
  id: string;
  headline: string;
  summary: string;
  therapyArea: string;
  productArea: string;
  sourceName: string;
  sourceUrl: string;
  publishedAt: string;
  companyId: string;
  indicationId: string;
  phase: DevelopmentPhase;
  status: ProductStatus;
  regions: Region[];
};

export function DataSourcesPage() {
  const { getCompanyById, getIndicationById, loading, error } = useAppData();
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState<FilterState>({
    companies: [],
    therapyAreas: [],
    indications: [],
    phases: [],
    statuses: [],
    regions: [],
    yearRange: [2020, 2027],
  });

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
      companyId: 'c1',
      indicationId: 'i1',
      phase: 'Phase 3',
      status: 'Active',
      regions: ['US', 'EU'],
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
      companyId: 'c2',
      indicationId: 'i2',
      phase: 'Phase 3',
      status: 'Active',
      regions: ['US', 'EU', 'Asia'],
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
      companyId: 'c4',
      indicationId: 'i4',
      phase: 'Phase 1',
      status: 'Active',
      regions: ['US', 'EU'],
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
      companyId: 'c7',
      indicationId: 'i8',
      phase: 'Phase 2',
      status: 'Active',
      regions: ['EU'],
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
      companyId: 'c5',
      indicationId: 'i14',
      phase: 'Filing',
      status: 'Active',
      regions: ['Global'],
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
      companyId: 'c8',
      indicationId: 'i12',
      phase: 'Phase 1',
      status: 'Active',
      regions: ['US', 'EU'],
    },
    {
      id: 'n7',
      headline: 'Regulatory commentary spotlights approval-readiness in chronic kidney disease programs',
      summary:
        'Analyst notes and public filings are converging around label scope, sequencing strategy, and launch preparation for renal assets.',
      therapyArea: 'Nephrology',
      productArea: 'Chronic kidney disease',
      sourceName: 'FDA Drugs Database',
      sourceUrl: 'https://www.fda.gov/drugs/drug-approvals-and-databases',
      publishedAt: '2026-03-20',
      companyId: 'c6',
      indicationId: 'i7',
      phase: 'Approved',
      status: 'Approved',
      regions: ['US', 'EU'],
    },
    {
      id: 'n8',
      headline: 'Pipeline watch: bispecific oncology assets keep deal teams busy',
      summary:
        'Recent publications point to continued strategic interest in differentiated bispecific programs with faster proof-of-concept paths.',
      therapyArea: 'Oncology',
      productArea: 'Bispecific antibodies',
      sourceName: 'ClinicalTrials.gov',
      sourceUrl: 'https://clinicaltrials.gov/search?cond=Cancer',
      publishedAt: '2026-03-18',
      companyId: 'c3',
      indicationId: 'i1',
      phase: 'Phase 2',
      status: 'Active',
      regions: ['US', 'EU'],
    },
  ];

  const filteredNews = useMemo(() => {
    const search = query.trim().toLowerCase();

    return newsItems
      .filter((item) => {
        if (filters.companies.length > 0 && !filters.companies.includes(item.companyId)) {
          return false;
        }

        if (filters.therapyAreas.length > 0 && !filters.therapyAreas.includes(item.therapyArea)) {
          return false;
        }

        if (filters.indications.length > 0 && !filters.indications.includes(item.indicationId)) {
          return false;
        }

        if (filters.phases.length > 0 && !filters.phases.includes(item.phase)) {
          return false;
        }

        if (filters.statuses.length > 0 && !filters.statuses.includes(item.status)) {
          return false;
        }

        if (filters.regions.length > 0 && !item.regions.some((region) => filters.regions.includes(region))) {
          return false;
        }

        const year = new Date(item.publishedAt).getFullYear();
        if (year < filters.yearRange[0] || year > filters.yearRange[1]) {
          return false;
        }

        if (!search) {
          return true;
        }

        const companyName = getCompanyById(item.companyId)?.name ?? '';
        const indicationName = getIndicationById(item.indicationId)?.name ?? '';

        return [
          item.headline,
          item.summary,
          item.therapyArea,
          item.productArea,
          item.sourceName,
          companyName,
          indicationName,
          item.phase,
        ]
          .join(' ')
          .toLowerCase()
          .includes(search);
      })
      .sort((left, right) => new Date(right.publishedAt).getTime() - new Date(left.publishedAt).getTime());
  }, [filters, getCompanyById, getIndicationById, newsItems, query]);

  const latestUpdate = filteredNews[0]?.publishedAt ?? newsItems[0]?.publishedAt;
  const coveredTherapyAreas = new Set(filteredNews.map((item) => item.therapyArea)).size;

  if (loading) {
    return <PageState description="Loading news archive..." />;
  }

  return (
    <div className="h-full flex">
      <FilterSidebar filters={filters} onFiltersChange={setFilters} />

      <div className="flex-1 overflow-auto">
        <div className="p-8 space-y-8">
          <div>
            <h1 className="text-3xl font-semibold mb-2">News</h1>
            <p className="text-slate-600">
              A searchable research library and chronological board of relevant healthcare industry R&D updates
            </p>
          </div>

          {error && <BackendNotice message={error} />}

          <div className="grid grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600 mb-1">Therapy Areas Covered</p>
                    <p className="text-3xl font-semibold">{coveredTherapyAreas}</p>
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
                    <p className="text-3xl font-semibold">{filteredNews.length}</p>
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
                    <p className="text-sm text-slate-600 mb-1">Latest Update</p>
                    <p className="text-3xl font-semibold">
                      {latestUpdate
                        ? new Date(latestUpdate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                        : 'N/A'}
                    </p>
                  </div>
                  <div className="size-12 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center">
                    <ArrowUpRight className="size-5" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between gap-6">
                <div>
                  <h2 className="text-xl font-semibold text-slate-950">Research News Archive</h2>
                  <p className="mt-1 text-sm text-slate-600">
                    Search, filter, and review relevant R&D headlines across therapy areas, products, and development stages
                  </p>
                </div>
                <div className="relative w-full max-w-xl">
                  <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Search headlines, therapy areas, products, companies, or indications..."
                    className="pl-10 bg-slate-50 border-slate-200"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            {filteredNews.map((item) => {
              const company = getCompanyById(item.companyId);
              const indication = getIndicationById(item.indicationId);

              return (
                <Card key={item.id}>
                  <CardContent className="p-6">
                    <article className="flex items-start justify-between gap-6">
                      <div className="flex-1 min-w-0">
                        <div className="mb-3 flex flex-wrap items-center gap-2 text-xs font-medium text-slate-500">
                          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-slate-700">
                            {item.therapyArea}
                          </span>
                          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-slate-700">
                            {item.productArea}
                          </span>
                          <span
                            className="rounded-full px-2.5 py-1"
                            style={{
                              backgroundColor: getPhaseColor(item.phase),
                              color: getPhaseTextColor(item.phase),
                            }}
                          >
                            {item.phase}
                          </span>
                          <span>
                            {new Date(item.publishedAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </span>
                        </div>

                        <h2 className="text-xl font-semibold text-slate-950 mb-2">{item.headline}</h2>
                        <p className="text-sm leading-6 text-slate-600 mb-4">{item.summary}</p>

                        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-slate-600">
                          <span>
                            <span className="text-slate-500">Company: </span>
                            {company?.name ?? 'Unknown'}
                          </span>
                          <span>
                            <span className="text-slate-500">Indication: </span>
                            {indication?.name ?? item.productArea}
                          </span>
                          <span>
                            <span className="text-slate-500">Regions: </span>
                            {item.regions.join(', ')}
                          </span>
                        </div>
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
                    </article>
                  </CardContent>
                </Card>
              );
            })}

            {filteredNews.length === 0 && (
              <Card>
                <CardContent className="p-10 text-center">
                  <h2 className="text-lg font-semibold text-slate-950 mb-2">No news matches the current filters</h2>
                  <p className="text-sm text-slate-600">
                    Try broadening the search or clearing some filters to see more healthcare R&D updates.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function BackendNotice({ message }: { message: string }) {
  return (
    <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
      {message}
    </div>
  );
}

function PageState({ description }: { description: string }) {
  return (
    <div className="h-full flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-semibold mb-2">News</h1>
        <p className="text-slate-600">{description}</p>
      </div>
    </div>
  );
}

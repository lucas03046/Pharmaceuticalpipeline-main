import { Product } from '../../types/database';
import { useAppData } from '../data/AppDataContext';
import { getPhaseHoverColor, getPhaseColor } from '../data/catalog';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './ui/tooltip';

interface PipelineTimelineProps {
  products: Product[];
  onProductClick: (product: Product) => void;
}

export function PipelineTimeline({ products, onProductClick }: PipelineTimelineProps) {
  const { getCompanyById } = useAppData();
  const currentYear = new Date().getFullYear();
  const years = [2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026, 2027];

  const getTimelineData = (product: Product) => {
    const startYear = new Date(product.startDate).getFullYear();
    const events = [...(product.events || [])].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    const segments = [];
    for (let i = 0; i < events.length; i++) {
      const event = events[i];
      const nextEvent = events[i + 1];

      const startDate = new Date(event.date);
      const endDate = nextEvent ? new Date(nextEvent.date) : new Date();

      segments.push({
        phase: event.phase,
        startYear: startDate.getFullYear(),
        startMonth: startDate.getMonth(),
        endYear: endDate.getFullYear(),
        endMonth: endDate.getMonth(),
        color: getPhaseColor(event.phase),
      });
    }

    return { startYear, segments };
  };

  const getSegmentStyle = (segment: any, minYear: number, maxYear: number) => {
    const totalMonths = (maxYear - minYear + 1) * 12;
    const segmentStartMonths = (segment.startYear - minYear) * 12 + segment.startMonth;
    const segmentEndMonths = (segment.endYear - minYear) * 12 + segment.endMonth;

    const left = (segmentStartMonths / totalMonths) * 100;
    const width = ((segmentEndMonths - segmentStartMonths) / totalMonths) * 100;

    return {
      left: `${left}%`,
      width: `${Math.max(width, 0.5)}%`,
      backgroundColor: segment.color,
    };
  };

  const minYear = Math.min(...years);
  const maxYear = Math.max(...years);

  return (
    <div className="bg-white rounded-lg border">
      <div className="border-b bg-slate-50 sticky top-0 z-10">
        <div className="flex items-center h-12">
          <div className="w-64 px-6 font-medium text-sm border-r bg-white">Product</div>
          <div className="flex-1 flex">
            {years.map((year) => (
              <div
                key={year}
                className={`flex-1 text-center text-xs font-medium border-r last:border-r-0 py-3 ${
                  year === currentYear ? 'bg-blue-50 text-blue-700' : 'text-slate-600'
                }`}
              >
                {year}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="divide-y">
        {products.map((product) => {
          const company = getCompanyById(product.companyId);
          const { segments } = getTimelineData(product);

          return (
            <TooltipProvider key={product.id}>
              <div className="flex items-center h-16 hover:bg-slate-50 transition-colors group">
                <div className="w-64 px-6 border-r">
                  <button onClick={() => onProductClick(product)} className="text-left w-full">
                    <div className="font-medium text-sm mb-0.5 group-hover:text-blue-600">{product.name}</div>
                    <div className="text-xs text-slate-500">{company?.name}</div>
                  </button>
                </div>

                <div className="flex-1 relative h-16 px-4">
                  <div className="absolute inset-0 flex">
                    {years.map((year) => (
                      <div
                        key={year}
                        className={`flex-1 border-r last:border-r-0 ${year === currentYear ? 'bg-blue-50/30' : ''}`}
                      />
                    ))}
                  </div>

                  {years.includes(currentYear) && (
                    <div
                      className="absolute top-0 bottom-0 w-px bg-blue-500 z-10"
                      style={{
                        left: `${((currentYear - minYear) / (maxYear - minYear + 1)) * 100}%`,
                      }}
                    />
                  )}

                  <div className="absolute inset-y-0 left-0 right-0 flex items-center px-4">
                    <div className="relative w-full h-6">
                      {segments.map((segment, idx) => (
                        <Tooltip key={idx}>
                          <TooltipTrigger asChild>
                            <div
                              className="absolute h-6 rounded cursor-pointer transition-colors"
                              style={getSegmentStyle(segment, minYear, maxYear)}
                              onMouseEnter={(event) => {
                                event.currentTarget.style.backgroundColor = getPhaseHoverColor(segment.phase);
                              }}
                              onMouseLeave={(event) => {
                                event.currentTarget.style.backgroundColor = getPhaseColor(segment.phase);
                              }}
                            />
                          </TooltipTrigger>
                          <TooltipContent>
                            <div className="text-xs">
                              <div className="font-medium mb-1">{segment.phase}</div>
                              <div className="text-slate-400">
                                {new Date(segment.startYear, segment.startMonth).toLocaleDateString('en-US', {
                                  month: 'short',
                                  year: 'numeric',
                                })}
                                {' -> '}
                                {new Date(segment.endYear, segment.endMonth).toLocaleDateString('en-US', {
                                  month: 'short',
                                  year: 'numeric',
                                })}
                              </div>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </TooltipProvider>
          );
        })}
      </div>

      {products.length === 0 && <div className="py-12 text-center text-slate-500">No products match the selected filters</div>}
    </div>
  );
}

import { DevelopmentPhase } from '../../types/database';
import { useState } from 'react';
import { ChevronDown, ChevronRight, Filter } from 'lucide-react';
import { Checkbox } from './ui/checkbox';
import { Label } from './ui/label';
import { ScrollArea } from './ui/scroll-area';
import { useAppData } from '../data/AppDataContext';
import { getPhaseColor } from '../data/catalog';

export interface FilterState {
  companies: string[];
  therapyAreas: string[];
  indications: string[];
  phases: string[];
  statuses: string[];
  regions: string[];
  yearRange: [number, number];
}

interface FilterSidebarProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
}

export function FilterSidebar({ filters, onFiltersChange }: FilterSidebarProps) {
  const { companies, indications, getTherapyAreas } = useAppData();
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(['company', 'therapyArea', 'phase', 'status'])
  );

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  const toggleFilter = (category: keyof FilterState, value: string) => {
    const currentValues = filters[category] as string[];
    const newValues = currentValues.includes(value)
      ? currentValues.filter((v) => v !== value)
      : [...currentValues, value];

    onFiltersChange({
      ...filters,
      [category]: newValues,
    });
  };

  const therapyAreas = getTherapyAreas();
  const phases: DevelopmentPhase[] = ['Preclinical', 'Phase 1', 'Phase 2', 'Phase 3', 'Filing', 'Approved', 'Discontinued'];
  const statuses = ['Active', 'Approved', 'Discontinued'];
  const regions = ['US', 'EU', 'Global', 'Asia'];

  return (
    <aside className="w-72 border-r bg-white flex flex-col">
      <div className="p-4 border-b">
        <div className="flex items-center gap-2">
          <Filter className="size-4 text-slate-600" />
          <h2 className="font-semibold">Filters</h2>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-1">
          <FilterSection
            title="Company"
            isExpanded={expandedSections.has('company')}
            onToggle={() => toggleSection('company')}
          >
            <div className="space-y-2">
              {companies.slice(0, 12).map((company) => (
                <div key={company.id} className="flex items-center gap-2">
                  <Checkbox
                    id={`company-${company.id}`}
                    checked={filters.companies.includes(company.id)}
                    onCheckedChange={() => toggleFilter('companies', company.id)}
                  />
                  <Label htmlFor={`company-${company.id}`} className="text-sm cursor-pointer">
                    {company.name}
                  </Label>
                </div>
              ))}
            </div>
          </FilterSection>

          <FilterSection
            title="Therapy Area"
            isExpanded={expandedSections.has('therapyArea')}
            onToggle={() => toggleSection('therapyArea')}
          >
            <div className="space-y-2">
              {therapyAreas.map((area) => (
                <div key={area} className="flex items-center gap-2">
                  <Checkbox
                    id={`therapy-${area}`}
                    checked={filters.therapyAreas.includes(area)}
                    onCheckedChange={() => toggleFilter('therapyAreas', area)}
                  />
                  <Label htmlFor={`therapy-${area}`} className="text-sm cursor-pointer">
                    {area}
                  </Label>
                </div>
              ))}
            </div>
          </FilterSection>

          <FilterSection
            title="Indication"
            isExpanded={expandedSections.has('indication')}
            onToggle={() => toggleSection('indication')}
          >
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {indications.slice(0, 20).map((indication) => (
                <div key={indication.id} className="flex items-center gap-2">
                  <Checkbox
                    id={`indication-${indication.id}`}
                    checked={filters.indications.includes(indication.id)}
                    onCheckedChange={() => toggleFilter('indications', indication.id)}
                  />
                  <Label htmlFor={`indication-${indication.id}`} className="text-sm cursor-pointer">
                    {indication.name}
                  </Label>
                </div>
              ))}
            </div>
          </FilterSection>

          <FilterSection
            title="Development Phase"
            isExpanded={expandedSections.has('phase')}
            onToggle={() => toggleSection('phase')}
          >
            <div className="space-y-2">
              {phases.map((phase) => (
                <div key={phase} className="flex items-center gap-2">
                  <Checkbox
                    id={`phase-${phase}`}
                    checked={filters.phases.includes(phase)}
                    onCheckedChange={() => toggleFilter('phases', phase)}
                  />
                  <Label htmlFor={`phase-${phase}`} className="text-sm cursor-pointer flex items-center gap-2">
                    <span className="size-2.5 rounded-full shrink-0" style={{ backgroundColor: getPhaseColor(phase) }} />
                    {phase}
                  </Label>
                </div>
              ))}
            </div>
          </FilterSection>

          <FilterSection
            title="Status"
            isExpanded={expandedSections.has('status')}
            onToggle={() => toggleSection('status')}
          >
            <div className="space-y-2">
              {statuses.map((status) => (
                <div key={status} className="flex items-center gap-2">
                  <Checkbox
                    id={`status-${status}`}
                    checked={filters.statuses.includes(status)}
                    onCheckedChange={() => toggleFilter('statuses', status)}
                  />
                  <Label htmlFor={`status-${status}`} className="text-sm cursor-pointer">
                    {status}
                  </Label>
                </div>
              ))}
            </div>
          </FilterSection>

          <FilterSection
            title="Region"
            isExpanded={expandedSections.has('region')}
            onToggle={() => toggleSection('region')}
          >
            <div className="space-y-2">
              {regions.map((region) => (
                <div key={region} className="flex items-center gap-2">
                  <Checkbox
                    id={`region-${region}`}
                    checked={filters.regions.includes(region)}
                    onCheckedChange={() => toggleFilter('regions', region)}
                  />
                  <Label htmlFor={`region-${region}`} className="text-sm cursor-pointer">
                    {region}
                  </Label>
                </div>
              ))}
            </div>
          </FilterSection>
        </div>
      </ScrollArea>
    </aside>
  );
}

interface FilterSectionProps {
  title: string;
  isExpanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

function FilterSection({ title, isExpanded, onToggle, children }: FilterSectionProps) {
  return (
    <div className="border-b last:border-b-0 pb-3 mb-3">
      <button
        onClick={onToggle}
        className="flex items-center justify-between w-full py-2 hover:bg-slate-50 rounded px-2 -mx-2"
      >
        <span className="font-medium text-sm">{title}</span>
        {isExpanded ? <ChevronDown className="size-4 text-slate-500" /> : <ChevronRight className="size-4 text-slate-500" />}
      </button>
      {isExpanded && <div className="mt-3">{children}</div>}
    </div>
  );
}

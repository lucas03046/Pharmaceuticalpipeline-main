import { X, ExternalLink, Building2, FlaskConical, Activity, Globe2, Calendar } from 'lucide-react';
import { Product } from '../../types/database';
import { useAppData } from '../data/AppDataContext';
import { getPhaseColor, getPhaseTextColor } from '../data/catalog';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';

interface ProductDetailDrawerProps {
  product: Product | null;
  onClose: () => void;
}

export function ProductDetailDrawer({ product, onClose }: ProductDetailDrawerProps) {
  const { getCompanyById, getIndicationById } = useAppData();
  if (!product) return null;

  const company = getCompanyById(product.companyId);
  const indication = getIndicationById(product.indicationId);

  return (
    <div className="fixed right-0 top-16 bottom-0 w-[480px] bg-white border-l shadow-xl z-40 flex flex-col">
      <div className="p-6 border-b">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h2 className="text-xl font-semibold mb-1">{product.name}</h2>
            <p className="text-sm text-slate-600">{company?.name}</p>
          </div>
          <button
            onClick={onClose}
            className="size-8 rounded-lg hover:bg-slate-100 flex items-center justify-center transition-colors"
          >
            <X className="size-5" />
          </button>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-6 space-y-6">
          <div className="flex items-center gap-2">
            <Badge
              style={{
                backgroundColor: getPhaseColor(product.currentPhase),
                color: getPhaseTextColor(product.currentPhase),
              }}
            >
              {product.currentPhase}
            </Badge>
            <Badge variant="outline">{product.status}</Badge>
          </div>

          <div className="space-y-4">
            <DetailRow icon={<Building2 className="size-4" />} label="Company" value={company?.name || 'Unknown'} />
            <DetailRow
              icon={<FlaskConical className="size-4" />}
              label="Molecule / Modality"
              value={`${product.molecule || 'Unknown'} • ${product.modality || 'Unclassified'}`}
            />
            <DetailRow icon={<Activity className="size-4" />} label="Therapy Area" value={indication?.therapyArea || 'Unknown'} />
            <DetailRow icon={<Activity className="size-4" />} label="Indication" value={indication?.name || 'Unknown'} />
            <DetailRow icon={<Activity className="size-4" />} label="ICD-10 Code" value={indication?.icd10Code || 'Unknown'} />
            <DetailRow icon={<Globe2 className="size-4" />} label="Regions" value={(product.regions || []).join(', ')} />
            <DetailRow
              icon={<Calendar className="size-4" />}
              label="Last Updated"
              value={new Date(product.lastUpdated || product.startDate).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            />
          </div>

          {product.sourceUrl && (
            <a
              href={product.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 hover:underline"
            >
              <ExternalLink className="size-4" />
              View source
            </a>
          )}

          <div>
            <h3 className="font-semibold mb-4">Milestone History</h3>
            <div className="space-y-4">
              {(product.events || [])
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .map((event) => (
                  <MilestoneItem key={event.id} event={event} />
                ))}
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}

function DetailRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="text-slate-400 mt-0.5">{icon}</div>
      <div className="flex-1 min-w-0">
        <div className="text-xs text-slate-500 mb-0.5">{label}</div>
        <div className="text-sm">{value}</div>
      </div>
    </div>
  );
}

function MilestoneItem({ event }: { event: NonNullable<Product['events']>[number] }) {
  return (
    <div className="flex gap-3">
      <div className="flex flex-col items-center">
        <div className="size-3 rounded-full" style={{ backgroundColor: getPhaseColor(event.phase) }} />
        <div className="w-px h-full bg-slate-200 mt-1" />
      </div>
      <div className="flex-1 pb-4">
        <div className="flex items-center gap-2 mb-1">
          <Badge
            variant="outline"
            className="text-xs"
            style={{
              borderColor: getPhaseColor(event.phase),
              color: getPhaseColor(event.phase),
              backgroundColor: `${getPhaseColor(event.phase)}14`,
            }}
          >
            {event.phase}
          </Badge>
          <span className="text-xs text-slate-500">
            {new Date(event.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}
          </span>
        </div>
        <p className="text-sm text-slate-700">{event.description}</p>
      </div>
    </div>
  );
}

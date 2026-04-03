import { useState, useMemo } from 'react';
import { FilterSidebar, FilterState } from '../components/FilterSidebar';
import { PipelineTimeline } from '../components/PipelineTimeline';
import { ProductDetailDrawer } from '../components/ProductDetailDrawer';
import { useAppData } from '../data/AppDataContext';
import { Product } from '../../types/database';

export function PipelinePage() {
  const { products, getIndicationById, loading, error } = useAppData();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [filters, setFilters] = useState<FilterState>({
    companies: [],
    therapyAreas: [],
    indications: [],
    phases: [],
    statuses: [],
    regions: [],
    yearRange: [2020, 2027],
  });

  // Apply filters
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // Company filter
      if (filters.companies.length > 0 && !filters.companies.includes(product.companyId)) {
        return false;
      }

      // Therapy area filter
      if (filters.therapyAreas.length > 0) {
        const indication = getIndicationById(product.indicationId);
        if (!indication || !filters.therapyAreas.includes(indication.therapyArea)) {
          return false;
        }
      }

      // Indication filter
      if (filters.indications.length > 0 && !filters.indications.includes(product.indicationId)) {
        return false;
      }

      // Phase filter
      if (filters.phases.length > 0 && !filters.phases.includes(product.currentPhase)) {
        return false;
      }

      // Status filter
      if (filters.statuses.length > 0 && !filters.statuses.includes(product.status)) {
        return false;
      }

      // Region filter
      if (filters.regions.length > 0) {
        const hasMatchingRegion = product.regions.some((region) =>
          filters.regions.includes(region)
        );
        if (!hasMatchingRegion) {
          return false;
        }
      }

      return true;
    });
  }, [filters]);

  if (loading) {
    return <PageState title="Pipeline Timeline" description="Loading products from the local Python backend..." />;
  }

  return (
    <div className="h-full flex">
      <FilterSidebar filters={filters} onFiltersChange={setFilters} />
      
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-semibold mb-2">Pipeline Timeline</h1>
            <p className="text-slate-600">
              Showing {filteredProducts.length} of {products.length} products
            </p>
          </div>

          {error && <BackendNotice message={error} />}

          {/* Timeline */}
          <PipelineTimeline
            products={filteredProducts}
            onProductClick={setSelectedProduct}
          />
        </div>
      </div>

      {/* Detail Drawer */}
      <ProductDetailDrawer
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </div>
  );
}

function BackendNotice({ message }: { message: string }) {
  return (
    <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
      {message}
    </div>
  );
}

function PageState({ title, description }: { title: string; description: string }) {
  return (
    <div className="h-full flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-semibold mb-2">{title}</h1>
        <p className="text-slate-600">{description}</p>
      </div>
    </div>
  );
}

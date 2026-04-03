import React, { createContext, useContext, useEffect, useState } from 'react';
import { apiFetch } from '../../lib/api';
import { Company, Indication, Product } from '../../types/database';
import { fallbackCompanies, fallbackIndications, fallbackOverview, fallbackProducts } from './fallbackData';

interface Overview {
  companies: number;
  products: number;
  openReviewItems: number;
  rawStudies: number;
}

interface AppDataValue {
  companies: Company[];
  indications: Indication[];
  products: Product[];
  overview: Overview | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  getCompanyById: (id: string) => Company | undefined;
  getIndicationById: (id?: string) => Indication | undefined;
  getProductsByCompany: (companyId: string) => Product[];
  getTherapyAreas: () => string[];
}

const AppDataContext = createContext<AppDataValue | null>(null);

interface BootstrapPayload {
  overview: Overview;
  companies: Company[];
  indications: Indication[];
  products: Product[];
}

export function AppDataProvider({ children }: { children: React.ReactNode }) {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [indications, setIndications] = useState<Indication[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [overview, setOverview] = useState<Overview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const hydrateFromFallback = (message?: string) => {
    setCompanies(fallbackCompanies);
    setIndications(fallbackIndications);
    setProducts(fallbackProducts);
    setOverview(fallbackOverview);
    setError(message ?? null);
  };

  const refresh = async () => {
    setLoading(true);
    setError(null);
    try {
      const payload = await apiFetch<BootstrapPayload>('/api/bootstrap');
      setCompanies(payload.companies || []);
      setIndications(payload.indications || []);
      setProducts(payload.products || []);
      setOverview(payload.overview || null);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown backend error';
      hydrateFromFallback(`Using local demo data because the backend is unavailable (${message}).`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void refresh();
  }, []);

  const value: AppDataValue = {
    companies,
    indications,
    products,
    overview,
    loading,
    error,
    refresh,
    getCompanyById: (id: string) => companies.find((company) => company.id === id),
    getIndicationById: (id?: string) => indications.find((indication) => indication.id === id),
    getProductsByCompany: (companyId: string) => products.filter((product) => product.companyId === companyId),
    getTherapyAreas: () => Array.from(new Set(indications.map((indication) => indication.therapyArea))).sort(),
  };

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>;
}

export function useAppData() {
  const context = useContext(AppDataContext);
  if (!context) {
    throw new Error('useAppData must be used within AppDataProvider');
  }
  return context;
}

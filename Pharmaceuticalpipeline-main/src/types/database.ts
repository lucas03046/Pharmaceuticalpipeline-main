export type DevelopmentPhase = 'Preclinical' | 'Phase 1' | 'Phase 2' | 'Phase 3' | 'Filing' | 'Approved' | 'Discontinued';

export type ProductStatus = 'Active' | 'Approved' | 'Discontinued';

export type Region = 'US' | 'EU' | 'Global' | 'Asia';

export type ModalityType = 
  | 'Small Molecule' 
  | 'Biologics' 
  | 'Cell & Gene' 
  | 'Vaccine' 
  | 'Oral' 
  | 'Injectable' 
  | 'Antibody-Drug Conjugate' 
  | 'Bispecific Antibody';

export interface Company {
  id: string;
  name: string;
  slug?: string;
  logo?: string;
  logoUrl?: string; // For DB compatibility
  headquarters: string;
  founded?: number;
  foundedYear?: number; // For DB compatibility
  employeeCount: string;
  marketCap?: string;
  website?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Indication {
  id: string;
  name: string;
  therapyArea: string; // From UI
  therapyAreaId?: string; // For DB compatibility
  icd10Code: string;
  createdAt?: string;
}

export interface Product {
  id: string;
  name: string;
  slug?: string;
  companyId: string;
  molecule: string; // From UI
  moleculeType?: string; // For DB compatibility
  modality: string; // From UI
  indicationId: string;
  currentPhase: DevelopmentPhase;
  status: ProductStatus | any;
  regions: Region[];
  startDate: string;
  lastUpdated?: string;
  nctNumber?: string;
  sourceUrl?: string;
  events?: ProductEvent[];
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductEvent {
  id: string;
  productId: string;
  phase: DevelopmentPhase;
  date: string; // From UI
  eventDate?: string; // For DB compatibility
  description: string;
  sourceUrl?: string;
  createdAt?: string;
}

export interface DataSource {
  id: string;
  name: string;
  type: string;
  baseUrl?: string;
  status: 'active' | 'inactive';
  lastSync?: string;
  recordCount: number;
  createdAt: string;
}

export interface ScrapeJob {
  id: string;
  dataSourceId: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  startedAt: string;
  completedAt?: string;
  recordsCreated: number;
  recordsUpdated: number;
  errors?: any[];
}

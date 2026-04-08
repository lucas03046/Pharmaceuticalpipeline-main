import { Company, Indication, Product } from '../../types/database';

export interface FallbackOverview {
  companies: number;
  products: number;
  openReviewItems: number;
  rawStudies: number;
}

const pfizerPdfUrl =
  'https://cdn.pfizer.com/pfizercom/product-pipeline/Q4%202025%20Pipeline%20Update_vFinal3.pdf';

export const fallbackCompanies: Company[] = [
  {
    id: 'pfizer-company',
    name: 'Pfizer',
    headquarters: 'New York, USA',
    founded: 1849,
    employeeCount: 'Unknown',
    marketCap: null as any,
    website: 'https://www.pfizer.com',
    createdAt: '2026-02-03T00:00:00Z',
    updatedAt: '2026-02-03T00:00:00Z',
  },
];

export const fallbackIndications: Indication[] = [
  { id: 'pf-i-1', name: 'Hemophilia (inhibitor cohort)', therapyArea: 'Inflammation and Immunology', icd10Code: '' },
  { id: 'pf-i-2', name: 'Vitiligo', therapyArea: 'Inflammation and Immunology', icd10Code: '' },
  { id: 'pf-i-3', name: 'Dermatomyositis / Polymyositis', therapyArea: 'Inflammation and Immunology', icd10Code: '' },
  { id: 'pf-i-4', name: 'Sickle Cell Disease', therapyArea: 'Inflammation and Immunology', icd10Code: '' },
  { id: 'pf-i-5', name: 'COVID-19 Infection', therapyArea: 'Internal Medicine', icd10Code: '' },
  { id: 'pf-i-6', name: 'Chronic Weight Management', therapyArea: 'Internal Medicine', icd10Code: '' },
  { id: 'pf-i-7', name: 'Cisplatin-Eligible Muscle-Invasive Bladder Cancer (EV-304)', therapyArea: 'Oncology', icd10Code: '' },
  { id: 'pf-i-8', name: 'HER2+ Adjuvant Breast Cancer (CompassHER2 RD)', therapyArea: 'Oncology', icd10Code: '' },
  { id: 'pf-i-9', name: '1L HER2+ Metastatic Urothelial Cancer (DV-001)', therapyArea: 'Oncology', icd10Code: '' },
  { id: 'pf-i-10', name: 'Metastatic Castration Resistant Prostate Cancer post-Abiraterone (MEVPRO-1)', therapyArea: 'Oncology', icd10Code: '' },
  { id: 'pf-i-11', name: '1L HR+/HER2- Metastatic Breast Cancer (FourLight-3)', therapyArea: 'Oncology', icd10Code: '' },
  { id: 'pf-i-12', name: '1L Metastatic Colorectal Cancer (Symbiotic-GI-03)', therapyArea: 'Oncology', icd10Code: '' },
];

function program(
  id: string,
  name: string,
  indicationId: string,
  phase: Product['currentPhase'],
  molecule: string,
  modality: string,
): Product {
  return {
    id,
    name,
    companyId: 'pfizer-company',
    molecule,
    modality,
    indicationId,
    currentPhase: phase,
    status: 'Active',
    regions: ['Global'],
    startDate: '2026-02-03T00:00:00Z',
    lastUpdated: '2026-02-03T00:00:00Z',
    sourceUrl: pfizerPdfUrl,
    events: [
      {
        id: `${id}-e1`,
        productId: id,
        phase,
        date: '2026-02-03T00:00:00Z',
        description: 'Curated from Pfizer pipeline snapshot dated February 3, 2026.',
        sourceUrl: pfizerPdfUrl,
      },
    ],
  };
}

export const fallbackProducts: Product[] = [
  program('pf-p-1', 'HYMPAVZI (marstacimab)', 'pf-i-1', 'Filing', 'Anti-tissue factor pathway inhibitor', 'Biologics'),
  program('pf-p-2', 'LITFULO (ritlecitinib)', 'pf-i-2', 'Phase 3', 'JAK3/TEC inhibitor', 'Small Molecule'),
  program('pf-p-3', 'dazukibart (PF-06823859)', 'pf-i-3', 'Phase 3', 'anti-IFN-beta', 'Biologics'),
  program('pf-p-4', 'osivelotor (PF-07940367)', 'pf-i-4', 'Phase 3', 'HbS polymerization inhibitor', 'Small Molecule'),
  program('pf-p-5', 'ibuzatrelvir (PF-07817883)', 'pf-i-5', 'Phase 3', 'SARS-CoV-2 3CL protease inhibitor', 'Oral'),
  program('pf-p-6', 'MET-097i (PF-08653944)', 'pf-i-6', 'Phase 3', 'GLP-1 receptor agonist', 'Biologics'),
  program('pf-p-7', 'PADCEV (enfortumab vedotin)', 'pf-i-7', 'Phase 3', 'Nectin-4 directed antibody-drug conjugate', 'Biologics'),
  program('pf-p-8', 'TUKYSA (tucatinib)', 'pf-i-8', 'Phase 3', 'HER2 tyrosine kinase inhibitor', 'Small Molecule'),
  program('pf-p-9', 'disitamab vedotin (PF-08046051)', 'pf-i-9', 'Phase 3', 'HER2-directed antibody-drug conjugate', 'Biologics'),
  program('pf-p-10', 'mevrometostat + enzalutamide', 'pf-i-10', 'Phase 3', 'EZH2 inhibitor + androgen receptor inhibitor', 'Combination'),
  program('pf-p-11', 'atirmociclib (PF-07220060)', 'pf-i-11', 'Phase 3', 'CDK4 inhibitor', 'Small Molecule'),
  program('pf-p-12', 'PF-08634404', 'pf-i-12', 'Phase 3', 'PD-1xVEGF bispecific antibody', 'Biologics'),
];

export const fallbackOverview: FallbackOverview = {
  companies: fallbackCompanies.length,
  products: fallbackProducts.length,
  openReviewItems: 1,
  rawStudies: 0,
};

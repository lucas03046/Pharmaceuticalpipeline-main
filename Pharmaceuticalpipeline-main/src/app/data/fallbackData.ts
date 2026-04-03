import { Company, Indication, Product } from '../../types/database';

export interface FallbackOverview {
  companies: number;
  products: number;
  openReviewItems: number;
  rawStudies: number;
}

export const fallbackCompanies: Company[] = [
  { id: 'c1', name: 'Novartis', headquarters: 'Basel, Switzerland', founded: 1996, employeeCount: '108,000', marketCap: '$210B' },
  { id: 'c2', name: 'Pfizer', headquarters: 'New York, USA', founded: 1849, employeeCount: '83,000', marketCap: '$165B' },
  { id: 'c3', name: 'Roche', headquarters: 'Basel, Switzerland', founded: 1896, employeeCount: '104,000', marketCap: '$285B' },
  { id: 'c4', name: 'Johnson & Johnson', headquarters: 'New Brunswick, USA', founded: 1886, employeeCount: '152,000', marketCap: '$385B' },
  { id: 'c5', name: 'Merck', headquarters: 'Rahway, USA', founded: 1891, employeeCount: '68,000', marketCap: '$245B' },
  { id: 'c6', name: 'AstraZeneca', headquarters: 'Cambridge, UK', founded: 1999, employeeCount: '89,200', marketCap: '$195B' },
  { id: 'c7', name: 'Sanofi', headquarters: 'Paris, France', founded: 1973, employeeCount: '100,000', marketCap: '$125B' },
  { id: 'c8', name: 'GSK', headquarters: 'London, UK', founded: 2000, employeeCount: '95,000', marketCap: '$85B' },
  { id: 'c9', name: 'AbbVie', headquarters: 'Chicago, USA', founded: 2013, employeeCount: '50,000', marketCap: '$315B' },
  { id: 'c10', name: 'Bristol Myers Squibb', headquarters: 'New York, USA', founded: 1989, employeeCount: '34,300', marketCap: '$105B' },
];

export const fallbackIndications: Indication[] = [
  { id: 'i1', name: 'Non-Small Cell Lung Cancer', therapyArea: 'Oncology', icd10Code: 'C34.9' },
  { id: 'i2', name: 'Type 2 Diabetes', therapyArea: 'Metabolic', icd10Code: 'E11' },
  { id: 'i3', name: 'Rheumatoid Arthritis', therapyArea: 'Immunology', icd10Code: 'M06.9' },
  { id: 'i4', name: "Alzheimer's Disease", therapyArea: 'Neurology', icd10Code: 'G30.9' },
  { id: 'i5', name: 'Multiple Sclerosis', therapyArea: 'Neurology', icd10Code: 'G35' },
  { id: 'i6', name: 'Atrial Fibrillation', therapyArea: 'Cardiovascular', icd10Code: 'I48.9' },
  { id: 'i7', name: 'Chronic Kidney Disease', therapyArea: 'Nephrology', icd10Code: 'N18.9' },
  { id: 'i8', name: 'Psoriasis', therapyArea: 'Dermatology', icd10Code: 'L40.9' },
  { id: 'i9', name: 'Breast Cancer', therapyArea: 'Oncology', icd10Code: 'C50.9' },
  { id: 'i10', name: "Crohn's Disease", therapyArea: 'Gastroenterology', icd10Code: 'K50.9' },
  { id: 'i11', name: 'Hepatitis C', therapyArea: 'Infectious Disease', icd10Code: 'B18.2' },
  { id: 'i12', name: 'Asthma', therapyArea: 'Respiratory', icd10Code: 'J45.9' },
  { id: 'i13', name: 'Melanoma', therapyArea: 'Oncology', icd10Code: 'C43.9' },
  { id: 'i14', name: 'Heart Failure', therapyArea: 'Cardiovascular', icd10Code: 'I50.9' },
  { id: 'i15', name: 'Major Depressive Disorder', therapyArea: 'Psychiatry', icd10Code: 'F33.9' },
];

export const fallbackProducts: Product[] = [
  {
    id: 'p1', name: 'NVS-401', companyId: 'c1', molecule: 'Monoclonal Antibody', modality: 'Biologics',
    indicationId: 'i1', currentPhase: 'Phase 3', status: 'Active', regions: ['US', 'EU'],
    startDate: '2021-03-15', lastUpdated: '2026-02-28', sourceUrl: 'https://clinicaltrials.gov/study/NCT12345',
    events: [
      { id: 'e1', productId: 'p1', phase: 'Preclinical', date: '2020-06-01', description: 'Preclinical studies initiated' },
      { id: 'e2', productId: 'p1', phase: 'Phase 1', date: '2021-03-15', description: 'Phase 1 trial started' },
      { id: 'e3', productId: 'p1', phase: 'Phase 2', date: '2022-08-10', description: 'Phase 2 enrollment complete' },
      { id: 'e4', productId: 'p1', phase: 'Phase 3', date: '2024-05-20', description: 'Phase 3 initiated' },
    ],
  },
  {
    id: 'p2', name: 'PFE-892', companyId: 'c2', molecule: 'Small Molecule', modality: 'Oral',
    indicationId: 'i2', currentPhase: 'Phase 2', status: 'Active', regions: ['US'],
    startDate: '2022-11-01', lastUpdated: '2026-03-05', sourceUrl: 'https://clinicaltrials.gov/study/NCT23456',
    events: [
      { id: 'e5', productId: 'p2', phase: 'Preclinical', date: '2021-09-01', description: 'Preclinical development' },
      { id: 'e6', productId: 'p2', phase: 'Phase 1', date: '2022-11-01', description: 'First in human study' },
      { id: 'e7', productId: 'p2', phase: 'Phase 2', date: '2024-07-15', description: 'Phase 2 dose expansion' },
    ],
  },
  {
    id: 'p3', name: 'ROC-755', companyId: 'c3', molecule: 'Antibody-Drug Conjugate', modality: 'Biologics',
    indicationId: 'i9', currentPhase: 'Filing', status: 'Active', regions: ['Global'],
    startDate: '2019-01-10', lastUpdated: '2026-03-01', sourceUrl: 'https://clinicaltrials.gov/study/NCT34567',
    events: [
      { id: 'e8', productId: 'p3', phase: 'Preclinical', date: '2018-04-01', description: 'Discovery phase' },
      { id: 'e9', productId: 'p3', phase: 'Phase 1', date: '2019-01-10', description: 'Phase 1 trial' },
      { id: 'e10', productId: 'p3', phase: 'Phase 2', date: '2020-09-20', description: 'Phase 2 results positive' },
      { id: 'e11', productId: 'p3', phase: 'Phase 3', date: '2022-03-15', description: 'Pivotal trial enrollment' },
      { id: 'e12', productId: 'p3', phase: 'Filing', date: '2025-11-30', description: 'BLA submission to FDA' },
    ],
  },
  {
    id: 'p4', name: 'JNJ-234', companyId: 'c4', molecule: 'Gene Therapy', modality: 'Cell & Gene',
    indicationId: 'i4', currentPhase: 'Phase 1', status: 'Active', regions: ['US', 'EU'],
    startDate: '2024-06-01', lastUpdated: '2026-02-20',
    events: [
      { id: 'e13', productId: 'p4', phase: 'Preclinical', date: '2022-01-15', description: 'Preclinical validation' },
      { id: 'e14', productId: 'p4', phase: 'Phase 1', date: '2024-06-01', description: 'Phase 1 safety study ongoing' },
    ],
  },
  {
    id: 'p5', name: 'MRK-667', companyId: 'c5', molecule: 'Checkpoint Inhibitor', modality: 'Biologics',
    indicationId: 'i13', currentPhase: 'Phase 3', status: 'Active', regions: ['Global'],
    startDate: '2020-08-20', lastUpdated: '2026-03-10',
    events: [
      { id: 'e15', productId: 'p5', phase: 'Preclinical', date: '2019-05-01', description: 'Target validation' },
      { id: 'e16', productId: 'p5', phase: 'Phase 1', date: '2020-08-20', description: 'Phase 1 dose escalation' },
      { id: 'e17', productId: 'p5', phase: 'Phase 2', date: '2022-02-10', description: 'Phase 2 promising results' },
      { id: 'e18', productId: 'p5', phase: 'Phase 3', date: '2024-01-15', description: 'Confirmatory trial' },
    ],
  },
  {
    id: 'p6', name: 'AZN-991', companyId: 'c6', molecule: 'SGLT2 Inhibitor', modality: 'Oral',
    indicationId: 'i7', currentPhase: 'Approved', status: 'Approved', regions: ['US', 'EU'],
    startDate: '2017-03-01', lastUpdated: '2025-09-15',
    events: [
      { id: 'e19', productId: 'p6', phase: 'Preclinical', date: '2016-01-01', description: 'Lead optimization' },
      { id: 'e20', productId: 'p6', phase: 'Phase 1', date: '2017-03-01', description: 'Phase 1 completed' },
      { id: 'e21', productId: 'p6', phase: 'Phase 2', date: '2018-07-10', description: 'Phase 2 efficacy shown' },
      { id: 'e22', productId: 'p6', phase: 'Phase 3', date: '2020-02-20', description: 'Phase 3 met endpoints' },
      { id: 'e23', productId: 'p6', phase: 'Filing', date: '2023-06-01', description: 'NDA filed' },
      { id: 'e24', productId: 'p6', phase: 'Approved', date: '2025-09-15', description: 'FDA approval granted' },
    ],
  },
  {
    id: 'p7', name: 'SNY-123', companyId: 'c7', molecule: 'IL-17 Inhibitor', modality: 'Biologics',
    indicationId: 'i8', currentPhase: 'Phase 2', status: 'Active', regions: ['EU'],
    startDate: '2023-04-15', lastUpdated: '2026-03-08',
    events: [
      { id: 'e25', productId: 'p7', phase: 'Preclinical', date: '2021-11-01', description: 'Target identified' },
      { id: 'e26', productId: 'p7', phase: 'Phase 1', date: '2023-04-15', description: 'Safety established' },
      { id: 'e27', productId: 'p7', phase: 'Phase 2', date: '2025-01-20', description: 'Phase 2 ongoing' },
    ],
  },
  {
    id: 'p8', name: 'GSK-456', companyId: 'c8', molecule: 'mRNA Vaccine', modality: 'Vaccine',
    indicationId: 'i12', currentPhase: 'Phase 1', status: 'Active', regions: ['US', 'EU'],
    startDate: '2025-02-01', lastUpdated: '2026-03-01',
    events: [
      { id: 'e28', productId: 'p8', phase: 'Preclinical', date: '2023-08-01', description: 'Platform development' },
      { id: 'e29', productId: 'p8', phase: 'Phase 1', date: '2025-02-01', description: 'First patient dosed' },
    ],
  },
  {
    id: 'p9', name: 'ABV-789', companyId: 'c9', molecule: 'BTK Inhibitor', modality: 'Oral',
    indicationId: 'i5', currentPhase: 'Phase 3', status: 'Active', regions: ['Global'],
    startDate: '2021-05-10', lastUpdated: '2026-02-25',
    events: [
      { id: 'e30', productId: 'p9', phase: 'Preclinical', date: '2020-02-01', description: 'Molecule synthesis' },
      { id: 'e31', productId: 'p9', phase: 'Phase 1', date: '2021-05-10', description: 'Phase 1 completed' },
      { id: 'e32', productId: 'p9', phase: 'Phase 2', date: '2022-11-15', description: 'Dose selection' },
      { id: 'e33', productId: 'p9', phase: 'Phase 3', date: '2024-06-01', description: 'Registration trial' },
    ],
  },
  {
    id: 'p10', name: 'BMS-321', companyId: 'c10', molecule: 'CAR-T Therapy', modality: 'Cell & Gene',
    indicationId: 'i1', currentPhase: 'Phase 2', status: 'Active', regions: ['US'],
    startDate: '2023-09-01', lastUpdated: '2026-03-07',
    events: [
      { id: 'e34', productId: 'p10', phase: 'Preclinical', date: '2021-12-01', description: 'Vector design' },
      { id: 'e35', productId: 'p10', phase: 'Phase 1', date: '2023-09-01', description: 'Dose escalation' },
      { id: 'e36', productId: 'p10', phase: 'Phase 2', date: '2025-05-10', description: 'Expansion cohort' },
    ],
  },
];

export const fallbackOverview: FallbackOverview = {
  companies: fallbackCompanies.length,
  products: fallbackProducts.length,
  openReviewItems: 12,
  rawStudies: 450000,
};

import { createClient } from '@supabase/supabase-js';
import { companies, indications, products } from '../src/app/data/mockData';

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://iulmauclxnktunstrupv.supabase.co';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml1bG1hdWNseG5rdHVuc3RydXB2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMzNTQ5NjAsImV4cCI6MjA4ODkzMDk2MH0.w97hNWNlo--19KlGYs7CNvQVyGFQT_TVaV84ejntNe4';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function insertMockData() {
  console.log('Starting mock data insertion...');

  // 1. Insert therapy_areas first (needed for indications)
  const therapyAreasSet = new Set<string>();
  indications.forEach(ind => therapyAreasSet.add(ind.therapyArea));
  
  const therapyAreas = Array.from(therapyAreasSet).map((name, index) => ({
    id: `ta${index + 1}`,
    name
  }));

  console.log('Inserting therapy_areas...');
  const { error: therapyAreasError } = await supabase
    .from('therapy_areas')
    .upsert(therapyAreas, { onConflict: 'id' });
  
  if (therapyAreasError) {
    console.error('Error inserting therapy_areas:', therapyAreasError);
    return;
  }
  console.log(`Inserted ${therapyAreas.length} therapy_areas`);

  // 2. Insert companies
  console.log('Inserting companies...');
  const companiesData = companies.map(company => ({
    id: company.id,
    name: company.name,
    headquarters: company.headquarters,
    founded_year: company.founded,
    employee_count: company.employeeCount,
    market_cap: company.marketCap
  }));

  const { error: companiesError } = await supabase
    .from('companies')
    .upsert(companiesData, { onConflict: 'id' });

  if (companiesError) {
    console.error('Error inserting companies:', companiesError);
    return;
  }
  console.log(`Inserted ${companiesData.length} companies`);

  // 3. Insert indications with therapy_area_id mapping
  console.log('Inserting indications...');
  const therapyAreaMap = new Map(therapyAreas.map(ta => [ta.name, ta.id]));
  
  const indicationsData = indications.map(ind => ({
    id: ind.id,
    name: ind.name,
    therapy_area: ind.therapyArea,
    therapy_area_id: therapyAreaMap.get(ind.therapyArea),
    icd10_code: ind.icd10Code
  }));

  const { error: indicationsError } = await supabase
    .from('indications')
    .upsert(indicationsData, { onConflict: 'id' });

  if (indicationsError) {
    console.error('Error inserting indications:', indicationsError);
    return;
  }
  console.log(`Inserted ${indicationsData.length} indications`);

  // 4. Insert products
  console.log('Inserting products...');
  const productsData = products.map(product => ({
    id: product.id,
    name: product.name,
    company_id: product.companyId,
    molecule: product.molecule,
    molecule_type: product.molecule,
    modality: product.modality,
    indication_id: product.indicationId,
    current_phase: product.currentPhase,
    status: product.status === 'Approved' ? 'Approved' : product.status === 'Discontinued' ? 'Discontinued' : 'Active',
    regions: product.regions,
    start_date: product.startDate,
    last_updated: product.lastUpdated || product.startDate,
    source_url: product.sourceUrl
  }));

  const { error: productsError } = await supabase
    .from('products')
    .upsert(productsData, { onConflict: 'id' });

  if (productsError) {
    console.error('Error inserting products:', productsError);
    return;
  }
  console.log(`Inserted ${productsData.length} products`);

  // 5. Insert product_events
  console.log('Inserting product_events...');
  const allEvents = products.flatMap(product => 
    (product.events || []).map(event => ({
      id: event.id,
      product_id: event.productId,
      phase: event.phase,
      event_date: event.date,
      description: event.description,
      source_url: event.sourceUrl
    }))
  );

  const { error: eventsError } = await supabase
    .from('product_events')
    .upsert(allEvents, { onConflict: 'id' });

  if (eventsError) {
    console.error('Error inserting product_events:', eventsError);
    return;
  }
  console.log(`Inserted ${allEvents.length} product_events`);

  console.log('Mock data insertion completed successfully!');
}

insertMockData().catch(console.error);

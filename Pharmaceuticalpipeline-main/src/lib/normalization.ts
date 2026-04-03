import { DevelopmentPhase } from '../types/database';

/**
 * Normalizes phase names from various sources into the standard DevelopmentPhase enum.
 */
export function normalizePhase(phase: string): DevelopmentPhase {
  const p = phase.toLowerCase().trim();
  
  if (p.includes('pre-clinical') || p.includes('preclinical') || p.includes('discovery')) {
    return 'Preclinical';
  }
  if (p.includes('phase 1') || p.includes('phase i') || p === 'p1') {
    return 'Phase 1';
  }
  if (p.includes('phase 2') || p.includes('phase ii') || p === 'p2') {
    return 'Phase 2';
  }
  if (p.includes('phase 3') || p.includes('phase iii') || p === 'p3') {
    return 'Phase 3';
  }
  if (p.includes('filing') || p.includes('submission') || p.includes('bla') || p.includes('nda')) {
    return 'Filing';
  }
  if (p.includes('approved') || p.includes('marketed') || p.includes('authorized')) {
    return 'Approved';
  }
  if (p.includes('discontinued') || p.includes('terminated') || p.includes('withdrawn')) {
    return 'Discontinued';
  }

  return 'Preclinical'; // Default fallback
}

/**
 * Normalizes indication names (placeholder for more complex fuzzy matching).
 */
export function normalizeIndication(indication: string): string {
  return indication.trim();
}

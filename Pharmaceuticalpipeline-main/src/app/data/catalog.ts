import { DevelopmentPhase } from '../../types/database';

export const PHASE_COLORS: Record<DevelopmentPhase, string> = {
  Preclinical: '#2c5f5f',
  'Phase 1': '#6db5b5',
  'Phase 2': '#b0dede',
  'Phase 3': '#00b8e6',
  Filing: '#789999',
  Approved: '#6db5b5',
  Discontinued: '#6d3f3f',
};

export function getPhaseColor(phase: DevelopmentPhase): string {
  return PHASE_COLORS[phase];
}

export function getPhaseHoverColor(phase: DevelopmentPhase): string {
  const baseColor = getPhaseColor(phase).replace('#', '');
  const amount = 0.14;
  const [red, green, blue] = [0, 2, 4].map((index) =>
    Math.max(
      0,
      Math.min(
        255,
        Math.round(parseInt(baseColor.slice(index, index + 2), 16) * (1 - amount)),
      ),
    ),
  );

  return `#${[red, green, blue]
    .map((value) => value.toString(16).padStart(2, '0'))
    .join('')}`;
}

export function getPhaseTextColor(phase: DevelopmentPhase): string {
  if (phase === 'Phase 2') {
    return '#173636';
  }

  return '#ffffff';
}

export function getPhaseOrder(phase: DevelopmentPhase): number {
  const order: Record<DevelopmentPhase, number> = {
    Preclinical: 0,
    'Phase 1': 1,
    'Phase 2': 2,
    'Phase 3': 3,
    Filing: 4,
    Approved: 5,
    Discontinued: 6,
  };
  return order[phase];
}

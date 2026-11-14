import { riskLevelInfo } from '@/constants/domain';
import type { AffectedRegion } from '@/types/models';

// Regiões mais graves primeiro; empate, a atualização mais recente.
export function sortRegionsByRisk(regions: AffectedRegion[]): AffectedRegion[] {
  return [...regions].sort(
    (first, second) =>
      riskLevelInfo[second.riskLevel].weight - riskLevelInfo[first.riskLevel].weight ||
      Date.parse(second.updatedAt) - Date.parse(first.updatedAt),
  );
}

export function formatAffectedPopulation(population: number): string {
  if (population >= 1000) {
    return `${Math.round(population / 1000).toLocaleString('pt-BR')} mil pessoas afetadas`;
  }
  return `${population.toLocaleString('pt-BR')} pessoas afetadas`;
}

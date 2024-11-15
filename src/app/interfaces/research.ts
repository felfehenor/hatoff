import { Content } from './identifiable';

export interface GameResearch extends Content {
  description: string;
  researchRequired: number;
  requiresResearchIds?: string[];

  unlocksTaskIds?: string[];
  unlocksDamageTypeIds?: string[];
  unlocksArchetypeIds?: string[];
  unlocksPopulation?: number;
  unlocksClickXpBonus?: number;
}

import { Content } from './identifiable';

export interface GameResearch extends Content {
  description: string;
  researchRequired: number;
  requiresResearchIds?: string[];

  unlocksTaskId?: string;
  unlocksDamageTypeId?: string;
  unlocksArchetypeId?: string;
  unlocksPopulation?: number;
}

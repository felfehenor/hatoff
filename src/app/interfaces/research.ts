import { Content } from './identifiable';

export interface GameResearch extends Content {
  researchRequired: number;
  requiresResearchIds?: string[];

  unlocksTaskId?: string;
  unlocksDamageTypeId?: string;
  unlocksArchetypeId?: string;
  unlocksPopulation?: number;
}

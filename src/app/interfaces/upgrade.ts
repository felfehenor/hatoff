import { Content } from './identifiable';

export interface GameUpgradeCost {
  resourceId: string;
  value: number;
}

export interface GameUpgrade extends Content {
  description: string;
  costs: GameUpgradeCost[];
  requiresUpgradeIds?: string[];
  requiresResearchIds?: string[];

  boostHeroCap?: number;
  boostXpGain?: number;
  boostResourceGain?: number;
  boostLevelCap?: number;
}

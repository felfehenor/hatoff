import { Content } from './identifiable';

export interface GameUpgradeCost {
  resourceId: string;
  value: number;
}

export interface GameUpgrade extends Content {
  description: string;

  /**
   * Upgrade costs, by resource. Does not vary per task.
   */
  costs: GameUpgradeCost[];

  /**
   * Previous upgrades that are required to see this upgrade.
   */
  requiresUpgradeIds?: string[];

  /**
   * Previous researches that are required to be complete to see this upgrade.
   */
  requiresResearchIds?: string[];

  /**
   * The amount to boost the hero cap by for this task.
   */
  boostHeroCap?: number;

  /**
   * The amount to boost the XP gain by for this task.
   */
  boostXpGain?: number;

  /**
   * The amount to boost the resource gain by for this task.
   */
  boostResourceGain?: number;

  /**
   * The amount to boost the level cap for this task by.
   */
  boostLevelCap?: number;
}

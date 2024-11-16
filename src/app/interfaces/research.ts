import { GameHeroStat } from './hero';
import { Content } from './identifiable';

export interface GameResearch extends Content {
  description: string;

  /**
   * The total number of research required to complete this research task.
   */
  researchRequired: number;

  /**
   * Prerequisite research tasks that need to be completed before this one can be researched.
   */
  requiresResearchIds?: string[];

  /**
   * Tasks that are unlocked by this research.
   */
  unlocksTaskIds?: string[];

  /**
   * Damage types that are unlocked by this research.
   */
  unlocksDamageTypeIds?: string[];

  /**
   * Archetypes that are unlocked by this research.
   */
  unlocksArchetypeIds?: string[];

  /**
   * Population cap increases that are unlocked by this research.
   */
  unlocksPopulation?: number;

  /**
   * Click XP bonuses that are unlocked by this research.
   */
  unlocksClickXpBonus?: number;

  /**
   * What stat to increase when rolling a new recruit.
   *
   * @requires `unlockRecruitStatBonusValue`
   */
  unlockRecruitStatBonus?: GameHeroStat;

  /**
   * The value a stat can go up by when rolling a new recruit.
   *
   * @requires `unlockRecruitStatBonus`
   */
  unlockRecruitStatBonusValue?: number;

  /**
   * What stat to increase when doing fusion.
   *
   * @requires `unlockFusionStatBonusValue`
   */
  unlockFusionStatBonus?: GameHeroStat;

  /**
   * The value a stat goes up by when doing fusion.
   *
   * @requires `unlockFusionStatBonus`
   */
  unlockFusionStatBonusValue?: number;

  /**
   * The max level of a retained task for fused heroes.
   */
  unlockFusionTaskLevelRetain?: number;
}

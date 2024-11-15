import { GameHeroStat } from './hero';
import { Content } from './identifiable';

export interface GameArchetype extends Content {
  description: string;

  /**
   * The resource id having this archetype boosts the gain of.
   *
   * @requires `boostGainResourceAmount`.
   */
  boostGainResourceId?: string;

  /**
   * The resource boost that having this archetype gives.
   *
   * @requires `boostGainResourceId`
   */
  boostGainResourceAmount?: number;

  /**
   * The task this boosts the output of. Any = all tasks.
   *
   * @require `boostGainTaskAmount`
   */
  boostGainTaskId?: string;

  /**
   * The amount to boost the task output by.
   *
   * @require `boostGainTaskId`
   */
  boostGainTaskAmount?: number;

  /**
   * The stat that is boosted on level up.
   *
   * @require `boostLevelupStatValue`
   */
  boostLevelupStat?: GameHeroStat;

  /**
   * The value to boost the stat by on level up.
   *
   * @require `boostGainTaskAmount`
   */
  boostLevelupStatValue?: number;

  /**
   * The amount to boost XP gained by. Applies to all sources of XP gain.
   */
  boostXpGain?: number;
}

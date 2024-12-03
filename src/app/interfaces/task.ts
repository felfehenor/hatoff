import { GameHeroStat } from './hero';
import { Content } from './identifiable';

export type GameTaskTypeAutoChange = 'defense';

export interface GameTask extends Content {
  description: string;

  /**
   * The primary damage type needed for this task.
   */
  damageTypeId: string;

  /**
   * Whether or not this task should dynamically change its damage type. And based on what, if so.
   */
  damageTypeAutoChange?: GameTaskTypeAutoChange;

  /**
   * Whether or not the type must match (rather than support subTypes).
   */
  requireExactType?: boolean;

  /**
   * The maximum number of heroes that can be allocated to this task. 0 = hide task.
   */
  maxHeroesAllocable: number;

  /**
   * How much XP heroes get when completing a cycle.
   */
  xpPerCycle: number;

  /**
   * How much speed is required to apply force in a cycle.
   */
  speedPerCycle: number;

  /**
   * How much damage is required to complete a cycle.
   */
  damageRequiredPerCycle: number;

  /**
   * Base XP required per task level, for hero leveling up. Multiplied by the next level.
   *
   * @example: base = 500, level 2 = 1000, level 3 = 1500
   */
  xpRequiredPerLevel: number;

  /**
   * The base max task level.
   */
  maxLevel: number;

  /**
   * Whether or not to spread the hero damage type across the entire kingdom.
   */
  spreadHeroDamageType?: boolean;

  /**
   * The resource id to convert into XP upon cycle completion.
   *
   * @example: Knowledge
   */
  convertResourceIdIntoXp?: string;

  /**
   * The resource id to convert into a stat upon cycle completion.
   *
   * @requires `convertResourceStat`.
   *
   * @example: Holiness
   */
  convertResourceIdToStat?: string;

  /**
   * The stat to convert resources into.
   *
   * @requires `convertResourceIdToStat`.
   */
  convertResourceStat?: GameHeroStat;

  /**
   * The resource amount to give upon completing a cycle.
   *
   * @requires `resourceIdPerCycle`.
   */
  resourceRewardPerCycle: number;

  /**
   * The resource id to give upon completing a cycle.
   *
   * @requires `resourceRewardPerCycle`.
   */
  resourceIdPerCycle?: string;

  /**
   * The task id required for this task to fire.
   *
   * @example: School/Church tasks.
   */
  siblingTaskIdRequiringHeroesAllocated?: string;

  /**
   * Whether or not to apply the results directly to the research tab.
   */
  applyResultsToResearch?: boolean;

  /**
   * The possible upgrades this task can hold.
   */
  possibleUpgradeIds?: string[];

  /**
   * Whether or not the task should slowly unstun heroes.
   */
  slowlyRevivesHeroes?: boolean;

  /**
   * The attribute a hero can earn by doing this task.
   */
  earnedAttributeId?: string;
}

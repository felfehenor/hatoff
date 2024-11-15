import { GameHeroStat } from './hero';
import { Content } from './identifiable';

export interface GameTask extends Content {
  description: string;

  damageTypeId: string;
  requireExactType?: boolean;
  maxHeroesAllocable: number;

  xpPerCycle: number;
  speedPerCycle: number;
  damageRequiredPerCycle: number;
  xpRequiredPerLevel: number;
  maxLevel: number;

  convertResourceIdIntoXp?: string;
  convertResourceIdToStat?: string;
  convertResourceStat?: GameHeroStat;

  resourceRewardPerCycle: number;
  resourceIdPerCycle?: string;

  siblingTaskIdRequiringHeroesAllocated?: string;
  applyResultsToResearch?: boolean;

  possibleUpgradeIds?: string[];
}

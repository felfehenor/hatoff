import { Content } from './identifiable';

export interface GameTask extends Content {
  description: string;

  damageTypeId: string;
  requireExactType?: boolean;
  maxHeroesAllocable: number;

  speedPerCycle: number;
  damageRequiredPerCycle: number;
  xpRequiredPerLevel: number;
  maxLevel: number;

  resourceIdPerCycle?: string;
  resourceRewardPerCycle?: number;
}

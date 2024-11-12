import { GameHeroStat } from './hero';
import { Content } from './identifiable';

export interface GameArchetype extends Content {
  description: string;

  boostGainResourceId?: string;
  boostGainResourceAmount?: number;

  boostGainTaskId?: string;
  boostGainTaskAmount?: number;

  boostLevelupStat?: GameHeroStat;
  boostLevelupStatValue?: number;
}

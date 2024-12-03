import { GameHeroStat } from './hero';
import { Content } from './identifiable';

export interface GameAttribute extends Content {
  description: string;
  timeToHeal?: number;
  modifyStat?: GameHeroStat;
  modifyStatPercent?: number;
  modifyStatValue?: number;
}

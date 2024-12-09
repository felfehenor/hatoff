import { GameHeroStat } from './hero';
import { Content } from './identifiable';

export interface GameBuffStatBoost {
  stat: GameHeroStat;
  value: number;
}

export interface GameBuff extends Content {
  description: string;
  duration: number;
  category: string;
  canStack?: boolean;

  statBoosts: GameBuffStatBoost[];
}

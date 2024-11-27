import { GameHeroStat } from './hero';
import { Content } from './identifiable';

export interface GameItem extends Content {
  description: string;
  cost: number;
  icon: string;
  color: string;

  giveXp?: number;
  giveStat?: GameHeroStat;
  giveStatValue?: number;

  reviveHero?: boolean;

  pickRandomDamageType?: boolean;
  pickRandomArchetypes?: boolean;

  requiresResearchIds?: string[];
}

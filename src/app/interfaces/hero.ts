import { GameCombatant } from './combat';
import { Identifiable } from './identifiable';

export type GameHeroStat =
  | 'health'
  | 'progress'
  | 'force'
  | 'resistance'
  | 'piety'
  | 'speed';

export const AllGameHeroStats: GameHeroStat[] = [
  'health',
  'progress',
  'force',
  'resistance',
  'piety',
  'speed',
];

export interface GameHero extends Identifiable, GameCombatant {
  isSpecial?: boolean;

  stunTicks: number;

  maxLevel: number;
  fusionLevel: number;

  xp: number;
  maxXp: number;

  taskXp: Record<string, number>;
  taskLevels: Record<string, number>;
  attributeHealTicks: Record<string, number>;
  buffTicks: Record<string, number>;
}

export interface SpecialGameHero {
  id: string;
  name: string;

  damageTypeId: string;
  archetypeIds: string[];

  stats: Partial<Record<GameHeroStat, number>>;
}

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

export interface GameHero extends Identifiable {
  damageTypeId: string;
  archetypeIds: string[];

  level: number;
  maxLevel: number;
  fusionLevel: number;

  xp: number;
  maxXp: number;

  taskXp: Record<string, number>;
  taskLevels: Record<string, number>;

  stats: Record<GameHeroStat, number>;
}

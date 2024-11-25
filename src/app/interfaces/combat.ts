import { GameHeroStat } from './hero';

export interface GameCombatant {
  id: string;
  name: string;
  archetypeIds: string[];
  level: number;
  damageTypeId: string;
  currentHp: number;
  stats: Record<GameHeroStat, number>;
}

export interface GameCombat {
  attackers: GameCombatant[];
  defenders: GameCombatant[];
}

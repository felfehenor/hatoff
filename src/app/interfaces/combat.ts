import { GameHeroStat } from './hero';

export interface GameCombatant {
  id: string;
  name: string;
  archetypeIds: string[];
  level: number;
  damageTypeId: string;
  currentHp: number;
  stats: Record<GameHeroStat, number>;
  attributeIds: string[];
}

export interface GameActiveCombatant extends GameCombatant {
  skillIds: string[];
  skillCooldowns: Record<string, number>;
}

export interface GameCombat {
  attackers: GameActiveCombatant[];
  defenders: GameActiveCombatant[];
}

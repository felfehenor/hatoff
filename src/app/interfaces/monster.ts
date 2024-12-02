import { GameCombatant } from './combat';
import { Content } from './identifiable';

export interface GameMonsterReward {
  resourceId: string;
  resourceValue: number;
}

export interface GameMonster extends Content, GameCombatant {
  rewards: GameMonsterReward[];
}

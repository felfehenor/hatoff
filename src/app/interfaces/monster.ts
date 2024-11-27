import { GameCombatant } from './combat';
import { Content } from './identifiable';

export interface GameMonster extends Content, GameCombatant {}

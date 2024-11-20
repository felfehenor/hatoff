import { gamestate } from './gamestate';
import { isTownName } from './town';

export function isEasyMode(): boolean {
  return gamestate().meta.difficulty === 'easy' || isTownName('Simpletown');
}

export function isHardMode(): boolean {
  return gamestate().meta.difficulty === 'hard' || isTownName('Fel Fhenor');
}

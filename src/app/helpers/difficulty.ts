import { GameDifficulty } from '../interfaces';
import { gamestate } from './gamestate';
import { isTownName } from './town';

export function isEasyMode(): boolean {
  return gamestate().meta.difficulty === 'easy' || isTownName('Simpletown');
}

export function isHardMode(): boolean {
  return gamestate().meta.difficulty === 'hard' || isTownName('Fel Fhenor');
}

export function currentDifficulty(): GameDifficulty {
  if (isEasyMode()) return 'easy';
  if (isHardMode()) return 'hard';
  return 'normal';
}

export function difficultyDescription(difficulty: GameDifficulty): string {
  if (difficulty === 'easy')
    return 'Easy peasy. Defend Town and injuries are disabled, leading to a more chill, idle game.';
  if (difficulty === 'hard')
    return 'Hard mode. Defend Town costs more, and all task types are strict assignment. Injuries are permanent. Heroes will die permanently.';

  return 'The game as intended. No upscaling, no downscaling.';
}

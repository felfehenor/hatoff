import { GameDifficulty } from '../interfaces';
import { gamestate, setGameState } from './gamestate';
import { initializeTown } from './migrate';

export function isSetup(): boolean {
  const state = gamestate();

  return state.townSetup.hasDoneSetup;
}

export function finishSetup(
  heroName: string,
  townName: string,
  difficulty: GameDifficulty,
): void {
  const state = gamestate();

  state.townSetup.hasDoneSetup = true;
  state.townSetup.heroName = heroName;
  state.townSetup.townName = townName;
  state.meta.difficulty = difficulty;

  setGameState(state);

  initializeTown();
}

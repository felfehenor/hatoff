import { gamestate, setGameState } from './gamestate';

export function isPaused() {
  return gamestate().meta.isPaused;
}

export function togglePause() {
  const state = gamestate();
  state.meta.isPaused = !state.meta.isPaused;
  setGameState(state);
}

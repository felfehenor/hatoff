import { merge } from 'lodash';
import { GameResearch } from '../interfaces';
import { getEntriesByType } from './content';
import { blankGameState, gamestate, setGameState } from './gamestate';
import { addHero, createHero, totalHeroes } from './hero';

export function migrateState() {
  const state = gamestate();

  if (!state.townSetup.hasDoneSetup) return;

  const newState = merge(blankGameState(), state);

  setGameState(newState);

  initializeTown();
}

export function initializeTown() {
  unlockBasicTasks();
  ensureFirstHero();
}

export function unlockBasicTasks() {
  const state = gamestate();

  const allTasks = getEntriesByType<GameResearch>('research').filter(
    (t) => t.researchRequired === 0,
  );

  allTasks.forEach((task) => {
    state.researchProgress[task.id] = 0;
  });

  setGameState(state);
}

export function ensureFirstHero() {
  if (totalHeroes() > 0) return;

  const state = gamestate();
  const firstHero = createHero();

  firstHero.name = state.townSetup.heroName;

  state.townSetup.heroId = firstHero.id;
  setGameState(state);

  addHero(firstHero);
}

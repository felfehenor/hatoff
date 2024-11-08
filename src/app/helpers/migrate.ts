import { merge } from 'lodash';
import { GameResearch } from '../interfaces';
import { getEntriesByType, getEntry } from './content';
import { blankGameState, gamestate, setGameState } from './gamestate';
import { addHero, createHero, totalHeroes } from './hero';
import { defaultOptions, options, setOptions } from './options';
import { gainResource } from './resource';

export function migrateGameState() {
  const state = gamestate();

  if (!state.townSetup.hasDoneSetup) return;

  const newState = merge(blankGameState(), state);

  setGameState(newState);

  initializeTown();
}

export function migrateOptionsState() {
  const state = options();
  const newState = merge(defaultOptions(), state);
  setOptions(newState);
}

export function initializeTown() {
  unlockBasicTasks();
  ensureSomeResources();
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

export function ensureSomeResources() {
  if (totalHeroes() > 0) return;

  ['Gold', 'Wood', 'Stone', 'Food'].forEach((res) => {
    const resource = getEntry<GameResearch>(res);
    if (!resource) return;

    gainResource(resource, 10);
  });
}

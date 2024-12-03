import { merge } from 'lodash';
import {
  GameArchetype,
  GameDamageType,
  GameResearch,
  GameResource,
} from '../interfaces';
import { getEntriesByType, getEntry } from './content';
import { blankGameState, gamestate, setGameState } from './gamestate';
import {
  addHero,
  createHero,
  createSpecialHero,
  hasSpecialHero,
  totalHeroes,
} from './hero';
import { defaultOptions, options, setOptions } from './options';
import { gainResource } from './resource';
import { isTownName } from './town';

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
  let firstHero = createHero();

  if (hasSpecialHero(state.townSetup.heroName)) {
    state.townSetup.heroId = 'SpecialHero';
    firstHero = createSpecialHero(state.townSetup.heroName) ?? createHero();
  }

  const heroArchId = getEntry<GameArchetype>('Protagonist')?.id;
  if (heroArchId) {
    firstHero.archetypeIds[0] = heroArchId;
  }

  const emoId = getEntry<GameDamageType>('Emotional')?.id;
  if (emoId) {
    firstHero.damageTypeId = emoId;
  }

  firstHero.name = state.townSetup.heroName;

  firstHero.stats.force = 7;
  firstHero.stats.speed = 2;

  state.townSetup.heroId = firstHero.id;
  setGameState(state);

  addHero(firstHero);
}

export function ensureSomeResources() {
  if (totalHeroes() > 0) return;

  let resources = ['Food'];
  let amount = 50;

  if (isTownName('Rosebud')) {
    resources = ['Food', 'Gold', 'Stone', 'Wood'];
    amount = 5000;
  }

  resources.forEach((res) => {
    const resource = getEntry<GameResource>(res);
    if (!resource) return;

    gainResource(resource, amount);
  });
}

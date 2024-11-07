import { GameHero } from '../interfaces';

import { v4 as uuid } from 'uuid';

import { species } from 'fantastical';
import { gamestate, setGameState } from './gamestate';
import { allUnlockedArchetypes, allUnlockedDamageTypes } from './research';
import { randomIdentifiableChoice } from './rng';

export function defaultHero(): GameHero {
  return {
    id: uuid(),
    name: '',

    archetypeIds: [],
    damageTypeId: '',
    fusionLevel: 0,
    level: 1,
    maxLevel: 20,
    xp: 0,
    maxXp: 100,
    taskLevels: {},
    stats: {
      health: 100,
      force: 5,
      resistance: 1,
      piety: 0,
      progress: 5,
      speed: 1,
    },
  };
}

export function createHero(): GameHero {
  const hero = defaultHero();

  hero.name = species.human();

  const availableArchetypes = allUnlockedArchetypes();
  const availableDamageTypes = allUnlockedDamageTypes();

  hero.damageTypeId = randomIdentifiableChoice(hero.id, availableDamageTypes);
  hero.archetypeIds = [randomIdentifiableChoice(hero.id, availableArchetypes)];

  return hero;
}

export function allHeroes(): GameHero[] {
  return Object.values(gamestate().heroes ?? {});
}

export function addHero(hero: GameHero): void {
  const state = gamestate();

  state.heroes[hero.id] = hero;

  setGameState(state);
}

export function removeHero(hero: GameHero): void {
  const state = gamestate();

  delete state.heroes[hero.id];

  setGameState(state);
}

export function setHeroDamageType(hero: GameHero, damageTypeId: string): void {
  const state = gamestate();
  state.heroes[hero.id].damageTypeId = damageTypeId;
  setGameState(state);
}

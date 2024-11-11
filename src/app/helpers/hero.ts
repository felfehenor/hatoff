import { GameHero } from '../interfaces';

import { v4 as uuid } from 'uuid';

import { species } from 'fantastical';
import { sumBy } from 'lodash';
import { gamestate, setGameState } from './gamestate';
import {
  allUnlockedArchetypes,
  allUnlockedDamageTypes,
  allUnlockedPopulationResearch,
} from './research';
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
    taskXp: {},
    taskLevels: {},
    stats: {
      health: 100,
      force: 3,
      resistance: 1,
      piety: 1,
      progress: 1,
      speed: 1,
    },
  };
}

export function createHero(): GameHero {
  const hero = defaultHero();

  hero.name = species.human({ allowMultipleNames: true });

  const availableArchetypes = allUnlockedArchetypes();
  const availableDamageTypes = allUnlockedDamageTypes();

  hero.damageTypeId = randomIdentifiableChoice(hero.id, availableDamageTypes);
  hero.archetypeIds = [randomIdentifiableChoice(hero.id, availableArchetypes)];

  return hero;
}

export function populationCap(): number {
  return sumBy(
    allUnlockedPopulationResearch(),
    (r) => r.unlocksPopulation ?? 0,
  );
}

export function totalHeroes(): number {
  return allHeroes().length;
}

export function canRecruitHero(): boolean {
  return totalHeroes() < populationCap();
}

export function allHeroes(): GameHero[] {
  return Object.values(gamestate().heroes ?? {});
}

export function getHero(id: string): GameHero | undefined {
  return gamestate().heroes[id];
}

export function addHero(hero: GameHero): void {
  const state = gamestate();

  state.heroes[hero.id] = hero;

  setGameState(state);
}

export function removeHero(hero: GameHero): void {
  const state = gamestate();

  delete state.heroes[hero.id];
  delete state.taskAssignments[hero.id];
  delete state.heroCurrentTaskSpeed[hero.id];

  setGameState(state);
}

export function setHeroDamageType(hero: GameHero, damageTypeId: string): void {
  const state = gamestate();
  state.heroes[hero.id].damageTypeId = damageTypeId;
  setGameState(state);
}

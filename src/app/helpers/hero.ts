import { GameHero, GameHeroStat, SpecialGameHero } from '../interfaces';

import { v4 as uuid } from 'uuid';

import { signal, WritableSignal } from '@angular/core';
import { species } from 'fantastical';
import { cloneDeep, merge, sumBy } from 'lodash';
import { cooldown } from './cooldown';
import { gainXp } from './gameloop-hero';
import { gamestate, setGameState, updateGamestate } from './gamestate';
import {
  allUnlockedArchetypes,
  allUnlockedClickXpResearch,
  allUnlockedDamageTypes,
  allUnlockedPopulationResearch,
  isResearchComplete,
} from './research';
import { randomChoice, randomIdentifiableChoice } from './rng';

const _specialHeroes: WritableSignal<SpecialGameHero[]> = signal([]);

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
    maxXp: maxXpForLevel(1, 0),
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

export function setSpecialHeroes(heroes: SpecialGameHero[]): void {
  _specialHeroes.set(heroes);
}

export function getRandomSpecialHero(seed: string): SpecialGameHero {
  return randomChoice<SpecialGameHero>(seed, _specialHeroes());
}

export function createSpecialHero(id: string): GameHero | undefined {
  const modifications = cloneDeep(_specialHeroes().find((s) => s.id === id));
  if (!modifications) return undefined;

  const hero = createHero();
  hero.isSpecial = true;

  hero.id = modifications.id;
  hero.name = modifications.name;

  hero.damageTypeId = modifications.damageTypeId;
  hero.archetypeIds = modifications.archetypeIds;

  Object.keys(modifications.stats).forEach((statKey) => {
    const stat = statKey as GameHeroStat;

    hero.stats[stat] += modifications.stats[stat] ?? 0;
  });

  merge(hero.stats, modifications.stats);

  return hero;
}

export function hasSpecialHero(id: string): boolean {
  return !!_specialHeroes().find((s) => s.id === id);
}

export function maxXpForLevel(level: number, fusionLevel: number): number {
  return level * (50 + fusionLevel ** 3 * 100);
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

export function clickXpBoost(): number {
  return sumBy(allUnlockedClickXpResearch(), (r) => r.unlocksClickXpBonus ?? 0);
}

export function canGiveClickXp(): boolean {
  return isResearchComplete('Help From Above');
}

export function giveClickXp(hero: GameHero): void {
  updateGamestate((state) => {
    const heroRef = state.heroes[hero.id];
    state.cooldowns.nextClickResetTime = cooldown(5);
    gainXp(state, heroRef, clickXpBoost());

    return state;
  });
}

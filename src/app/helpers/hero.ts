import { GameHero, GameHeroStat, SpecialGameHero } from '../interfaces';

import { v4 as uuid } from 'uuid';

import { signal, WritableSignal } from '@angular/core';
import { species } from 'fantastical';
import { cloneDeep, merge, sample, sum, sumBy } from 'lodash';
import { isDungeonInProgress, isHeroExploring } from './dungeon';
import { gamestate, updateGamestate } from './gamestate';
import { maxXpForLevel } from './hero-xp';
import {
  allUnlockedArchetypes,
  allUnlockedDamageTypes,
  allUnlockedPopulationResearch,
} from './research';
import { randomChoice } from './rng';

const _specialHeroes: WritableSignal<SpecialGameHero[]> = signal([]);

export function defaultHero(): GameHero {
  return {
    id: uuid(),
    name: '',

    archetypeIds: [],
    damageTypeId: '',
    stunTicks: 0,
    fusionLevel: 0,
    level: 1,
    maxLevel: 20,
    xp: 0,
    maxXp: maxXpForLevel(1, 0),
    taskXp: {},
    taskLevels: {},
    currentHp: 0,
    stats: {
      health: 100,
      force: 3,
      resistance: 1,
      piety: 1,
      progress: 1,
      speed: 1,
    },
    infusedStats: {
      health: 0,
      force: 0,
      resistance: 0,
      piety: 0,
      progress: 0,
      speed: 0,
    },
    buffTicks: {},
    buffIds: [],
    attributeIds: [],
    attributeHealTicks: {},
  };
}

export function createHero(): GameHero {
  const hero = defaultHero();

  hero.name = species.human({ allowMultipleNames: true });

  const availableArchetypes = allUnlockedArchetypes();
  const availableDamageTypes = allUnlockedDamageTypes();

  hero.damageTypeId = sample(availableDamageTypes)!.id;
  hero.archetypeIds = [sample(availableArchetypes)!.id];

  return hero;
}

export function isMainHero(hero: GameHero): boolean {
  return gamestate().townSetup.heroId === hero.id;
}

export function hasMainHero(): boolean {
  const state = gamestate();
  return !!getHero(state.townSetup.heroId);
}

export function setSpecialHeroes(heroes: SpecialGameHero[]): void {
  _specialHeroes.set(heroes);
}

export function getRandomSpecialHero(seed: string): SpecialGameHero {
  return randomChoice<SpecialGameHero>(_specialHeroes(), seed);
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

export function renameHero(id: string, newName: string): void {
  updateGamestate((state) => {
    const heroRef = state.heroes[id];
    heroRef.name = newName;
    return state;
  });
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
  updateGamestate((state) => {
    state.heroes[hero.id] = hero;
    return state;
  });
}

export function removeHero(hero: GameHero): void {
  updateGamestate((state) => {
    delete state.heroes[hero.id];
    delete state.taskAssignments[hero.id];
    delete state.heroCurrentTaskSpeed[hero.id];
    return state;
  });
}

export function setHeroDamageType(hero: GameHero, damageTypeId: string): void {
  updateGamestate((state) => {
    state.heroes[hero.id].damageTypeId = damageTypeId;
    return state;
  });
}

export function reviveHero(hero: GameHero): void {
  updateGamestate((state) => {
    const heroRef = state.heroes[hero.id];
    heroRef.stunTicks = 0;
    return state;
  });
}

export function unstunAllHeroes(): void {
  updateGamestate((state) => {
    Object.values(state.heroes).forEach((hero) => {
      hero.stunTicks = 0;
    });

    return state;
  });
}

export function stunHero(hero: GameHero, ticks: number): void {
  updateGamestate((state) => {
    const heroRef = state.heroes[hero.id];
    heroRef.stunTicks = ticks;

    return state;
  });
}

export function reduceStun(hero: GameHero, ticks: number): void {
  updateGamestate((state) => {
    const heroRef = state.heroes[hero.id];
    heroRef.stunTicks -= ticks;

    return state;
  });
}

export function isStunned(hero: GameHero): boolean {
  return hero.stunTicks > 0;
}

export function isHeroAbleToDoMostThings(hero: GameHero): boolean {
  return isDungeonInProgress() ? !isHeroExploring(hero) : true;
}

export function canUseItemsOnHero(hero: GameHero): boolean {
  return isHeroAbleToDoMostThings(hero);
}

export function getTotalHeroLevel(hero: GameHero): number {
  return sum(
    Array(1 + hero.fusionLevel)
      .fill(0)
      .map((_, i) => (i === hero.fusionLevel ? hero.level : 20 + i * 10)),
  );
}

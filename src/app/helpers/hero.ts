import {
  GameDamageType,
  GameHero,
  GameHeroStat,
  GameTask,
  SpecialGameHero,
} from '../interfaces';

import { v4 as uuid } from 'uuid';

import { signal, WritableSignal } from '@angular/core';
import { species } from 'fantastical';
import { cloneDeep, merge, sample, sampleSize, sumBy } from 'lodash';
import { getArchetypeLevelUpStatBonusForHero } from './archetype';
import { getEntry } from './content';
import { cooldown } from './cooldown';
import { getDamageForcePercentage } from './damagetype';
import { isDungeonInProgress, isHeroExploring } from './dungeon';
import { gamestate, setGameState, updateGamestate } from './gamestate';
import { notify } from './notify';
import { getOption } from './options';
import {
  allUnlockedArchetypes,
  allUnlockedClickXpResearch,
  allUnlockedDamageTypes,
  allUnlockedPopulationResearch,
  allUnlockedStatBoostResearchValue,
  isResearchComplete,
} from './research';
import { randomChoice, randomIdentifiableChoice, seededrng } from './rng';
import {
  getGlobalBoostForDamageType,
  getTaskDamageType,
  synergyBonus,
} from './task';

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

export function isMaxLevel(hero: GameHero): boolean {
  return hero.level >= hero.maxLevel;
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
    state.cooldowns.nextClickResetTime = cooldown('nextClickResetTime');
    gainXp(heroRef, clickXpBoost());

    return state;
  });
}

export function taskSpeedAndForceBoostForHero(
  hero: GameHero,
  task: GameTask,
): number {
  return hero.taskLevels[task.id] ?? 0;
}

export function totalHeroSpeed(
  hero: GameHero,
  task: GameTask,
  numTimes: number,
): number {
  return (
    (hero.stats.speed + taskSpeedAndForceBoostForHero(hero, task)) *
    getOption('heroSpeedMultiplier') *
    numTimes
  );
}

export function totalHeroForce(
  hero: GameHero,
  task: GameTask,
  numTimes: number,
): number {
  const heroDamage = getEntry<GameDamageType>(hero.damageTypeId);
  const taskDamage = getTaskDamageType(task);
  if (!heroDamage || !taskDamage) return 0;

  const percentApplied = getDamageForcePercentage(heroDamage, taskDamage);
  if (percentApplied === 0) return 0;

  const bonusDamage = getGlobalBoostForDamageType(heroDamage);
  const percentBonus = synergyBonus(task);

  const taskBonusDamage = taskSpeedAndForceBoostForHero(hero, task);

  const damageApplied = Math.max(
    1,
    Math.floor(
      ((percentApplied + percentBonus) / 100) *
        (hero.stats.force + bonusDamage + taskBonusDamage),
    ),
  );

  return damageApplied * getOption('heroForceMultiplier') * numTimes;
}

export function ensureHeroStatMaxes(hero: GameHero): void {
  hero.stats.health = Math.min(hero.stats.health, 9999);
  hero.stats.force = Math.min(hero.stats.force, 999);
  hero.stats.resistance = Math.min(hero.stats.resistance, 999);
  hero.stats.progress = Math.min(hero.stats.progress, 999);
  hero.stats.piety = Math.min(hero.stats.piety, 999);
  hero.stats.speed = Math.min(hero.stats.speed, 99);
}

export function gainStat(hero: GameHero, stat: GameHeroStat, val = 1): void {
  updateGamestate((state) => {
    const heroRef = state.heroes[hero.id];

    heroRef.stats[stat] += Math.floor(val);

    ensureHeroStatMaxes(heroRef);

    return state;
  });
}

export function levelup(hero: GameHero): void {
  const rng = seededrng(hero.id + ' ' + hero.level);

  function statBoost(val = 1, chance = 50) {
    const shouldGain = rng() * 100 <= chance;
    if (!shouldGain) return 0;

    return val * getOption('heroLevelUpStatGainMultiplier');
  }

  const hpBoost =
    statBoost(5) +
    getArchetypeLevelUpStatBonusForHero(hero, 'health') +
    allUnlockedStatBoostResearchValue('health');
  const forceBoost =
    statBoost(1, 35) + getArchetypeLevelUpStatBonusForHero(hero, 'force');
  const pietyBoost =
    statBoost(1, 25) + getArchetypeLevelUpStatBonusForHero(hero, 'piety');
  const progressBoost =
    statBoost(1, 50) + getArchetypeLevelUpStatBonusForHero(hero, 'progress');
  const resistanceBoost =
    statBoost(1, 15) + getArchetypeLevelUpStatBonusForHero(hero, 'resistance');
  const speedBoost =
    statBoost(1, 10) + getArchetypeLevelUpStatBonusForHero(hero, 'speed');

  hero.stats.health += hpBoost;
  hero.stats.force += forceBoost;
  hero.stats.piety += pietyBoost;
  hero.stats.progress += progressBoost;
  hero.stats.resistance += resistanceBoost;
  hero.stats.speed += speedBoost;

  ensureHeroStatMaxes(hero);

  const stats = [
    hpBoost > 0 ? `+${hpBoost} HP` : '',
    forceBoost > 0 ? `+${forceBoost} FRC` : '',
    pietyBoost > 0 ? `+${pietyBoost} PIE` : '',
    progressBoost > 0 ? `+${progressBoost} PRG` : '',
    resistanceBoost > 0 ? `+${resistanceBoost} RES` : '',
    speedBoost > 0 ? `+${speedBoost} SPD` : '',
  ].filter(Boolean);

  notify(
    `Level up: ${hero.name} Lv.${hero.level}! ${stats.join(', ')}`,
    'LevelUp',
  );
}

export function gainXp(hero: GameHero, xp = 1): void {
  updateGamestate((state) => {
    const heroRef = state.heroes[hero.id];
    if (heroRef.level >= heroRef.maxLevel) return state;

    heroRef.xp += xp * getOption('heroXpMultiplier');

    while (heroRef.xp >= heroRef.maxXp) {
      heroRef.xp = heroRef.xp - heroRef.maxXp;
      heroRef.maxXp = maxXpForLevel(heroRef.level + 1, heroRef.fusionLevel);
      heroRef.level += 1;

      levelup(heroRef);

      if (heroRef.level >= heroRef.maxLevel) break;
    }

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

export function pickRandomArchetypes(hero: GameHero): void {
  updateGamestate((state) => {
    const heroRef = state.heroes[hero.id];
    const numArchetypes = heroRef.archetypeIds.length;

    const unlockedArchetypes = allUnlockedArchetypes();
    const newArchetypes = sampleSize(unlockedArchetypes, numArchetypes).map(
      (i) => i.id,
    );
    heroRef.archetypeIds = newArchetypes;

    return state;
  });
}

export function pickRandomDamageType(hero: GameHero): void {
  updateGamestate((state) => {
    const heroRef = state.heroes[hero.id];

    const unlockedDamageTypes = allUnlockedDamageTypes();
    const newDamageType = sample(unlockedDamageTypes)!;
    heroRef.damageTypeId = newDamageType?.id;

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

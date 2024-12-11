import {
  GameArchetype,
  GameAttribute,
  GameCombatant,
  GameDamageType,
  GameHero,
  GameHeroStat,
  GameTask,
  SpecialGameHero,
} from '../interfaces';

import { v4 as uuid } from 'uuid';

import { signal, WritableSignal } from '@angular/core';
import { species } from 'fantastical';
import { cloneDeep, merge, sample, sampleSize, sum, sumBy } from 'lodash';
import { getArchetypeLevelUpStatBonusForHero } from './archetype';
import { totalStatBuff } from './buff';
import { getEntry } from './content';
import { cooldown } from './cooldown';
import { getDamageForcePercentage } from './damagetype';
import { isDungeonInProgress, isHeroExploring } from './dungeon';
import { gamestate, updateGamestate } from './gamestate';
import { getInfusedStat } from './hero-infusion';
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
import { randomChoice, succeedsChance } from './rng';
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
  updateGamestate((state) => {
    state.heroes[hero.id].damageTypeId = damageTypeId;
    return state;
  });
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

export function heroStatDelta(hero: GameCombatant, stat: GameHeroStat): number {
  const attributes = (hero.attributeIds ?? [])
    .map((a) => getEntry<GameAttribute>(a))
    .filter((a) => a?.modifyStat === stat);
  const deltaValue = sum(attributes.map((a) => a?.modifyStatValue ?? 0));
  const deltaPercent = sum(attributes.map((a) => a?.modifyStatPercent ?? 0));

  const baseHeroStat = hero.stats[stat];
  const baseStatValue = baseHeroStat + deltaValue + totalStatBuff(hero, stat);
  const statValueAfterPercentChange =
    baseStatValue * ((100 + deltaPercent) / 100);

  return statValueAfterPercentChange - baseHeroStat;
}

export function heroStatValue(hero: GameHero, stat: GameHeroStat): number {
  if (!hero) return 0;
  return (
    hero.stats[stat] + heroStatDelta(hero, stat) + getInfusedStat(hero, stat)
  );
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
        (heroStatValue(hero, 'force') + bonusDamage + taskBonusDamage),
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

export function loseStat(hero: GameHero, stat: GameHeroStat, val = 1): void {
  gainStat(hero, stat, -val);
}

export function levelup(hero: GameHero): void {
  function statBoost(val = 1, chance = 50) {
    const baseBoost = Math.floor(chance / 100);
    const remainderChance = chance % 100;

    const shouldGain = succeedsChance(remainderChance);
    if (!shouldGain)
      return baseBoost * getOption('heroLevelUpStatGainMultiplier');

    return (baseBoost + val) * getOption('heroLevelUpStatGainMultiplier');
  }

  const potentialStatBoosts: GameHeroStat[] = [
    'force',
    'piety',
    'progress',
    'resistance',
    'speed',
  ];
  const numGuaranteedStats = 1 + hero.fusionLevel;
  const chosenStats = Array(numGuaranteedStats)
    .fill(0)
    .map(() => sample(potentialStatBoosts) as GameHeroStat);

  const bonusRolls: Record<GameHeroStat, number> = {
    force: getArchetypeLevelUpStatBonusForHero(hero, 'force'),
    health: 0,
    piety: getArchetypeLevelUpStatBonusForHero(hero, 'piety'),
    progress: getArchetypeLevelUpStatBonusForHero(hero, 'progress'),
    resistance: getArchetypeLevelUpStatBonusForHero(hero, 'resistance'),
    speed: getArchetypeLevelUpStatBonusForHero(hero, 'speed'),
  };

  chosenStats.forEach((stat) => {
    bonusRolls[stat] += 85;
  });

  const hpBoost =
    statBoost(5) +
    getArchetypeLevelUpStatBonusForHero(hero, 'health') +
    allUnlockedStatBoostResearchValue('health');
  const forceBoost = statBoost(1, 35 + bonusRolls.force);
  const pietyBoost = statBoost(1, 25 + bonusRolls.piety);
  const progressBoost = statBoost(1, 50 + bonusRolls.progress);
  const resistanceBoost = statBoost(1, 15 + bonusRolls.resistance);
  const speedBoost = statBoost(1, 10 + bonusRolls.speed);

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

    const protagonistId = getEntry<GameArchetype>('Protagonist')!.id;
    const hasProtagonist = heroRef.archetypeIds.includes(protagonistId);

    const numArchetypesToGet = hasProtagonist
      ? numArchetypes - 1
      : numArchetypes;

    const unlockedArchetypes = allUnlockedArchetypes();
    const newArchetypes = sampleSize(
      unlockedArchetypes,
      numArchetypesToGet,
    ).map((i) => i.id);

    if (hasProtagonist) {
      newArchetypes.unshift(protagonistId);
    }

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

export function getTotalHeroLevel(hero: GameHero): number {
  return sum(
    Array(1 + hero.fusionLevel)
      .fill(0)
      .map((_, i) => (i === hero.fusionLevel ? hero.level : 20 + i * 10)),
  );
}

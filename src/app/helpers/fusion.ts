import { difference, uniq } from 'lodash';
import {
  GameAttribute,
  GameDamageType,
  GameHero,
  GameHeroStat,
} from '../interfaces';
import { isInjury } from './attribute';
import { getEntry } from './content';
import { isHardMode } from './difficulty';
import { gamestate } from './gamestate';
import {
  addHero,
  allHeroes,
  createHero,
  createSpecialHero,
  isHeroAbleToDoMostThings,
  isMaxLevel,
  maxXpForLevel,
  removeHero,
} from './hero';
import { notifySuccess } from './notify';
import {
  allUnlockedDamageTypes,
  allUnlockedFusionMaxTaskLevelResearchValue,
  allUnlockedFusionStatBoostResearchValue,
} from './research';
import { randomChoice } from './rng';

export function validFusionHeroes(): GameHero[] {
  return allHeroes().filter(
    (f) => isMaxLevel(f) && isHeroAbleToDoMostThings(f),
  );
}

export function isValidFusionHeroForHero(
  hero: GameHero,
  subHero: GameHero,
): boolean {
  // you can never fuse your main hero into someone else
  if (subHero.id === gamestate().townSetup.heroId) return false;

  return (
    hero.id !== subHero.id &&
    isMaxLevel(subHero) &&
    hero.fusionLevel === subHero.fusionLevel
  );
}

export function validFusionHeroesForHero(hero: GameHero): GameHero[] {
  return validFusionHeroes().filter(
    (h) => isValidFusionHeroForHero(hero, h) && isHeroAbleToDoMostThings(h),
  );
}

export function canFuseHeroes(): boolean {
  const heroes = allHeroes();
  if (heroes.length < 2) return false;

  return heroes.some(
    (h) =>
      isMaxLevel(h) &&
      isHeroAbleToDoMostThings(h) &&
      heroes.some(
        (subH) =>
          isValidFusionHeroForHero(h, subH) && isHeroAbleToDoMostThings(subH),
      ),
  );
}

export function heroFusionDamageType(
  mainHero: GameHero,
  subHero: GameHero,
): string {
  // matching type = matching output
  if (mainHero.damageTypeId === subHero.damageTypeId)
    return mainHero.damageTypeId;

  const mainHeroDamage = getEntry<GameDamageType>(mainHero.damageTypeId);
  const subHeroDamage = getEntry<GameDamageType>(subHero.damageTypeId);
  if (!mainHeroDamage || !subHeroDamage) return mainHero.damageTypeId;

  if (mainHeroDamage.isAny) return mainHeroDamage.id;
  if (subHeroDamage.isAny) return mainHeroDamage.id;

  const seed = [mainHero.id, subHero.id].sort().join('-');

  let choices = allUnlockedDamageTypes().map((i) => i.id);

  // if there's overlap, we pick randomly from them
  if (
    mainHeroDamage.subTypes.some((s) => s.damageTypeId === subHeroDamage.id) ||
    subHeroDamage.subTypes.some((s) => s.damageTypeId === mainHeroDamage.id)
  ) {
    choices = uniq([
      mainHeroDamage.id,
      ...mainHeroDamage.subTypes.map((t) => t.damageTypeId),
      subHeroDamage.id,
      ...subHeroDamage.subTypes.map((t) => t.damageTypeId),
    ]);
  }

  const choice = randomChoice<string>(choices, seed);

  return choice;
}

export function heroFusionResult(
  bigHero: GameHero,
  smallHero: GameHero,
): GameHero {
  const newHero = structuredClone(bigHero);

  let baseHero = createHero();
  if (bigHero.isSpecial) {
    baseHero = createSpecialHero(bigHero.id) ?? createHero();
  }

  newHero.fusionLevel += 1;
  newHero.level = 1;
  newHero.maxLevel += 10;

  newHero.damageTypeId = heroFusionDamageType(bigHero, smallHero);

  newHero.xp = 0;
  newHero.maxXp = maxXpForLevel(1, newHero.fusionLevel);

  newHero.archetypeIds = [
    ...new Set([
      ...bigHero.archetypeIds,
      difference(smallHero.archetypeIds, bigHero.archetypeIds)[0],
    ]),
  ].filter(Boolean);

  newHero.taskXp = {};

  const newStats: Record<GameHeroStat, number> = baseHero.stats;

  Object.keys(newStats).forEach((key) => {
    const statKey = key as GameHeroStat;
    const statMult = statKey === 'health' ? 10 : 1;
    newStats[statKey] += newHero.fusionLevel * statMult;
    newStats[statKey] += allUnlockedFusionStatBoostResearchValue(statKey);
  });

  newHero.stats = newStats;

  const maxTaskRetainLevel = allUnlockedFusionMaxTaskLevelResearchValue();

  const newTaskLevels: Record<string, number> = {};
  [
    ...new Set([
      ...Object.keys(bigHero.taskLevels ?? {}),
      ...Object.keys(smallHero.taskLevels ?? {}),
    ]),
  ].forEach((taskKey) => {
    const max = Math.min(
      maxTaskRetainLevel,
      Math.max(
        bigHero.taskLevels[taskKey] ?? 0,
        smallHero.taskLevels[taskKey] ?? 0,
      ),
    );
    newTaskLevels[taskKey] = max;
  });

  newHero.taskLevels = newTaskLevels;

  newHero.attributeIds = [
    ...new Set([
      ...(bigHero.attributeIds ?? []),
      ...(smallHero.attributeIds ?? []),
    ]),
  ].filter((a) => !isInjury(getEntry<GameAttribute>(a)!));

  if (isHardMode()) {
    newHero.attributeIds.push(
      ...(bigHero.attributeIds ?? []).filter((a) =>
        isInjury(getEntry<GameAttribute>(a)!),
      ),
    );
  }

  return newHero;
}

export function doFusion(mainHero: GameHero, subHero: GameHero): void {
  const result = heroFusionResult(mainHero, subHero);
  removeHero(subHero);
  addHero(result);

  notifySuccess(`Successfully fused ${mainHero.name} and ${subHero.name}!`);
}

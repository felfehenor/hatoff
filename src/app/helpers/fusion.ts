import { uniq } from 'lodash';
import { GameDamageType, GameHero, GameHeroStat } from '../interfaces';
import { getEntry } from './content';
import { gamestate } from './gamestate';
import { addHero, allHeroes, maxXpForLevel, removeHero } from './hero';
import { notifySuccess } from './notify';
import { allUnlockedDamageTypes } from './research';
import { randomChoice } from './rng';

export function validFusionHeroes(): GameHero[] {
  return allHeroes().filter((f) => f.level === f.maxLevel);
}

export function isValidFusionHeroForHero(
  hero: GameHero,
  subHero: GameHero,
): boolean {
  // you can never fuse your main hero into someone else
  if (subHero.id === gamestate().townSetup.heroId) return false;

  return (
    hero.id !== subHero.id &&
    hero.level === subHero.level &&
    hero.maxLevel === subHero.maxLevel
  );
}

export function validFusionHeroesForHero(hero: GameHero): GameHero[] {
  return validFusionHeroes().filter((h) => isValidFusionHeroForHero(hero, h));
}

export function canFuseHeroes(): boolean {
  const heroes = allHeroes();
  if (heroes.length < 2) return false;

  return heroes.some(
    (h) =>
      h.level === h.maxLevel &&
      heroes.some((subH) => isValidFusionHeroForHero(h, subH)),
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

  const choice = randomChoice<string>(seed, choices);

  return choice;
}

export function heroFusionResult(
  bigHero: GameHero,
  smallHero: GameHero,
): GameHero {
  const newHero = structuredClone(bigHero);

  newHero.fusionLevel += 1;
  newHero.level = 1;
  newHero.maxLevel += 10;

  newHero.damageTypeId = heroFusionDamageType(bigHero, smallHero);

  newHero.xp = 0;
  newHero.maxXp = maxXpForLevel(1, newHero.fusionLevel);

  newHero.archetypeIds = [
    ...new Set([...bigHero.archetypeIds, smallHero.archetypeIds[0]]),
  ];

  newHero.taskXp = {};

  const newStats: Record<GameHeroStat, number> = {
    force: 0,
    health: 0,
    piety: 0,
    progress: 0,
    resistance: 0,
    speed: 0,
  };

  Object.keys(newStats).forEach((key) => {
    const statKey = key as GameHeroStat;
    const biggest = Math.max(bigHero.stats[statKey], smallHero.stats[statKey]);
    const smallest = Math.min(bigHero.stats[statKey], smallHero.stats[statKey]);

    const newStatValue = biggest + Math.floor(smallest / 2);
    newStats[statKey] = newStatValue;
  });

  newHero.stats = newStats;

  const newTaskLevels: Record<string, number> = {};
  [
    ...new Set([
      ...Object.keys(bigHero.taskLevels ?? {}),
      ...Object.keys(smallHero.taskLevels ?? {}),
    ]),
  ].forEach((taskKey) => {
    const max = Math.max(
      bigHero.taskLevels[taskKey] ?? 0,
      smallHero.taskLevels[taskKey] ?? 0,
    );
    newTaskLevels[taskKey] = max;
  });

  newHero.taskLevels = newTaskLevels;

  return newHero;
}

export function doFusion(mainHero: GameHero, subHero: GameHero): void {
  const result = heroFusionResult(mainHero, subHero);
  removeHero(subHero);
  addHero(result);

  notifySuccess(`Successfully fused ${mainHero.name} and ${subHero.name}!`);
}

import { sum } from 'lodash';
import {
  GameAttribute,
  GameCombatant,
  GameDamageType,
  GameHero,
  GameHeroStat,
  GameTask,
} from '../interfaces';
import { totalStatBuff } from './buff';
import { getEntry } from './content';
import { getDamageForcePercentage } from './damagetype';
import { updateGamestate } from './gamestate';
import { getInfusedStat } from './hero-infusion';
import { getOption } from './options';
import {
  getGlobalBoostForDamageType,
  getTaskDamageType,
  synergyBonus,
} from './task';

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

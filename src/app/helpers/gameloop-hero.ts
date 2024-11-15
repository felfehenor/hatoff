import { sum } from 'lodash';
import {
  GameDamageType,
  GameHero,
  GameHeroStat,
  GameResearch,
  GameResource,
  GameState,
  GameTask,
} from '../interfaces';
import {
  getArchetypeLevelUpStatBonusForHero,
  getArchetypeResourceBonusForHero,
  getArchetypeTaskBonusForHero,
  getArchetypeXpBonusForHero,
} from './archetype';
import { getEntry } from './content';
import { getDamageForcePercentage } from './damagetype';
import { gamestate, setGameState } from './gamestate';
import { maxXpForLevel } from './hero';
import { notify, notifyError } from './notify';
import { getOption } from './options';
import { getResourceValue, loseResource } from './resource';
import { seededrng } from './rng';
import {
  heroesAllocatedToTask,
  maxLevelForTask,
  numHeroesAllocatedToTask,
  synergyBonus,
  xpRequiredForTaskLevel,
} from './task';
import { resourceBonusForTask, xpBonusForTask } from './upgrade';

function applyHeroSpeed(
  state: GameState,
  hero: GameHero,
  task: GameTask,
): void {
  state.heroCurrentTaskSpeed[hero.id] ??= 0;
  state.heroCurrentTaskSpeed[hero.id] +=
    (hero.stats.speed + taskSpeedAndForceBoostForHero(hero, task)) *
    getOption('heroSpeedMultiplier');
}

function resetHeroSpeed(state: GameState, hero: GameHero): void {
  state.heroCurrentTaskSpeed[hero.id] = 0;
}

function canApplyDamageToTask(
  state: GameState,
  hero: GameHero,
  task: GameTask,
): boolean {
  return state.heroCurrentTaskSpeed[hero.id] >= task.speedPerCycle;
}

function applyHeroForce(
  state: GameState,
  hero: GameHero,
  task: GameTask,
): void {
  const heroDamage = getEntry<GameDamageType>(hero.damageTypeId);
  const taskDamage = getEntry<GameDamageType>(task.damageTypeId);
  if (!heroDamage || !taskDamage) return;

  const percentApplied = getDamageForcePercentage(heroDamage, taskDamage);
  if (percentApplied === 0) return;

  const percentBonus = synergyBonus(task);

  const damageApplied = Math.max(
    1,
    Math.floor(
      ((percentApplied + percentBonus) / 100) *
        (hero.stats.force + taskSpeedAndForceBoostForHero(hero, task)),
    ),
  );

  state.taskProgress[task.id] ??= 0;
  state.taskProgress[task.id] +=
    damageApplied * getOption('heroForceMultiplier');
}

function updateHero(state: GameState, hero: GameHero): void {
  state.heroes[hero.id] = hero;
}

function taskSpeedAndForceBoostForHero(hero: GameHero, task: GameTask): number {
  return hero.taskLevels[task.id] ?? 0;
}

function taskBonusForHero(hero: GameHero, task: GameTask): number {
  let rewardBoost = hero.taskLevels[task.id] ?? 0;

  if (task.resourceIdPerCycle) {
    const resourceGained = getEntry<GameResource>(task.resourceIdPerCycle);
    if (resourceGained) {
      rewardBoost += getArchetypeResourceBonusForHero(hero, resourceGained);
    }
  }

  rewardBoost += getArchetypeTaskBonusForHero(hero, task);

  return rewardBoost;
}

function numTaskRewards(state: GameState, task: GameTask): number {
  return Math.floor(state.taskProgress[task.id] / task.damageRequiredPerCycle);
}

function isTaskFinished(state: GameState, task: GameTask): boolean {
  return numTaskRewards(state, task) > 0;
}

function finalizeTask(state: GameState, task: GameTask): void {
  if (task.siblingTaskIdRequiringHeroesAllocated) {
    const sibling = getEntry<GameTask>(
      task.siblingTaskIdRequiringHeroesAllocated,
    );
    if (sibling && heroesAllocatedToTask(sibling).length === 0) {
      notifyError(`Task "${task.name}" requires heroes on "${sibling.name}"!`);
      return;
    }
  }

  const heroBonusSum = sum(
    heroesAllocatedToTask(task).map((h) => taskBonusForHero(h, task)),
  );

  if (task.resourceIdPerCycle && task.resourceRewardPerCycle) {
    const res = getEntry<GameResource>(task.resourceIdPerCycle);
    const bonusResources = resourceBonusForTask(task);
    const numHeroesOnTask = numHeroesAllocatedToTask(task);

    const gained =
      (heroBonusSum +
        bonusResources +
        task.resourceRewardPerCycle * numHeroesOnTask) *
      numTaskRewards(state, task) *
      getOption('rewardMultiplier');
    state.resources[task.resourceIdPerCycle] ??= 0;
    state.resources[task.resourceIdPerCycle] += gained;

    notify(`+${gained} ${res?.name ?? '???'}`, 'ResourceGain');
  }

  if (task.applyResultsToResearch) {
    const researchGained =
      (heroBonusSum + task.resourceRewardPerCycle) *
      numTaskRewards(state, task) *
      getOption('rewardMultiplier');
    const activeResearch = state.activeResearch;
    const activeResearchEntry = getEntry<GameResearch>(activeResearch);
    if (
      !activeResearchEntry ||
      state.researchProgress[activeResearch] >=
        activeResearchEntry.researchRequired
    ) {
      notifyError('Gained research, but not researching anything!');
      return;
    }

    state.researchProgress[activeResearch] ??= 0;
    state.researchProgress[activeResearch] = Math.min(
      state.researchProgress[activeResearch] + researchGained,
      activeResearchEntry.researchRequired,
    );
  }
}

function resetTask(state: GameState, task: GameTask): void {
  state.taskProgress[task.id] -=
    task.damageRequiredPerCycle * numTaskRewards(state, task);
}

function rewardTaskDoers(state: GameState, task: GameTask): void {
  const xpGained = numTaskRewards(state, task);
  const heroXpBonus = xpBonusForTask(task);

  let bonusConversionXp = 0;
  if (task.convertResourceIdIntoXp) {
    const resourceRef = getEntry<GameResource>(task.convertResourceIdIntoXp);
    if (!resourceRef) return;

    const resourceValue = getResourceValue(resourceRef.id);
    loseResource(resourceRef, resourceValue);
    bonusConversionXp += resourceValue;
  }

  let statValueGained = 0;
  if (task.convertResourceIdToStat && task.convertResourceStat) {
    const resourceRef = getEntry<GameResource>(task.convertResourceIdToStat);
    if (!resourceRef) return;

    const resourceValue = getResourceValue(resourceRef.id);
    loseResource(resourceRef, resourceValue);
    statValueGained += resourceValue;
  }

  heroesAllocatedToTask(task).forEach((hero) => {
    const archXpBonus = getArchetypeXpBonusForHero(hero);

    gainTaskXp(state, hero, task, xpGained + archXpBonus + hero.stats.progress);
    gainXp(
      state,
      hero,
      xpGained *
        (1 +
          bonusConversionXp +
          archXpBonus +
          heroXpBonus +
          taskBonusForHero(hero, task)),
    );

    if (statValueGained > 0 && task.convertResourceStat) {
      gainStat(hero, task.convertResourceStat, statValueGained);
    }

    updateHero(state, hero);
  });
}

function gainStat(hero: GameHero, stat: GameHeroStat, val = 1): void {
  hero.stats[stat] += Math.floor(val);
}

function levelup(state: GameState, hero: GameHero): void {
  const rng = seededrng(hero.id + ' ' + hero.level);

  function statBoost(val = 1, chance = 50) {
    const shouldGain = rng() * 100 <= chance;
    if (!shouldGain) return 0;

    return val * getOption('heroLevelUpStatGainMultiplier');
  }

  const hpBoost =
    statBoost(5) + getArchetypeLevelUpStatBonusForHero(hero, 'health');
  const forceBoost =
    statBoost(1, 65) + getArchetypeLevelUpStatBonusForHero(hero, 'force');
  const pietyBoost =
    statBoost(1, 25) + getArchetypeLevelUpStatBonusForHero(hero, 'piety');
  const progressBoost =
    statBoost(1, 50) + getArchetypeLevelUpStatBonusForHero(hero, 'progress');
  const resistanceBoost =
    statBoost(1, 15) + getArchetypeLevelUpStatBonusForHero(hero, 'resistance');
  const speedBoost =
    statBoost(1, 10) + getArchetypeLevelUpStatBonusForHero(hero, 'speed');

  gainStat(hero, 'health', hpBoost);
  gainStat(hero, 'force', forceBoost);
  gainStat(hero, 'piety', pietyBoost);
  gainStat(hero, 'progress', progressBoost);
  gainStat(hero, 'resistance', resistanceBoost);
  gainStat(hero, 'speed', speedBoost);

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

function gainTaskXp(
  state: GameState,
  hero: GameHero,
  task: GameTask,
  xp = 1,
): void {
  if (hero.taskLevels[task.id] >= maxLevelForTask(task)) return;

  hero.taskXp ??= {};

  hero.taskLevels[task.id] ??= 0;
  hero.taskXp[task.id] ??= 0;

  hero.taskXp[task.id] += xp * getOption('heroTaskXpMultiplier');

  if (
    hero.taskXp[task.id] >=
    xpRequiredForTaskLevel(task, hero.taskLevels[task.id] + 1)
  ) {
    hero.taskXp[task.id] = 0;
    hero.taskLevels[task.id] += 1;
  }
}

function gainXp(state: GameState, hero: GameHero, xp = 1): void {
  if (hero.level >= hero.maxLevel) return;

  hero.xp += xp * getOption('heroXpMultiplier');

  if (hero.xp >= hero.maxXp) {
    hero.maxXp = maxXpForLevel(hero.level + 1, hero.fusionLevel);
    hero.xp = 0;
    hero.level += 1;

    levelup(state, hero);
  }
}

export function doHeroGameloop(): void {
  const state = gamestate();

  Object.values(state.heroes).forEach((hero) => {
    if (!state.taskAssignments[hero.id]) return;

    const task = getEntry<GameTask>(state.taskAssignments[hero.id]);
    if (!task) return;

    // boost speed, track action
    applyHeroSpeed(state, hero, task);
    if (!canApplyDamageToTask(state, hero, task)) return;
    resetHeroSpeed(state, hero);

    // if we've met the terms, we can do damage
    applyHeroForce(state, hero, task);

    if (!isTaskFinished(state, task)) return;

    // finish the task, reset it, give the task doers a reward
    finalizeTask(state, task);
    rewardTaskDoers(state, task);
    resetTask(state, task);
  });

  setGameState(state);
}

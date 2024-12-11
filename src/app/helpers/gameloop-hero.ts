import { sample, sampleSize, sum } from 'lodash';
import {
  GameAttribute,
  GameHero,
  GameResearch,
  GameResource,
  GameTask,
  GameTimerType,
} from '../interfaces';
import { sendDesignEvent } from './analytics';
import {
  getArchetypeResourceBonusForHero,
  getArchetypeTaskBonusForHero,
  getArchetypeXpBonusForHero,
} from './archetype';
import { heroGainAttribute, heroHasAttribute } from './attribute';
import { tickBuffs } from './buff';
import { getEntry } from './content';
import { currentDungeonStep, isDungeonInProgress } from './dungeon';
import {
  modifyDefenseTimer,
  modifyExploreTimer,
  modifyHeroBuffTimer,
  modifyHeroRerollTimer,
  modifyShopRerollTimer,
} from './entertain';
import { gamestate, updateGamestate } from './gamestate';
import {
  allHeroes,
  gainStat,
  gainXp,
  heroStatValue,
  isStunned,
  loseStat,
  reduceStun,
  totalHeroForce,
  totalHeroSpeed,
} from './hero';
import { notify, notifyError } from './notify';
import { getOption } from './options';
import {
  getResourceValue,
  hasResource,
  loseResource,
  zeroResource,
} from './resource';
import { succeedsChance } from './rng';
import {
  heroesAllocatedToTask,
  maxLevelForTask,
  numHeroesAllocatedToTask,
  xpRequiredForTaskLevel,
} from './task';
import { resourceBonusForTask, xpBonusForTask } from './upgrade';

function applyHeroSpeed(
  hero: GameHero,
  task: GameTask,
  numTimes: number,
): void {
  updateGamestate((state) => {
    state.heroCurrentTaskSpeed[hero.id] ??= 0;
    state.heroCurrentTaskSpeed[hero.id] += totalHeroSpeed(hero, task, numTimes);
    return state;
  });
}

function resetHeroSpeed(hero: GameHero): void {
  updateGamestate((state) => {
    state.heroCurrentTaskSpeed[hero.id] = 0;
    return state;
  });
}

function canApplyDamageToTask(hero: GameHero, task: GameTask): boolean {
  return gamestate().heroCurrentTaskSpeed[hero.id] >= task.speedPerCycle;
}

function numTimesToApplyDamageToTask(hero: GameHero, task: GameTask): number {
  return Math.floor(
    gamestate().heroCurrentTaskSpeed[hero.id] / task.speedPerCycle,
  );
}

function applyHeroForce(
  hero: GameHero,
  task: GameTask,
  numTimes: number,
): void {
  const damage = totalHeroForce(hero, task, numTimes);

  updateGamestate((state) => {
    state.taskProgress[task.id] ??= 0;
    state.taskProgress[task.id] += damage;
    return state;
  });
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

function numTaskRewards(task: GameTask): number {
  return Math.floor(
    gamestate().taskProgress[task.id] / task.damageRequiredPerCycle,
  );
}

function isTaskFinished(task: GameTask): boolean {
  return numTaskRewards(task) > 0;
}

function finalizeTask(task: GameTask): void {
  sendDesignEvent(`Task:${task.name}:Complete`);

  if (task.siblingTaskIdRequiringHeroesAllocated) {
    const sibling = getEntry<GameTask>(
      task.siblingTaskIdRequiringHeroesAllocated,
    );
    if (sibling && heroesAllocatedToTask(sibling).length === 0) {
      notifyError(`Task "${task.name}" requires heroes on "${sibling.name}"!`);
      return;
    }
  }

  if (!canConsumeFinalizedTaskResources(task)) return;
  if (!canConsumeFinalizedTaskStats(task)) return;

  const heroBonusSum = sum(
    heroesAllocatedToTask(task).map((h) => taskBonusForHero(h, task)),
  );

  consumeFinalizedTaskStats(task);
  consumeFinalizedTaskResources(task);
  applyTaskFinalizedResultsToResources(task, heroBonusSum);
  applyTaskFinalizedResultsToResearch(task, heroBonusSum);
  applyTaskFinalizedResultsToTimers(task, heroBonusSum);
}

function canConsumeFinalizedTaskStats(task: GameTask): boolean {
  const consumedStat = task.consumeStatPerCycle;
  if (!consumedStat) return true;

  return heroesAllocatedToTask(task).every((h) => h.stats[consumedStat] > 0);
}

function consumeFinalizedTaskStats(task: GameTask): void {
  const statTaken = task.consumeStatPerCycle;
  if (!statTaken) return;

  heroesAllocatedToTask(task).forEach((h) => {
    loseStat(h, statTaken, task.consumeAmount ?? 1);
  });
}

function canConsumeFinalizedTaskResources(task: GameTask): boolean {
  // if we consume nothing, we can do that.
  if (
    !task.consumeAmount ||
    !task.consumeResourceIdPerCycle ||
    !task.consumeResourceCount
  )
    return true;

  const possibleResources = (task.consumeResourceIdPerCycle ?? [])
    .map((rid) => getEntry<GameResource>(rid))
    .filter(Boolean) as GameResource[];
  const requiredAmount = task.consumeAmount ?? 0;
  const requiredNum = task.consumeResourceCount ?? 1;

  return (
    possibleResources.filter((r) => hasResource(r, requiredAmount)).length >=
    requiredNum
  );
}

function consumeFinalizedTaskResources(task: GameTask): void {
  const possibleResources = (task.consumeResourceIdPerCycle ?? [])
    .map((rid) => getEntry<GameResource>(rid))
    .filter(Boolean) as GameResource[];
  const requiredAmount = task.consumeAmount ?? 0;
  const requiredNum = task.consumeResourceCount ?? 1;

  if (possibleResources.length === 0 || requiredAmount === 0) return;

  const consumableResources = possibleResources.filter((r) =>
    hasResource(r, requiredAmount),
  );

  sampleSize(consumableResources, requiredNum).forEach((res) => {
    loseResource(res, requiredAmount);
  });
}

function applyTaskFinalizedResultsToResources(
  task: GameTask,
  heroBonusSum: number,
): void {
  if (!task.resourceIdPerCycle) return;

  const res = getEntry<GameResource>(task.resourceIdPerCycle);
  const bonusResources = resourceBonusForTask(task);
  const numHeroesOnTask = numHeroesAllocatedToTask(task);

  const gained =
    (heroBonusSum +
      bonusResources +
      task.resourceRewardPerCycle * numHeroesOnTask) *
    numTaskRewards(task) *
    getOption('rewardMultiplier');

  const taskResourceId = task.resourceIdPerCycle;

  updateGamestate((state) => {
    state.resources[taskResourceId] ??= 0;
    state.resources[taskResourceId] += gained;
    return state;
  });

  notify(`+${gained} ${res?.name ?? '???'}`, 'ResourceGain');
}

function applyTaskFinalizedResultsToResearch(
  task: GameTask,
  heroBonusSum: number,
): void {
  if (!task.applyResultsToResearch) return;

  const researchGained =
    (heroBonusSum + task.resourceRewardPerCycle) *
    numTaskRewards(task) *
    getOption('rewardMultiplier');
  const activeResearch = gamestate().activeResearch;
  const activeResearchEntry = getEntry<GameResearch>(activeResearch);
  if (
    !activeResearchEntry ||
    gamestate().researchProgress[activeResearch] >=
      activeResearchEntry.researchRequired
  ) {
    return;
  }

  updateGamestate((state) => {
    state.researchProgress[activeResearch] ??= 0;
    state.researchProgress[activeResearch] = Math.min(
      state.researchProgress[activeResearch] + researchGained,
      activeResearchEntry.researchRequired,
    );
    return state;
  });
}

function applyTaskFinalizedResultsToTimers(
  task: GameTask,
  heroBonusSum: number,
): void {
  if (!task.applyDamageToRandomTimers) return;

  const bonus = resourceBonusForTask(task);

  const timerDamageTicksDone =
    (heroBonusSum + task.resourceRewardPerCycle + bonus) *
    numTaskRewards(task) *
    getOption('rewardMultiplier');

  const baseTimers: GameTimerType[] = ['defense', 'shopreroll', 'heroreroll'];
  if (
    isDungeonInProgress() &&
    ['loot', 'treasure'].includes(currentDungeonStep()?.type ?? '')
  ) {
    baseTimers.push('dungeon');
  }

  if (allHeroes().some((h) => Object.keys(h.buffTicks ?? {}).length > 0)) {
    baseTimers.push('herobuff');
  }

  const timerType = sample(baseTimers) as GameTimerType;

  const timerCalls: Record<GameTimerType, (ticks: number) => void> = {
    defense: modifyDefenseTimer,
    dungeon: modifyExploreTimer,
    herobuff: modifyHeroBuffTimer,
    heroreroll: modifyHeroRerollTimer,
    shopreroll: modifyShopRerollTimer,
  };

  timerCalls[timerType](timerDamageTicksDone);
}

function resetTask(task: GameTask): void {
  updateGamestate((state) => {
    state.taskProgress[task.id] -=
      task.damageRequiredPerCycle * numTaskRewards(task);

    return state;
  });
}

function rewardTaskDoers(task: GameTask): void {
  const xpGainedTimes = numTaskRewards(task);
  const heroXpBonus = xpBonusForTask(task);

  let bonusConversionXp = 0;
  if (task.convertResourceIdIntoXp) {
    const resourceRef = getEntry<GameResource>(task.convertResourceIdIntoXp);
    if (!resourceRef) return;

    const resourceValue = getResourceValue(resourceRef.id);
    bonusConversionXp += resourceValue;

    zeroResource(resourceRef);
  }

  let statValueGained = 0;
  if (task.convertResourceIdToStat && task.convertResourceStat) {
    const resourceRef = getEntry<GameResource>(task.convertResourceIdToStat);
    if (!resourceRef) return;

    const resourceValue = getResourceValue(resourceRef.id);
    zeroResource(resourceRef);
    statValueGained += resourceValue;
  }

  const taskXpGained = task.xpPerCycle;

  heroesAllocatedToTask(task).forEach((hero) => {
    const archXpBonus = getArchetypeXpBonusForHero(hero);

    const totalXpForHero =
      taskXpGained +
      bonusConversionXp +
      archXpBonus +
      heroXpBonus +
      taskBonusForHero(hero, task);

    gainTaskXp(
      hero,
      task,
      xpGainedTimes + archXpBonus + heroStatValue(hero, 'progress'),
    );
    gainXp(hero, xpGainedTimes * totalXpForHero);

    if (statValueGained > 0 && task.convertResourceStat) {
      gainStat(hero, task.convertResourceStat, statValueGained);
    }

    let chanceToGetAttribute = hero.taskLevels[task.id] ?? 0;
    if (hero.damageTypeId !== task.damageTypeId) {
      chanceToGetAttribute -= 2;
    }

    if (
      task.earnedAttributeId &&
      hero.attributeIds &&
      !hero.attributeIds.includes(task.earnedAttributeId) &&
      hero.taskLevels[task.id] > 0 &&
      succeedsChance(chanceToGetAttribute)
    ) {
      const attribute = getEntry<GameAttribute>(task.earnedAttributeId)!;

      if (!heroHasAttribute(hero, attribute)) {
        notify(`${hero.name} has unlocked "${attribute.name}"!`, 'Success');
        heroGainAttribute(hero, attribute);
      }
    }
  });
}

function gainTaskXp(hero: GameHero, task: GameTask, xp = 1): void {
  if (hero.taskLevels[task.id] >= maxLevelForTask(task)) return;

  updateGamestate((state) => {
    const heroRef = state.heroes[hero.id];

    heroRef.taskXp ??= {};

    heroRef.taskLevels[task.id] ??= 0;
    heroRef.taskXp[task.id] ??= 0;

    heroRef.taskXp[task.id] += xp * getOption('heroTaskXpMultiplier');

    if (
      heroRef.taskXp[task.id] >=
      xpRequiredForTaskLevel(task, heroRef.taskLevels[task.id] + 1)
    ) {
      heroRef.taskXp[task.id] = 0;
      heroRef.taskLevels[task.id] += 1;
    }

    return state;
  });
}

export function canDoTask(task: GameTask): boolean {
  return task.speedPerCycle > 0;
}

export function doHeroGameloop(numTicks: number): void {
  const state = gamestate();

  Object.values(state.heroes).forEach((hero) => {
    tickBuffs(hero);

    if (isStunned(hero)) {
      reduceStun(hero, numTicks);
      return;
    }

    if (!state.taskAssignments[hero.id]) return;

    const task = getEntry<GameTask>(state.taskAssignments[hero.id]);
    if (!task) return;

    if (!canDoTask(task)) return;

    // boost speed, track action
    applyHeroSpeed(hero, task, numTicks);
    if (!canApplyDamageToTask(hero, task)) return;
    const numTimesToApplyForce = numTimesToApplyDamageToTask(hero, task);
    resetHeroSpeed(hero);

    // if we've met the terms, we can do damage
    applyHeroForce(hero, task, numTimesToApplyForce);

    if (!isTaskFinished(task)) return;

    // finish the task, reset it, give the task doers a reward
    finalizeTask(task);
    rewardTaskDoers(task);
    resetTask(task);
  });
}

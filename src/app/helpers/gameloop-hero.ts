import { sum } from 'lodash';
import {
  GameAttribute,
  GameHero,
  GameResearch,
  GameResource,
  GameTask,
} from '../interfaces';
import { sendDesignEvent } from './analytics';
import {
  getArchetypeResourceBonusForHero,
  getArchetypeTaskBonusForHero,
  getArchetypeXpBonusForHero,
} from './archetype';
import { heroGainAttribute } from './attribute';
import { getEntry } from './content';
import { gamestate, updateGamestate } from './gamestate';
import {
  gainStat,
  gainXp,
  heroStatValue,
  isStunned,
  reduceStun,
  totalHeroForce,
  totalHeroSpeed,
} from './hero';
import { notify, notifyError } from './notify';
import { getOption } from './options';
import { getResourceValue, zeroResource } from './resource';
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

  if (task.applyResultsToResearch) {
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
      notify(`${hero.name} has unlocked "${attribute.name}"!`, 'Success');

      heroGainAttribute(hero, attribute);
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

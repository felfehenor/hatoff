import { sample, sampleSize } from 'lodash';
import {
  GameDamageType,
  GameResource,
  GameTask,
  GameUpgrade,
} from '../interfaces';
import { getEntriesByType, getEntry } from './content';
import { cooldown } from './cooldown';
import { isEasyMode, isHardMode } from './difficulty';
import { gamestate, updateGamestate } from './gamestate';
import { notify } from './notify';
import {
  allUnlockedDamageTypes,
  allUnlockedTasks,
  totalCompletedResearch,
} from './research';
import { getResourceValue, hasResource, zeroResource } from './resource';
import { randomChoice, randomrng } from './rng';
import { heroesAllocatedToTask, unassignHeroTask } from './task';
import {
  allUpgradesForTask,
  hasUpgrade,
  loseUpgrade,
  purchasedUpgradesForTask,
} from './upgrade';

export function setDefenseResetTime(): void {
  updateGamestate((state) => {
    state.cooldowns.nextDefenseAttackTime = cooldown(3600);
    return state;
  });
}

export function requiredBuildingsForTownAttack(): number {
  return 7;
}

export function requiredResearchesForTownAttack(): number {
  return 14;
}

export function canAttackTown(): boolean {
  if (isEasyMode()) return false;

  return (
    allUnlockedTasks().length >= requiredBuildingsForTownAttack() &&
    totalCompletedResearch() >= requiredResearchesForTownAttack()
  );
}

export function hasQueuedAttack(): boolean {
  return gamestate().defense.incomingDamage > 0;
}

export function generateFirstAttack(): void {
  notify(
    "You've just unlocked town defense, and accrued the ire of the woodlands...",
    'Defense',
  );
  updateGamestate((state) => {
    state.defense.numAttacks = 0;
    return state;
  });

  generateTownAttack();
}

export function pickTownDamageType(): GameDamageType {
  const numAttacks = gamestate().defense.numAttacks;
  const allUnlockedIds = allUnlockedDamageTypes().map((f) => f.id);

  const damageTypes = getEntriesByType<GameDamageType>('damagetype')
    .filter((t) => !t.isAny && t.name !== 'Defensive')
    .filter((t) => {
      // no locked damage types in the first few
      if (numAttacks < 3) {
        return allUnlockedIds.includes(t.id);
      }

      // 30% chance of having a locked damage type up until attack 7
      if (numAttacks < 7 && randomrng()() > 0.7) {
        return allUnlockedIds.includes(t.id);
      }

      // every damage type
      return t;
    });

  return randomChoice<GameDamageType>(damageTypes);
}

export function calculateDamageForTown(): number {
  const numAttacks = gamestate().defense.numAttacks + 1;
  const numResearch = totalCompletedResearch();
  if (numAttacks <= 0) return 0;

  const divisor = isHardMode() ? 25 : 50;

  const coefficient = numAttacks / divisor;
  const result = numResearch ** coefficient * Math.log10(numResearch) * 50;

  return Math.floor(result);
}

export function isTaskThreatened(task: GameTask): boolean {
  return (
    !hasEnoughFortifications() &&
    gamestate().defense.targettedTaskIds.includes(task.id)
  );
}

export function hasEnoughFortifications(): boolean {
  return (
    getResourceValue('Fortifications') >= gamestate().defense.incomingDamage
  );
}

export function generateTownAttack(): void {
  const availableTasks = allUnlockedTasks().filter(
    (t) =>
      !getEntry<GameDamageType>(t.damageTypeId)?.isAny &&
      destroyableUpgrades(t).length > 0,
  );
  const numTasks = sample([1, 2]);
  const chosenTasks = sampleSize(availableTasks, numTasks).map((t) => t.id);

  updateGamestate((state) => {
    state.defense.incomingDamage = calculateDamageForTown();
    state.defense.damageTypeId = pickTownDamageType().id;
    state.defense.targettedTaskIds = chosenTasks;
    return state;
  });
}

export function setTownAttacks(attacks: number): void {
  updateGamestate((state) => {
    state.defense.numAttacks = attacks;
    return state;
  });
}

export function destroyableUpgrades(task: GameTask): GameUpgrade[] {
  const allUpgrades = allUpgradesForTask(task);
  const purchasedUpgrades = purchasedUpgradesForTask(task);

  return purchasedUpgrades.filter((u) => {
    const dependentUpgrades = allUpgrades.filter((f) =>
      f.requiresUpgradeIds?.includes(u.id),
    );

    // no child upgrades = we can delete it
    if (dependentUpgrades.length === 0) return true;

    // if any of our child upgrades exist, and they're built, we can't delete this one
    if (
      dependentUpgrades.some(
        (d) => d.requiresUpgradeIds?.includes(u.id) && hasUpgrade(task, d),
      )
    )
      return false;

    // we can only delete it
    return true;
  });
}

export function doTownAttack(): void {
  setTownAttacks(gamestate().defense.numAttacks + 1);

  const tasksToLoseUpgradesFor: GameTask[] = [];

  updateGamestate((state) => {
    const defenseTask = getEntry<GameTask>('Town Defense');
    if (defenseTask) {
      const allocated = heroesAllocatedToTask(defenseTask);
      allocated.forEach((hero) => unassignHeroTask(hero));
    }

    const fortifications = getEntry<GameResource>('Fortifications');
    if (fortifications) {
      const wasFullyDefended = hasResource(
        fortifications,
        state.defense.incomingDamage,
      );
      zeroResource(fortifications);

      if (!wasFullyDefended) {
        tasksToLoseUpgradesFor.push(
          ...state.defense.targettedTaskIds.map((t) => getEntry<GameTask>(t)!),
        );
      }
    }

    return state;
  });

  tasksToLoseUpgradesFor.forEach((task) => {
    const possibleLosses = destroyableUpgrades(task);
    const lost = sample(possibleLosses)!;

    notify(`${task.name} lost the upgrade ${lost.name}!`, 'Defense');

    loseUpgrade(task, lost);
  });

  generateTownAttack();
  setDefenseResetTime();
}

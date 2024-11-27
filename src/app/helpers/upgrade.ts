import { sortBy, sum } from 'lodash';
import { GameTask, GameUpgrade } from '../interfaces';
import { getEntriesByType, getEntry } from './content';
import { gamestate, setGameState, updateGamestate } from './gamestate';
import { isResearchComplete } from './research';

export function taskLevel(task: GameTask): number {
  const state = gamestate();
  return Object.keys(state.taskUpgrades[task.id] ?? {}).length;
}

export function maxTaskLevel(task: GameTask): number {
  return taskLevel(task) + upgradesAvailableForTask(task).length;
}

export function hasUpgrade(task: GameTask, upgrade: GameUpgrade): boolean {
  const state = gamestate();
  return !!state.taskUpgrades[task.id]?.[upgrade.id];
}

export function loseUpgrade(task: GameTask, upgrade: GameUpgrade): void {
  updateGamestate((state) => {
    delete state.taskUpgrades[task.id][upgrade.id];
    return state;
  });
}

export function allUpgradesForTask(task: GameTask): GameUpgrade[] {
  return (
    (task.possibleUpgradeIds
      ?.map((t) => getEntry<GameUpgrade>(t))
      .filter(Boolean) as GameUpgrade[]) ?? []
  );
}

export function purchasedUpgradesForTask(task: GameTask): GameUpgrade[] {
  const state = gamestate();
  return sortBy(
    Object.keys(state.taskUpgrades[task.id] ?? {}).map(
      (t) => getEntry<GameUpgrade>(t)!,
    ),
    'name',
  );
}

export function upgradesAvailableForTask(task: GameTask): GameUpgrade[] {
  return sortBy(
    getEntriesByType<GameUpgrade>('upgrade').filter(
      (u) =>
        task.possibleUpgradeIds?.includes(u.id) &&
        !hasUpgrade(task, u) &&
        (u.requiresResearchIds ?? []).every((r) => isResearchComplete(r)) &&
        (u.requiresUpgradeIds ?? []).every((upg) =>
          hasUpgrade(task, getEntry<GameUpgrade>(upg)!),
        ),
    ),
    'name',
  );
}

export function allocationBonusForTask(task: GameTask): number {
  const state = gamestate();
  return sum(
    Object.keys(state.taskUpgrades[task.id] ?? {})
      .map((upgId) => getEntry<GameUpgrade>(upgId))
      .map((u) => u?.boostHeroCap ?? 0),
  );
}

export function xpBonusForTask(task: GameTask): number {
  const state = gamestate();
  return sum(
    Object.keys(state.taskUpgrades[task.id] ?? {})
      .map((upgId) => getEntry<GameUpgrade>(upgId))
      .map((u) => u?.boostXpGain ?? 0),
  );
}

export function resourceBonusForTask(task: GameTask): number {
  const state = gamestate();
  return sum(
    Object.keys(state.taskUpgrades[task.id] ?? {})
      .map((upgId) => getEntry<GameUpgrade>(upgId))
      .map((u) => u?.boostResourceGain ?? 0),
  );
}

export function maxLevelBonusForTask(task: GameTask): number {
  const state = gamestate();
  return sum(
    Object.keys(state.taskUpgrades[task.id] ?? {})
      .map((upgId) => getEntry<GameUpgrade>(upgId))
      .map((u) => u?.boostLevelCap ?? 0),
  );
}

export function synergyBonusForTask(task: GameTask): number {
  const state = gamestate();
  return sum(
    Object.keys(state.taskUpgrades[task.id] ?? {})
      .map((upgId) => getEntry<GameUpgrade>(upgId))
      .map((u) => u?.boostSynergy ?? 0),
  );
}

export function canBuyUpgrade(upgrade: GameUpgrade): boolean {
  const state = gamestate();
  return upgrade.costs.every(
    (resCost) => state.resources[resCost.resourceId] >= resCost.value,
  );
}

export function buyUpgrade(upgrade: GameUpgrade, task: GameTask): void {
  const state = gamestate();
  state.taskUpgrades[task.id] ??= {};
  state.taskUpgrades[task.id][upgrade.id] = Date.now();

  upgrade.costs.forEach((resCost) => {
    state.resources[resCost.resourceId] -= resCost.value;
  });

  setGameState(state);
}

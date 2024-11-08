import { GameHero, GameResource, GameState, GameTask } from '../interfaces';
import { getEntry } from './content';
import { gamestate, setGameState } from './gamestate';
import { notify } from './notify';

function applyHeroSpeed(state: GameState, hero: GameHero): void {
  state.heroCurrentTaskSpeed[hero.id] ??= 0;
  state.heroCurrentTaskSpeed[hero.id] += hero.stats.speed;
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
  task: GameTask,
  hero: GameHero,
): void {
  state.taskProgress[task.id] ??= 0;
  state.taskProgress[task.id] += hero.stats.force;
}

function numTaskRewards(state: GameState, task: GameTask): number {
  return Math.floor(state.taskProgress[task.id] / task.damageRequiredPerCycle);
}

function isTaskFinished(state: GameState, task: GameTask): boolean {
  return numTaskRewards(state, task) > 0;
}

function finalizeTask(state: GameState, task: GameTask): void {
  if (task.resourceIdPerCycle && task.resourceRewardPerCycle) {
    const res = getEntry<GameResource>(task.resourceIdPerCycle);

    const gained = task.resourceRewardPerCycle * numTaskRewards(state, task);
    state.resources[task.resourceIdPerCycle] ??= 0;
    state.resources[task.resourceIdPerCycle] += gained;

    notify(`+${gained} ${res?.name ?? '???'}`);
  }
}

function resetTask(state: GameState, task: GameTask): void {
  state.taskProgress[task.id] -=
    task.damageRequiredPerCycle * numTaskRewards(state, task);
}

function rewardTaskDoers(state: GameState, task: GameTask): void {
  // TODO: #41
}

export function doHeroGameloop(): void {
  const state = gamestate();

  Object.values(state.heroes).forEach((hero) => {
    if (!state.taskAssignments[hero.id]) return;

    const task = getEntry<GameTask>(state.taskAssignments[hero.id]);
    if (!task) return;

    // boost speed, track action
    applyHeroSpeed(state, hero);
    if (!canApplyDamageToTask(state, hero, task)) return;
    resetHeroSpeed(state, hero);

    // if we've met the terms, we can do damage
    applyHeroForce(state, task, hero);

    if (!isTaskFinished(state, task)) return;
    finalizeTask(state, task);
    resetTask(state, task);
    rewardTaskDoers(state, task);
  });

  setGameState(state);
}

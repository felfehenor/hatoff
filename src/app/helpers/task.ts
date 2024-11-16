import { sum } from 'lodash';
import { GameDamageType, GameHero, GameTask } from '../interfaces';
import { getEntry } from './content';
import {
  canUseDamageTypeForRequirement,
  getDamageForcePercentage,
} from './damagetype';
import { gamestate, setGameState } from './gamestate';
import { allUnlockedTasks } from './research';
import { isTownName } from './town';
import {
  allocationBonusForTask,
  maxLevelBonusForTask,
  synergyBonusForTask,
} from './upgrade';

export function isStrictDamageType(task: GameTask): boolean {
  return task.requireExactType || isTownName('Fel Fhenor');
}

export function heroesAllocatedToTask(task: GameTask): GameHero[] {
  const state = gamestate();
  const assignments = state.taskAssignments;
  return Object.keys(assignments)
    .filter((h) => assignments[h] === task.id)
    .map((h) => state.heroes[h]);
}

export function canAllocateHeroToTask(hero: GameHero, task: GameTask): boolean {
  const heroDamageType = getEntry<GameDamageType>(hero.damageTypeId);
  const taskDamageType = getEntry<GameDamageType>(task.damageTypeId);

  if (!heroDamageType || !taskDamageType) return false;

  if (isStrictDamageType(task) && taskDamageType.id !== heroDamageType.id)
    return false;

  if (!canUseDamageTypeForRequirement(heroDamageType, taskDamageType))
    return false;

  if (getDamageForcePercentage(heroDamageType, taskDamageType) === 0)
    return false;

  return heroesAllocatedToTask(task).length < maxHeroesForTask(task);
}

export function numHeroesAllocatedToTask(task: GameTask): number {
  return heroesAllocatedToTask(task).length;
}

export function numIdleHeroes(): number {
  const state = gamestate();
  return (
    Object.keys(state.heroes).length - Object.keys(state.taskAssignments).length
  );
}

export function isHeroAllocatedToTask(task: GameTask, hero: GameHero): boolean {
  return gamestate().taskAssignments[hero.id] === task.id;
}

export function currentHeroTask(hero: GameHero): GameTask | undefined {
  return getEntry<GameTask>(gamestate().taskAssignments[hero.id]);
}

export function getTaskProgress(task: GameTask): number {
  return gamestate().taskProgress[task.id] ?? 0;
}

export function assignHeroToTask(task: GameTask, hero: GameHero): void {
  const state = gamestate();
  state.taskAssignments[hero.id] = task.id;
  state.heroCurrentTaskSpeed[hero.id] = 0;
  setGameState(state);
}

export function unassignHeroTask(hero: GameHero): void {
  const state = gamestate();
  delete state.taskAssignments[hero.id];
  delete state.heroCurrentTaskSpeed[hero.id];
  setGameState(state);
}

export function synergyBonus(task: GameTask): number {
  const allHeroes = heroesAllocatedToTask(task);
  if (allHeroes.length <= 1) return 0;

  const damageType = allHeroes[0].damageTypeId;

  const doAllMatch = allHeroes.every((h) => h.damageTypeId === damageType);
  if (!doAllMatch) return 0;

  const bonus = allHeroes.length > 0 ? synergyBonusForTask(task) : 0;

  return bonus + Math.min(5, allHeroes.length) * 10;
}

export function maxHeroesForTask(task: GameTask): number {
  return task.maxHeroesAllocable + allocationBonusForTask(task);
}

export function maxLevelForTask(task: GameTask): number {
  return task.maxLevel + maxLevelBonusForTask(task);
}

export function xpRequiredForTaskLevel(task: GameTask, level: number): number {
  return task.xpRequiredPerLevel * level;
}

export function getGlobalBoostForDamageType(type: GameDamageType): number {
  return sum(
    allUnlockedTasks()
      .filter((t) => t.spreadHeroDamageType)
      .flatMap((t) =>
        heroesAllocatedToTask(t).filter((h) => h.damageTypeId === type.id),
      )
      .map((h) => h.stats.force),
  );
}

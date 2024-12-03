import { sum } from 'lodash';
import { GameDamageType, GameHero, GameTask } from '../interfaces';
import { getEntry, getResearchableEntriesByType } from './content';
import {
  canUseDamageTypeForRequirement,
  getDamageForcePercentage,
} from './damagetype';
import { isHardMode } from './difficulty';
import { heroesInExploreTask, isDungeonInProgress } from './dungeon';
import { gamestate, updateGamestate } from './gamestate';
import { heroStatValue } from './hero';
import { allUnlockedDamageTypes, allUnlockedTasks } from './research';
import {
  allocationBonusForTask,
  maxLevelBonusForTask,
  synergyBonusForTask,
} from './upgrade';

export function isStrictDamageType(task: GameTask): boolean {
  const damageType = getTaskDamageType(task);
  if (
    !getResearchableEntriesByType<GameDamageType>('damagetype')
      .map((t) => t.id)
      .includes(damageType.id)
  )
    return false;

  return task.requireExactType || isHardMode();
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
  const taskDamageType = getTaskDamageType(task);

  if (isDungeonInProgress()) {
    const explore = getEntry<GameTask>('Explore');
    if (explore?.id === task.id) return false;
  }

  if (!heroDamageType || !taskDamageType) return false;

  if (heroesAllocatedToTask(task).length >= maxHeroesForTask(task))
    return false;

  if (heroDamageType.isAny) return true;

  if (isStrictDamageType(task) && taskDamageType.id !== heroDamageType.id)
    return false;

  if (!canUseDamageTypeForRequirement(heroDamageType, taskDamageType))
    return false;

  if (getDamageForcePercentage(heroDamageType, taskDamageType) === 0)
    return false;

  return true;
}

export function canUnallocateHeroFromTask(
  hero: GameHero,
  task: GameTask,
): boolean {
  if (isDungeonInProgress()) {
    const explore = getEntry<GameTask>('Explore');
    if (!explore || explore.id !== task.id) return true;

    return !heroesInExploreTask().find((h) => h.id === hero.id);
  }

  return true;
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
  updateGamestate((state) => {
    state.taskAssignments[hero.id] = task.id;
    state.heroCurrentTaskSpeed[hero.id] = 0;
    return state;
  });
}

export function unassignHeroTask(hero: GameHero): void {
  updateGamestate((state) => {
    delete state.taskAssignments[hero.id];
    delete state.heroCurrentTaskSpeed[hero.id];
    return state;
  });
}

export function synergyBonus(task: GameTask): number {
  const allHeroes = heroesAllocatedToTask(task);
  if (allHeroes.length <= 1) return 0;

  const normalDamageTypes = allHeroes.filter(
    (t) => !getEntry<GameDamageType>(t.damageTypeId)?.isAny,
  );

  const damageType = normalDamageTypes[0].damageTypeId;

  const doAllMatch = normalDamageTypes.every(
    (h) => h.damageTypeId === damageType,
  );
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
      .map((h) => heroStatValue(h, 'force')),
  );
}

export function getDefenseDamageType(): GameDamageType {
  const defenseType = getEntry<GameDamageType>('Defensive')!;
  const baseType = getEntry<GameDamageType>(gamestate().defense.damageTypeId)!;
  if (!baseType) return defenseType;

  const sumType = {
    ...structuredClone(defenseType),
  };

  sumType.color = baseType.color;

  sumType.subTypes = [
    { damageTypeId: baseType.id, percent: 100 },
    ...baseType.subTypes,
  ];

  const existingTypes = sumType.subTypes.map((t) => t.damageTypeId);
  const remainingTypes = allUnlockedDamageTypes().filter(
    (t) => !existingTypes.includes(t.id),
  );

  sumType.subTypes.push(
    ...remainingTypes.map((t) => ({ damageTypeId: t.id, percent: 25 })),
  );

  return sumType;
}

export function getTaskDamageType(task: GameTask): GameDamageType {
  if (task.damageTypeAutoChange === 'defense') {
    return getDefenseDamageType();
  }

  return getEntry<GameDamageType>(task.damageTypeId)!;
}

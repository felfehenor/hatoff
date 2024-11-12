import { GameDamageType, GameHero, GameTask } from '../interfaces';
import { getEntry } from './content';
import { canUseDamageTypeForRequirement } from './damagetype';
import { gamestate, setGameState } from './gamestate';

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

  if (!canUseDamageTypeForRequirement(heroDamageType, taskDamageType))
    return false;

  return heroesAllocatedToTask(task).length < task.maxHeroesAllocable;
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

  return Math.min(5, allHeroes.length) * 10;
}

import { GameHero, GameTask } from '../interfaces';
import { getEntry } from './content';
import { gamestate, setGameState } from './gamestate';

export function heroesAllocatedToTask(task: GameTask): GameHero[] {
  const state = gamestate();
  const assignments = state.taskAssignments;
  return Object.keys(assignments)
    .filter((h) => assignments[h] === task.id)
    .map((h) => state.heroes[h]);
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

export function assignHeroToTask(task: GameTask, hero: GameHero): void {
  const state = gamestate();
  state.taskAssignments[hero.id] = task.id;
  setGameState(state);
}

export function unassignHeroTask(hero: GameHero): void {
  const state = gamestate();
  delete state.taskAssignments[hero.id];
  setGameState(state);
}

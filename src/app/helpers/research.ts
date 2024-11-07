import { isUndefined, sortBy } from 'lodash';
import {
  GameArchetype,
  GameDamageType,
  GameResearch,
  GameTask,
} from '../interfaces';
import { getEntriesByType, getEntry } from './content';
import { gamestate, setGameState } from './gamestate';

export function setActiveResearch(research: GameResearch): void {
  const state = gamestate();
  state.activeResearch = research.id;
  setGameState(state);
}

export function getResearchFor(id: string): number {
  return gamestate().researchProgress[id] ?? 0;
}

export function isResearchComplete(id: string): boolean {
  const entry = getEntry<GameResearch>(id);
  if (!entry) return false;

  return getResearchFor(id) >= entry.researchRequired;
}

export function allAvailableIncompleteResearch(): GameResearch[] {
  const state = gamestate();
  return getEntriesByType<GameResearch>('research').filter(
    (entry) =>
      isUndefined(state.researchProgress[entry.id]) ||
      state.researchProgress[entry.id] < entry.researchRequired,
  );
}

export function allCompletedResearch(): GameResearch[] {
  const state = gamestate();
  return getEntriesByType<GameResearch>('research').filter(
    (entry) => state.researchProgress[entry.id] >= entry.researchRequired,
  );
}

export function allUnlockedArchetypes(): GameArchetype[] {
  const validResearch = allCompletedResearch().filter(
    (r) => (r as GameResearch).unlocksArchetypeId,
  ) as GameResearch[];

  return sortBy(
    validResearch
      .map((r) => getEntry<GameArchetype>(r.unlocksArchetypeId!))
      .filter(Boolean),
    'name',
  ) as GameArchetype[];
}

export function allUnlockedDamageTypes(): GameDamageType[] {
  const validResearch = allCompletedResearch().filter(
    (r) => (r as GameResearch).unlocksDamageTypeId,
  ) as GameResearch[];

  return sortBy(
    validResearch
      .map((r) => getEntry<GameDamageType>(r.unlocksDamageTypeId!))
      .filter(Boolean),
    'name',
  ) as GameDamageType[];
}

export function allUnlockedTasks(): GameTask[] {
  const validResearch = allCompletedResearch().filter(
    (r) => (r as GameResearch).unlocksTaskId,
  ) as GameResearch[];

  return sortBy(
    validResearch
      .map((r) => getEntry<GameTask>(r.unlocksArchetypeId!))
      .filter(Boolean),
    'name',
  ) as GameTask[];
}

export function allUnlockedPopulationResearch(): GameResearch[] {
  const validResearch = allCompletedResearch().filter(
    (r) => (r as GameResearch).unlocksPopulation,
  ) as GameResearch[];

  return sortBy(validResearch, 'name') as GameResearch[];
}

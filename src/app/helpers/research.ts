import { isUndefined, sortBy, sum } from 'lodash';
import {
  GameArchetype,
  GameDamageType,
  GameHeroStat,
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

  return getResearchFor(entry.id) >= entry.researchRequired;
}

export function allAvailableIncompleteResearch(): GameResearch[] {
  const state = gamestate();
  return getEntriesByType<GameResearch>('research').filter(
    (entry) =>
      (isUndefined(state.researchProgress[entry.id]) ||
        state.researchProgress[entry.id] < entry.researchRequired) &&
      (entry.requiresResearchIds ?? []).every((req) => isResearchComplete(req)),
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
    (r) => (r as GameResearch).unlocksArchetypeIds,
  ) as GameResearch[];

  return sortBy(
    validResearch
      .map((r) => r.unlocksArchetypeIds ?? [])
      .flat()
      .map((aId) => getEntry<GameArchetype>(aId))
      .filter(Boolean),
    'name',
  ) as GameArchetype[];
}

export function allUnlockedDamageTypes(): GameDamageType[] {
  const validResearch = allCompletedResearch().filter(
    (r) => (r as GameResearch).unlocksDamageTypeIds,
  ) as GameResearch[];

  return sortBy(
    validResearch
      .map((r) => r.unlocksDamageTypeIds ?? [])
      .flat()
      .map((dId) => getEntry<GameDamageType>(dId))
      .filter(Boolean),
    'name',
  ) as GameDamageType[];
}

export function allUnlockedTasks(): GameTask[] {
  const validResearch = allCompletedResearch().filter(
    (r) => (r as GameResearch).unlocksTaskIds,
  ) as GameResearch[];

  return sortBy(
    validResearch
      .map((r) => r.unlocksTaskIds ?? [])
      .flat()
      .map((tId) => getEntry<GameTask>(tId))
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

export function allUnlockedClickXpResearch(): GameResearch[] {
  const validResearch = allCompletedResearch().filter(
    (r) => (r as GameResearch).unlocksClickXpBonus,
  ) as GameResearch[];

  return sortBy(validResearch, 'name') as GameResearch[];
}

export function allUnlockedStatBoostResearchValue(stat: GameHeroStat): number {
  const validResearch = allCompletedResearch().filter(
    (r) => (r as GameResearch).unlockRecruitStatBonus === stat,
  ) as GameResearch[];

  return sum(validResearch.map((r) => r.unlockRecruitStatBonusValue ?? 0));
}

export function allUnlockedFusionStatBoostResearchValue(
  stat: GameHeroStat,
): number {
  const validResearch = allCompletedResearch().filter(
    (r) => (r as GameResearch).unlockFusionStatBonus === stat,
  ) as GameResearch[];

  return sum(validResearch.map((r) => r.unlockFusionStatBonusValue ?? 0));
}

export function allUnlockedFusionMaxTaskLevelResearchValue(): number {
  const validResearch = allCompletedResearch().filter(
    (r) => (r as GameResearch).unlockFusionTaskLevelRetain,
  ) as GameResearch[];

  return sum(validResearch.map((r) => r.unlockFusionTaskLevelRetain ?? 0));
}

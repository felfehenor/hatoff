import { isUndefined, sortBy, sum } from 'lodash';
import {
  GameArchetype,
  GameDamageType,
  GameHeroStat,
  GameItem,
  GameResearch,
  GameTask,
} from '../interfaces';
import { getEntriesByType, getEntry } from './content';
import { gamestate, updateGamestate } from './gamestate';
import { hasUnlockedLootItem } from './loot';

export function setActiveResearch(research: GameResearch): void {
  updateGamestate((state) => {
    state.activeResearch = research.id;
    return state;
  });
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
      (entry.requiresResearchIds ?? []).every((req) =>
        isResearchComplete(req),
      ) &&
      (entry.requiresLootIds ?? []).every((loot) => hasUnlockedLootItem(loot)),
  );
}

export function allCompletedResearch(): GameResearch[] {
  return getEntriesByType<GameResearch>('research').filter((entry) =>
    isResearchComplete(entry.id),
  );
}

export function totalCompletedResearch(): number {
  return allCompletedResearch().filter(
    (f) => f.researchRequired > 0 && isResearchComplete(f.id),
  ).length;
}

export function hasResearchedEnoughFor(research: GameResearch): boolean {
  const req = research.requireResearchCount ?? 0;
  if (req <= 0) return true;

  return totalCompletedResearch() >= req;
}

export function allUnlockedArchetypes(): GameArchetype[] {
  const validResearch = allCompletedResearch().filter(
    (r) => r.unlocksArchetypeIds && hasResearchedEnoughFor(r),
  );

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
    (r) => r.unlocksDamageTypeIds && hasResearchedEnoughFor(r),
  );

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
    (r) => r.unlocksTaskIds && hasResearchedEnoughFor(r),
  );

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
    (r) => r.unlocksPopulation,
  );

  return sortBy(validResearch, 'name') as GameResearch[];
}

export function allUnlockedClickXpResearch(): GameResearch[] {
  const validResearch = allCompletedResearch().filter(
    (r) => r.unlocksClickXpBonus,
  );

  return sortBy(validResearch, 'name') as GameResearch[];
}

export function allUnlockedStatBoostResearchValue(stat: GameHeroStat): number {
  const validResearch = allCompletedResearch().filter(
    (r) => r.unlockRecruitStatBonus === stat,
  );

  return sum(validResearch.map((r) => r.unlockRecruitStatBonusValue ?? 0));
}

export function allUnlockedFusionStatBoostResearchValue(
  stat: GameHeroStat,
): number {
  const validResearch = allCompletedResearch().filter(
    (r) => r.unlockFusionStatBonus === stat,
  );

  return sum(validResearch.map((r) => r.unlockFusionStatBonusValue ?? 0));
}

export function allUnlockedFusionMaxTaskLevelResearchValue(): number {
  const validResearch = allCompletedResearch().filter(
    (r) => r.unlockFusionTaskLevelRetain,
  );

  return sum(validResearch.map((r) => r.unlockFusionTaskLevelRetain ?? 0));
}

export function allUnlockedShopSlotBoosts(): number {
  const validResearch = allCompletedResearch().filter((r) => r.unlockShopSlots);

  return sum(validResearch.map((r) => r.unlockShopSlots ?? 0));
}

export function allUnlockedPetSlotBoosts(): number {
  const validResearch = allCompletedResearch().filter((r) => r.unlockPetSlots);

  return sum(validResearch.map((r) => r.unlockPetSlots ?? 0));
}

export function allUnlockedShopItems(): GameItem[] {
  return getEntriesByType<GameItem>('item').filter((r) =>
    r.requiresResearchIds?.every((r) => isResearchComplete(r)),
  );
}

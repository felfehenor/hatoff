import { signal, Signal, WritableSignal } from '@angular/core';
import { cloneDeep } from 'lodash';
import {
  Content,
  ContentType,
  GameArchetype,
  GameDamageType,
  GameResearch,
  GameTask,
} from '../interfaces';
import { gamestate } from './gamestate';

const _allIdsByName: WritableSignal<Record<string, string>> = signal({});
export const allIdsByName: Signal<Record<string, string>> =
  _allIdsByName.asReadonly();

const _allContentById: WritableSignal<Record<string, Content>> = signal({});
export const allContentById: Signal<Record<string, Content>> =
  _allContentById.asReadonly();

export function setAllIdsByName(state: Record<string, string>): void {
  _allIdsByName.set(cloneDeep(state));
}

export function setAllContentById(state: Record<string, Content>): void {
  _allContentById.set(cloneDeep(state));
}

export function getEntriesByType<T>(type: ContentType): T[] {
  return Object.values(allContentById()).filter(
    (entry) => entry.__type === type,
  ) as T[];
}

export function getEntry<T extends Content>(
  entryIdOrName: string,
): T | undefined {
  const idHash = allIdsByName();
  const entriesHash = allContentById();

  if (idHash[entryIdOrName]) {
    return entriesHash[idHash[entryIdOrName]] as T;
  }

  return entriesHash[entryIdOrName] as T;
}

export function allCompletedResearch(): Content[] {
  const state = gamestate();
  return getEntriesByType<GameResearch>('research').filter(
    (entry) => state.researchProgress[entry.id] >= entry.researchRequired,
  );
}

export function allUnlockedArchetypes(): GameArchetype[] {
  const validResearch = allCompletedResearch().filter(
    (r) => (r as GameResearch).unlocksArchetypeId,
  ) as GameResearch[];

  return validResearch
    .map((r) => getEntry<GameArchetype>(r.unlocksArchetypeId!))
    .filter(Boolean) as GameArchetype[];
}

export function allUnlockedDamageTypes(): GameDamageType[] {
  const validResearch = allCompletedResearch().filter(
    (r) => (r as GameResearch).unlocksDamageTypeId,
  ) as GameResearch[];

  return validResearch
    .map((r) => getEntry<GameDamageType>(r.unlocksDamageTypeId!))
    .filter(Boolean) as GameDamageType[];
}

export function allUnlockedTasks(): GameTask[] {
  const validResearch = allCompletedResearch().filter(
    (r) => (r as GameResearch).unlocksTaskId,
  ) as GameResearch[];

  return validResearch
    .map((r) => getEntry<GameTask>(r.unlocksArchetypeId!))
    .filter(Boolean) as GameTask[];
}

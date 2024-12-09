import { signal, Signal, WritableSignal } from '@angular/core';
import { cloneDeep } from 'lodash';
import {
  Content,
  ContentType,
  GameResearch,
  HeroArt,
  ResearchableContent,
  ResearchableContentType,
} from '../interfaces';

const _art: WritableSignal<HeroArt> = signal({
  ear: {},
  eye: {},
  hair: {},
  facialhair: {},
  horn: {},
  makeup: {},
  mask: {},
  outfit: {},
  wing: {},
});
export const allArt: Signal<HeroArt> = _art.asReadonly();

const _allIdsByName: WritableSignal<Record<string, string>> = signal({});
export const allIdsByName: Signal<Record<string, string>> =
  _allIdsByName.asReadonly();

const _allContentById: WritableSignal<Record<string, Content>> = signal({});
export const allContentById: Signal<Record<string, Content>> =
  _allContentById.asReadonly();

export function setArt(art: HeroArt): void {
  _art.set(art);
}

export function setAllIdsByName(state: Record<string, string>): void {
  _allIdsByName.set(cloneDeep(state));
}

export function setAllContentById(state: Record<string, Content>): void {
  _allContentById.set(cloneDeep(state));
}

export function getResearchableEntriesByType<T extends ResearchableContent>(
  type: ResearchableContentType,
): T[] {
  const research = getEntriesByType<GameResearch>('research')
    .flatMap((r) => [
      r.unlocksArchetypeIds ?? [],
      r.unlocksDamageTypeIds ?? [],
      r.unlocksTaskIds ?? [],
    ])
    .flat();

  return getEntriesByType<T>(type).filter((t) => research.includes(t.id));
}

export function getEntriesByType<T>(type: ContentType): T[] {
  return Object.values(allContentById()).filter(
    (entry) => entry.__type === type,
  ) as T[];
}

export function getEntry<T extends Content>(
  entryIdOrName: string,
): T | undefined {
  if (!entryIdOrName) return undefined;

  const idHash = allIdsByName();
  const entriesHash = allContentById();

  let ret: T = entriesHash[entryIdOrName] as T;

  if (idHash[entryIdOrName]) {
    ret = entriesHash[idHash[entryIdOrName]] as T;
  }

  return ret;
}

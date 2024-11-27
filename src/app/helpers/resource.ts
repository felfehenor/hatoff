import { GameResource } from '../interfaces';
import { getEntry } from './content';
import { gamestate, updateGamestate } from './gamestate';

export function getResourceValue(idOrName: string): number {
  const id = getEntry<GameResource>(idOrName)?.id;
  if (!id) return 0;

  return gamestate().resources[id] ?? 0;
}

export function hasResource(resource: GameResource, value = 1): boolean {
  const state = gamestate();
  return (state.resources[resource.id] ?? 0) >= value;
}

export function gainResource(resource: GameResource, value = 1): void {
  updateGamestate((state) => {
    state.resources[resource.id] ??= 0;
    state.resources[resource.id] += value;

    return state;
  });
}

export function loseResource(resource: GameResource, value = 1): void {
  gainResource(resource, -value);
}

export function zeroResource(resource: GameResource) {
  updateGamestate((state) => {
    state.resources[resource.id] = 0;

    return state;
  });
}

import { GameResource } from '../interfaces';
import { getEntry } from './content';
import { gamestate } from './gamestate';

export function getResourceValue(idOrName: string): number {
  const id = getEntry<GameResource>(idOrName)?.id;
  if (!id) return 0;

  return gamestate().resources[id] ?? 0;
}

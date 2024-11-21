import { gamestate } from './gamestate';

export function hasUnlockedLootItem(id: string): boolean {
  return !!gamestate().foundLoot[id];
}

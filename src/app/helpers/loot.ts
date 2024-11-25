import { GameLoot } from '../interfaces';
import { getEntry } from './content';
import { gamestate, updateGamestate } from './gamestate';

export function hasUnlockedLootItem(id: string): boolean {
  return !!gamestate().foundLoot[id];
}

export function gainLootItemById(id: string, quantity = 1): void {
  updateGamestate((state) => {
    const lootItem = getEntry<GameLoot>(id);
    if (lootItem?.__type !== 'loot') return state;

    state.foundLoot[id] ??= 0;
    state.foundLoot[id] += quantity;
    return state;
  });
}

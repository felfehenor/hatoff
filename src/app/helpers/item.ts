import { GameItem } from '../interfaces';
import { getEntry } from './content';
import { updateGamestate } from './gamestate';

export function gainItemById(itemId: string, quantity = 1): void {
  updateGamestate((state) => {
    const lootItem = getEntry<GameItem>(itemId);
    if (lootItem?.__type !== 'item') return state;

    state.shop.ownedItems[itemId] ??= 0;
    state.shop.ownedItems[itemId] += quantity;
    return state;
  });
}

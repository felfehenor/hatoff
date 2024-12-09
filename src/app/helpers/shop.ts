import { sample } from 'lodash';
import { GameItem, GameResource } from '../interfaces';
import { getEntry } from './content';
import { cooldown } from './cooldown';
import { gamestate, setGameState, updateGamestate } from './gamestate';
import { gainItemById } from './item';
import { notifyError } from './notify';
import {
  allUnlockedShopItems,
  allUnlockedShopSlotBoosts,
  isResearchComplete,
} from './research';
import { hasResource, loseResource } from './resource';

export function setShopResetTime(): void {
  updateGamestate((state) => {
    state.cooldowns.nextShopResetTime = cooldown('nextShopResetTime');
    return state;
  });
}

export function resetShopRerolls(): void {
  updateGamestate((state) => {
    state.shop.numRerolls = 0;
    return state;
  });
}

export function maxShopSlots(): number {
  return allUnlockedShopSlotBoosts();
}

export function addShopItemToInventory(item: GameItem, index: number): void {
  gainItemById(item.id, 1);

  updateGamestate((state) => {
    state.shop.shopItems[index] = undefined;
    return state;
  });
}

export function generateShop() {
  const unlockedItems = allUnlockedShopItems();
  const maxSlots = maxShopSlots();

  const shopItems: GameItem[] = [];

  for (let i = 0; i < maxSlots; i++) {
    const chosenItem = sample(unlockedItems)!;
    shopItems.push(chosenItem);
  }

  updateGamestate((state) => {
    state.shop.shopItems = shopItems.map((i) => i.id);
    return state;
  });
}

export function buyItem(item: GameItem, index: number): void {
  const resource = getEntry<GameResource>('Gold');
  if (!resource) return;

  const currentItem = gamestate().shop.shopItems[index];
  if (!currentItem || currentItem !== item.id) {
    notifyError('That item is not currently available, try again!');
    return;
  }

  loseResource(resource, item.cost);
  addShopItemToInventory(item, index);
}

export function doShopReroll(): void {
  const resource = getEntry<GameResource>('Gold');
  if (!resource) return;

  generateShop();
  loseResource(resource, rerollShopCost());

  const state = gamestate();
  state.shop.numRerolls += 1;
  setGameState(state);
}

export function canBuyItemFromShop(item: GameItem): boolean {
  const resource = getEntry<GameResource>('Gold');
  if (!resource) return false;

  return (
    isResearchComplete('Shopping Trip') && hasResource(resource, item.cost)
  );
}

export function canRerollShop(): boolean {
  const resource = getEntry<GameResource>('Gold');
  if (!resource) return false;

  return hasResource(resource, rerollShopCost());
}

export function rerollShopCost(): number {
  const numRerolls = gamestate().shop.numRerolls ?? 0;
  if (numRerolls === 0) return 0;

  const totalRerolls = 1 + numRerolls;
  return Math.floor(Math.pow(totalRerolls, 2.2)) * 50;
}

import { sample, sum } from 'lodash';
import { GameHero, GameItem, GameResource } from '../interfaces';
import { getEntry } from './content';
import { cooldown } from './cooldown';
import { gamestate, setGameState, updateGamestate } from './gamestate';
import {
  gainXp,
  pickRandomArchetypes,
  pickRandomDamageType,
  reviveHero,
} from './hero';
import { gainItemById } from './item';
import { notify, notifyError } from './notify';
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

export function hasAnyitemsToUse(): boolean {
  const state = gamestate();
  return sum(Object.values(state.shop.ownedItems ?? {})) > 0;
}

export function useItemOnHero(hero: GameHero, item: GameItem): void {
  if (gamestate().shop.ownedItems[item.id] <= 0) return;

  const xpGained = item.giveXp ?? 0;
  if (xpGained > 0) {
    notify(`Gave ${hero.name} +${xpGained} XP!`, 'Item');
    gainXp(hero, xpGained);
  }

  const statValue = item.giveStatValue ?? 0;
  if (item.giveStat && statValue > 0) {
    updateGamestate((state) => {
      state.heroes[hero.id].stats[item.giveStat!] += statValue;
      notify(`Gave ${hero.name} +${statValue} ${item.giveStat}!`, 'Item');
      return state;
    });
  }

  if (item.reviveHero) {
    reviveHero(hero);
    notify(`Revived ${hero.name}!`, 'Item');
  }

  if (item.pickRandomArchetypes) {
    pickRandomArchetypes(hero);
    notify(`Shuffled archetypes for ${hero.name}!`, 'Item');
  }

  if (item.pickRandomDamageType) {
    pickRandomDamageType(hero);
    notify(`Shuffled damage type for ${hero.name}!`, 'Item');
  }

  updateGamestate((state) => {
    state.shop.ownedItems[item.id] -= 1;
    return state;
  });
}

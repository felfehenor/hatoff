import { sum } from 'lodash';
import { GameBuff, GameHero, GameItem } from '../interfaces';
import { heroInjuries, heroRemoveRandomInjury } from './attribute';
import { addHeroBuff } from './buff';
import { getEntry } from './content';
import { gamestate, updateGamestate } from './gamestate';
import { reviveHero } from './hero';
import { pickRandomArchetypes, pickRandomDamageType } from './hero-randomizers';
import { gainXp, isMaxLevel } from './hero-xp';
import { notify, notifyError } from './notify';

export function gainItemById(itemId: string, quantity = 1): void {
  updateGamestate((state) => {
    const lootItem = getEntry<GameItem>(itemId);
    if (lootItem?.__type !== 'item') return state;

    state.shop.ownedItems[itemId] ??= 0;
    state.shop.ownedItems[itemId] += quantity;
    return state;
  });
}

export function hasAnyitemsToUse(): boolean {
  const state = gamestate();
  return sum(Object.values(state.shop.ownedItems ?? {})) > 0;
}

export function useItemOnHero(hero: GameHero, item: GameItem): void {
  if (gamestate().shop.ownedItems[item.id] <= 0) return;

  const xpGained = item.giveXp ?? 0;
  if (xpGained > 0) {
    if (isMaxLevel(hero)) {
      notifyError('This hero cannot gain XP!');
      return;
    }

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

  if (item.applyBuffId) {
    const buff = getEntry<GameBuff>(item.applyBuffId);
    if (buff) {
      addHeroBuff(hero, buff);
      notify(`Gave ${buff.name} to ${hero.name}!`, 'Item');
    }
  }

  if (item.canClearRandomInjury) {
    const injuries = heroInjuries(hero);
    if (injuries.length === 0) {
      notifyError('This hero is not injured!');
      return;
    }

    heroRemoveRandomInjury(hero);
  }

  updateGamestate((state) => {
    state.shop.ownedItems[item.id] -= 1;
    return state;
  });
}

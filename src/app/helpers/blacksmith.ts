import { maxBy, sample, sampleSize } from 'lodash';
import {
  EquipmentRarity,
  GameEquipment,
  GameHero,
  GameHeroStat,
  GameResource,
} from '../interfaces';
import { getEntry } from './content';
import { blankHeroStats, getTotalHeroLevel } from './hero';
import { hasResource } from './resource';
import { randomNumber, uniqueId } from './rng';

export function blacksmithRollCostFor(hero: GameHero): number {
  return hero.fusionLevel + 1;
}

export function itemScore(item: GameEquipment): number {
  return (
    item.statBoosts.health +
    item.statBoosts.force * 5 +
    item.statBoosts.progress * 2 +
    item.statBoosts.resistance * 3 +
    item.statBoosts.speed * 7
  );
}

export function primaryItemStat(item: GameEquipment): GameHeroStat {
  return maxBy(
    Object.keys(item.statBoosts ?? {}),
    (s) =>
      item.statBoosts[s as GameHeroStat] /
      chooseItemStatBoost(s as GameHeroStat),
  ) as GameHeroStat;
}

export function chooseItemIcon(item: GameEquipment): string {
  const stats: Record<GameHeroStat, string> = {
    force: 'gameGladius',
    health: 'gameChestArmor',
    piety: 'gameFireflake',
    progress: 'gameSpanner',
    resistance: 'gameDragonShield',
    speed: 'gameBoots',
  };

  return stats[primaryItemStat(item)];
}

export function chooseItemName(item: GameEquipment): string {
  const stats: Record<GameHeroStat, string> = {
    force: 'Sword',
    health: 'Armor',
    piety: 'Holiness',
    progress: 'Wrench',
    resistance: 'Shield',
    speed: 'Boots',
  };

  return stats[primaryItemStat(item)];
}

export function chooseItemStatBoost(stat: GameHeroStat): number {
  const stats: Record<GameHeroStat, number> = {
    force: 1,
    health: 5,
    piety: 0,
    progress: 1,
    resistance: 1,
    speed: 1,
  };

  return stats[stat] ?? 0;
}

export function chooseItemRarity(): EquipmentRarity {
  const num = randomNumber(100);
  if (num < 0.5) return 'artifact';
  if (num < 1.5) return 'mythical';
  if (num < 15) return 'rare';
  if (num < 50) return 'uncommon';
  return 'common';
}

export function itemRarityMultiplier(rarity: EquipmentRarity): number {
  const mults: Record<EquipmentRarity, number> = {
    artifact: 5,
    mythical: 3,
    rare: 1,
    uncommon: 0.5,
    common: 0.25,
  };

  return mults[rarity];
}

export function itemMaxStatsForRarity(rarity: EquipmentRarity): number {
  const mults: Record<EquipmentRarity, number> = {
    artifact: 5,
    mythical: 4,
    rare: 3,
    uncommon: 2,
    common: 1,
  };

  return mults[rarity];
}

export function getItemCost(item: GameEquipment): Record<string, number> {
  const baseMult =
    itemMaxStatsForRarity(item.rarity) * (item.fusionLevel + 1) * 100;
  return {
    [getEntry('Wood')!.id]:
      baseMult * (item.statBoosts.force + item.statBoosts.health),
    [getEntry('Stone')!.id]:
      baseMult * (item.statBoosts.progress + item.statBoosts.resistance),
    [getEntry('Gold')!.id]: baseMult * item.statBoosts.speed,
  };
}

export function chooseItemStatsBasedOnRarity(
  rarity: EquipmentRarity,
  totalLevel: number,
): Record<GameHeroStat, number> {
  const stats = blankHeroStats();

  const totalStatBoosts = (itemRarityMultiplier(rarity) * totalLevel) / 10;

  const validStats = sampleSize(
    ['health', 'force', 'progress', 'resistance', 'speed'] as GameHeroStat[],
    itemMaxStatsForRarity(rarity),
  );

  for (let i = 0; i < totalStatBoosts; i++) {
    const statBoost = sample(validStats);

    stats[statBoost as GameHeroStat] += chooseItemStatBoost(
      statBoost as GameHeroStat,
    );
  }

  return stats;
}

export function createBlacksmithItemFor(hero: GameHero): GameEquipment {
  const rarity = chooseItemRarity();
  const totalLevel = getTotalHeroLevel(hero);

  const item = {
    id: uniqueId(),
    name: '',
    rarity,
    damageTypeId: hero.damageTypeId,
    icon: '',
    fusionLevel: hero.fusionLevel,
    totalLevel,
    statBoosts: chooseItemStatsBasedOnRarity(rarity, totalLevel),
  };

  item.name = chooseItemName(item);
  item.icon = chooseItemIcon(item);

  return item;
}

export function canRollForItem(hero: GameHero): boolean {
  return hasResource(
    getEntry<GameResource>('Metal Tools')!,
    blacksmithRollCostFor(hero),
  );
}

export function canBuyItem(item: GameEquipment): boolean {
  const cost = getItemCost(item);
  return Object.keys(cost).every((rId) =>
    hasResource(getEntry<GameResource>(rId)!, cost[rId]),
  );
}

export function rarityColor(rarity: EquipmentRarity): string {
  const rarityColors: Record<EquipmentRarity, string> = {
    common: '#e5e5d7',
    uncommon: '#0d610d',
    rare: '#2e31cd',
    mythical: '#75037c',
    artifact: '#b67646',
  };

  return rarityColors[rarity];
}

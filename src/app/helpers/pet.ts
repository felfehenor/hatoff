import { sample, sortBy, sum, uniq } from 'lodash';
import {
  GameHero,
  GameLoot,
  GameResource,
  PetRole,
  PetStat,
} from '../interfaces';
import { gamestate, updateGamestate } from './gamestate';

import { species } from 'fantastical';
import { getEntry } from './content';
import { allHeroes, getTotalHeroLevel, isMainHero, removeHero } from './hero';
import { allUnlockedPetSlotBoosts } from './research';
import { hasResource, loseResource } from './resource';

export function ensurePetName(): void {
  if (gamestate().pet.name) return;

  updateGamestate((state) => {
    state.pet.name = species.fairy(sample(['male', 'female']));
    return state;
  });
}

export function setPetRole(role: PetRole): void {
  updateGamestate((state) => {
    state.pet.role = role;
    return state;
  });
}

export function renamePet(newName: string): void {
  updateGamestate((state) => {
    state.pet.name = newName;
    return state;
  });
}

export function isPetPet(): boolean {
  return gamestate().cooldowns.nextPetPetTime > 0;
}

export function petPet(): void {
  updateGamestate((state) => {
    state.cooldowns.nextPetPetTime = 900;
    return state;
  });
}

export function getPetLevel(): number {
  return 1 + Math.floor(gamestate().pet.fedLevels / 100);
}

export function getPetXPToNextLevel(): number {
  return gamestate().pet.fedLevels % 100;
}

export function getPetStatMax(): number {
  return getPetLevel() * 3;
}

export function getPetStatBoughtTimes(stat: PetStat): number {
  return gamestate().pet.statsGained[stat] ?? 0;
}

export function getPetStat(stat: PetStat): number {
  const baseStatValue = 1 + getPetStatBoughtTimes(stat);

  return petStatBoost(stat) + petMultiplierForStat(stat) * baseStatValue;
}

export function petMultiplierForStat(stat: PetStat): number {
  switch (stat) {
    case 'force':
      return 1;
    case 'progress':
      return 1;
    case 'resistance':
      return 1;
    case 'speed':
      return 1;
  }
}

export function costMultiplierForStat(stat: PetStat): number {
  switch (stat) {
    case 'force':
      return 5;
    case 'progress':
      return 1;
    case 'resistance':
      return 7;
    case 'speed':
      return 10;
  }
}

export function petItemStatBoost(stat: PetStat): number {
  return sum(
    gamestate().pet.equippedRelics.map(
      (relic) => getEntry<GameLoot>(relic)?.statBoosts?.[stat] ?? 0,
    ),
  );
}

export function petStatBoost(stat: PetStat): number {
  const statValue = isPetPet() ? 1 + getPetStatBoughtTimes(stat) : 0;
  const itemStatValue = petItemStatBoost(stat);
  return petMultiplierForStat(stat) * (statValue + itemStatValue);
}

export function resourceToBuyPetStat(stat: PetStat): GameResource {
  switch (stat) {
    case 'force':
      return getEntry<GameResource>('Stone')!;
    case 'progress':
      return getEntry<GameResource>('Food')!;
    case 'resistance':
      return getEntry<GameResource>('Wood')!;
    case 'speed':
      return getEntry<GameResource>('Gold')!;
  }
}

export function getPetStatCost(stat: PetStat): number {
  return (
    costMultiplierForStat(stat) *
    (10000 + gamestate().pet.statsGained[stat] * 1000)
  );
}

export function canBuyPetStat(stat: PetStat): boolean {
  return (
    hasResource(resourceToBuyPetStat(stat), getPetStatCost(stat)) &&
    getPetStatBoughtTimes(stat) < getPetStatMax()
  );
}

export function buyPetStat(stat: PetStat): void {
  const resource = resourceToBuyPetStat(stat);
  const cost = getPetStatCost(stat);
  loseResource(resource, cost);
  updateGamestate((state) => {
    state.pet.fedResources[resource.id] ??= 0;
    state.pet.fedResources[resource.id] += cost;
    state.pet.statsGained[stat] ??= 0;
    state.pet.statsGained[stat] += 1;
    return state;
  });
}

export function feedablePetHeroes(): GameHero[] {
  return allHeroes().filter(
    (f) => !gamestate().taskAssignments[f.id] && !isMainHero(f),
  );
}

export function heroPetXp(hero: GameHero): number {
  return getTotalHeroLevel(hero) * (hero.fusionLevel + 1);
}

export function feedHeroToPet(hero: GameHero): void {
  removeHero(hero);

  updateGamestate((state) => {
    state.pet.fedFusionLevels += hero.fusionLevel;
    state.pet.fedLevels += heroPetXp(hero);
    return state;
  });
}

export function petEquippableRelics(): GameLoot[] {
  return sortBy(
    Object.keys(gamestate().foundLoot ?? {})
      .map((k) => getEntry<GameLoot>(k))
      .filter(Boolean),
    [
      (loot) => !gamestate().pet.equippedRelics.includes(loot!.id),
      (loot) => loot!.name,
    ],
  ) as GameLoot[];
}

export function canEquipMoreRelics(): boolean {
  return gamestate().pet.equippedRelics.length < allUnlockedPetSlotBoosts();
}

export function equipRelic(relic: GameLoot): void {
  updateGamestate((state) => {
    state.pet.equippedRelics = uniq([...state.pet.equippedRelics, relic.id]);
    return state;
  });
}

export function unequipRelic(relic: GameLoot): void {
  updateGamestate((state) => {
    state.pet.equippedRelics = state.pet.equippedRelics.filter(
      (r) => r !== relic.id,
    );
    return state;
  });
}

export function getPetExplorerStatBonus(stat: PetStat): number {
  if (gamestate().pet.role !== 'companion') return 0;

  return petStatBoost(stat);
}

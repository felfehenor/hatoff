import { sum } from 'lodash';
import {
  EquipmentSlot,
  GameEquipment,
  GameHero,
  GameHeroStat,
} from '../interfaces';
import { updateGamestate } from './gamestate';

export function getEquipmentStat(hero: GameHero, stat: GameHeroStat): number {
  return sum(
    Object.values(hero.equipment ?? {})
      .filter(Boolean)
      .map((i) => i?.statBoosts?.[stat] ?? 0),
  );
}

export function equipItemToHero(
  hero: GameHero,
  item: GameEquipment,
  slot: EquipmentSlot,
) {
  updateGamestate((state) => {
    const heroRef = state.heroes[hero.id];
    if (!heroRef) return state;

    heroRef.equipment ??= { primary: undefined };
    heroRef.equipment[slot] = item;

    return state;
  });
}

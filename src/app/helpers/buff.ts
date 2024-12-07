import { sum } from 'lodash';
import { GameBuff, GameCombatant, GameHeroStat } from '../interfaces';
import { getEntry } from './content';
import { updateGamestate } from './gamestate';

export function addHeroBuff(hero: GameCombatant, buff: GameBuff): void {
  if (hasBuffInCategory(hero, buff) && !buff.canStack) {
    buffsInCategory(hero, buff).forEach((delBuff) => {
      removeHeroBuff(hero, delBuff);
    });
  }

  updateGamestate((state) => {
    const heroRef = state.heroes[hero.id];

    heroRef.buffIds ??= [];
    heroRef.buffTicks ??= {};

    heroRef.buffIds.push(buff.id);
    heroRef.buffTicks[buff.id] = buff.duration;
    return state;
  });
}

export function removeHeroBuff(hero: GameCombatant, buff: GameBuff): void {
  updateGamestate((state) => {
    const heroRef = state.heroes[hero.id];
    heroRef.buffIds = heroRef.buffIds.filter((b) => b !== buff.id);
    delete heroRef.buffTicks[buff.id];
    return state;
  });
}

export function buffsInCategory(
  hero: GameCombatant,
  buff: GameBuff,
): GameBuff[] {
  return allHeroBuffs(hero).filter((b) => b.category === buff.category);
}

export function hasBuffInCategory(
  hero: GameCombatant,
  buff: GameBuff,
): boolean {
  return buffsInCategory(hero, buff).length > 0;
}

export function allHeroBuffs(hero: GameCombatant): GameBuff[] {
  return (hero.buffIds ?? [])
    .map((b) => getEntry<GameBuff>(b))
    .filter(Boolean) as GameBuff[];
}

export function tickBuffs(hero: GameCombatant): void {
  const buffsToRemove: string[] = [];

  updateGamestate((state) => {
    const heroRef = state.heroes[hero.id];

    (heroRef.buffIds ?? []).forEach((buffId) => {
      heroRef.buffTicks[buffId] -= 1;
      if (heroRef.buffTicks[buffId] <= 0) {
        buffsToRemove.push(buffId);
      }
    });

    return state;
  });

  buffsToRemove.forEach((buff) => {
    removeHeroBuff(hero, getEntry<GameBuff>(buff)!);
  });
}

export function totalStatBuff(hero: GameCombatant, stat: GameHeroStat): number {
  return sum(
    allHeroBuffs(hero).flatMap((b) =>
      b.statBoosts.filter((bs) => bs.stat === stat).map((bs) => bs.value),
    ),
  );
}

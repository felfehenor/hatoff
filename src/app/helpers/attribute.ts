import { sample, uniq } from 'lodash';
import { GameAttribute, GameHero } from '../interfaces';
import { getEntriesByType, getEntry } from './content';
import { isEasyMode, isHardMode } from './difficulty';
import { updateGamestate } from './gamestate';

export function heroGainAttribute(
  hero: GameHero,
  attribute: GameAttribute,
): void {
  if (isEasyMode() && isInjury(attribute)) return;

  updateGamestate((state) => {
    const heroRef = state.heroes[hero.id];
    heroRef.attributeIds ??= [];
    heroRef.attributeIds = uniq([...heroRef.attributeIds, attribute.id]);
    return state;
  });
}

export function heroRemoveAttribute(
  hero: GameHero,
  attribute: GameAttribute,
): void {
  updateGamestate((state) => {
    const heroRef = state.heroes[hero.id];
    heroRef.attributeIds = heroRef.attributeIds.filter(
      (f) => f !== attribute.id,
    );
    return state;
  });
}

export function heroHasAttribute(
  hero: GameHero,
  attribute: GameAttribute,
): boolean {
  return hero.attributeIds.includes(attribute.id);
}

export function isInjury(attribute: GameAttribute): boolean {
  return (
    (attribute.modifyStatPercent ?? 0) < 0 ||
    (attribute.modifyStatValue ?? 0) < 0
  );
}

export function heroInjuries(hero: GameHero): GameAttribute[] {
  return (hero.attributeIds ?? [])
    .map((a) => getEntry<GameAttribute>(a)!)
    .filter(Boolean)
    .filter((a) => isInjury(a));
}

export function heroGainRandomInjury(hero: GameHero): void {
  const injuries = getEntriesByType<GameAttribute>('attribute').filter(
    (a) => !(hero.attributeIds ?? []).includes(a.id) && isInjury(a),
  );
  const injury = sample(injuries);
  if (!injury) return;

  heroGainAttribute(hero, injury);
}

export function heroHealFirstInjury(hero: GameHero, ticks = 1): void {
  if (isHardMode()) return;

  const injuries = heroInjuries(hero);
  if (injuries.length === 0) return;

  const injuryToHeal = injuries[0];
  let shouldRemove = false;

  updateGamestate((state) => {
    const heroRef = state.heroes[hero.id];
    heroRef.attributeHealTicks ??= {};
    heroRef.attributeHealTicks[injuryToHeal.id] ??=
      injuryToHeal.timeToHeal ?? 60;
    heroRef.attributeHealTicks[injuryToHeal.id] -= ticks;

    if (heroRef.attributeHealTicks[injuryToHeal.id] <= 0) {
      delete heroRef.attributeHealTicks[injuryToHeal.id];
      shouldRemove = true;
    }

    return state;
  });

  if (shouldRemove) {
    heroRemoveAttribute(hero, injuryToHeal);
  }
}

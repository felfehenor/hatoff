import { sample, sampleSize } from 'lodash';
import { GameArchetype, GameHero } from '../interfaces';
import { getEntry } from './content';
import { updateGamestate } from './gamestate';
import { allUnlockedArchetypes, allUnlockedDamageTypes } from './research';

export function pickRandomArchetypes(hero: GameHero): void {
  updateGamestate((state) => {
    const heroRef = state.heroes[hero.id];
    const numArchetypes = heroRef.archetypeIds.length;

    const protagonistId = getEntry<GameArchetype>('Protagonist')!.id;
    const hasProtagonist = heroRef.archetypeIds.includes(protagonistId);

    const numArchetypesToGet = hasProtagonist
      ? numArchetypes - 1
      : numArchetypes;

    const unlockedArchetypes = allUnlockedArchetypes();
    const newArchetypes = sampleSize(
      unlockedArchetypes,
      numArchetypesToGet,
    ).map((i) => i.id);

    if (hasProtagonist) {
      newArchetypes.unshift(protagonistId);
    }

    heroRef.archetypeIds = newArchetypes;

    return state;
  });
}

export function pickRandomDamageType(hero: GameHero): void {
  updateGamestate((state) => {
    const heroRef = state.heroes[hero.id];

    const unlockedDamageTypes = allUnlockedDamageTypes();
    const newDamageType = sample(unlockedDamageTypes)!;
    heroRef.damageTypeId = newDamageType?.id;

    return state;
  });
}

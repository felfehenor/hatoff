import {
  GameArchetype,
  GameDamageType,
  GameHero,
  GameSkill,
} from '../interfaces';
import { getEntry } from './content';
import { canUseDamageTypeForRequirement } from './damagetype';

export function usableSkillsForHero(hero: GameHero): GameSkill[] {
  return allSkillsForHero(hero).filter((f) => {
    if (f.requireDamageTypeId) {
      const damageType = getEntry<GameDamageType>(f.requireDamageTypeId)!;
      const heroType = getEntry<GameDamageType>(hero.damageTypeId)!;
      return canUseDamageTypeForRequirement(damageType, heroType);
    }

    return true;
  });
}

export function allSkillsForHero(hero: GameHero): GameSkill[] {
  return [
    getEntry<GameSkill>('Attack')!,
    ...hero.archetypeIds.map((f) => {
      const archetype = getEntry<GameArchetype>(f);
      if (!archetype) return undefined;

      const skillId = archetype.combatSkillId;
      if (!skillId) return undefined;

      return getEntry<GameSkill>(skillId)!;
    }),
    ...Object.values(hero.equipment ?? {}).map((f) => {
      const skillId = f?.combatSkillId;
      if (!skillId) return undefined;

      return getEntry<GameSkill>(skillId)!;
    }),
  ].filter(Boolean) as GameSkill[];
}

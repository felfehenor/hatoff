import { sum } from 'lodash';
import {
  GameArchetype,
  GameCombatant,
  GameHero,
  GameHeroStat,
  GameResource,
  GameTask,
} from '../interfaces';
import { getEntry } from './content';

export function getArchetypeResourceBonusForHero(
  hero: GameCombatant,
  resource: GameResource,
): number {
  return sum(
    hero.archetypeIds
      .map((arch) => getEntry<GameArchetype>(arch))
      .filter((arch) => arch?.boostGainResourceId === resource.id)
      .map((arch) => arch?.boostGainResourceAmount ?? 0),
  );
}

export function getArchetypeTaskBonusForHero(
  hero: GameCombatant,
  task: GameTask,
): number {
  return sum(
    hero.archetypeIds
      .map((arch) => getEntry<GameArchetype>(arch))
      .filter(
        (arch) =>
          arch?.boostGainTaskId === task.id || arch?.boostGainTaskId === 'Any',
      )
      .map((arch) => arch?.boostGainTaskAmount ?? 0),
  );
}

export function getArchetypeLevelUpStatBonusForHero(
  hero: GameCombatant,
  stat: GameHeroStat,
): number {
  return sum(
    hero.archetypeIds
      .map((arch) => getEntry<GameArchetype>(arch))
      .filter((arch) => arch?.boostLevelupStat === stat)
      .map((arch) => arch?.boostLevelupStatValue ?? 0),
  );
}

export function getArchetypeCombatStatBonusForHero(
  hero: GameCombatant,
  stat: GameHeroStat,
): number {
  return sum(
    hero.archetypeIds
      .map((arch) => getEntry<GameArchetype>(arch))
      .filter((arch) => arch?.boostCombatStat === stat)
      .map((arch) => arch?.boostCombatStatValue ?? 0),
  );
}

export function getArchetypeXpBonusForHero(hero: GameHero): number {
  return sum(
    hero.archetypeIds
      .map((arch) => getEntry<GameArchetype>(arch))
      .map((arch) => arch?.boostXpGain ?? 0),
  );
}

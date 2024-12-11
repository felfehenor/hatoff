import { GameHero, GameHeroStat, GameResource } from '../interfaces';
import { getEntry } from './content';
import { updateGamestate } from './gamestate';
import { hasResource, loseResource } from './resource';

export function getInfusedStat(hero: GameHero, stat: GameHeroStat): number {
  return hero.infusedStats?.[stat] ?? 0;
}

export function maxHeroInfusions(hero: GameHero): number {
  return hero.fusionLevel * 5;
}

export function canInfuseStat(hero: GameHero, stat: GameHeroStat): boolean {
  const mana = getEntry<GameResource>('Mana');
  if (!mana) return false;

  const numInfusions = getInfusedStat(hero, stat);
  return (
    stat !== 'piety' &&
    numInfusions < maxHeroInfusions(hero) &&
    hasResource(mana, infusionCost(stat, numInfusions + 1))
  );
}

export function infusionCost(stat: GameHeroStat, value: number): number {
  if (stat === 'health') return 5 * (value + 1);

  const multiplier = infusionCostMultiplier(stat);
  return 5 ** value * multiplier;
}

export function infusionCostMultiplier(stat: GameHeroStat): number {
  switch (stat) {
    case 'force':
      return 5;
    case 'speed':
      return 10;
    case 'resistance':
      return 7;
    case 'progress':
      return 2;
    default: {
      return 1;
    }
  }
}

export function doInfusion(hero: GameHero, stat: GameHeroStat): void {
  const cost = infusionCost(stat, (hero.infusedStats?.[stat] ?? 0) + 1);
  const mana = getEntry<GameResource>('Mana');
  if (!mana) return;

  loseResource(mana, cost);

  updateGamestate((state) => {
    const heroRef = state.heroes[hero.id];
    if (!heroRef) return state;

    heroRef.infusedStats ??= {
      force: 0,
      health: 0,
      piety: 0,
      progress: 0,
      resistance: 0,
      speed: 0,
    };

    heroRef.infusedStats[stat] += 1;

    return state;
  });
}

export function resetInfusions(hero: GameHero): void {
  updateGamestate((state) => {
    const heroRef = state.heroes[hero.id];
    if (!heroRef) return state;

    heroRef.infusedStats = {
      force: 0,
      health: 0,
      piety: 0,
      progress: 0,
      resistance: 0,
      speed: 0,
    };

    return state;
  });
}

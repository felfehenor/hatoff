import { sample } from 'lodash';
import { GameHero, GameHeroStat } from '../interfaces';
import { getArchetypeLevelUpStatBonusForHero } from './archetype';
import { updateGamestate } from './gamestate';
import { ensureHeroStatMaxes } from './hero-stats';
import { notify } from './notify';
import { getOption } from './options';
import { allUnlockedStatBoostResearchValue } from './research';
import { succeedsChance } from './rng';

export function isMaxLevel(hero: GameHero): boolean {
  return hero.level >= hero.maxLevel;
}

export function maxXpForLevel(level: number, fusionLevel: number): number {
  return level * (50 + fusionLevel ** 3 * 100);
}

export function levelup(hero: GameHero): void {
  function statBoost(val = 1, chance = 50) {
    const baseBoost = Math.floor(chance / 100);
    const remainderChance = chance % 100;

    const shouldGain = succeedsChance(remainderChance);
    if (!shouldGain)
      return baseBoost * getOption('heroLevelUpStatGainMultiplier');

    return (baseBoost + val) * getOption('heroLevelUpStatGainMultiplier');
  }

  const potentialStatBoosts: GameHeroStat[] = [
    'force',
    'piety',
    'progress',
    'resistance',
    'speed',
  ];
  const numGuaranteedStats = 1 + hero.fusionLevel;
  const chosenStats = Array(numGuaranteedStats)
    .fill(0)
    .map(() => sample(potentialStatBoosts) as GameHeroStat);

  const bonusRolls: Record<GameHeroStat, number> = {
    force: getArchetypeLevelUpStatBonusForHero(hero, 'force'),
    health: 0,
    piety: getArchetypeLevelUpStatBonusForHero(hero, 'piety'),
    progress: getArchetypeLevelUpStatBonusForHero(hero, 'progress'),
    resistance: getArchetypeLevelUpStatBonusForHero(hero, 'resistance'),
    speed: getArchetypeLevelUpStatBonusForHero(hero, 'speed'),
  };

  chosenStats.forEach((stat) => {
    bonusRolls[stat] += 85;
  });

  const hpBoost =
    statBoost(5) +
    getArchetypeLevelUpStatBonusForHero(hero, 'health') +
    allUnlockedStatBoostResearchValue('health');
  const forceBoost = statBoost(1, 35 + bonusRolls.force);
  const pietyBoost = statBoost(1, 25 + bonusRolls.piety);
  const progressBoost = statBoost(1, 50 + bonusRolls.progress);
  const resistanceBoost = statBoost(1, 15 + bonusRolls.resistance);
  const speedBoost = statBoost(1, 10 + bonusRolls.speed);

  hero.stats.health += hpBoost;
  hero.stats.force += forceBoost;
  hero.stats.piety += pietyBoost;
  hero.stats.progress += progressBoost;
  hero.stats.resistance += resistanceBoost;
  hero.stats.speed += speedBoost;

  ensureHeroStatMaxes(hero);

  const stats = [
    hpBoost > 0 ? `+${hpBoost} HP` : '',
    forceBoost > 0 ? `+${forceBoost} FRC` : '',
    pietyBoost > 0 ? `+${pietyBoost} PIE` : '',
    progressBoost > 0 ? `+${progressBoost} PRG` : '',
    resistanceBoost > 0 ? `+${resistanceBoost} RES` : '',
    speedBoost > 0 ? `+${speedBoost} SPD` : '',
  ].filter(Boolean);

  notify(
    `Level up: ${hero.name} Lv.${hero.level}! ${stats.join(', ')}`,
    'LevelUp',
  );
}

export function gainXp(hero: GameHero, xp = 1): void {
  updateGamestate((state) => {
    const heroRef = state.heroes[hero.id];
    if (heroRef.level >= heroRef.maxLevel) return state;

    heroRef.xp += xp * getOption('heroXpMultiplier');

    while (heroRef.xp >= heroRef.maxXp) {
      heroRef.xp = heroRef.xp - heroRef.maxXp;
      heroRef.maxXp = maxXpForLevel(heroRef.level + 1, heroRef.fusionLevel);
      heroRef.level += 1;

      levelup(heroRef);

      if (heroRef.level >= heroRef.maxLevel) break;
    }

    return state;
  });
}

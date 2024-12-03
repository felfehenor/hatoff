import { clamp, sample } from 'lodash';
import {
  GameCombat,
  GameCombatant,
  GameDungeonEncounterFight,
  GameHeroStat,
  GameMonster,
} from '../interfaces';
import { getArchetypeCombatStatBonusForHero } from './archetype';
import { getEntry } from './content';
import { gamestate, updateGamestate } from './gamestate';
import { getHero, heroStatValue } from './hero';
import { randomNumber, succeedsChance } from './rng';

export function toCombatant(char: GameCombatant): GameCombatant {
  const newStats: Record<GameHeroStat, number> = {
    force:
      getCombatStat(char, 'force') +
      getArchetypeCombatStatBonusForHero(char, 'force'),
    health:
      getCombatStat(char, 'health') +
      getArchetypeCombatStatBonusForHero(char, 'health'),
    piety:
      getCombatStat(char, 'piety') +
      getArchetypeCombatStatBonusForHero(char, 'piety'),
    progress:
      getCombatStat(char, 'progress') +
      getArchetypeCombatStatBonusForHero(char, 'progress'),
    resistance:
      getCombatStat(char, 'resistance') +
      getArchetypeCombatStatBonusForHero(char, 'resistance'),
    speed:
      getCombatStat(char, 'speed') +
      getArchetypeCombatStatBonusForHero(char, 'speed'),
  };

  return {
    id: char.id ?? '',
    archetypeIds: char.archetypeIds,
    currentHp: newStats.health,
    damageTypeId: char.damageTypeId,
    level: char.level,
    name: char.name,
    stats: newStats,
    attributeIds: char.attributeIds,
  };
}

export function isDeadInCombat(char: GameCombatant): boolean {
  return char.currentHp <= 0;
}

export function generateCombat(
  fightData: GameDungeonEncounterFight,
): GameCombat {
  return {
    attackers: gamestate().exploration.exploringParty,
    defenders: fightData.monsters
      .map((m) => getEntry<GameMonster>(m.monsterId)!)
      .filter(Boolean)
      .map((m) => toCombatant(m)),
  };
}

export function didHeroesWin(): boolean {
  const combat = gamestate().exploration.currentCombat;
  if (!combat) return true;

  return combat.defenders.every((d) => isDeadInCombat(d));
}

export function isCombatResolved(): boolean {
  const fight = gamestate().exploration.currentCombat;
  if (!fight || fight.attackers.length === 0 || fight.defenders.length === 0)
    return true;

  return (
    fight.attackers.every((h) => isDeadInCombat(h)) ||
    fight.defenders.every((h) => isDeadInCombat(h))
  );
}

export function doTeamAction(
  attackers: GameCombatant[],
  defenders: GameCombatant[],
): void {
  attackers
    .filter((d) => !isDeadInCombat(d))
    .forEach((attacker) => {
      const validTargets = defenders.filter((d) => !isDeadInCombat(d));
      const target = sample(validTargets);
      if (!target) return;

      const hitChance = chanceToHit(attacker, target);
      if (!succeedsChance(hitChance)) return;

      const damage = damageDealt(attacker, target);
      target.currentHp -= damage;

      if (target.currentHp <= 0) {
        attemptToDie(target);
      }
    });
}

export function doCombatRound() {
  const fight = gamestate().exploration.currentCombat;
  if (!fight) return;

  if (!isCombatResolved()) {
    doTeamAction(fight.attackers, fight.defenders);
  }

  if (!isCombatResolved()) {
    doTeamAction(fight.defenders, fight.attackers);
  }
}

export function chanceToHit(
  attacker: GameCombatant,
  defender: GameCombatant,
): number {
  // higher than opponent speed = higher chance to hit
  const diff = clamp(
    heroStatValue(attacker, 'speed') - heroStatValue(defender, 'speed'),
    -30,
    15,
  );
  return 80 + diff;
}

export function baseHeroDamage(attacker: GameCombatant): number {
  return heroStatValue(attacker, 'force');
}

export function damageDealt(
  attacker: GameCombatant,
  defender: GameCombatant,
): number {
  return Math.max(
    1,
    Math.floor(baseHeroDamage(attacker) * damageReduction(defender)),
  );
}

export function damageReduction(defender: GameCombatant): number {
  return Math.max(
    0.1,
    0.92 * 0.996 ** heroStatValue(defender, 'resistance') + 0.07,
  );
}

export function attemptToDie(character: GameCombatant): void {
  const pietyRequired = 25 + randomNumber(75);
  if (character.stats.piety >= pietyRequired) {
    character.stats.piety -= pietyRequired;
    character.currentHp = heroStatValue(character, 'health');

    // write it back
    if (character.id) {
      updateGamestate((state) => {
        const ref = getHero(character.id);
        if (!ref) return state;

        ref.stats.piety = character.stats.piety;

        return state;
      });
    }
  }
}

export function getCombatStat(
  character: GameCombatant,
  stat: GameHeroStat,
): number {
  return heroStatValue(character, stat);
}

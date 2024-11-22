import { sample } from 'lodash';
import {
  GameCombat,
  GameCombatant,
  GameDungeonEncounterFight,
  GameMonster,
} from '../interfaces';
import { getEntry } from './content';
import { gamestate } from './gamestate';
import { randomrng } from './rng';

export function toCombatant(char: GameCombatant): GameCombatant {
  return {
    archetypeIds: char.archetypeIds,
    currentHp: char.stats.health,
    damageTypeId: char.damageTypeId,
    level: char.level,
    name: char.name,
    stats: { ...char.stats },
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
      const hitRoll = randomrng()() * 100;
      if (hitRoll > hitChance) return;

      const damage = damageDealt(attacker, target);
      target.currentHp -= damage;

      console.log(
        'attack',
        attacker.name,
        target.name,
        damage,
        attacker.stats.force,
        damageReduction(target),
      );
    });
}

export function doCombatRound() {
  const fight = gamestate().exploration.currentCombat;
  if (!fight) return;

  doTeamAction(fight.attackers, fight.defenders);

  if (!isCombatResolved()) {
    doTeamAction(fight.defenders, fight.attackers);
  }
}

export function chanceToHit(
  attacker: GameCombatant,
  defender: GameCombatant,
): number {
  return 90;
}

export function damageDealt(
  attacker: GameCombatant,
  defender: GameCombatant,
): number {
  return Math.max(
    1,
    Math.floor(attacker.stats.force * damageReduction(defender)),
  );
}

export function damageReduction(defender: GameCombatant): number {
  return Math.max(0.1, 0.92 * 0.996 ** defender.stats.resistance + 0.07);
}

export function attemptToDie(character: GameCombatant): void {}

export function chanceToBeIncapacitated(character: GameCombatant): number {
  return 100;
}

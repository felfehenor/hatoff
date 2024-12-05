import { clamp, sample, sampleSize, sumBy } from 'lodash';
import {
  GameActiveCombatant,
  GameCombat,
  GameCombatant,
  GameDungeonEncounterFight,
  GameHero,
  GameHeroStat,
  GameMonster,
  GameSkill,
} from '../interfaces';
import { getArchetypeCombatStatBonusForHero } from './archetype';
import { getEntry } from './content';
import { gamestate, updateGamestate } from './gamestate';
import { getHero, heroStatValue } from './hero';
import { randomNumber, succeedsChance } from './rng';
import { usableSkillsForHero } from './skill';

export function heroToCombatant(char: GameHero): GameActiveCombatant {
  return toCombatant(char, {
    skillIds: usableSkillsForHero(char).map((s) => s.id),
  });
}

export function monsterToCombatant(monster: GameMonster): GameActiveCombatant {
  return toCombatant(monster, { skillIds: monster.skillIds });
}

export function toCombatant(
  char: GameCombatant,
  extra: Partial<GameActiveCombatant>,
): GameActiveCombatant {
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
    skillIds: [],
    skillCooldowns: {},
    ...extra,
  };
}

export function isDeadInCombat(char: GameActiveCombatant): boolean {
  return char.currentHp <= 0;
}

export function combatLog(message: string): void {
  console.log(message);
}

export function generateCombat(
  fightData: GameDungeonEncounterFight,
): GameCombat {
  return {
    attackers: gamestate().exploration.exploringParty,
    defenders: fightData.monsters
      .map((m) => getEntry<GameMonster>(m.monsterId)!)
      .filter(Boolean)
      .map((m) => monsterToCombatant(m)),
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

export function chooseAttackerSkill(
  attacker: GameActiveCombatant,
): GameSkill | undefined {
  const validSkills = (attacker.skillIds ?? []).filter(
    (f) => attacker.skillCooldowns[f] ?? 0 <= 0,
  );
  const chosenSkill = sample(validSkills);

  return getEntry<GameSkill>(chosenSkill!);
}

export function setSkillCooldown(
  fighter: GameActiveCombatant,
  skill: GameSkill,
): void {
  if (skill.cooldown <= 0) return;

  fighter.skillCooldowns[skill.id] = skill.cooldown;
}

export function validSkillTargets(
  potentialTargets: GameActiveCombatant[],
): GameActiveCombatant[] {
  return potentialTargets.filter((t) => !isDeadInCombat(t));
}

export function chooseSkillTargets(
  targetList: GameActiveCombatant[],
  skill: GameSkill,
): GameActiveCombatant[] {
  const { targets, replace } = skill.targetting;

  const chosenTargets: GameActiveCombatant[] = [];
  if (replace) {
    for (let i = 0; i < targets; i++) {
      chosenTargets.push(sample(targetList)!);
    }
  } else {
    chosenTargets.push(...sampleSize(targetList, targets));
  }

  return chosenTargets.filter(Boolean);
}

export function attackTarget(
  attacker: GameActiveCombatant,
  allies: GameActiveCombatant[],
  enemies: GameActiveCombatant[],
): void {
  const skill = chooseAttackerSkill(attacker);
  if (!skill) return;

  setSkillCooldown(attacker, skill);

  const { type } = skill.targetting;
  const targetList = type === 'ally' ? allies : enemies;

  const validTargets = validSkillTargets(targetList);
  const chosenTargets = chooseSkillTargets(validTargets, skill);

  if (chosenTargets.length === 0) return;

  chosenTargets.forEach((target) => {
    if (isDeadInCombat(target)) return;

    const hitChance = chanceToHit(attacker, target, skill);
    if (!succeedsChance(hitChance)) {
      combatLog(
        `${attacker.name} targetted ${target.name} with ${skill.name} but missed!`,
      );
      return;
    }

    const damage = damageDealt(attacker, target, skill);
    target.currentHp -= damage;

    combatLog(
      `${attacker.name} targetted ${target.name} with ${skill.name} for ${damage} HP!`,
    );

    if (isDeadInCombat(target)) {
      combatLog(`${target.name} was slain by ${attacker.name}!`);
      attemptToDie(target);
    }
  });
}

export function lowerAllCooldowns(fight: GameCombat): void {
  [...fight.attackers, ...fight.defenders].forEach((combatant) => {
    Object.keys(combatant.skillCooldowns ?? {}).forEach((skillKey) => {
      combatant.skillCooldowns[skillKey] -= 1;
    });
  });
}

export function doTeamAction(
  attackers: GameActiveCombatant[],
  defenders: GameActiveCombatant[],
): void {
  attackers
    .filter((d) => !isDeadInCombat(d))
    .forEach((attacker) => {
      attackTarget(attacker, attackers, defenders);
    });
}

export function doCombatRound() {
  const fight = gamestate().exploration.currentCombat;
  if (!fight) return;

  combatLog('New Combat Round');

  lowerAllCooldowns(fight);

  if (!isCombatResolved()) {
    doTeamAction(fight.attackers, fight.defenders);
  }

  if (!isCombatResolved()) {
    doTeamAction(fight.defenders, fight.attackers);
  }
}

export function chanceToHit(
  attacker: GameActiveCombatant,
  defender: GameActiveCombatant,
  skill: GameSkill,
): number {
  // higher than opponent speed = higher chance to hit
  const diff = clamp(
    heroStatValue(attacker, 'speed') - heroStatValue(defender, 'speed'),
    -30,
    15,
  );
  return skill.accuracy + diff;
}

export function baseHeroDamage(
  attacker: GameActiveCombatant,
  skill: GameSkill,
): number {
  return sumBy(
    skill.scalars.map(
      (s) => heroStatValue(attacker, s.stat) * (s.percent / 100),
    ),
  );
}

export function damageDealt(
  attacker: GameActiveCombatant,
  defender: GameActiveCombatant,
  skill: GameSkill,
): number {
  return Math.max(
    1,
    Math.floor(baseHeroDamage(attacker, skill) * damageReduction(defender)),
  );
}

export function damageReduction(defender: GameActiveCombatant): number {
  return Math.max(
    0.1,
    0.92 * 0.996 ** heroStatValue(defender, 'resistance') + 0.07,
  );
}

export function attemptToDie(character: GameActiveCombatant): void {
  if(!character) return;

  const pietyRequired = 25 + randomNumber(75);
  if (character.stats.piety >= pietyRequired) {
    character.stats.piety -= pietyRequired;
    character.currentHp = heroStatValue(character, 'health');

    combatLog(
      `${character.name} received a heavenly blessing and came back to life!`,
    );

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

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
  PetStat,
} from '../interfaces';
import { getArchetypeCombatStatBonusForHero } from './archetype';
import { getEntry } from './content';
import { heroLoseCombat } from './dungeon';
import { gamestate, updateGamestate } from './gamestate';
import { getHero, heroStatValue } from './hero';
import { getPetExplorerStatBonus } from './pet';
import { randomNumber, succeedsChance } from './rng';
import { usableSkillsForHero } from './skill';

export function heroToCombatant(char: GameHero): GameActiveCombatant {
  return toCombatant(char, {
    skillIds: usableSkillsForHero(char).map((s) => s.id),
  });
}

export function monsterToCombatant(monster: GameMonster): GameActiveCombatant {
  return toCombatant(monster, {
    skillIds: [getEntry<GameSkill>('Attack')?.id, ...monster.skillIds].filter(
      Boolean,
    ) as string[],
  });
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
    buffIds: char.buffIds ?? [],
    skillCooldowns: {},
    ...extra,
  };
}

export function isDeadInCombat(char: GameActiveCombatant): boolean {
  return char.currentHp <= 0;
}

export function combatLog(fight: GameCombat, message: string): void {
  fight.combatMessages?.unshift(message);
}

export function generateCombat(
  fightData: GameDungeonEncounterFight,
): GameCombat {
  const baseCombat: GameCombat = {
    attackers: gamestate().exploration.exploringParty,
    defenders: fightData.monsters
      .map((m) => getEntry<GameMonster>(m.monsterId)!)
      .filter(Boolean)
      .map((m) => monsterToCombatant(m)),
    combatMessages: [],
    rounds: 0,
  };

  const monsterInstances: Record<string, number> = {};
  baseCombat.defenders.forEach((monster) => {
    monsterInstances[monster.name] ??= 0;
    monsterInstances[monster.name] += 1;

    monster.name = `${monster.name} ${String.fromCharCode(
      monsterInstances[monster.name] + 64,
    )}`;
  });

  return baseCombat;
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
    (f) => (attacker.skillCooldowns[f] ?? 0) <= 0,
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

export function applySkillBuffs(
  fight: GameCombat,
  skill: GameSkill,
  target: GameActiveCombatant,
): void {
  const buffIds = skill.applyBuffIds ?? [];
  buffIds.forEach((buff) => {
    target.buffIds ??= [];
    target.buffIds.push(buff);
  });
}

export function attackTarget(
  fight: GameCombat,
  attacker: GameActiveCombatant,
  allies: GameActiveCombatant[],
  enemies: GameActiveCombatant[],
): void {
  const skill = chooseAttackerSkill(attacker);
  if (!skill) {
    combatLog(fight, `${attacker.name} lazes about!`);
    return;
  }

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
        fight,
        `${attacker.name} targetted ${target.name} with ${skill.name} but missed!`,
      );
      return;
    }

    const damage = damageDealt(attacker, target, skill);
    if (damage > 0) {
      target.currentHp -= damage;

      combatLog(
        fight,
        `${attacker.name} targetted ${target.name} with ${
          skill.name
        } for ${Math.abs(damage)} HP!`,
      );
    } else {
      combatLog(
        fight,
        `${attacker.name} targetted ${target.name} with ${skill.name}!`,
      );
    }

    applySkillBuffs(fight, skill, target);

    if (isDeadInCombat(target)) {
      combatLog(fight, `${target.name} was slain by ${attacker.name}!`);
      attemptToDie(fight, target);
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
  fight: GameCombat,
  attackers: GameActiveCombatant[],
  defenders: GameActiveCombatant[],
): void {
  attackers
    .filter((d) => !isDeadInCombat(d))
    .forEach((attacker) => {
      attackTarget(fight, attacker, attackers, defenders);
    });
}

export function doCombatRound() {
  let shouldForceLose = false;

  updateGamestate((state) => {
    const fight = state.exploration.currentCombat;
    if (!fight) return state;

    fight.rounds++;

    if (fight.rounds > 100) {
      combatLog(fight, 'The reaper came...');
      shouldForceLose = true;
      return state;
    }

    combatLog(fight, `Combat Round ${fight.rounds}`);

    lowerAllCooldowns(fight);

    if (!isCombatResolved()) {
      doTeamAction(fight, fight.attackers, fight.defenders);
    }

    if (!isCombatResolved()) {
      doTeamAction(fight, fight.defenders, fight.attackers);
    }

    return state;
  });

  if (shouldForceLose) {
    heroLoseCombat(true);
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
  function getHeroBaseDamage(stat: GameHeroStat): number {
    const baseDamageValue = heroStatValue(attacker, stat);
    if (stat === 'piety' || stat === 'health' || !isCombatantAHero(attacker)) {
      return baseDamageValue;
    }

    return baseDamageValue + getPetExplorerStatBonus(stat as PetStat);
  }

  return sumBy(
    skill.scalars.map((s) => getHeroBaseDamage(s.stat) * (s.percent / 100)),
  );
}

export function damageDealt(
  attacker: GameActiveCombatant,
  defender: GameActiveCombatant,
  skill: GameSkill,
): number {
  return Math.floor(
    baseHeroDamage(attacker, skill) * damageReduction(defender),
  );
}

export function damageReduction(defender: GameActiveCombatant): number {
  return Math.max(
    0.1,
    0.92 * 0.996 ** heroStatValue(defender, 'resistance') + 0.07,
  );
}

export function attemptToDie(
  fight: GameCombat,
  character: GameActiveCombatant,
): void {
  if (!character) return;

  const pietyRequired = 25 + randomNumber(75);
  if (character.stats.piety >= pietyRequired) {
    character.stats.piety -= pietyRequired;
    character.currentHp = heroStatValue(character, 'health');

    combatLog(
      fight,
      `${character.name} received a heavenly blessing and came back to life!`,
    );

    // write it back
    if (isCombatantAHero(character)) {
      updateGamestate((state) => {
        const ref = getHero(character.id);
        if (!ref) return state;

        ref.stats.piety = character.stats.piety;

        return state;
      });
    }
  }
}

export function isCombatantAHero(character: GameCombatant): boolean {
  return character.archetypeIds.length > 0;
}

export function getCombatStat(
  character: GameCombatant,
  stat: GameHeroStat,
): number {
  return heroStatValue(character, stat);
}

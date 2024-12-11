import { sumBy } from 'lodash';
import { v4 as uuid } from 'uuid';
import {
  GameAttribute,
  GameDungeon,
  GameDungeonEncounter,
  GameDungeonEncounterFight,
  GameDungeonEncounterLoot,
  GameDungeonEncounterTreasure,
  GameHero,
  GameItem,
  GameLoot,
  GameMonster,
  GameResource,
  GameTask,
} from '../interfaces';
import { sendDesignEvent } from './analytics';
import {
  heroGainAttribute,
  heroGainRandomInjury,
  heroHasAttribute,
  heroInjuries,
} from './attribute';
import {
  didHeroesWin,
  doCombatRound,
  generateCombat,
  heroToCombatant,
  isCombatResolved,
} from './combat';
import { getEntriesByType, getEntry } from './content';
import { isHardMode } from './difficulty';
import { gamestate, updateGamestate } from './gamestate';
import { gainXp, isStunned, removeHero, stunHero } from './hero';
import { gainItemById } from './item';
import { gainLootItemById, hasUnlockedLootItem } from './loot';
import { notify, notifyError } from './notify';
import { gainResource } from './resource';
import { randomChoice, succeedsChance } from './rng';
import { heroesAllocatedToTask } from './task';

export function setActiveDungeon(dungeon: GameDungeon): void {
  if (isDungeonInProgress()) {
    notifyError('Cannot change dungeons while exploring.');
  }

  updateGamestate((state) => {
    state.activeDungeon = dungeon.id;
    return state;
  });
}

export function currentDungeon(): GameDungeon | undefined {
  return getEntry<GameDungeon>(gamestate().activeDungeon);
}

export function currentDungeonName(): string {
  return currentDungeon()?.name ?? 'Unknown';
}

export function isCurrentDungeon(dungeon: GameDungeon): boolean {
  return gamestate().activeDungeon === dungeon.id;
}

export function isDungeonComplete(id: string): boolean {
  return gamestate().dungeonsCompleted[id] > 0;
}

export function allUnlockedDungeons(): GameDungeon[] {
  return getEntriesByType<GameDungeon>('dungeon').filter((d) =>
    (d.requiresLootIds ?? []).every((lootId) => hasUnlockedLootItem(lootId)),
  );
}

export function isDungeonInProgress(): boolean {
  return gamestate().exploration.isExploring;
}

export function currentTicksForDungeon(dungeon: GameDungeon): number {
  const currentStep = gamestate().exploration.currentStep;

  const doneTicks = sumBy(
    dungeon.encounters.filter((e, i) => i < currentStep),
    (e) => e.ticksRequired,
  );
  const currentTicks = gamestate().exploration.currentStepTicks;

  return currentTicks + doneTicks;
}

export function totalTicksForDungeon(dungeon: GameDungeon): number {
  return sumBy(dungeon.encounters, (e) => e.ticksRequired);
}

export function dungeonCompletionPercent(): number {
  const dungeon = currentDungeon();
  if (!dungeon) return 0;

  const totalTicks = totalTicksForDungeon(dungeon);
  const currentTicks = currentTicksForDungeon(dungeon);

  const tickPercent = currentTicks / Math.max(1, totalTicks);

  return 100 * tickPercent;
}

export function canStepThroughCurrentDungeon(): boolean {
  return gamestate().exploration.hasFinishedCurrentStep;
}

export function stepThroughCurrentDungeon(): void {
  const currentStep = currentDungeonStep();

  // attempt to gain xp for previous, finished
  if (currentStep) {
    const xpGained = currentStep.xpGained ?? 0;
    if (xpGained > 0) {
      heroesInExploreTask().forEach((h) => gainXp(h, xpGained));
    }
  }

  // move to the next step
  updateGamestate((state) => {
    state.exploration.currentStep++;
    state.exploration.currentStepTicks = 0;
    state.exploration.hasFinishedCurrentStep = false;
    return state;
  });
}

export function currentDungeonStep(): GameDungeonEncounter | undefined {
  const currentStep = gamestate().exploration.currentStep;
  const currentStepData = currentDungeon()?.encounters[currentStep];

  return currentStepData;
}

export function hasSpentEnoughTicksAtCurrentStep(): boolean {
  return (
    gamestate().exploration.currentStepTicks >=
    (currentDungeonStep()?.ticksRequired ?? 0)
  );
}

export function tickExploration(ticks: number): void {
  updateGamestate((state) => {
    state.exploration.currentStepTicks += ticks;
    return state;
  });
}

export function clearActiveDungeon() {
  const dungeon = currentDungeon();
  if (!dungeon) return;

  const hasCompleted = gamestate().dungeonsCompleted[dungeon.id] > 0;

  sendDesignEvent(
    `Exploration:${currentDungeonName()}:Success:${
      hasCompleted ? 'Repeat' : 'FirstTime'
    }`,
  );
  notify(`Successfully cleared ${dungeon.name ?? 'the dungeon'}!`, 'Dungeon');

  updateGamestate((state) => {
    state.dungeonsCompleted[dungeon.id] ??= 0;
    state.dungeonsCompleted[dungeon.id]++;

    return state;
  });

  const earnedAttributeId = dungeon.earnedAttributeId;
  if (earnedAttributeId) {
    heroesInExploreTask().forEach((hero) => {
      const attribute = getEntry<GameAttribute>(earnedAttributeId)!;

      if (!heroHasAttribute(hero, attribute)) {
        notify(`${hero.name} has unlocked "${attribute.name}"!`, 'Dungeon');
        heroGainAttribute(hero, attribute);
      }
    });
  }

  exitDungeon();
}

export function handleCurrentDungeonStep(ticks: number) {
  // if we've finished our current step
  if (canStepThroughCurrentDungeon()) {
    // our next tick, we move through to the next step, and mark our current step as unresolved
    stepThroughCurrentDungeon();
    return;
  }

  // if we haven't been at the current step long enough, tick it
  if (!hasSpentEnoughTicksAtCurrentStep()) {
    tickExploration(ticks);
    return;
  }

  // tick the current step
  const currentStepData = currentDungeonStep();
  switch (currentStepData?.type) {
    case 'fight': {
      dungeonFightStep(currentStepData);
      return;
    }

    case 'loot': {
      dungeonLootStep(currentStepData);
      return;
    }

    case 'treasure': {
      dungeonTreasureStep(currentStepData);
      return;
    }

    default: {
      clearActiveDungeon();
    }
  }
}

export function heroWinCombat(fightStep: GameDungeonEncounterFight): void {
  const rewards: Record<string, number> = {};

  fightStep.monsters.forEach((mon) => {
    const monData = getEntry<GameMonster>(mon.monsterId);
    if (!monData) return;

    monData.rewards?.forEach((reward) => {
      rewards[reward.resourceId] ??= 0;
      rewards[reward.resourceId] += reward.resourceValue;
    });
  });

  const resources = Object.keys(rewards)
    .map((r) => getEntry<GameResource>(r))
    .filter((r) => rewards[r!.id] > 0);

  resources.forEach((res) => {
    if (!res) return;
    gainResource(res, rewards[res.id]);
  });

  const notifyStr = resources
    .map((r) => `+${rewards[r!.id]} ${r!.name}`)
    .join(', ');

  notify(`Combat rewards: ${notifyStr}`, 'Dungeon');
}

export function failureInjureHeroes(): void {
  const finalizeForHero = (hero: GameHero) => {
    sendDesignEvent('Hero:Injure:Explore');
    stunHero(hero, currentDungeon()?.stunTimeOnFailure ?? 900);
    heroGainRandomInjury(hero);
    notify(`${hero.name} has been injured...`, 'Dungeon');
  };

  heroesInExploreTask().forEach((hero) => {
    if (isHardMode()) {
      const injuries = heroInjuries(hero);
      const permadeathChance = 25 + injuries.length * 10;

      if (succeedsChance(permadeathChance)) {
        sendDesignEvent(`Hero:PermaDeath:${currentDungeonName()}`);
        removeHero(hero);
        notify(`${hero.name} has perished...`, 'Dungeon');
      } else {
        finalizeForHero(hero);
      }

      return;
    }

    finalizeForHero(hero);
  });
}

export function heroLoseCombat(isForced = false): void {
  sendDesignEvent(
    `Exploration:${currentDungeonName()}:Failure:${
      isForced ? 'Natural' : 'Forced'
    }`,
  );
  notifyError('The exploration party was unsuccessful...', true);

  failureInjureHeroes();

  exitDungeon();
}

export function handleFightOutcome(fightStep: GameDungeonEncounterFight): void {
  if (didHeroesWin()) {
    heroWinCombat(fightStep);
    return;
  }

  heroLoseCombat();
}

export function dungeonFightStep(fightStep: GameDungeonEncounterFight): void {
  const exploreState = gamestate().exploration;

  // if we don't have combat, we generate combat
  if (!exploreState.currentCombat) {
    updateGamestate((state) => {
      state.exploration.currentCombat = generateCombat(fightStep);
      state.exploration.hasFinishedCurrentStep = false;
      return state;
    });

    return;
  }

  // if combat is resolved, we delete it, and move to the next step
  if (isCombatResolved()) {
    handleFightOutcome(fightStep);

    updateGamestate((state) => {
      state.exploration.exploringParty =
        state.exploration.currentCombat?.attackers ?? [];
      state.exploration.currentCombat = undefined;
      state.exploration.hasFinishedCurrentStep = true;
      return state;
    });

    return;
  }

  // otherwise, we do a round of combat
  doCombatRound();
}

export function dungeonTreasureStep(
  treasureStep: GameDungeonEncounterTreasure,
): void {
  const pickedTreasure = randomChoice(
    treasureStep.itemIds ?? [],
    gamestate().exploration.id,
  );
  updateGamestate((state) => {
    if (pickedTreasure) {
      const itemRef = getEntry<GameItem>(pickedTreasure);
      if (itemRef) {
        gainItemById(itemRef.id, 1);
        notify(`You got 1x ${itemRef.name}!`, 'Dungeon');
      }
    }

    state.exploration.hasFinishedCurrentStep = true;
    return state;
  });
}

export function dungeonLootStep(lootStep: GameDungeonEncounterLoot): void {
  updateGamestate((state) => {
    const itemRef = getEntry<GameLoot>(lootStep.lootId);
    if (itemRef) {
      gainLootItemById(itemRef.id, 1);
      notify(`You got a relic: ${itemRef.name}!`, 'Dungeon');
    }

    state.exploration.hasFinishedCurrentStep = true;
    return state;
  });
}

export function heroesInExploreTask(): GameHero[] {
  const exploreTask = getEntry<GameTask>('Explore');
  if (!exploreTask) return [];

  return heroesAllocatedToTask(exploreTask);
}

export function canEnterDungeon(): boolean {
  // we can enter the dungeon if: we have no dungeon, and all heroes allocated to the task aren't stunned
  return (
    !!currentDungeon() &&
    heroesInExploreTask().filter((h) => isStunned(h)).length === 0
  );
}

export function enterDungeon(): void {
  updateGamestate((state) => {
    state.exploration.id = uuid();
    state.exploration.currentStep = -1;
    state.exploration.currentStepTicks = 0;
    state.exploration.isExploring = true;
    state.exploration.hasFinishedCurrentStep = true;
    state.exploration.currentCombat = undefined;
    state.exploration.exploringParty = heroesInExploreTask().map((h) =>
      heroToCombatant(h),
    );
    return state;
  });
}

export function exitDungeon(): void {
  updateGamestate((state) => {
    state.activeDungeon = '';
    state.exploration.isExploring = false;
    state.exploration.currentStep = -1;
    state.exploration.currentStepTicks = 0;
    state.exploration.hasFinishedCurrentStep = false;
    state.exploration.currentCombat = undefined;
    state.exploration.exploringParty = [];
    return state;
  });
}

export function isHeroExploring(hero: GameHero): boolean {
  return !!heroesInExploreTask().find((h) => h.id === hero.id);
}

export function fleeDungeon() {
  notify(`Your exploration party fled...`, 'Dungeon');
  failureInjureHeroes();
  exitDungeon();
}

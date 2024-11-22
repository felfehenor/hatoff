import { v4 as uuid } from 'uuid';
import {
  GameDungeon,
  GameDungeonEncounterFight,
  GameDungeonEncounterLoot,
  GameDungeonEncounterTreasure,
  GameHero,
  GameTask,
} from '../interfaces';
import {
  didHeroesWin,
  doCombatRound,
  generateCombat,
  isCombatResolved,
  toCombatant,
} from './combat';
import { getEntriesByType, getEntry } from './content';
import { gamestate, updateGamestate } from './gamestate';
import { isStunned, stunHero } from './hero';
import { hasUnlockedLootItem } from './loot';
import { notify, notifyError } from './notify';
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

export function dungeonCompletionPercent(): number {
  return (
    100 *
    (gamestate().exploration.currentStep /
      (currentDungeon()?.encounters.length ?? 1))
  );
}

export function canStepThroughCurrentDungeon(): boolean {
  return gamestate().exploration.hasFinishedCurrentStep;
}

export function stepThroughCurrentDungeon(): void {
  console.log('taking a step');
  updateGamestate((state) => {
    state.exploration.currentStep++;
    state.exploration.hasFinishedCurrentStep = false;
    return state;
  });
}

export function handleCurrentDungeonStep() {
  console.log('handle current step');

  // if we've finished our current step
  if (canStepThroughCurrentDungeon()) {
    console.log('we can step');
    // our next tick, we move through to the next step, and mark our current step as unresolved
    stepThroughCurrentDungeon();
    return;
  }

  const currentStep = gamestate().exploration.currentStep;
  const currentStepData = currentDungeon()?.encounters[currentStep];

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
      notify(
        `Successfully cleared ${currentDungeon()?.name ?? 'the dungeon'}!`,
        'Dungeon',
      );
      exitDungeon();
    }
  }
}

export function heroWinCombat(fightStep: GameDungeonEncounterFight): void {
  console.log('hero rewards');

  // TODO: gain xp
}

export function heroLoseCombat(): void {
  console.log('hero lose');
  notifyError('The exploration party has returned unsuccessful...');

  heroesInExploreTask().forEach((hero) => {
    stunHero(hero, 900);
  });

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

  console.log('combat step', fightStep, { exploreState });

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
  console.log('treasure step', treasureStep);
  updateGamestate((state) => {
    // TODO: gain treasure
    // TODO: notify of treasure
    state.exploration.hasFinishedCurrentStep = true;
    return state;
  });
}

export function dungeonLootStep(lootStep: GameDungeonEncounterLoot): void {
  console.log('loot step', lootStep);
  updateGamestate((state) => {
    // TODO: gain loot
    // TODO: notify of loot
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
  console.log('enter dungeon');
  updateGamestate((state) => {
    state.exploration.id = uuid();
    state.exploration.currentStep = -1;
    state.exploration.isExploring = true;
    state.exploration.hasFinishedCurrentStep = true;
    state.exploration.exploringParty = heroesInExploreTask().map((h) =>
      toCombatant(h),
    );
    return state;
  });
}

export function exitDungeon(): void {
  console.log('exit dungeon');
  updateGamestate((state) => {
    state.activeDungeon = '';
    state.exploration.isExploring = false;
    state.exploration.currentStep = -1;
    state.exploration.hasFinishedCurrentStep = false;
    state.exploration.exploringParty = [];
    return state;
  });
}

export function isHeroExploring(hero: GameHero): boolean {
  return !!heroesInExploreTask().find((h) => h.id === hero.id);
}

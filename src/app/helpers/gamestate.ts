import { Signal, signal, WritableSignal } from '@angular/core';
import { cloneDeep } from 'lodash';
import { GameState } from '../interfaces';

export function blankGameState(): GameState {
  return {
    heroes: {},
    researchProgress: {},
    heroCurrentTaskSpeed: {},
    taskProgress: {},
    taskAssignments: {},
    taskUpgrades: {},
    resources: {},
    foundLoot: {},
    dungeonsCompleted: {},
    activeDungeon: '',
    activeResearch: '',
    recruitment: {
      recruitableHeroes: [],
      numRerolls: 0,
    },
    cooldowns: {
      nextDefenseAttackTime: 0,
      nextClickResetTime: 0,
      nextShopResetTime: 0,
      nextRecruitResetTime: 0,
    },
    defense: {
      numAttacks: -1,
      incomingDamage: 0,
      damageTypeId: '',
      targettedTaskIds: [],
    },
    townSetup: {
      hasDoneSetup: false,
      heroId: '',
      heroName: '',
      townName: '',
    },
    shop: {
      ownedItems: {},
      shopItems: [],
      numRerolls: 0,
    },
    exploration: {
      id: '',
      isExploring: false,
      currentStep: -1,
      hasFinishedCurrentStep: false,
      currentCombat: undefined,
      exploringParty: [],
    },
    meta: {
      version: 1,
      isPaused: false,
      difficulty: 'normal',
      createdAt: Date.now(),
      numTicks: 0,
    },
  };
}

const _gamestate: WritableSignal<GameState> = signal(blankGameState());
export const gamestate: Signal<GameState> = _gamestate.asReadonly();

export function setGameState(state: GameState): void {
  _gamestate.set(cloneDeep(state));
}

export function updateGamestate(func: (state: GameState) => GameState): void {
  const newState = func(gamestate());
  setGameState(newState);
}

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
    activeResearch: '',
    recruitment: {
      recruitableHeroes: [],
      numRerolls: 0,
    },
    cooldowns: {
      nextClickResetTime: 0,
      nextRecruitResetTime: 0,
    },
    townSetup: {
      hasDoneSetup: false,
      heroId: '',
      heroName: '',
      townName: '',
    },
    meta: {
      version: 1,
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
  _gamestate.update(func);
}

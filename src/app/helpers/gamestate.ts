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
    resources: {},
    activeResearch: '',
    recruitment: {
      recruitableHeroes: [],
      nextResetTime: 0,
      numRerolls: 0,
    },
    townSetup: {
      hasDoneSetup: false,
      heroId: '',
      heroName: '',
      townName: '',
    },
    version: 1,
  };
}

const _gamestate: WritableSignal<GameState> = signal(blankGameState());
export const gamestate: Signal<GameState> = _gamestate.asReadonly();

export function setGameState(state: GameState): void {
  _gamestate.set(cloneDeep(state));
}

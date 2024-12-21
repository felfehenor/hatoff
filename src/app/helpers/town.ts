import { gamestate } from './gamestate';
import { localStorageSignal } from './signal';

export const gameOverReason = localStorageSignal('', 'gameoverreason');

export function isTownName(name: string): boolean {
  return gamestate().townSetup.townName === name;
}

export function setGameOverReason(reason: string): void {
  gameOverReason.set(reason);
}

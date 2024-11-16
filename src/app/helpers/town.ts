import { gamestate } from './gamestate';

export function isTownName(name: string): boolean {
  return gamestate().townSetup.townName === name;
}

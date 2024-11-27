import {
  canEnterDungeon,
  enterDungeon,
  handleCurrentDungeonStep,
} from './dungeon';
import { gamestate } from './gamestate';

export function doDungeonGameloop(ticks: number) {
  const state = gamestate();

  if (!state.exploration.isExploring) {
    if (canEnterDungeon()) {
      enterDungeon();
    }

    return;
  }

  handleCurrentDungeonStep(ticks);
}

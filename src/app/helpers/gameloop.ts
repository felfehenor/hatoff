import { GameStateCooldowns } from '../interfaces';
import { maxCooldowns } from './cooldown';
import { doDefenseGameloop } from './gameloop-defense';
import { doDungeonGameloop } from './gameloop-dungeon';
import { doHeroGameloop } from './gameloop-hero';
import { doRecruitGameloop } from './gameloop-recruit';
import { doShopGameloop } from './gameloop-shop';
import { doTaskGameloop } from './gameloop-task';
import {
  blankGameState,
  isGameStateReady,
  setGameState,
  updateGamestate,
} from './gamestate';
import { getOption } from './options';
import { isPaused } from './pause';
import { isSetup } from './setup';

export function isPlayingGame(): boolean {
  return window.location.href.includes('/game');
}

export function isGameOver(): boolean {
  return window.location.href.includes('/over');
}

export function doGameOver(): void {
  setGameState(blankGameState());
}

export function doGameloop(numTicks: number): void {
  if (!isSetup()) return;
  if (!isPlayingGame()) return;
  if (isPaused()) return;
  if (!isGameStateReady()) return;
  if (isGameOver()) return;

  const totalTicks = numTicks * getOption('tickMultiplier');

  doHeroGameloop(totalTicks);
  doDungeonGameloop(totalTicks);
  doRecruitGameloop();
  doShopGameloop();
  doDefenseGameloop();
  doTaskGameloop(totalTicks);

  updateGamestate((state) => {
    state.meta.numTicks += totalTicks;

    Object.keys(state.cooldowns).forEach((cd) => {
      const cdKey = cd as keyof GameStateCooldowns;
      state.cooldowns[cdKey] -= 1;

      if (state.cooldowns[cdKey] <= 0) state.cooldowns[cdKey] = 0;
      if (state.cooldowns[cdKey] >= maxCooldowns[cdKey])
        state.cooldowns[cdKey] = maxCooldowns[cdKey];
    });

    return state;
  });
}

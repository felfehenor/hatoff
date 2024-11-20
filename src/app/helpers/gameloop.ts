import { GameStateCooldowns } from '../interfaces';
import { maxCooldowns } from './cooldown';
import { doDefenseGameloop } from './gameloop-defense';
import { doHeroGameloop } from './gameloop-hero';
import { doRecruitGameloop } from './gameloop-recruit';
import { doShopGameloop } from './gameloop-shop';
import { updateGamestate } from './gamestate';
import { getOption } from './options';
import { isPaused } from './pause';
import { isSetup } from './setup';

export function isPlayingGame(): boolean {
  return window.location.href.includes('/game');
}

export function doGameloop(numTicks: number): void {
  if (!isSetup()) return;
  if (!isPlayingGame()) return;
  if (isPaused()) return;

  const totalTicks = numTicks * getOption('tickMultiplier');

  doHeroGameloop(totalTicks);
  doRecruitGameloop();
  doShopGameloop();
  doDefenseGameloop();

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

import { GameStateCooldowns } from '../interfaces';
import { doDefenseGameloop } from './gameloop-defense';
import { doHeroGameloop } from './gameloop-hero';
import { doRecruitGameloop } from './gameloop-recruit';
import { doShopGameloop } from './gameloop-shop';
import { updateGamestate } from './gamestate';
import { getOption } from './options';
import { isSetup } from './setup';

export function isPlayingGame(): boolean {
  return window.location.href.includes('/game');
}

export function doGameloop(numTicks: number): void {
  if (!isSetup()) return;
  if (!isPlayingGame()) return;

  const totalTicks = numTicks * getOption('tickMultiplier');

  doHeroGameloop(totalTicks);
  doRecruitGameloop();
  doShopGameloop();
  doDefenseGameloop();

  updateGamestate((state) => {
    state.meta.numTicks += totalTicks;

    Object.keys(state.cooldowns).forEach((cd) => {
      state.cooldowns[cd as keyof GameStateCooldowns] -= 1;
    });
    return state;
  });
}

import { doHeroGameloop } from './gameloop-hero';
import { doRecruitGameloop } from './gameloop-recruit';
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

  updateGamestate((state) => {
    state.meta.numTicks += totalTicks;
    return state;
  });
}

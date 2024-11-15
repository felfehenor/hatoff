import { gamestate } from './gamestate';
import { generateHeroesToRecruit, resetRerolls, setResetTime } from './recruit';

export function doRecruitGameloop() {
  const state = gamestate();

  if (state.recruitment.recruitableHeroes.length === 0) {
    generateHeroesToRecruit();
    setResetTime();
    return;
  }

  if (Date.now() > state.cooldowns.nextRecruitResetTime) {
    generateHeroesToRecruit();
    setResetTime();
    resetRerolls();
    return;
  }
}

import { gamestate } from './gamestate';
import {
  generateHeroesToRecruit,
  resetRecruitRerolls,
  setRecruitResetTime,
} from './recruit';

export function doRecruitGameloop() {
  const state = gamestate();

  if (state.recruitment.recruitableHeroes.length === 0) {
    generateHeroesToRecruit();
    setRecruitResetTime();
    return;
  }

  if (Date.now() > state.cooldowns.nextRecruitResetTime) {
    generateHeroesToRecruit();
    setRecruitResetTime();
    resetRecruitRerolls();
    return;
  }
}

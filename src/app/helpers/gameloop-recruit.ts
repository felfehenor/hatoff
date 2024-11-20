import { gamestate } from './gamestate';
import {
  generateHeroesToRecruit,
  resetRecruitRerolls,
  setRecruitResetTime,
} from './recruit';

export function doRecruitGameloop() {
  const state = gamestate();

  if (state.cooldowns.nextRecruitResetTime > 3600) {
    setRecruitResetTime();
    resetRecruitRerolls();
    return;
  }

  if (state.recruitment.recruitableHeroes.length === 0) {
    generateHeroesToRecruit();
    setRecruitResetTime();
    return;
  }

  if (state.cooldowns.nextRecruitResetTime <= 0) {
    generateHeroesToRecruit();
    setRecruitResetTime();
    resetRecruitRerolls();
    return;
  }
}

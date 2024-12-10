import { GameStateCooldowns } from '../interfaces';

export const maxCooldowns: Record<keyof GameStateCooldowns, number> = {
  nextClickResetTime: 5,
  nextDefenseAttackTime: 3600,
  nextRecruitResetTime: 3600,
  nextShopResetTime: 3600,
  nextPetPetTime: 900,
};

export function cooldown(key: keyof GameStateCooldowns): number {
  return maxCooldowns[key];
}

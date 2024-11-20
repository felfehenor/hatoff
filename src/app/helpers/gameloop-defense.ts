import {
  canAttackTown,
  doTownAttack,
  generateFirstAttack,
  generateTownAttack,
  hasQueuedAttack,
  setDefenseResetTime,
} from './defense';
import { gamestate } from './gamestate';

export function doDefenseGameloop() {
  const state = gamestate();

  if (!canAttackTown()) return;

  if (state.defense.numAttacks === -1) {
    generateFirstAttack();
    setDefenseResetTime();
    return;
  }

  if (!hasQueuedAttack()) {
    generateTownAttack();
    setDefenseResetTime();
    return;
  }

  if (state.cooldowns.nextDefenseAttackTime <= 0) {
    doTownAttack();
    return;
  }
}

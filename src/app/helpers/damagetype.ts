import { GameDamageType } from '../interfaces';

export function canUseDamageTypeForRequirement(
  type: GameDamageType,
  checkType: GameDamageType,
): boolean {
  return (
    type.id === checkType.id ||
    type.subTypes?.some((t) => t.damageTypeId === checkType.id) ||
    checkType.subTypes?.some((t) => t.damageTypeId === type.id)
  );
}

export function getDamageForcePercentage(
  heroType: GameDamageType,
  taskType: GameDamageType,
): number {
  if (heroType.id === taskType.id) return 100;

  return (
    taskType.subTypes?.find((t) => t.damageTypeId === heroType.id)?.percent ?? 0
  );
}

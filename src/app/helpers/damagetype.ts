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

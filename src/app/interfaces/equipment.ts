import { GameHeroStat } from './hero';
import { Identifiable } from './identifiable';

export type EquipmentSlot = 'primary';
export type EquipmentRarity =
  | 'common'
  | 'uncommon'
  | 'rare'
  | 'mythical'
  | 'artifact';

export interface GameEquipment extends Identifiable {
  damageTypeId: string;
  icon: string;
  rarity: EquipmentRarity;
  totalLevel: number;
  fusionLevel: number;
  statBoosts: Record<GameHeroStat, number>;
}

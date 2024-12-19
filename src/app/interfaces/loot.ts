import { Content } from './identifiable';
import { PetStat } from './pet';

export interface GameLoot extends Content {
  description: string;

  statBoosts: Partial<Record<PetStat, number>>;
}

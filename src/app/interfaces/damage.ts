import { Content } from './identifiable';

export interface GameDamageSubtype {
  damageTypeId: string;
  percent: number;
}

export interface GameDamageType extends Content {
  icon: string;
  color: string;
  subTypes: GameDamageSubtype[];
}

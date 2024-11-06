import { Content } from './identifiable';

export interface GameDamageSubtype {
  damageTypeId: string;
  percent: number;
}

export interface GameDamageType extends Content {
  subTypes: GameDamageSubtype[];
}

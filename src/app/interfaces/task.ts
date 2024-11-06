import { Content } from './identifiable';

export interface GameTask extends Content {
  damageTypeId: string;
  requireExactType?: boolean;
  maxHeroesAllocable: number;
}

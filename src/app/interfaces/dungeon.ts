import { Content } from './identifiable';

export interface GameDungeonEncounterMonster {
  monsterId: string;
}

export interface GameDungeonEncounter {
  monsters: GameDungeonEncounterMonster[];
  lootId?: string;
}

export interface GameDungeon extends Content {
  description: string;

  encounters: GameDungeonEncounter[];
}

import { Content } from './identifiable';

export type GameDungeonEncounter =
  | GameDungeonEncounterFight
  | GameDungeonEncounterTreasure
  | GameDungeonEncounterLoot;

export interface GameDungeonEncounterFightMonster {
  monsterId: string;
}

export interface GameDungeonEncounterFight {
  type: 'fight';
  monsters: GameDungeonEncounterFightMonster[];
}

export interface GameDungeonEncounterTreasure {
  type: 'treasure';
  treasureIds: string[];
}

export interface GameDungeonEncounterLoot {
  type: 'loot';
  lootId: string;
}

export interface GameDungeon extends Content {
  description: string;

  requiresLootIds?: string[];

  encounters: GameDungeonEncounter[];
}

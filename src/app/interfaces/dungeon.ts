import { Content } from './identifiable';

export interface GameDungeonEncounterFightMonster {
  monsterId: string;
}

export type GameDungeonEncounter =
  | GameDungeonEncounterFight
  | GameDungeonEncounterLoot
  | GameDungeonEncounterTreasure;

export interface GameDungeonEncounterFight extends GameDungeonEncounterBase {
  type: 'fight';
  monsters: GameDungeonEncounterFightMonster[];
}

export interface GameDungeonEncounterTreasure extends GameDungeonEncounterBase {
  type: 'treasure';
  treasureIds: string[];
}

export interface GameDungeonEncounterLoot extends GameDungeonEncounterBase {
  type: 'loot';
  lootId: string;
}

export interface GameDungeonEncounterBase {
  type: 'fight' | 'treasure' | 'loot';
  xpGained: number;
  ticksRequired: number;
}

export interface GameDungeon extends Content {
  description: string;
  stunTimeOnFailure: number;
  earnedAttributeId?: string;

  requiresLootIds?: string[];

  encounters: GameDungeonEncounter[];
}

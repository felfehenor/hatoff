import { GameDungeon } from '../interfaces';
import { getEntriesByType, getEntry } from './content';
import { gamestate, updateGamestate } from './gamestate';
import { hasUnlockedLootItem } from './loot';

export function setActiveDungeon(dungeon: GameDungeon): void {
  updateGamestate((state) => {
    state.activeDungeon = dungeon.id;
    return state;
  });
}

export function currentDungeon(): GameDungeon | undefined {
  return getEntry<GameDungeon>(gamestate().activeDungeon);
}

export function isDungeonComplete(id: string): boolean {
  return gamestate().dungeonsCompleted[id] > 0;
}

export function allUnlockedDungeons(): GameDungeon[] {
  return getEntriesByType<GameDungeon>('dungeon').filter((d) =>
    (d.requiresLootIds ?? []).every((lootId) => hasUnlockedLootItem(lootId)),
  );
}

import { GameHero } from './hero';

export interface GameStateTownSetup {
  hasDoneSetup: boolean;
  townName: string;
  heroName: string;
  heroId: string;
}

export interface GameState {
  version: number;
  heroes: Record<string, GameHero>;
  researchProgress: Record<string, number>;
  resources: Record<string, number>;
  taskAssignments: Record<string, string>;
  activeResearch: string;
  townSetup: GameStateTownSetup;
}

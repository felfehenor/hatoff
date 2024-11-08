import { GameHero } from './hero';

export interface GameStateTownSetup {
  hasDoneSetup: boolean;
  townName: string;
  heroName: string;
  heroId: string;
}

export interface GameStateRecruitment {
  recruitableHeroes: GameHero[];
  nextResetTime: number;
  numRerolls: number;
}

export interface GameState {
  version: number;
  heroes: Record<string, GameHero>;
  researchProgress: Record<string, number>;
  resources: Record<string, number>;

  heroCurrentTaskSpeed: Record<string, number>;
  taskProgress: Record<string, number>;
  taskAssignments: Record<string, string>;
  activeResearch: string;
  townSetup: GameStateTownSetup;

  recruitment: GameStateRecruitment;
}

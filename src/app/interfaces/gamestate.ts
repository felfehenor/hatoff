import { GameHero } from './hero';

export interface GameStateMeta {
  version: number;
  createdAt: number;
  numTicks: number;
}

export interface GameStateTownSetup {
  hasDoneSetup: boolean;
  townName: string;
  heroName: string;
  heroId: string;
}

export interface GameStateRecruitment {
  recruitableHeroes: GameHero[];
  numRerolls: number;
}

export interface GameStateCooldowns {
  nextRecruitResetTime: number;
  nextClickResetTime: number;
}

export interface GameState {
  /**
   * Hero id -> Hero data
   */
  heroes: Record<string, GameHero>;

  /**
   * Research id -> Research progress
   */
  researchProgress: Record<string, number>;

  /**
   * Resource id -> total obtained
   */
  resources: Record<string, number>;

  /**
   * Hero id -> Hero speed
   */
  heroCurrentTaskSpeed: Record<string, number>;

  /**
   * Task id -> Task progress
   */
  taskProgress: Record<string, number>;

  /**
   * Hero id -> Task id
   */
  taskAssignments: Record<string, string>;

  /**
   * Task id -> Upgrade id -> true
   */
  taskUpgrades: Record<string, Record<string, boolean>>;

  /**
   * Current research id
   */
  activeResearch: string;

  /**
   * Setup information for the town
   */
  townSetup: GameStateTownSetup;

  /**
   * Recruitment data
   */
  recruitment: GameStateRecruitment;

  /**
   * Cooldowns data
   */
  cooldowns: GameStateCooldowns;

  /**
   * Meta data
   */
  meta: GameStateMeta;
}

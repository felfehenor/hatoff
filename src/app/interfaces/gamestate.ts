import { GameHero } from './hero';

export type GameDifficulty = 'easy' | 'normal' | 'hard';

export interface GameStateMeta {
  version: number;
  isPaused: boolean;
  createdAt: number;
  numTicks: number;
  difficulty: GameDifficulty;
}

export interface GameStateTownSetup {
  hasDoneSetup: boolean;
  townName: string;
  heroName: string;
  heroId: string;
}

export interface GameStateRecruitment {
  recruitableHeroes: (GameHero | undefined)[];
  numRerolls: number;
}

export interface GameStateCooldowns {
  nextDefenseAttackTime: number;
  nextShopResetTime: number;
  nextRecruitResetTime: number;
  nextClickResetTime: number;
}

export interface GameStateShop {
  ownedItems: Record<string, number>;
  shopItems: (string | undefined)[];
  numRerolls: number;
}

export interface GameStateDefense {
  numAttacks: number;
  incomingDamage: number;
  damageTypeId: string;
  targettedTaskIds: string[];
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
   * Shop data
   */
  shop: GameStateShop;

  /**
   * Defense data
   */
  defense: GameStateDefense;

  /**
   * Cooldowns data
   */
  cooldowns: GameStateCooldowns;

  /**
   * Meta data
   */
  meta: GameStateMeta;
}

import { GameActiveCombatant, GameCombat } from './combat';
import { GameHero } from './hero';
import { PetStat } from './pet';

export type GameDifficulty = 'easy' | 'normal' | 'hard';

export type PetRole = 'companion' | 'defender' | 'gatherer';

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
  nextPetPetTime: number;
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

export interface GameStateExplore {
  id: string;
  isExploring: boolean;
  currentStep: number;
  currentStepTicks: number;
  hasFinishedCurrentStep: boolean;
  currentCombat?: GameCombat;
  exploringParty: GameActiveCombatant[];
}

export interface GameStatePet {
  name: string;
  fedResources: Record<string, number>;
  fedFusionLevels: number;
  fedLevels: number;
  role: PetRole;
  equippedRelics: string[];
  statsGained: Record<PetStat, number>;
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
   * Task id -> Upgrade id -> timestamp
   */
  taskUpgrades: Record<string, Record<string, number>>;

  /**
   * Loot id -> timestamp
   */
  foundLoot: Record<string, number>;

  /**
   * Dungeon id -> completion count
   */
  dungeonsCompleted: Record<string, number>;

  /**
   * Current dungeon id
   */
  activeDungeon: string;

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
   * Exploration data
   */
  exploration: GameStateExplore;

  /**
   * Pet data
   */
  pet: GameStatePet;

  /**
   * Meta data
   */
  meta: GameStateMeta;
}

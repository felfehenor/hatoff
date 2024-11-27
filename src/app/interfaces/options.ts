export interface GameOptions {
  showDebug: boolean;
  debugConsoleLogStateUpdates: boolean;
  debugShowAllResources: boolean;

  heroSpeedMultiplier: number;
  heroForceMultiplier: number;
  heroXpMultiplier: number;
  heroTaskXpMultiplier: number;
  heroLevelUpStatGainMultiplier: number;

  tickMultiplier: number;
  rewardMultiplier: number;

  notificationLevelUp: boolean;
  notificationItem: boolean;
  notificationDefense: boolean;
  notificationDungeon: boolean;
  notificationResourceGain: boolean;
  notificationRecruitment: boolean;
  notificationError: boolean;
  notificationSuccess: boolean;
}

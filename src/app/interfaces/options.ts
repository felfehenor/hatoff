export interface GameOptions {
  showDebug: boolean;
  debugConsoleLogStateUpdates: boolean;

  heroSpeedMultiplier: number;
  heroForceMultiplier: number;
  heroXpMultiplier: number;
  heroTaskXpMultiplier: number;
  heroLevelUpStatGainMultiplier: number;

  rewardMultiplier: number;

  notificationLevelUp: boolean;
  notificationResourceGain: boolean;
  notificationError: boolean;
  notificationSuccess: boolean;
}

import { signal, Signal, WritableSignal } from '@angular/core';
import { environment } from '../../environments/environment';
import { GameOptions } from '../interfaces';

export function defaultOptions(): GameOptions {
  return {
    showDebug: !environment.production,
    debugConsoleLogStateUpdates: false,
    debugShowAllResources: false,

    heroForceMultiplier: 1,
    heroSpeedMultiplier: 1,
    heroXpMultiplier: 1,
    heroTaskXpMultiplier: 1,
    heroLevelUpStatGainMultiplier: 1,

    tickMultiplier: 1,
    rewardMultiplier: 1,

    notificationError: true,
    notificationLevelUp: true,
    notificationItem: true,
    notificationRecruitment: true,
    notificationResourceGain: false,
    notificationSuccess: true,
  };
}

const _options: WritableSignal<GameOptions> = signal(defaultOptions());
export const options: Signal<GameOptions> = _options.asReadonly();

export function setOptions(options: GameOptions) {
  _options.set(options);
}

export function setOption<T extends keyof GameOptions>(
  option: T,
  value: GameOptions[T],
): void {
  _options.update((state) => ({
    ...state,
    [option]: value,
  }));
}

export function toggleDebugOn() {
  setOption('showDebug', true);
}

export function getOption<T extends keyof GameOptions>(
  option: T,
): GameOptions[T] {
  return options()[option];
}

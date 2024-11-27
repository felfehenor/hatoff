import { effect, inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorageService } from 'ngx-webstorage';
import { interval } from 'rxjs';
import {
  canSendNotifications,
  doGameloop,
  doGameOver,
  gamestate,
  getOption,
  hasMainHero,
  isGameOver,
  isGameStateReady,
  isPlayingGame,
  isSetup,
  migrateGameState,
  migrateOptionsState,
  notifyError,
  options,
  setGameState,
  setOptions,
} from '../helpers';
import { GameOptions, GameState } from '../interfaces';
import { ContentService } from './content.service';

@Injectable({
  providedIn: 'root',
})
export class GamestateService {
  private router = inject(Router);
  private localStorage = inject(LocalStorageService);
  private contentService = inject(ContentService);

  public hasLoaded = signal<boolean>(false);

  constructor() {
    effect(() => {
      if (!this.contentService.hasLoaded() || this.hasLoaded()) return;
      console.log('[Gamestate] Migrating gamestate...');

      migrateGameState();
      migrateOptionsState();

      console.log('[Gamestate] Gamestate migrated & loaded.');
      this.hasLoaded.set(true);
      isGameStateReady.set(true);
    });

    effect(() => {
      if (!this.hasLoaded()) return;

      const state = gamestate();

      if (getOption('debugConsoleLogStateUpdates')) {
        console.info('[State Update]', state);
      }

      this.saveGamestate(state);

      this.checkForGameOver();
    });

    effect(() => {
      if (!this.hasLoaded()) return;

      const optionsState = options();
      this.saveOptions(optionsState);
    });
  }

  async init() {
    this.load();
    this.runGameloop();
  }

  load() {
    const state = this.localStorage.retrieve('gamestate');
    if (state) {
      setGameState(state);
    }

    const options = this.localStorage.retrieve('options');
    if (options) {
      setOptions(options);
    }
  }

  async checkForGameOver() {
    if (!isPlayingGame()) return;
    if (isGameOver() || !isSetup()) return;

    const shouldGameOver = !hasMainHero();
    if (!shouldGameOver) return;

    notifyError(
      'Your main hero has perished, leaving your town without a leader...',
      true,
    );

    await this.router.navigate(['/game/over']);
    doGameOver();
  }

  saveGamestate(saveState: GameState) {
    this.localStorage.store('gamestate', saveState);
  }

  saveOptions(optionsState: GameOptions) {
    this.localStorage.store('options', optionsState);
  }

  private runGameloop(): void {
    let lastRunTime = 0;

    function runLoop(numTicks: number) {
      lastRunTime = Date.now();
      doGameloop(numTicks);
    }

    runLoop(1);

    interval(1000).subscribe(() => {
      if (lastRunTime <= 0) return;

      const secondsElapsed = Math.round((Date.now() - lastRunTime) / 1000);

      if (document.hidden) {
        canSendNotifications.set(false);
      }

      runLoop(secondsElapsed);

      canSendNotifications.set(true);
    });
  }
}

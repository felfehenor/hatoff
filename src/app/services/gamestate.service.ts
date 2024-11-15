import { effect, inject, Injectable, signal } from '@angular/core';
import { LocalStorageService } from 'ngx-webstorage';
import { interval } from 'rxjs';
import {
  doGameloop,
  gamestate,
  getOption,
  migrateGameState,
  migrateOptionsState,
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
  private localStorage = inject(LocalStorageService);
  private contentService = inject(ContentService);

  private hasLoaded = signal<boolean>(false);

  constructor() {
    effect(
      () => {
        if (!this.contentService.hasLoaded() || this.hasLoaded()) return;
        console.log('[Gamestate] Migrating gamestate...');

        migrateGameState();
        migrateOptionsState();

        console.log('[Gamestate] Gamestate migrated & loaded.');
        this.hasLoaded.set(true);
      },
      { allowSignalWrites: true },
    );

    effect(() => {
      if (!this.hasLoaded()) return;

      const state = gamestate();

      if (getOption('debugConsoleLogStateUpdates')) {
        console.info('[State Update]', state);
      }

      this.saveGamestate(state);
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

  saveGamestate(saveState: GameState) {
    this.localStorage.store('gamestate', saveState);
  }

  saveOptions(optionsState: GameOptions) {
    this.localStorage.store('options', optionsState);
  }

  private runGameloop(): void {
    let lastRunTime = 0;

    function runLoop() {
      lastRunTime = Date.now();
      doGameloop();
    }

    runLoop();

    interval(1000).subscribe(() => {
      if (lastRunTime <= 0) return;

      const secondsElapsed = Math.round((Date.now() - lastRunTime) / 1000);
      for (let i = 0; i < secondsElapsed; i++) {
        runLoop();
      }
    });
  }
}

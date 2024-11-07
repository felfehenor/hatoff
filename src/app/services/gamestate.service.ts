import { effect, inject, Injectable, signal } from '@angular/core';
import { LocalStorageService } from 'ngx-webstorage';
import { interval } from 'rxjs';
import { doGameloop, gamestate, migrateState, setGameState } from '../helpers';
import { GameState } from '../interfaces';
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

        migrateState();

        console.log('[Gamestate] Gamestate migrated & loaded.');
        this.hasLoaded.set(true);
      },
      { allowSignalWrites: true },
    );

    effect(() => {
      if (!this.hasLoaded()) return;

      const state = gamestate();
      console.info('[State Update]', state);
      this.saveGamestate(state);
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
  }

  saveGamestate(saveState: GameState) {
    this.localStorage.store('gamestate', saveState);
  }

  private runGameloop(): void {
    interval(1000).subscribe(() => doGameloop());
  }
}

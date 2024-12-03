import { Component, computed, input } from '@angular/core';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { tablerCompass, tablerFlask2 } from '@ng-icons/tabler-icons';
import { TippyDirective } from '@ngneat/helipopper';
import { gamestate, getEntriesByType } from '../../helpers';
import { GameDungeon, GameLoot, GameResearch } from '../../interfaces';

@Component({
  selector: 'app-relic-display',
  imports: [NgIconComponent, TippyDirective],
  providers: [
    provideIcons({
      tablerFlask2,
      tablerCompass,
    }),
  ],
  templateUrl: './relic-display.component.html',
  styleUrl: './relic-display.component.scss',
})
export class RelicDisplayComponent {
  public relic = input.required<GameLoot>();
  public times = computed(() => gamestate().foundLoot[this.relic().id] ?? 0);

  public unlockedResearch = computed(() =>
    getEntriesByType<GameResearch>('research')
      .filter((t) => t.requiresLootIds?.includes(this.relic().id))
      .map((t) => t.name)
      .join(', '),
  );
  public unlockedDungeons = computed(() =>
    getEntriesByType<GameDungeon>('dungeon')
      .filter((t) => t.requiresLootIds?.includes(this.relic().id))
      .map((t) => t.name)
      .join(', '),
  );
}

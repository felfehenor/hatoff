import { Component, computed } from '@angular/core';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { tablerClock } from '@ng-icons/tabler-icons';
import { currentDungeonStep, gamestate } from '../../helpers';
import { GameDungeonEncounterLoot } from '../../interfaces';
import { BlankSlateComponent } from '../blank-slate/blank-slate.component';
import { ContentNameComponent } from '../content-name/content-name.component';

@Component({
  selector: 'app-dungeon-active-viewer-loot',
  imports: [BlankSlateComponent, NgIconComponent, ContentNameComponent],
  providers: [
    provideIcons({
      tablerClock,
    }),
  ],
  templateUrl: './dungeon-active-viewer-loot.component.html',
  styleUrl: './dungeon-active-viewer-loot.component.scss',
})
export class DungeonActiveViewerLootComponent {
  public relicId = computed(
    () => (currentDungeonStep() as GameDungeonEncounterLoot)?.lootId,
  );
  public currentProgress = computed(
    () => gamestate().exploration.currentStepTicks,
  );
  public maxProgress = computed(() => currentDungeonStep()?.ticksRequired ?? 0);

  public lootProgress = computed(
    () => (this.currentProgress() / this.maxProgress()) * 100,
  );
}

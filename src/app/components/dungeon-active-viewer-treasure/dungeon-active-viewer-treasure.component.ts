import { Component, computed } from '@angular/core';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { tablerClock } from '@ng-icons/tabler-icons';
import {
  currentDungeonStep,
  gamestate,
  getEntry,
  usedContentIcons,
} from '../../helpers';
import { GameDungeonEncounterTreasure, GameItem } from '../../interfaces';
import { BlankSlateComponent } from '../blank-slate/blank-slate.component';

@Component({
  selector: 'app-dungeon-active-viewer-treasure',
  imports: [BlankSlateComponent, NgIconComponent],
  providers: [
    provideIcons({
      tablerClock,
      ...usedContentIcons(),
    }),
  ],
  templateUrl: './dungeon-active-viewer-treasure.component.html',
  styleUrl: './dungeon-active-viewer-treasure.component.scss',
})
export class DungeonActiveViewerTreasureComponent {
  public treasureList = computed(
    () =>
      (currentDungeonStep() as GameDungeonEncounterTreasure)?.treasureIds
        .map((t) => getEntry<GameItem>(t))
        .filter(Boolean) as GameItem[],
  );

  public currentProgress = computed(
    () => gamestate().exploration.currentStepTicks,
  );

  public maxProgress = computed(() => currentDungeonStep()?.ticksRequired ?? 0);

  public lootProgress = computed(
    () => (this.currentProgress() / this.maxProgress()) * 100,
  );
}

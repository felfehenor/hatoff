import { Component, computed, input } from '@angular/core';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import {
  tablerFlask2,
  tablerInfoHexagon,
  tablerSparkles,
} from '@ng-icons/tabler-icons';
import { TippyDirective } from '@ngneat/helipopper';
import { getEntriesByType, getResearchFor } from '../../helpers';
import { GameResearch } from '../../interfaces';

@Component({
  selector: 'app-research-display',
  imports: [NgIconComponent, TippyDirective],
  providers: [
    provideIcons({
      tablerSparkles,
      tablerFlask2,
      tablerInfoHexagon,
    }),
  ],
  templateUrl: './research-display.component.html',
  styleUrl: './research-display.component.scss',
})
export class ResearchDisplayComponent {
  public research = input.required<GameResearch>();
  public active = input<boolean>(false);

  public currentResearch = computed(() => getResearchFor(this.research().id));

  public completion = computed(
    () => (this.currentResearch() / this.research().researchRequired) * 100,
  );

  public unlockedResearch = computed(() =>
    getEntriesByType<GameResearch>('research').filter((f) =>
      f.requiresResearchIds?.includes(this.research().id),
    ),
  );
}

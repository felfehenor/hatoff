import { Component, computed, input } from '@angular/core';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { heroBeaker, heroStar } from '@ng-icons/heroicons/outline';
import { tablerInfoHexagon } from '@ng-icons/tabler-icons';
import { TippyDirective } from '@ngneat/helipopper';
import { getEntriesByType, getResearchFor } from '../../helpers';
import { GameResearch } from '../../interfaces';

@Component({
  selector: 'app-research-display',
  standalone: true,
  imports: [NgIconComponent, TippyDirective],
  providers: [
    provideIcons({
      heroStar,
      heroBeaker,
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

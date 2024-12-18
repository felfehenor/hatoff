import { Component, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { countBy, sortBy } from 'lodash';
import { PageCardComponent } from '../../components/page-card/page-card.component';
import { ResearchListComponent } from '../../components/research-list/research-list.component';
import { AnalyticsClickDirective } from '../../directives/analytics-click.directive';
import {
  allAvailableIncompleteResearch,
  allCompletedResearch,
  gamestate,
  isResearchComplete,
  localStorageSignal,
} from '../../helpers';

@Component({
  selector: 'app-game-research',
  imports: [
    PageCardComponent,
    ResearchListComponent,
    FormsModule,
    AnalyticsClickDirective,
  ],
  templateUrl: './game-research.component.html',
  styleUrl: './game-research.component.scss',
})
export class GameResearchComponent {
  public activeType = localStorageSignal<string>('All', 'sort-gameresearch');
  public mode = localStorageSignal<'Current' | 'Previous'>(
    'Current',
    'filter-gameresearchtype',
  );

  public allResearchCategories = computed(() => {
    const allResearch =
      this.mode() === 'Current'
        ? allAvailableIncompleteResearch()
        : allCompletedResearch();

    const base = [{ name: 'All', num: allResearch.length, value: allResearch }];

    const counts = countBy(
      allResearch.filter((r) => r.type),
      (r) => r.type,
    );
    Object.keys(counts)
      .sort()
      .forEach((label) => {
        base.push({
          name: label,
          num: counts[label],
          value: allResearch.filter((r) => r.type === label),
        });
      });

    return base;
  });

  public researchList = computed(() =>
    sortBy(
      this.allResearchCategories().find((f) => f.name === this.activeType())
        ?.value ?? [],
      (r) => r.researchRequired,
    ),
  );

  public shouldShowResearchWarning = computed(
    () =>
      allAvailableIncompleteResearch().length > 0 &&
      (!gamestate().activeResearch ||
        isResearchComplete(gamestate().activeResearch)),
  );
}

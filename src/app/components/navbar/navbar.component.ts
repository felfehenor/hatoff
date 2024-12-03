import { Component, computed, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import {
  tablerBuildingFortress,
  tablerBuildingStore,
  tablerCompass,
  tablerFlask2,
  tablerPlayerPause,
  tablerPlayerPlay,
  tablerSettings,
  tablerSparkles,
  tablerSwords,
  tablerUsersGroup,
} from '@ng-icons/tabler-icons';
import { TippyDirective } from '@ngneat/helipopper';
import { AnalyticsClickDirective } from '../../directives/analytics-click.directive';
import { HideResearchDirective } from '../../directives/hideresearch.directive';
import {
  currentDungeon,
  gamestate,
  isPaused,
  isResearchComplete,
  isSetup,
  togglePause,
} from '../../helpers';
import { MetaService } from '../../services/meta.service';
import { ResourceListComponent } from '../resource-list/resource-list.component';

@Component({
  selector: 'app-navbar',
  imports: [
    RouterLink,
    RouterLinkActive,
    NgIconComponent,
    ResourceListComponent,
    HideResearchDirective,
    TippyDirective,
    AnalyticsClickDirective,
  ],
  providers: [
    provideIcons({
      tablerSettings,
      tablerBuildingFortress,
      tablerFlask2,
      tablerUsersGroup,
      tablerSparkles,
      tablerBuildingStore,
      tablerPlayerPause,
      tablerPlayerPlay,
      tablerCompass,
      tablerSwords,
    }),
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  public meta = inject(MetaService);

  isSetup = computed(() => isSetup());
  townName = computed(() => gamestate().townSetup.townName);

  isResearching = computed(
    () =>
      gamestate().activeResearch &&
      !isResearchComplete(gamestate().activeResearch),
  );

  isExploring = computed(() => !!currentDungeon());

  isPaused = computed(() => isPaused());

  pauseTooltip = computed(() => {
    return isPaused()
      ? "The game is paused, and no ticks are happening. You can adjust settings, heroes, use items, and anything else that doesn't need real time progress."
      : 'The game is unpaused, and moving at 1x speed. You can pause it if you need to walk away, or think about how to approach a problem.';
  });

  togglePause() {
    togglePause();
  }
}

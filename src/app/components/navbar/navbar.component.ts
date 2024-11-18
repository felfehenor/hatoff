import { Component, computed, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import {
  heroBeaker,
  heroBuildingOffice2,
  heroBuildingStorefront,
  heroCog6Tooth,
  heroSparkles,
  heroUserGroup,
} from '@ng-icons/heroicons/outline';
import { HideResearchDirective } from '../../directives/hideresearch.directive';
import { gamestate, isResearchComplete, isSetup } from '../../helpers';
import { MetaService } from '../../services/meta.service';
import { ResourceListComponent } from '../resource-list/resource-list.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    NgIconComponent,
    ResourceListComponent,
    HideResearchDirective,
  ],
  providers: [
    provideIcons({
      heroCog6Tooth,
      heroBuildingOffice2,
      heroBeaker,
      heroUserGroup,
      heroSparkles,
      heroBuildingStorefront,
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
}

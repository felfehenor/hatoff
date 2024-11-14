import { Component, computed, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import {
  heroBeaker,
  heroBuildingOffice2,
  heroCog6Tooth,
  heroSparkles,
  heroUserGroup,
} from '@ng-icons/heroicons/outline';
import { gamestate, isResearchComplete, isSetup } from '../../helpers';
import { MetaService } from '../../services/meta.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, NgIconComponent],
  providers: [
    provideIcons({
      heroCog6Tooth,
      heroBuildingOffice2,
      heroBeaker,
      heroUserGroup,
      heroSparkles,
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

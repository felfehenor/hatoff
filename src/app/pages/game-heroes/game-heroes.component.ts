import { Component, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HeroListComponent } from '../../components/hero-list/hero-list.component';
import { PageCardComponent } from '../../components/page-card/page-card.component';
import { DisableResearchDirective } from '../../directives/disableresearch.directive';
import {
  canFuseHeroes,
  canRecruitHero,
  isResearchComplete,
  populationCap,
  totalHeroes,
} from '../../helpers';

@Component({
  selector: 'app-game-heroes',
  standalone: true,
  imports: [
    PageCardComponent,
    HeroListComponent,
    RouterLink,
    DisableResearchDirective,
  ],
  templateUrl: './game-heroes.component.html',
  styleUrl: './game-heroes.component.scss',
})
export class GameHeroesComponent {
  public currentHeroCount = computed(() => totalHeroes());
  public currentHeroCap = computed(() => populationCap());
  public canRecruit = computed(
    () => isResearchComplete('Help Posters') && canRecruitHero(),
  );
  public canFuse = computed(() => canFuseHeroes());
}

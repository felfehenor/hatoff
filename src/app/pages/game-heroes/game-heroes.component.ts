import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { countBy, sortBy } from 'lodash';
import { HeroListComponent } from '../../components/hero-list/hero-list.component';
import { PageCardComponent } from '../../components/page-card/page-card.component';
import { AnalyticsClickDirective } from '../../directives/analytics-click.directive';
import {
  allHeroes,
  canRecruitHero,
  getEntry,
  isResearchComplete,
  populationCap,
  totalHeroes,
} from '../../helpers';
import { GameDamageType, GameHero } from '../../interfaces';

interface FilterOption {
  name: string;
  num: number;
  value: GameHero[];
}

@Component({
  selector: 'app-game-heroes',
  imports: [
    PageCardComponent,
    HeroListComponent,
    RouterLink,
    AnalyticsClickDirective,
    FormsModule,
  ],
  templateUrl: './game-heroes.component.html',
  styleUrl: './game-heroes.component.scss',
})
export class GameHeroesComponent {
  public activeType = signal<string>('All');
  public currentHeroCount = computed(() => totalHeroes());
  public currentHeroCap = computed(() => populationCap());
  public canRecruit = computed(
    () => isResearchComplete('Help Posters') && canRecruitHero(),
  );
  public shouldShowFuseButton = computed(() =>
    isResearchComplete('Fusion Engine'),
  );

  public allDamageTypes = computed(() => {
    const heroes = allHeroes();

    const base: FilterOption[] = [
      { name: 'All', num: heroes.length, value: heroes },
    ];
    const extra: FilterOption[] = [];

    const counts = countBy(heroes, (r) => r.damageTypeId);

    Object.keys(counts).forEach((damageTypeId) => {
      const damageType = getEntry<GameDamageType>(damageTypeId)!;

      extra.push({
        name: damageType.name,
        num: counts[damageTypeId],
        value: heroes.filter((r) => r.damageTypeId === damageTypeId),
      });
    });

    return base.concat(sortBy(extra, 'name'));
  });

  public heroList = computed(() =>
    sortBy(
      this.allDamageTypes().find((f) => f.name === this.activeType())?.value ??
        [],
    ),
  );
}

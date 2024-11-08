import { DecimalPipe } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { DamageTypeComponent } from '../../components/damage-type/damage-type.component';
import { HeroArchetypeListComponent } from '../../components/hero-archetype-list/hero-archetype-list.component';
import { HeroArtComponent } from '../../components/hero-art/hero-art.component';
import { HeroLevelTaglineComponent } from '../../components/hero-level-tagline/hero-level-tagline.component';
import { HeroStatsTableComponent } from '../../components/hero-stats-table/hero-stats-table.component';
import { HeroTaskLevelListComponent } from '../../components/hero-task-level-list/hero-task-level-list.component';
import { PageCardComponent } from '../../components/page-card/page-card.component';
import { ResourceDisplayComponent } from '../../components/resource-display/resource-display.component';
import {
  canRecruit,
  canReroll,
  doReroll,
  gamestate,
  getEntry,
  getHero,
  populationCap,
  recruitCost,
  recruitHero,
  rerollCost,
  totalHeroes,
} from '../../helpers';
import { GameDamageType, GameHero } from '../../interfaces';

@Component({
  selector: 'app-game-recruit',
  standalone: true,
  imports: [
    PageCardComponent,
    ResourceDisplayComponent,
    DecimalPipe,
    HeroLevelTaglineComponent,
    DamageTypeComponent,
    HeroArtComponent,
    HeroArchetypeListComponent,
    HeroStatsTableComponent,
    HeroTaskLevelListComponent,
    SweetAlert2Module,
  ],
  templateUrl: './game-recruit.component.html',
  styleUrl: './game-recruit.component.scss',
})
export class GameRecruitComponent {
  public currentHeroCount = computed(() => totalHeroes());
  public currentHeroCap = computed(() => populationCap());
  public canRecruit = computed(() => canRecruit());
  public canReroll = computed(() => canReroll());
  public rerollCost = computed(() => rerollCost());
  public recruitCost = computed(() => recruitCost());
  public currentHeroPool = computed(
    () => gamestate().recruitment.recruitableHeroes,
  );
  public secondsUntilReset = computed(() =>
    Math.floor(
      ((gamestate().recruitment.nextResetTime - Date.now()) / 1000) % 60,
    ),
  );
  public minutesUntilReset = computed(() =>
    Math.floor(
      (gamestate().recruitment.nextResetTime - Date.now()) / 1000 / 60,
    ),
  );

  public selectedHero = signal<GameHero | undefined>(undefined);

  public hasRecruitedHero(hero: GameHero) {
    return getHero(hero.id);
  }

  public recruitDesc(hero: GameHero): string {
    const damageType =
      getEntry<GameDamageType>(hero.damageTypeId)?.name ?? 'Unknown';
    return `Are you sure you want to recruit ${hero.name}? They do ${hero.stats.force} ${damageType} damage.`;
  }

  public recruitHero(hero: GameHero): void {
    recruitHero(hero);
  }

  public doReroll(): void {
    doReroll();
  }
}

import { DecimalPipe } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { timer } from 'rxjs';
import { CountdownComponent } from '../../components/countdown/countdown.component';
import { DamageTypeComponent } from '../../components/damage-type/damage-type.component';
import { HeroArchetypeListComponent } from '../../components/hero-archetype-list/hero-archetype-list.component';
import { HeroArtComponent } from '../../components/hero-art/hero-art.component';
import { HeroLevelTaglineComponent } from '../../components/hero-level-tagline/hero-level-tagline.component';
import { HeroStatsTableComponent } from '../../components/hero-stats-table/hero-stats-table.component';
import { HeroTaskLevelListComponent } from '../../components/hero-task-level-list/hero-task-level-list.component';
import { PageCardComponent } from '../../components/page-card/page-card.component';
import { HeroSpecialGlowDirective } from '../../directives/hero-special-glow.directive';
import {
  canRecruit,
  canRerollRecruit,
  doRecruitReroll,
  gamestate,
  getEntry,
  populationCap,
  recruitCost,
  recruitHero,
  recruitRerollCost,
  totalHeroes,
} from '../../helpers';
import { GameDamageType, GameHero } from '../../interfaces';

@Component({
  selector: 'app-game-recruit',
  standalone: true,
  imports: [
    PageCardComponent,
    DecimalPipe,
    HeroLevelTaglineComponent,
    DamageTypeComponent,
    HeroArtComponent,
    HeroArchetypeListComponent,
    HeroStatsTableComponent,
    HeroTaskLevelListComponent,
    SweetAlert2Module,
    HeroSpecialGlowDirective,
    CountdownComponent,
  ],
  templateUrl: './game-recruit.component.html',
  styleUrl: './game-recruit.component.scss',
})
export class GameRecruitComponent {
  public currentHeroCount = computed(() => totalHeroes());
  public currentHeroCap = computed(() => populationCap());
  public canRecruit = computed(() => canRecruit());
  public canReroll = computed(
    () => canRerollRecruit() && !this.isRerollOnTimeout(),
  );
  public rerollCost = computed(() => recruitRerollCost());
  public recruitCost = computed(() => recruitCost());
  public currentHeroPool = computed(
    () => gamestate().recruitment.recruitableHeroes,
  );
  public secondsUntilReset = computed(
    () => gamestate().cooldowns.nextRecruitResetTime,
  );

  public selectedHero = signal<GameHero | undefined>(undefined);
  public isRerollOnTimeout = signal<boolean>(false);

  public recruitDesc(hero: GameHero): string {
    const damageType =
      getEntry<GameDamageType>(hero.damageTypeId)?.name ?? 'Unknown';
    return `Are you sure you want to recruit ${hero.name}? They do ${hero.stats.force} ${damageType} damage.`;
  }

  public recruitHero(hero: GameHero, index: number): void {
    recruitHero(hero, index);
  }

  public doReroll(): void {
    doRecruitReroll();

    this.isRerollOnTimeout.set(true);
    timer(2000).subscribe(() => {
      this.isRerollOnTimeout.set(false);
    });
  }
}

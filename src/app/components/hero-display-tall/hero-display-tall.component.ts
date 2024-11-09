import { DecimalPipe, TitleCasePipe } from '@angular/common';
import { Component, computed, input, output } from '@angular/core';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import {
  gamestate,
  getHero,
  removeHero,
  setHeroDamageType,
} from '../../helpers';
import { GameHero } from '../../interfaces';
import { ArchetypeDisplayComponent } from '../archetype-display/archetype-display.component';
import { ButtonCloseComponent } from '../button-close/button-close.component';
import { ContentNameComponent } from '../content-name/content-name.component';
import { DamageTypeComponent } from '../damage-type/damage-type.component';
import { HeroArchetypeListComponent } from '../hero-archetype-list/hero-archetype-list.component';
import { HeroArtComponent } from '../hero-art/hero-art.component';
import { HeroAssignmentComponent } from '../hero-assignment/hero-assignment.component';
import { HeroLevelTaglineComponent } from '../hero-level-tagline/hero-level-tagline.component';
import { HeroStatsTableComponent } from '../hero-stats-table/hero-stats-table.component';
import { HeroTaskLevelDisplayComponent } from '../hero-task-level-display/hero-task-level-display.component';
import { HeroTaskLevelListComponent } from '../hero-task-level-list/hero-task-level-list.component';

@Component({
  selector: 'app-hero-display-tall',
  standalone: true,
  imports: [
    DecimalPipe,
    DamageTypeComponent,
    ContentNameComponent,
    TitleCasePipe,
    HeroArtComponent,
    ArchetypeDisplayComponent,
    HeroTaskLevelDisplayComponent,
    HeroArchetypeListComponent,
    HeroStatsTableComponent,
    HeroAssignmentComponent,
    HeroLevelTaglineComponent,
    HeroTaskLevelListComponent,
    SweetAlert2Module,
    ButtonCloseComponent,
  ],
  templateUrl: './hero-display-tall.component.html',
  styleUrl: './hero-display-tall.component.scss',
})
export class HeroDisplayTallComponent {
  public hero = input.required<GameHero>();
  public close = output<void>();

  public liveHeroData = computed(() => getHero(this.hero().id));

  public canEditHeroStats = computed(
    () => this.hero()?.id === gamestate().townSetup.heroId,
  );

  public canDismissHero = computed(
    () => this.hero().id !== gamestate().townSetup.heroId,
  );

  public changeMainCharacterType(newType: string) {
    const hero = this.hero();
    if (!hero) return;

    setHeroDamageType(hero, newType);
  }

  public dismissHero() {
    removeHero(this.hero());
    this.close.emit();
  }
}

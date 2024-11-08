import { DecimalPipe, TitleCasePipe } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { gamestate, getHero, setHeroDamageType } from '../../helpers';
import { GameHero } from '../../interfaces';
import { ArchetypeDisplayComponent } from '../archetype-display/archetype-display.component';
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
  ],
  templateUrl: './hero-display-tall.component.html',
  styleUrl: './hero-display-tall.component.scss',
})
export class HeroDisplayTallComponent {
  public hero = input.required<GameHero>();

  public liveHeroData = computed(() => getHero(this.hero().id));

  public canEditHeroStats = computed(
    () => this.hero()?.id === gamestate().townSetup.heroId,
  );

  public changeMainCharacterType(newType: string) {
    const hero = this.hero();
    if (!hero) return;

    setHeroDamageType(hero, newType);
  }
}

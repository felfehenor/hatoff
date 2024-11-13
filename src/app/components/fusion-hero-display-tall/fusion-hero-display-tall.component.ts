import { Component, input } from '@angular/core';
import { GameHero } from '../../interfaces';
import { DamageTypeComponent } from '../damage-type/damage-type.component';
import { HeroArchetypeListComponent } from '../hero-archetype-list/hero-archetype-list.component';
import { HeroArtComponent } from '../hero-art/hero-art.component';
import { HeroLevelTaglineComponent } from '../hero-level-tagline/hero-level-tagline.component';
import { HeroStatsTableComponent } from '../hero-stats-table/hero-stats-table.component';
import { HeroTaskLevelListComponent } from '../hero-task-level-list/hero-task-level-list.component';

@Component({
  selector: 'app-fusion-hero-display-tall',
  standalone: true,
  imports: [
    HeroArtComponent,
    HeroLevelTaglineComponent,
    DamageTypeComponent,
    HeroArchetypeListComponent,
    HeroStatsTableComponent,
    HeroTaskLevelListComponent,
  ],
  templateUrl: './fusion-hero-display-tall.component.html',
  styleUrl: './fusion-hero-display-tall.component.scss',
})
export class FusionHeroDisplayTallComponent {
  public hero = input.required<GameHero>();
}

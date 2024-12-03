import { Component, input } from '@angular/core';
import { GameHero } from '../../interfaces';
import { HeroArchetypeListComponent } from '../hero-archetype-list/hero-archetype-list.component';
import { HeroArtComponent } from '../hero-art/hero-art.component';
import { HeroAttributeListComponent } from '../hero-attribute-list/hero-attribute-list.component';
import { HeroDamageTypeComponent } from '../hero-damage-type/hero-damage-type.component';
import { HeroLevelTaglineComponent } from '../hero-level-tagline/hero-level-tagline.component';
import { HeroStatsTableComponent } from '../hero-stats-table/hero-stats-table.component';
import { HeroTaskLevelListComponent } from '../hero-task-level-list/hero-task-level-list.component';

@Component({
  selector: 'app-fusion-hero-display-tall',
  imports: [
    HeroArtComponent,
    HeroLevelTaglineComponent,
    HeroArchetypeListComponent,
    HeroStatsTableComponent,
    HeroTaskLevelListComponent,
    HeroDamageTypeComponent,
    HeroAttributeListComponent,
  ],
  templateUrl: './fusion-hero-display-tall.component.html',
  styleUrl: './fusion-hero-display-tall.component.scss',
})
export class FusionHeroDisplayTallComponent {
  public hero = input.required<GameHero>();
}

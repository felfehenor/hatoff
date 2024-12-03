import { Component, input } from '@angular/core';
import { HeroSpecialGlowDirective } from '../../directives/hero-special-glow.directive';
import { GameHero } from '../../interfaces';
import { HeroArchetypeListComponent } from '../hero-archetype-list/hero-archetype-list.component';
import { HeroArtComponent } from '../hero-art/hero-art.component';
import { HeroDamageTypeComponent } from '../hero-damage-type/hero-damage-type.component';
import { LevelDisplayComponent } from '../level-display/level-display.component';

@Component({
  selector: 'app-fusion-hero-display',
  imports: [
    HeroArtComponent,
    HeroArchetypeListComponent,
    LevelDisplayComponent,
    HeroSpecialGlowDirective,
    HeroDamageTypeComponent,
  ],
  templateUrl: './fusion-hero-display.component.html',
  styleUrl: './fusion-hero-display.component.scss',
})
export class FusionHeroDisplayComponent {
  public hero = input.required<GameHero>();
}

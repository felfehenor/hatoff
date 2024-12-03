import { PercentPipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { HeroSpecialGlowDirective } from '../../directives/hero-special-glow.directive';
import { GameHero } from '../../interfaces';
import { HeroArtComponent } from '../hero-art/hero-art.component';
import { HeroDamageTypeComponent } from '../hero-damage-type/hero-damage-type.component';
import { HeroFusionIndicatorComponent } from '../hero-fusion-indicator/hero-fusion-indicator.component';
import { HeroStatusComponent } from '../hero-status/hero-status.component';
import { LevelDisplayComponent } from '../level-display/level-display.component';

@Component({
  selector: 'app-hero-display',
  imports: [
    PercentPipe,
    HeroArtComponent,
    LevelDisplayComponent,
    HeroSpecialGlowDirective,
    HeroFusionIndicatorComponent,
    HeroStatusComponent,
    HeroDamageTypeComponent,
  ],
  templateUrl: './hero-display.component.html',
  styleUrl: './hero-display.component.scss',
})
export class HeroDisplayComponent {
  public hero = input.required<GameHero>();
  public clickable = input<boolean>(false);
  public active = input<boolean>(false);
}

import { PercentPipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { HeroSpecialGlowDirective } from '../../directives/hero-special-glow.directive';
import { GameHero } from '../../interfaces';
import { DamageTypeComponent } from '../damage-type/damage-type.component';
import { HeroArtComponent } from '../hero-art/hero-art.component';
import { HeroFusionIndicatorComponent } from '../hero-fusion-indicator/hero-fusion-indicator.component';
import { LevelDisplayComponent } from '../level-display/level-display.component';

@Component({
  selector: 'app-hero-display',
  standalone: true,
  imports: [
    DamageTypeComponent,
    PercentPipe,
    HeroArtComponent,
    LevelDisplayComponent,
    HeroSpecialGlowDirective,
    HeroFusionIndicatorComponent,
  ],
  templateUrl: './hero-display.component.html',
  styleUrl: './hero-display.component.scss',
})
export class HeroDisplayComponent {
  public hero = input.required<GameHero>();
  public clickable = input<boolean>(false);
  public active = input<boolean>(false);
}

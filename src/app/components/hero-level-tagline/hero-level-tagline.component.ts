import { DecimalPipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import { gameOvermind } from '@ng-icons/game-icons';
import { GameHero } from '../../interfaces';
import { HeroFusionIndicatorComponent } from '../hero-fusion-indicator/hero-fusion-indicator.component';
import { LevelDisplayComponent } from '../level-display/level-display.component';

@Component({
  selector: 'app-hero-level-tagline',
  imports: [DecimalPipe, LevelDisplayComponent, HeroFusionIndicatorComponent],
  providers: [
    provideIcons({
      gameOvermind,
    }),
  ],
  templateUrl: './hero-level-tagline.component.html',
  styleUrl: './hero-level-tagline.component.scss',
})
export class HeroLevelTaglineComponent {
  public hero = input.required<GameHero>();
  public showXp = input<boolean>(true);
}

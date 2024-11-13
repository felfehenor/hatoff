import { DecimalPipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { gameOvermind } from '@ng-icons/game-icons';
import { TippyDirective } from '@ngneat/helipopper';
import { GameHero } from '../../interfaces';

@Component({
  selector: 'app-hero-level-tagline',
  standalone: true,
  imports: [DecimalPipe, NgIconComponent, TippyDirective],
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

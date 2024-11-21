import { Component, input } from '@angular/core';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { gameOvermind } from '@ng-icons/game-icons';
import { TippyDirective } from '@ngneat/helipopper';
import { GameHero } from '../../interfaces';

@Component({
    selector: 'app-hero-fusion-indicator',
    imports: [TippyDirective, NgIconComponent],
    providers: [
        provideIcons({
            gameOvermind,
        }),
    ],
    templateUrl: './hero-fusion-indicator.component.html',
    styleUrl: './hero-fusion-indicator.component.scss'
})
export class HeroFusionIndicatorComponent {
  public hero = input.required<GameHero>();
}

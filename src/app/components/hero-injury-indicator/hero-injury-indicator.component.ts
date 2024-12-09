import { Component, computed, input } from '@angular/core';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { gameBrokenBone } from '@ng-icons/game-icons';
import { TippyDirective } from '@ngneat/helipopper';
import { heroInjuries } from '../../helpers';
import { GameHero } from '../../interfaces';

@Component({
  selector: 'app-hero-injury-indicator',
  imports: [TippyDirective, NgIconComponent],
  providers: [
    provideIcons({
      gameBrokenBone,
    }),
  ],
  templateUrl: './hero-injury-indicator.component.html',
  styleUrl: './hero-injury-indicator.component.scss',
})
export class HeroInjuryIndicatorComponent {
  public hero = input.required<GameHero>();

  public numInjuries = computed(() => heroInjuries(this.hero()).length);
}

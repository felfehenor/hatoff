import { Component, computed, input } from '@angular/core';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { tablerStars } from '@ng-icons/tabler-icons';
import { TippyDirective } from '@ngneat/helipopper';
import { isStunned } from '../../helpers';
import { GameHero } from '../../interfaces';

@Component({
  selector: 'app-hero-status',
  imports: [NgIconComponent, TippyDirective],
  providers: [
    provideIcons({
      tablerStars,
    }),
  ],
  templateUrl: './hero-status.component.html',
  styleUrl: './hero-status.component.scss',
})
export class HeroStatusComponent {
  public hero = input.required<GameHero>();

  public isStunned = computed(() => isStunned(this.hero()));
  public stunTooltip = computed(
    () => `This hero is incapacitated for ${this.hero().stunTicks} seconds.`,
  );
}

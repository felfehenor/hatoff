import { Component, computed } from '@angular/core';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { HeroSpecialGlowDirective } from '../../directives/hero-special-glow.directive';
import { feedablePetHeroes, feedHeroToPet, heroPetXp } from '../../helpers';
import { GameHero } from '../../interfaces';
import { HeroArtComponent } from '../hero-art/hero-art.component';
import { HeroLevelTaglineComponent } from '../hero-level-tagline/hero-level-tagline.component';

@Component({
  selector: 'app-pet-actions-feed-hero',
  imports: [
    HeroLevelTaglineComponent,
    HeroArtComponent,
    HeroSpecialGlowDirective,
    SweetAlert2Module,
  ],
  templateUrl: './pet-actions-feed-hero.component.html',
  styleUrl: './pet-actions-feed-hero.component.scss',
})
export class PetActionsFeedHeroComponent {
  public viableFoodCandidates = computed(() => feedablePetHeroes());

  public xpForHero(hero: GameHero): number {
    return heroPetXp(hero);
  }

  public feedHeroToPet(hero: GameHero): void {
    feedHeroToPet(hero);
  }
}

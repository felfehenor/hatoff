import { Component, computed, signal } from '@angular/core';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { FusionHeroDisplayTallComponent } from '../../components/fusion-hero-display-tall/fusion-hero-display-tall.component';
import { FusionHeroDisplayComponent } from '../../components/fusion-hero-display/fusion-hero-display.component';
import { PageCardComponent } from '../../components/page-card/page-card.component';
import {
  doFusion,
  heroFusionResult,
  validFusionHeroes,
  validFusionHeroesForHero,
} from '../../helpers';
import { GameHero } from '../../interfaces';

@Component({
  selector: 'app-game-fusion',
  standalone: true,
  imports: [
    PageCardComponent,
    FusionHeroDisplayComponent,
    FusionHeroDisplayTallComponent,
    SweetAlert2Module,
  ],
  templateUrl: './game-fusion.component.html',
  styleUrl: './game-fusion.component.scss',
})
export class GameFusionComponent {
  public mainHero = signal<GameHero | undefined>(undefined);
  public subHero = signal<GameHero | undefined>(undefined);

  public viableMainHeroes = computed(() => validFusionHeroes());
  public viableSubHeroes = computed(() => {
    const main = this.mainHero();
    if (!main) return [];

    return validFusionHeroesForHero(main);
  });

  public resultingHero = computed(() => {
    const main = this.mainHero();
    const sub = this.subHero();

    if (!main || !sub) return undefined;

    return heroFusionResult(main, sub);
  });

  public rechoosePrimary() {
    this.mainHero.set(undefined);
    this.rechooseSecondary();
  }

  public rechooseSecondary() {
    this.subHero.set(undefined);
  }

  public fuse() {
    const main = this.mainHero();
    const sub = this.subHero();
    if (!main || !sub) return;

    doFusion(main, sub);

    this.mainHero.set(undefined);
    this.subHero.set(undefined);
  }
}

import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { FusionHeroDisplayTallComponent } from '../../components/fusion-hero-display-tall/fusion-hero-display-tall.component';
import { FusionHeroDisplayComponent } from '../../components/fusion-hero-display/fusion-hero-display.component';
import { PageCardComponent } from '../../components/page-card/page-card.component';
import { ResourceDisplayComponent } from '../../components/resource-display/resource-display.component';
import { AnalyticsClickDirective } from '../../directives/analytics-click.directive';
import {
  doFusion,
  fusionManaCost,
  getEntry,
  hasResource,
  heroFusionResult,
  validFusionHeroes,
  validFusionHeroesForHero,
} from '../../helpers';
import { GameDamageType, GameHero, GameResource } from '../../interfaces';

@Component({
  selector: 'app-game-fusion',
  imports: [
    PageCardComponent,
    FusionHeroDisplayComponent,
    FusionHeroDisplayTallComponent,
    SweetAlert2Module,
    AnalyticsClickDirective,
    FormsModule,
    ResourceDisplayComponent,
  ],
  templateUrl: './game-fusion.component.html',
  styleUrl: './game-fusion.component.scss',
})
export class GameFusionComponent {
  public mainHero = signal<GameHero | undefined>(undefined);
  public subHero = signal<GameHero | undefined>(undefined);

  public secondaryFilterType = signal<'All' | 'Matching' | 'Similar'>('All');

  public viableMainHeroes = computed(() => validFusionHeroes());
  public viableSubHeroes = computed(() => {
    const main = this.mainHero();
    if (!main) return [];

    const filterType = this.secondaryFilterType();

    const baseHeroes = validFusionHeroesForHero(main);
    if (filterType === 'Matching')
      return baseHeroes.filter((f) => f.damageTypeId === main.damageTypeId);

    if (filterType === 'Similar') {
      return baseHeroes.filter((h) => {
        const mainType = getEntry<GameDamageType>(main.damageTypeId)!;
        const subType = getEntry<GameDamageType>(h.damageTypeId)!;

        return (
          mainType.subTypes.some((s) => s.damageTypeId === subType.id) ||
          subType.subTypes.some((s) => s.damageTypeId === mainType.id)
        );
      });
    }

    return baseHeroes;
  });

  public resultingHero = computed(() => {
    const main = this.mainHero();
    const sub = this.subHero();

    if (!main || !sub) return undefined;

    return heroFusionResult(main, sub);
  });

  public fusionCost = computed(() =>
    fusionManaCost(this.resultingHero()?.fusionLevel ?? 1),
  );

  public canFuse = computed(() =>
    hasResource(getEntry<GameResource>('Mana')!, this.fusionCost()),
  );

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

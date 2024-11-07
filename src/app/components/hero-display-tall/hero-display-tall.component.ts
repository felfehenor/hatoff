import { DecimalPipe, TitleCasePipe } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { gamestate, setHeroDamageType } from '../../helpers';
import { AllGameHeroStats, GameHero, GameHeroStat } from '../../interfaces';
import { ArchetypeDisplayComponent } from '../archetype-display/archetype-display.component';
import { ContentNameComponent } from '../content-name/content-name.component';
import { DamageTypeComponent } from '../damage-type/damage-type.component';
import { HeroArtComponent } from '../hero-art/hero-art.component';

@Component({
  selector: 'app-hero-display-tall',
  standalone: true,
  imports: [
    DecimalPipe,
    DamageTypeComponent,
    ContentNameComponent,
    TitleCasePipe,
    HeroArtComponent,
    ArchetypeDisplayComponent,
  ],
  templateUrl: './hero-display-tall.component.html',
  styleUrl: './hero-display-tall.component.scss',
})
export class HeroDisplayTallComponent {
  public hero = input.required<GameHero>();

  public canEditHeroStats = computed(
    () => this.hero()?.id === gamestate().townSetup.heroId,
  );

  public readonly gameStats: GameHeroStat[] = AllGameHeroStats;

  public changeMainCharacterType(newType: string) {
    const hero = this.hero();
    if (!hero) return;

    setHeroDamageType(hero, newType);
  }
}

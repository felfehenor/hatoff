import { DecimalPipe, NgClass, TitleCasePipe } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { allHeroes, gamestate, setHeroDamageType } from '../../helpers';
import { AllGameHeroStats, GameHero, GameHeroStat } from '../../interfaces';
import { ContentNameComponent } from '../content-name/content-name.component';
import { DamageTypeComponent } from '../damage-type/damage-type.component';
import { HeroDisplayComponent } from '../hero-display/hero-display.component';

@Component({
  selector: 'app-hero-list',
  standalone: true,
  imports: [
    HeroDisplayComponent,
    NgClass,
    ContentNameComponent,
    TitleCasePipe,
    DecimalPipe,
    DamageTypeComponent,
  ],
  templateUrl: './hero-list.component.html',
  styleUrl: './hero-list.component.scss',
})
export class HeroListComponent {
  public allHeroes = computed(() => allHeroes());
  public canEditHeroStats = computed(
    () => this.selectedHero()?.id === gamestate().townSetup.heroId,
  );

  public selectedHero = signal<GameHero | undefined>(undefined);

  public readonly gameStats: GameHeroStat[] = AllGameHeroStats;

  public cardClasses = computed(() => {
    if (this.selectedHero()) {
      return [
        'sm:min-w-[95%]',
        'sm:max-w-[95%]',
        'md:min-w-[95%]',
        'md:max-w-[95%]',
        'lg:min-w-[45%]',
        'lg:max-w-[45%]',
      ];
    }

    return [
      'sm:min-w-[45%]',
      'sm:max-w-[45%]',
      'lg:min-w-[30%]',
      'lg:max-w-[30%]',
      'xl:min-w-[23%]',
      'xl:max-w-[23%]',
    ];
  });

  public changeMainCharacterType(newType: string) {
    const hero = this.selectedHero();
    if (!hero) return;

    setHeroDamageType(hero, newType);
  }
}

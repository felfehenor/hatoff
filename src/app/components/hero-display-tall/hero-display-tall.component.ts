import { DecimalPipe, TitleCasePipe } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import {
  currentHeroTask,
  gamestate,
  getHero,
  setHeroDamageType,
} from '../../helpers';
import { AllGameHeroStats, GameHero, GameHeroStat } from '../../interfaces';
import { ArchetypeDisplayComponent } from '../archetype-display/archetype-display.component';
import { ContentNameComponent } from '../content-name/content-name.component';
import { DamageTypeComponent } from '../damage-type/damage-type.component';
import { HeroArtComponent } from '../hero-art/hero-art.component';
import { HeroTaskLevelDisplayComponent } from '../hero-task-level-display/hero-task-level-display.component';

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
    HeroTaskLevelDisplayComponent,
  ],
  templateUrl: './hero-display-tall.component.html',
  styleUrl: './hero-display-tall.component.scss',
})
export class HeroDisplayTallComponent {
  public hero = input.required<GameHero>();

  public liveHeroData = computed(() => getHero(this.hero().id));

  public canEditHeroStats = computed(
    () => this.hero()?.id === gamestate().townSetup.heroId,
  );

  public currentHeroTask = computed(() => currentHeroTask(this.hero())?.name);

  public allHeroTaskLevels = computed(() =>
    Object.keys(this.hero().taskLevels),
  );

  public readonly gameStats: GameHeroStat[] = AllGameHeroStats;

  public changeMainCharacterType(newType: string) {
    const hero = this.hero();
    if (!hero) return;

    setHeroDamageType(hero, newType);
  }
}

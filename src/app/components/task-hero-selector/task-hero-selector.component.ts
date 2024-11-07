import { Component, computed, input } from '@angular/core';
import {
  allHeroes,
  assignHeroToTask,
  currentHeroTask,
  heroesAllocatedToTask,
  isHeroAllocatedToTask,
  unassignHeroTask,
} from '../../helpers';
import { GameHero, GameTask } from '../../interfaces';
import { DamageTypeComponent } from '../damage-type/damage-type.component';
import { HeroArtComponent } from '../hero-art/hero-art.component';

@Component({
  selector: 'app-task-hero-selector',
  standalone: true,
  imports: [HeroArtComponent, DamageTypeComponent],
  templateUrl: './task-hero-selector.component.html',
  styleUrl: './task-hero-selector.component.scss',
})
export class TaskHeroSelectorComponent {
  public task = input.required<GameTask>();
  public heroes = computed(() => heroesAllocatedToTask(this.task()));
  public allHeroes = computed(() =>
    allHeroes()
      .concat(allHeroes())
      .concat(allHeroes())
      .concat(allHeroes())
      .concat(allHeroes())
      .concat(allHeroes())
      .concat(allHeroes())
      .concat(allHeroes())
      .concat(allHeroes())
      .concat(allHeroes())
      .concat(allHeroes())
      .concat(allHeroes())
      .concat(allHeroes())
      .concat(allHeroes())
      .concat(allHeroes())
      .concat(allHeroes())
      .concat(allHeroes()),
  );

  public selectHero(hero: GameHero): void {
    if (isHeroAllocatedToTask(this.task(), hero)) {
      unassignHeroTask(hero);
      return;
    }

    assignHeroToTask(this.task(), hero);
  }

  public isHeroSelected(hero: GameHero): boolean {
    return isHeroAllocatedToTask(this.task(), hero);
  }

  public currentTaskNameForHero(hero: GameHero): string | undefined {
    return currentHeroTask(hero)?.name;
  }
}

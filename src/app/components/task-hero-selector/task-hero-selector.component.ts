import { Component, computed, input, output } from '@angular/core';
import {
  allHeroes,
  assignHeroToTask,
  currentHeroTask,
  heroesAllocatedToTask,
  isHeroAllocatedToTask,
  unassignHeroTask,
} from '../../helpers';
import { GameHero, GameTask } from '../../interfaces';
import { ButtonCloseComponent } from '../button-close/button-close.component';
import { DamageTypeComponent } from '../damage-type/damage-type.component';
import { HeroArtComponent } from '../hero-art/hero-art.component';
import { HeroAssignmentComponent } from '../hero-assignment/hero-assignment.component';

@Component({
  selector: 'app-task-hero-selector',
  standalone: true,
  imports: [
    HeroArtComponent,
    DamageTypeComponent,
    HeroAssignmentComponent,
    ButtonCloseComponent,
  ],
  templateUrl: './task-hero-selector.component.html',
  styleUrl: './task-hero-selector.component.scss',
})
export class TaskHeroSelectorComponent {
  public task = input.required<GameTask>();
  public close = output<void>();

  public heroes = computed(() => heroesAllocatedToTask(this.task()));
  public allHeroes = computed(() => allHeroes());

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

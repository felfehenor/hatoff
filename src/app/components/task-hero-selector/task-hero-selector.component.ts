import { Component, computed, input, output } from '@angular/core';
import { sortBy } from 'lodash';
import {
  allHeroes,
  assignHeroToTask,
  canAllocateHeroToTask,
  currentHeroTask,
  getDamageForcePercentage,
  getEntry,
  heroesAllocatedToTask,
  isHeroAllocatedToTask,
  unassignHeroTask,
} from '../../helpers';
import { GameDamageType, GameHero, GameTask, HeroMood } from '../../interfaces';
import { ButtonCloseComponent } from '../button-close/button-close.component';
import { DamageTypeBreakdownComponent } from '../damage-type-breakdown/damage-type-breakdown.component';
import { DamageTypeComponent } from '../damage-type/damage-type.component';
import { HeroArchetypeListComponent } from '../hero-archetype-list/hero-archetype-list.component';
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
    HeroArchetypeListComponent,
    DamageTypeBreakdownComponent,
  ],
  templateUrl: './task-hero-selector.component.html',
  styleUrl: './task-hero-selector.component.scss',
})
export class TaskHeroSelectorComponent {
  public task = input.required<GameTask>();
  public close = output<void>();

  public heroes = computed(() => heroesAllocatedToTask(this.task()));
  public allHeroes = computed(() =>
    sortBy(allHeroes(), [
      (hero) => !this.heroes().includes(hero),
      (hero) => !canAllocateHeroToTask(hero, this.task()),
    ]),
  );

  public selectHero(hero: GameHero): void {
    if (!this.canAssignHeroToTask(hero)) return;

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

  public canAssignHeroToTask(hero: GameHero): boolean {
    return (
      canAllocateHeroToTask(hero, this.task()) ||
      isHeroAllocatedToTask(this.task(), hero)
    );
  }

  public heroMood(hero: GameHero): HeroMood {
    const damageType = getEntry<GameDamageType>(hero.damageTypeId);
    const taskDamageType = getEntry<GameDamageType>(this.task().damageTypeId);

    if (!damageType || !taskDamageType) return 'surprise';

    const percentDamageApplied = getDamageForcePercentage(
      damageType,
      taskDamageType,
    );
    if (percentDamageApplied === 100) return 'happy';
    if (percentDamageApplied === 0) return 'sad';
    return 'neutral';
  }
}

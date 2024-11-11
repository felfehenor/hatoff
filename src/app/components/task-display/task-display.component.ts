import { Component, computed, input } from '@angular/core';
import { getTaskProgress, heroesAllocatedToTask } from '../../helpers';
import { GameTask } from '../../interfaces';
import { DamageTypeBreakdownComponent } from '../damage-type-breakdown/damage-type-breakdown.component';
import { TaskHeroSmallComponent } from '../task-hero-small/task-hero-small.component';

@Component({
  selector: 'app-task-display',
  standalone: true,
  imports: [TaskHeroSmallComponent, DamageTypeBreakdownComponent],
  templateUrl: './task-display.component.html',
  styleUrl: './task-display.component.scss',
})
export class TaskDisplayComponent {
  public task = input.required<GameTask>();
  public active = input<boolean>(false);
  public heroes = computed(() => heroesAllocatedToTask(this.task()));

  public completion = computed(
    () =>
      (getTaskProgress(this.task()) / this.task().damageRequiredPerCycle) * 100,
  );
}

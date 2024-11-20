import { DecimalPipe } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { TippyDirective } from '@ngneat/helipopper';
import { sum } from 'lodash';
import {
  getOption,
  getTaskDamageType,
  getTaskProgress,
  heroesAllocatedToTask,
  isStrictDamageType,
  isTaskThreatened,
  maxHeroesForTask,
  maxTaskLevel,
  taskLevel,
  totalHeroForce,
  totalHeroSpeed,
} from '../../helpers';
import { GameTask } from '../../interfaces';
import { DamageTypeBreakdownComponent } from '../damage-type-breakdown/damage-type-breakdown.component';
import { LevelDisplayComponent } from '../level-display/level-display.component';
import { TaskHeroSmallComponent } from '../task-hero-small/task-hero-small.component';
import { TaskSynergyComponent } from '../task-synergy/task-synergy.component';

@Component({
  selector: 'app-task-display',
  standalone: true,
  imports: [
    TaskHeroSmallComponent,
    DamageTypeBreakdownComponent,
    TaskSynergyComponent,
    LevelDisplayComponent,
    TippyDirective,
    DecimalPipe,
  ],
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

  public maxHeroes = computed(() => maxHeroesForTask(this.task()));
  public taskLevel = computed(() => taskLevel(this.task()));
  public maxTasklevel = computed(() => maxTaskLevel(this.task()));
  public isStrict = computed(() => isStrictDamageType(this.task()));

  public taskDamageType = computed(() => getTaskDamageType(this.task()));
  public threatened = computed(() => isTaskThreatened(this.task()));

  public perTick = computed(() => {
    const task = this.task();
    const numTicksPerTick = getOption('tickMultiplier');
    const heroes = heroesAllocatedToTask(task);
    const totalSpeed = sum(
      heroes.map((t) => totalHeroSpeed(t, task, numTicksPerTick)),
    );

    if (totalSpeed > 0) {
      const numApplications = totalSpeed / task.speedPerCycle;
      const heroDamage = sum(
        heroes.map((t) => totalHeroForce(t, task, numApplications)),
      );
      return heroDamage;
    }

    return 0;
  });

  public requiredPerTick = computed(() => this.task().damageRequiredPerCycle);
}

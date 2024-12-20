import { DecimalPipe } from '@angular/common';
import { Component, computed, input, output } from '@angular/core';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { tablerInfoHexagon } from '@ng-icons/tabler-icons';
import { TippyDirective } from '@ngneat/helipopper';
import { sum } from 'lodash';
import {
  getEntry,
  getOption,
  getTaskDamageType,
  getTaskProgress,
  heroesAllocatedToTask,
  isStrictDamageType,
  isTaskThreatened,
  maxHeroesForTask,
  maxTaskLevel,
  taskErrors,
  taskLevel,
  totalHeroForce,
  totalHeroSpeed,
} from '../../helpers';
import { GameDamageType, GameTask } from '../../interfaces';
import { DamageTypeBreakdownComponent } from '../damage-type-breakdown/damage-type-breakdown.component';
import { LevelDisplayComponent } from '../level-display/level-display.component';
import { TaskHeroSmallComponent } from '../task-hero-small/task-hero-small.component';
import { TaskSynergyComponent } from '../task-synergy/task-synergy.component';

@Component({
  selector: 'app-task-display',
  imports: [
    TaskHeroSmallComponent,
    DamageTypeBreakdownComponent,
    TaskSynergyComponent,
    LevelDisplayComponent,
    TippyDirective,
    DecimalPipe,
    NgIconComponent,
  ],
  providers: [
    provideIcons({
      tablerInfoHexagon,
    }),
  ],
  templateUrl: './task-display.component.html',
  styleUrl: './task-display.component.scss',
})
export class TaskDisplayComponent {
  public task = input.required<GameTask>();
  public showSubtasks = input<boolean>(false);
  public active = input<boolean>(false);

  public selectSubtask = output<GameTask>();

  public heroes = computed(() => {
    if (this.isPaired()) {
      return (
        this.task().pairsTaskIds?.flatMap((id) =>
          heroesAllocatedToTask(getEntry<GameTask>(id)!),
        ) ?? []
      );
    }

    return heroesAllocatedToTask(this.task());
  });

  public isPaired = computed(() => this.task().pairsTaskIds?.length);
  public subTasks = computed(() =>
    (this.task().pairsTaskIds ?? []).map((t) => getEntry<GameTask>(t)!),
  );

  public completion = computed(
    () =>
      (getTaskProgress(this.task()) /
        Math.max(1, this.task().damageRequiredPerCycle)) *
      100,
  );

  public maxHeroes = computed(() => maxHeroesForTask(this.task()));
  public taskLevel = computed(() => taskLevel(this.task()));
  public maxTasklevel = computed(() => maxTaskLevel(this.task()));
  public mainTaskStrict = computed(() => this.isTaskStrict(this.task()));
  public mainTaskDamageType = computed(() => this.taskDamageType(this.task()));
  public threatened = computed(() => {
    if (this.isPaired()) {
      return this.subTasks().some((t) => this.isTaskThreatened(t));
    }

    return this.isTaskThreatened(this.task());
  });

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
  public errorString = computed(() => {
    if (this.isPaired()) {
      return this.subTasks()
        .map((t) => taskErrors(t))
        .filter(Boolean)[0];
    }

    return taskErrors(this.task());
  });

  public taskDamageType(task: GameTask): GameDamageType {
    return getTaskDamageType(task);
  }

  public isTaskStrict(task: GameTask): boolean {
    return isStrictDamageType(task);
  }

  public isTaskThreatened(task: GameTask): boolean {
    return isTaskThreatened(task);
  }
}

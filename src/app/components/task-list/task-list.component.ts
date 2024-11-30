import { NgClass } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { AnalyticsClickDirective } from '../../directives/analytics-click.directive';
import { allUnlockedTasks, hasEnoughFortifications } from '../../helpers';
import { GameTask } from '../../interfaces';
import { TaskDisplayComponent } from '../task-display/task-display.component';
import { TaskHeroSelectorComponent } from '../task-hero-selector/task-hero-selector.component';

@Component({
  selector: 'app-task-list',
  imports: [
    TaskDisplayComponent,
    NgClass,
    TaskHeroSelectorComponent,
    AnalyticsClickDirective,
  ],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.scss',
})
export class TaskListComponent {
  public selectedTask = signal<GameTask | undefined>(undefined);

  public allTasks = computed(() =>
    allUnlockedTasks().filter((t) => t.maxHeroesAllocable > 0),
  );

  public meetsRequiredDefense = computed(() => hasEnoughFortifications());

  public cardClasses = computed(() => {
    if (this.selectedTask()) {
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
}

import { Component, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TippyDirective } from '@ngneat/helipopper';
import { sortBy } from 'lodash';
import { CountdownComponent } from '../../components/countdown/countdown.component';
import { PageCardComponent } from '../../components/page-card/page-card.component';
import { TaskListComponent } from '../../components/task-list/task-list.component';
import {
  allUnlockedTasks,
  gamestate,
  getEntry,
  hasQueuedAttack,
  localStorageSignal,
  numHeroesAllocatedToTask,
  numIdleHeroes,
} from '../../helpers';
import { GameDamageType } from '../../interfaces';

@Component({
  selector: 'app-game-town',
  imports: [
    PageCardComponent,
    TaskListComponent,
    CountdownComponent,
    TippyDirective,
    FormsModule,
  ],
  templateUrl: './game-town.component.html',
  styleUrl: './game-town.component.scss',
})
export class GameTownComponent {
  public activeSort = localStorageSignal<
    'numallocated' | 'alphabetical' | 'damagetype'
  >('alphabetical', 'sort-gametown');

  public taskOrder = computed(() => {
    const baseTasks = allUnlockedTasks().filter(
      (t) =>
        (t.maxHeroesAllocable > 0 && !t.pairedTaskId) ||
        (t.pairsTaskIds?.length ?? 0) > 0,
    );

    switch (this.activeSort()) {
      case 'alphabetical':
        return sortBy(baseTasks, (t) => t.name);
      case 'numallocated':
        return sortBy(baseTasks, (t) => -numHeroesAllocatedToTask(t));
      case 'damagetype':
        return sortBy(
          baseTasks,
          (t) => getEntry<GameDamageType>(t.damageTypeId)?.name,
        );
    }

    return baseTasks;
  });

  public numIdle = computed(() => numIdleHeroes());

  public shouldShowCountdown = computed(() => hasQueuedAttack());
  public secondsUntilAttack = computed(
    () => gamestate().cooldowns.nextDefenseAttackTime,
  );

  public defenseTooltip = computed(() => {
    const required = gamestate().defense.incomingDamage;
    return `You'll need to generate ${required.toLocaleString()} Fortifications to fully protect against this attack. If you don't, your buildings and heroes will be attacked.`;
  });
}

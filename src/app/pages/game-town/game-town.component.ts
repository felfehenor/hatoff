import { Component, computed } from '@angular/core';
import { TippyDirective } from '@ngneat/helipopper';
import { CountdownComponent } from '../../components/countdown/countdown.component';
import { PageCardComponent } from '../../components/page-card/page-card.component';
import { TaskListComponent } from '../../components/task-list/task-list.component';
import { gamestate, hasQueuedAttack, numIdleHeroes } from '../../helpers';

@Component({
  selector: 'app-game-town',
  standalone: true,
  imports: [
    PageCardComponent,
    TaskListComponent,
    CountdownComponent,
    TippyDirective,
  ],
  templateUrl: './game-town.component.html',
  styleUrl: './game-town.component.scss',
})
export class GameTownComponent {
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

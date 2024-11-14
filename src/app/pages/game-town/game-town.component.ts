import { Component, computed } from '@angular/core';
import { PageCardComponent } from '../../components/page-card/page-card.component';
import { ResourceDisplayComponent } from '../../components/resource-display/resource-display.component';
import { TaskListComponent } from '../../components/task-list/task-list.component';
import { gamestate, getEntry, numIdleHeroes, options } from '../../helpers';

@Component({
  selector: 'app-game-town',
  standalone: true,
  imports: [PageCardComponent, TaskListComponent, ResourceDisplayComponent],
  templateUrl: './game-town.component.html',
  styleUrl: './game-town.component.scss',
})
export class GameTownComponent {
  public numIdle = computed(() => numIdleHeroes());

  public resources = computed(() =>
    options().debugShowAllResources
      ? Object.keys(gamestate().resources).filter((k) => getEntry(k))
      : ['Gold', 'Wood', 'Stone', 'Food'],
  );
}

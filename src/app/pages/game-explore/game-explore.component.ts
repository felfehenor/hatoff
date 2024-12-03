import { Component, computed, signal } from '@angular/core';
import { DungeonListComponent } from '../../components/dungeon-list/dungeon-list.component';
import { PageCardComponent } from '../../components/page-card/page-card.component';
import { RelicListComponent } from '../../components/relic-list/relic-list.component';
import { allUnlockedDungeons } from '../../helpers';

@Component({
  selector: 'app-game-explore',
  imports: [PageCardComponent, DungeonListComponent, RelicListComponent],
  templateUrl: './game-explore.component.html',
  styleUrl: './game-explore.component.scss',
})
export class GameExploreComponent {
  public mode = signal<'Dungeons' | 'Relics'>('Dungeons');

  public dungeonList = computed(() => allUnlockedDungeons());
}

import { Component, computed } from '@angular/core';
import { DungeonListComponent } from '../../components/dungeon-list/dungeon-list.component';
import { PageCardComponent } from '../../components/page-card/page-card.component';
import { allUnlockedDungeons } from '../../helpers';

@Component({
  selector: 'app-game-explore',
  imports: [PageCardComponent, DungeonListComponent],
  templateUrl: './game-explore.component.html',
  styleUrl: './game-explore.component.scss',
})
export class GameExploreComponent {
  public dungeonList = computed(() => allUnlockedDungeons());
}

import { NgClass } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { AnalyticsClickDirective } from '../../directives/analytics-click.directive';
import {
  baseCardClasses,
  gamestate,
  isDungeonInProgress,
  setActiveDungeon,
} from '../../helpers';
import { GameDungeon } from '../../interfaces';
import { DungeonDisplayComponent } from '../dungeon-display/dungeon-display.component';

@Component({
  selector: 'app-dungeon-list',
  imports: [NgClass, DungeonDisplayComponent, AnalyticsClickDirective],
  templateUrl: './dungeon-list.component.html',
  styleUrl: './dungeon-list.component.scss',
})
export class DungeonListComponent {
  public displayedDungeons = input.required<GameDungeon[]>();
  public activeDungeon = computed(() => gamestate().activeDungeon);
  public isAnyDungeonActive = computed(() => isDungeonInProgress());

  public cardClasses = computed(() => {
    return baseCardClasses();
  });

  public selectDungeon(dungeon: GameDungeon): void {
    if (this.isAnyDungeonActive()) return;
    setActiveDungeon(dungeon);
  }
}

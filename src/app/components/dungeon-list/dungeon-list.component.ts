import { NgClass } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { gamestate, setActiveDungeon } from '../../helpers';
import { GameDungeon } from '../../interfaces';
import { DungeonDisplayComponent } from '../dungeon-display/dungeon-display.component';

@Component({
  selector: 'app-dungeon-list',
  imports: [NgClass, DungeonDisplayComponent],
  templateUrl: './dungeon-list.component.html',
  styleUrl: './dungeon-list.component.scss',
})
export class DungeonListComponent {
  public displayedDungeons = input.required<GameDungeon[]>();
  public activeDungeon = computed(() => gamestate().activeDungeon);

  public cardClasses = computed(() => {
    return [
      'sm:min-w-[45%]',
      'sm:max-w-[45%]',
      'lg:min-w-[30%]',
      'lg:max-w-[30%]',
      'xl:min-w-[23%]',
      'xl:max-w-[23%]',
    ];
  });

  public selectDungeon(dungeon: GameDungeon): void {
    setActiveDungeon(dungeon);
  }
}

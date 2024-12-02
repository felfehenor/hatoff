import { NgClass } from '@angular/common';
import { Component, computed } from '@angular/core';
import { gamestate, getEntry } from '../../helpers';
import { GameLoot } from '../../interfaces';
import { RelicDisplayComponent } from '../relic-display/relic-display.component';

@Component({
  selector: 'app-relic-list',
  imports: [RelicDisplayComponent, NgClass],
  templateUrl: './relic-list.component.html',
  styleUrl: './relic-list.component.scss',
})
export class RelicListComponent {
  public unlockedRelics = computed(
    () =>
      Object.keys(gamestate().foundLoot ?? {})
        .map((lootId) => getEntry<GameLoot>(lootId))
        .filter(Boolean) as GameLoot[],
  );

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
}

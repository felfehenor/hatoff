import { Component, computed, input } from '@angular/core';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import {
  tablerAward,
  tablerCircleCheck,
  tablerClock,
  tablerPackage,
  tablerSword,
  tablerSwords,
} from '@ng-icons/tabler-icons';
import { TippyDirective } from '@ngneat/helipopper';
import {
  currentDungeonStep,
  currentTicksForDungeon,
  dungeonCompletionPercent,
  gamestate,
  getEntry,
  isCurrentDungeon,
  isDungeonComplete,
  totalTicksForDungeon,
} from '../../helpers';
import { GameDungeon, GameLoot } from '../../interfaces';

@Component({
  selector: 'app-dungeon-display',
  imports: [NgIconComponent, TippyDirective],
  providers: [
    provideIcons({
      tablerSword,
      tablerSwords,
      tablerCircleCheck,
      tablerPackage,
      tablerAward,
      tablerClock,
    }),
  ],
  templateUrl: './dungeon-display.component.html',
  styleUrl: './dungeon-display.component.scss',
})
export class DungeonDisplayComponent {
  public dungeon = input.required<GameDungeon>();
  public active = input<boolean>(false);

  public isDone = computed(() => isDungeonComplete(this.dungeon().id));

  public allLoots = computed(() =>
    this.dungeon().encounters.filter((f) => f.type === 'loot'),
  );

  public lootItemNames = computed(() => {
    const lootNames = this.dungeon()
      .encounters.filter((f) => f.type === 'loot')
      .map((l) => getEntry<GameLoot>(l.lootId)?.name ?? 'Unknown');

    return lootNames.join(', ');
  });

  public enemyNames = computed(() =>
    gamestate()
      .exploration.currentCombat?.defenders.map((t) => t.name)
      .join(', '),
  );

  public numFights = computed(
    () => this.dungeon().encounters.filter((f) => f.type === 'fight').length,
  );
  public numTreasures = computed(
    () => this.dungeon().encounters.filter((f) => f.type === 'treasure').length,
  );
  public numLoots = computed(
    () => this.dungeon().encounters.filter((f) => f.type === 'loot').length,
  );

  public dungeonTickDisplay = computed(() => {
    const total = totalTicksForDungeon(this.dungeon());

    if (this.active()) {
      const current = currentTicksForDungeon(this.dungeon());
      return `${current} / ${total}`;
    }

    return total;
  });

  public currentDungeonStepType = computed(() =>
    this.active() ? currentDungeonStep()?.type : '',
  );

  public isCurrent = computed(() => isCurrentDungeon(this.dungeon()));
  public completion = computed(() => dungeonCompletionPercent());
}

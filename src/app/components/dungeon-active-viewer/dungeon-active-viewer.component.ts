import { Component, computed, effect, output } from '@angular/core';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import {
  tablerAward,
  tablerClock,
  tablerPackage,
  tablerSword,
} from '@ng-icons/tabler-icons';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { clamp } from 'lodash';
import { currentDungeon, fleeDungeon, gamestate } from '../../helpers';
import {
  GameDungeonEncounter,
  GameDungeonEncounterType,
} from '../../interfaces';
import { BlankSlateComponent } from '../blank-slate/blank-slate.component';
import { DungeonActiveViewerCombatComponent } from '../dungeon-active-viewer-combat/dungeon-active-viewer-combat.component';
import { DungeonActiveViewerExploringpartyComponent } from '../dungeon-active-viewer-exploringparty/dungeon-active-viewer-exploringparty.component';
import { DungeonActiveViewerLootComponent } from '../dungeon-active-viewer-loot/dungeon-active-viewer-loot.component';
import { DungeonActiveViewerTreasureComponent } from '../dungeon-active-viewer-treasure/dungeon-active-viewer-treasure.component';

@Component({
  selector: 'app-dungeon-active-viewer',
  imports: [
    DungeonActiveViewerCombatComponent,
    DungeonActiveViewerLootComponent,
    DungeonActiveViewerTreasureComponent,
    DungeonActiveViewerExploringpartyComponent,
    BlankSlateComponent,
    NgIconComponent,
    SweetAlert2Module,
  ],
  providers: [
    provideIcons({
      tablerSword,
      tablerAward,
      tablerPackage,
      tablerClock,
    }),
  ],
  templateUrl: './dungeon-active-viewer.component.html',
  styleUrl: './dungeon-active-viewer.component.scss',
})
export class DungeonActiveViewerComponent {
  public close = output<void>();

  public shouldShow = computed(() => this.state()?.isExploring);
  public state = computed(() => gamestate().exploration);

  public currentStepDisplay = computed(() => {
    const dungeon = currentDungeon();
    if (!dungeon) return [];

    const state = this.state();

    const currentStep = clamp(state.currentStep, 0, dungeon.encounters.length);
    const stepBoundary = [
      {
        rawStep: dungeon.encounters[currentStep - 1],
        stepNum: currentStep - 1,
        barAfter: true,
        barBefore: true,
        barAfterValue: 1,
        barAfterMax: 1,
      },
      {
        rawStep: dungeon.encounters[currentStep + 0],
        stepNum: currentStep + 0,
        barAfter: true,
        barBefore: true,
        barAfterValue:
          dungeon.encounters[currentStep + 0]?.ticksRequired > 0
            ? state.currentStepTicks
            : 0,
        barAfterMax: dungeon.encounters[currentStep + 0]?.ticksRequired,
      },
      {
        rawStep: dungeon.encounters[currentStep + 1],
        stepNum: currentStep + 1,
        barAfter: false,
        barBefore: false,
        barAfterValue: 0,
        barAfterMax: 0,
      },
      {
        rawStep: dungeon.encounters[currentStep + 2],
        stepNum: currentStep + 2,
        barAfter: false,
        barBefore: false,
        barAfterValue: 0,
        barAfterMax: 0,
      },
    ]
      .filter((x) => x.rawStep)
      .slice(0, 3)
      .map((boundary) => ({
        ...boundary,
        hasBarBefore: boundary.stepNum > 0,
        hasBarAfter: boundary.stepNum < dungeon.encounters.length - 1,
      }));

    if (stepBoundary.length === 2) {
      stepBoundary.push(undefined as never);
    }

    return stepBoundary;
  });

  public currentStepType = computed(() => {
    const dungeon = currentDungeon();
    if (!dungeon) return undefined;

    const curStep = this.state().currentStep;
    const type = dungeon.encounters[curStep]?.type;

    if (!type && curStep <= 0) return 'prepare';
    if (!type && curStep > 0) return 'finalize';

    return type ?? 'unknown';
  });

  public currentDungeonName = computed(() => currentDungeon()?.name);

  constructor() {
    effect(() => {
      if (this.shouldShow()) return;

      this.close.emit();
    });
  }

  public stepIcon(step: GameDungeonEncounter) {
    const typeIcons: Record<GameDungeonEncounterType, string> = {
      fight: 'tablerSword',
      loot: 'tablerAward',
      treasure: 'tablerPackage',
    };

    return typeIcons[step.type];
  }

  public flee() {
    fleeDungeon();
  }
}

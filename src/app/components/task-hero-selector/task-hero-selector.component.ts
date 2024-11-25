import { Component, computed, input, output, signal } from '@angular/core';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { tablerAlertOctagon } from '@ng-icons/tabler-icons';
import { TippyDirective } from '@ngneat/helipopper';
import { sortBy } from 'lodash';
import { HeroSpecialGlowDirective } from '../../directives/hero-special-glow.directive';
import {
  allHeroes,
  assignHeroToTask,
  buyUpgrade,
  canAllocateHeroToTask,
  canBuyUpgrade,
  canUnallocateHeroFromTask,
  currentHeroTask,
  getDamageForcePercentage,
  getEntry,
  getTaskDamageType,
  heroesAllocatedToTask,
  isHeroAllocatedToTask,
  isTaskThreatened,
  maxHeroesForTask,
  maxTaskLevel,
  purchasedUpgradesForTask,
  taskLevel,
  unassignHeroTask,
  upgradesAvailableForTask,
} from '../../helpers';
import {
  GameDamageType,
  GameHero,
  GameTask,
  GameUpgrade,
  HeroMood,
} from '../../interfaces';
import { BlurCardComponent } from '../blur-card/blur-card.component';
import { ButtonCloseComponent } from '../button-close/button-close.component';
import { DamageTypeBreakdownComponent } from '../damage-type-breakdown/damage-type-breakdown.component';
import { DamageTypeComponent } from '../damage-type/damage-type.component';
import { HeroArchetypeListComponent } from '../hero-archetype-list/hero-archetype-list.component';
import { HeroArtComponent } from '../hero-art/hero-art.component';
import { HeroAssignmentComponent } from '../hero-assignment/hero-assignment.component';
import { HeroFusionIndicatorComponent } from '../hero-fusion-indicator/hero-fusion-indicator.component';
import { HeroStatusComponent } from '../hero-status/hero-status.component';
import { LevelDisplayComponent } from '../level-display/level-display.component';
import { ResourceDisplayComponent } from '../resource-display/resource-display.component';
import { TaskSynergyComponent } from '../task-synergy/task-synergy.component';

@Component({
  selector: 'app-task-hero-selector',
  imports: [
    HeroArtComponent,
    DamageTypeComponent,
    HeroAssignmentComponent,
    ButtonCloseComponent,
    HeroArchetypeListComponent,
    DamageTypeBreakdownComponent,
    TaskSynergyComponent,
    LevelDisplayComponent,
    ResourceDisplayComponent,
    HeroSpecialGlowDirective,
    HeroFusionIndicatorComponent,
    NgIconComponent,
    TippyDirective,
    BlurCardComponent,
    HeroStatusComponent,
  ],
  providers: [
    provideIcons({
      tablerAlertOctagon,
    }),
  ],
  templateUrl: './task-hero-selector.component.html',
  styleUrl: './task-hero-selector.component.scss',
})
export class TaskHeroSelectorComponent {
  public task = input.required<GameTask>();
  public close = output<void>();

  public heroes = computed(() => heroesAllocatedToTask(this.task()));
  public allHeroes = computed(() =>
    sortBy(allHeroes(), [
      (hero) => !this.heroes().includes(hero),
      (hero) => !canAllocateHeroToTask(hero, this.task()),
    ]),
  );
  public maxHeroes = computed(() => maxHeroesForTask(this.task()));
  public taskLevel = computed(() => taskLevel(this.task()));
  public maxTasklevel = computed(() => maxTaskLevel(this.task()));
  public threatened = computed(() => isTaskThreatened(this.task()));

  public currentMode = signal<'heroes' | 'upgrades'>('heroes');
  public canChangeModes = computed(
    () => this.unpurchasedUpgrades().length > 0 || this.taskLevel() > 0,
  );
  public unpurchasedUpgrades = computed(() =>
    upgradesAvailableForTask(this.task()),
  );
  public purchasedUpgrades = computed(() =>
    purchasedUpgradesForTask(this.task()),
  );
  public taskDamageType = computed(() => getTaskDamageType(this.task()));

  public selectHero(hero: GameHero): void {
    if (!this.canAssignHeroToTask(hero)) return;

    if (isHeroAllocatedToTask(this.task(), hero)) {
      unassignHeroTask(hero);
      return;
    }

    assignHeroToTask(this.task(), hero);
  }

  public isHeroSelected(hero: GameHero): boolean {
    return isHeroAllocatedToTask(this.task(), hero);
  }

  public currentTaskNameForHero(hero: GameHero): string | undefined {
    return currentHeroTask(hero)?.name;
  }

  public canAssignHeroToTask(hero: GameHero): boolean {
    return (
      canAllocateHeroToTask(hero, this.task()) ||
      isHeroAllocatedToTask(this.task(), hero)
    );
  }

  public canUnassignHeroFromTask(hero: GameHero): boolean {
    return canUnallocateHeroFromTask(hero, this.task());
  }

  public heroMood(hero: GameHero): HeroMood {
    const damageType = getEntry<GameDamageType>(hero.damageTypeId);
    const taskDamageType = getEntry<GameDamageType>(this.task().damageTypeId);

    if (!damageType || !taskDamageType) return 'surprise';

    const percentDamageApplied = getDamageForcePercentage(
      damageType,
      taskDamageType,
    );
    if (percentDamageApplied === 100) return 'happy';
    if (percentDamageApplied === 0) return 'sad';
    return 'neutral';
  }

  public canBuyUpgrade(upgrade: GameUpgrade): boolean {
    return canBuyUpgrade(upgrade);
  }

  public buyUpgrade(upgrade: GameUpgrade): void {
    buyUpgrade(upgrade, this.task());
  }
}

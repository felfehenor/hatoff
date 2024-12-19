import { Component, computed, input } from '@angular/core';
import {
  canInfuseStat,
  doInfusion,
  getInfusedStat,
  infusionCost,
  isResearchComplete,
  maxHeroInfusions,
} from '../../helpers';
import { GameHero, GameHeroStat } from '../../interfaces';
import { ResourceDisplayComponent } from '../resource-display/resource-display.component';

@Component({
  selector: 'app-hero-stat-infusion-table',
  imports: [ResourceDisplayComponent],
  templateUrl: './hero-stat-infusion-table.component.html',
  styleUrl: './hero-stat-infusion-table.component.scss',
})
export class HeroStatInfusionTableComponent {
  public hero = input.required<GameHero>();

  public maxBuyable = computed(() => maxHeroInfusions(this.hero()));
  public canInfuse = computed(
    () => this.maxBuyable() > 0 && isResearchComplete('Mana Infusion'),
  );

  public readonly stats: Array<{
    name: GameHeroStat;
  }> = [
    {
      name: 'health',
    },
    {
      name: 'progress',
    },
    {
      name: 'force',
    },
    {
      name: 'resistance',
    },
    {
      name: 'piety',
    },
    {
      name: 'speed',
    },
  ];

  public currentInfusions(stat: GameHeroStat): number {
    return this.hero().infusedStats?.[stat] ?? 0;
  }

  public infusionCost(stat: GameHeroStat): number {
    return infusionCost(stat, getInfusedStat(this.hero(), stat) + 1);
  }

  public canBuyInfusion(stat: GameHeroStat): boolean {
    return canInfuseStat(this.hero(), stat);
  }

  public buyInfusion(stat: GameHeroStat): void {
    doInfusion(this.hero(), stat);
  }
}

import { DecimalPipe, TitleCasePipe } from '@angular/common';
import { Component, computed } from '@angular/core';
import {
  buyPetStat,
  canBuyPetStat,
  getPetStatBoughtTimes,
  getPetStatCost,
  getPetStatMax,
} from '../../helpers';
import { PetStat } from '../../interfaces';

@Component({
  selector: 'app-pet-actions-feed-resources',
  imports: [TitleCasePipe, DecimalPipe],
  templateUrl: './pet-actions-feed-resources.component.html',
  styleUrl: './pet-actions-feed-resources.component.scss',
})
export class PetActionsFeedResourcesComponent {
  public readonly petStats: Array<{
    stat: PetStat;
    desc: string;
  }> = [
    {
      stat: 'progress',
      desc: 'Spend Food to increase your pets Progress.',
    },
    {
      stat: 'force',
      desc: 'Spend Stone to increase your pets Force.',
    },
    {
      stat: 'resistance',
      desc: 'Spend Wood to increase your pets Resistance.',
    },
    {
      stat: 'speed',
      desc: 'Spend Gold to increase your pets Speed.',
    },
  ];

  public petStatMax = computed(() => getPetStatMax());

  public canBuyStat(stat: PetStat): boolean {
    return canBuyPetStat(stat);
  }

  public costForStat(stat: PetStat): number {
    return getPetStatCost(stat);
  }

  public numStatBought(stat: PetStat): number {
    return getPetStatBoughtTimes(stat);
  }

  public buyStat(stat: PetStat): void {
    buyPetStat(stat);
  }
}

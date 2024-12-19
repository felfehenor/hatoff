import { DecimalPipe, TitleCasePipe } from '@angular/common';
import { Component, computed } from '@angular/core';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import {
  tablerBolt,
  tablerClock,
  tablerProgressBolt,
  tablerShield,
} from '@ng-icons/tabler-icons';
import { TippyDirective } from '@ngneat/helipopper';
import {
  gamestate,
  getPetLevel,
  getPetStat,
  getPetXPToNextLevel,
  petStatBoost,
} from '../../helpers';
import { PetStat } from '../../interfaces';

@Component({
  selector: 'app-pet-stats',
  imports: [TitleCasePipe, DecimalPipe, NgIconComponent, TippyDirective],
  providers: [
    provideIcons({
      tablerProgressBolt,
      tablerBolt,
      tablerShield,
      tablerClock,
    }),
  ],
  templateUrl: './pet-stats.component.html',
  styleUrl: './pet-stats.component.scss',
})
export class PetStatsComponent {
  public petName = computed(() => gamestate().pet.name);
  public petLevel = computed(() => getPetLevel());
  public petXP = computed(() => getPetXPToNextLevel());

  public readonly petStats: Array<{
    stat: PetStat;
    icon: string;
    color: string;
  }> = [
    { stat: 'progress', icon: 'tablerProgressBolt', color: '#a0f6a3' },
    { stat: 'force', icon: 'tablerBolt', color: '#e501b0' },
    { stat: 'resistance', icon: 'tablerShield', color: '#fd88e2' },
    { stat: 'speed', icon: 'tablerClock', color: '#e4a700' },
  ];

  public getStat(stat: PetStat): number {
    return getPetStat(stat);
  }

  public statBoost(stat: PetStat): number {
    return petStatBoost(stat);
  }
}

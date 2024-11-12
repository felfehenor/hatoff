import { Component, computed, input } from '@angular/core';
import { NgIconComponent, provideIcons } from '@ng-icons/core';

import { gameGooeyMolecule } from '@ng-icons/game-icons';
import { TippyDirective } from '@ngneat/helipopper';
import { synergyBonus } from '../../helpers';
import { GameTask } from '../../interfaces';

@Component({
  selector: 'app-task-synergy',
  standalone: true,
  imports: [NgIconComponent, TippyDirective],
  providers: [
    provideIcons({
      gameGooeyMolecule,
    }),
  ],
  templateUrl: './task-synergy.component.html',
  styleUrl: './task-synergy.component.scss',
})
export class TaskSynergyComponent {
  public task = input.required<GameTask>();
  public bonus = computed(() => synergyBonus(this.task()));

  public color = computed(() => {
    const bonus = this.bonus();
    if (bonus <= 20) return '#f9d030';
    if (bonus <= 30) return '#b8ee30';
    if (bonus <= 40) return '#26dfd0';
    return '#f62aA0';
  });
}

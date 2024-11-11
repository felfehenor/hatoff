import { Component, computed, model } from '@angular/core';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import {
  tablerBrain,
  tablerBubble,
  tablerCoins,
  tablerGavel,
  tablerHeartBroken,
  tablerSword,
} from '@ng-icons/tabler-icons';
import { TippyDirective } from '@ngneat/helipopper';
import { getEntry } from '../../helpers';
import { GameDamageType } from '../../interfaces';

@Component({
  selector: 'app-damage-type-breakdown',
  standalone: true,
  imports: [NgIconComponent, TippyDirective],
  providers: [
    provideIcons({
      tablerCoins,
      tablerSword,
      tablerBubble,
      tablerGavel,
      tablerHeartBroken,
      tablerBrain,
    }),
  ],
  templateUrl: './damage-type-breakdown.component.html',
  styleUrl: './damage-type-breakdown.component.scss',
})
export class DamageTypeBreakdownComponent {
  public id = model.required<string>();

  public typeInfo = computed(() => getEntry<GameDamageType>(this.id()));
  public subtypeInfo = computed(
    () =>
      this.typeInfo()?.subTypes?.map((t) => ({
        ...getEntry<GameDamageType>(t.damageTypeId),
        percent: t.percent,
      })) ?? [],
  );

  public icon = computed(() => this.typeInfo()?.icon);
  public color = computed(() => this.typeInfo()?.color ?? '');
}

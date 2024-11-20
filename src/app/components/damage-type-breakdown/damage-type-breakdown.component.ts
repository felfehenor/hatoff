import { Component, computed, input, model } from '@angular/core';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { TippyDirective } from '@ngneat/helipopper';
import {
  allUnlockedDamageTypes,
  getEntry,
  usedContentIcons,
} from '../../helpers';
import { GameDamageType } from '../../interfaces';

@Component({
  selector: 'app-damage-type-breakdown',
  standalone: true,
  imports: [NgIconComponent, TippyDirective],
  providers: [provideIcons(usedContentIcons())],
  templateUrl: './damage-type-breakdown.component.html',
  styleUrl: './damage-type-breakdown.component.scss',
})
export class DamageTypeBreakdownComponent {
  public damageType = model.required<GameDamageType>();
  public showSubtypes = input<boolean>(true);

  public subtypeInfo = computed(
    () =>
      (this.damageType()
        ?.subTypes?.map((t) => {
          const entry = getEntry<GameDamageType>(t.damageTypeId);
          if (!entry) return { name: '???', percent: 0 };

          if (!allUnlockedDamageTypes().includes(entry)) return undefined;

          return {
            ...entry,
            percent: t.percent,
          };
        })
        .filter(Boolean) as (GameDamageType & { percent: number })[]) ?? [],
  );

  public icon = computed(() => this.damageType()?.icon);
  public color = computed(() => this.damageType()?.color ?? '');
}

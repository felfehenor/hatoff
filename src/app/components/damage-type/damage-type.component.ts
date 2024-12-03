import { DecimalPipe } from '@angular/common';
import { Component, computed, input, model, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { provideIcons } from '@ng-icons/core';

import { AnalyticsClickDirective } from '../../directives/analytics-click.directive';
import {
  allUnlockedDamageTypes,
  getEntry,
  usedContentIcons,
} from '../../helpers';
import { GameDamageType } from '../../interfaces';
import { ContentNameComponent } from '../content-name/content-name.component';
import { DamageTypeBreakdownComponent } from '../damage-type-breakdown/damage-type-breakdown.component';

@Component({
  selector: 'app-damage-type',
  imports: [
    DecimalPipe,
    ContentNameComponent,
    FormsModule,
    DamageTypeBreakdownComponent,
    AnalyticsClickDirective,
  ],
  providers: [provideIcons(usedContentIcons())],
  templateUrl: './damage-type.component.html',
  styleUrl: './damage-type.component.scss',
})
export class DamageTypeComponent {
  public id = model.required<string>();
  public damage = input.required<number>();

  public editable = input<boolean>(false);
  public isEditing = signal<boolean>(false);

  public thisDamageType = computed(() => getEntry<GameDamageType>(this.id())!);
  public unlockedDamageTypes = computed(() => allUnlockedDamageTypes());
}

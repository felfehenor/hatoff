import { DecimalPipe } from '@angular/common';
import { Component, computed, input, model, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import {
  tablerBrain,
  tablerBubble,
  tablerCoins,
  tablerGavel,
  tablerHeartBroken,
  tablerSword,
} from '@ng-icons/tabler-icons';
import { allUnlockedDamageTypes, getEntry } from '../../helpers';
import { GameDamageType } from '../../interfaces';
import { ContentNameComponent } from '../content-name/content-name.component';

@Component({
  selector: 'app-damage-type',
  standalone: true,
  imports: [DecimalPipe, ContentNameComponent, FormsModule, NgIconComponent],
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
  templateUrl: './damage-type.component.html',
  styleUrl: './damage-type.component.scss',
})
export class DamageTypeComponent {
  public id = model.required<string>();
  public damage = input.required<number>();

  public editable = input<boolean>(false);
  public isEditing = signal<boolean>(false);
  public unlockedDamageTypes = computed(() => allUnlockedDamageTypes());

  public icon = computed(() => getEntry<GameDamageType>(this.id())?.icon);
}

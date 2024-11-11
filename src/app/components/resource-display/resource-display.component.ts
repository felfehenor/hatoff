import { DecimalPipe } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import {
  tablerBlob,
  tablerCarrot,
  tablerCoins,
  tablerWood,
} from '@ng-icons/tabler-icons';
import { TippyDirective } from '@ngneat/helipopper';
import { getEntry, getResourceValue } from '../../helpers';
import { GameResource } from '../../interfaces';
import { ContentNameComponent } from '../content-name/content-name.component';

@Component({
  selector: 'app-resource-display',
  standalone: true,
  imports: [TippyDirective, ContentNameComponent, DecimalPipe, NgIconComponent],
  providers: [
    provideIcons({
      tablerCarrot,
      tablerCoins,
      tablerBlob,
      tablerWood,
    }),
  ],
  templateUrl: './resource-display.component.html',
  styleUrl: './resource-display.component.scss',
})
export class ResourceDisplayComponent {
  public id = input.required<string>();

  private resource = computed(() => getEntry<GameResource>(this.id()));

  public description = computed(
    () => `${this.resource()?.name}: ${this.resource()?.description}`,
  );
  public icon = computed(() => this.resource()?.icon);

  public value = computed(() => getResourceValue(this.id()));
}

import { DecimalPipe } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { TippyDirective } from '@ngneat/helipopper';
import { getEntry, getResourceValue } from '../../helpers';
import { GameResource } from '../../interfaces';
import { ContentNameComponent } from '../content-name/content-name.component';

@Component({
  selector: 'app-resource-display',
  standalone: true,
  imports: [TippyDirective, ContentNameComponent, DecimalPipe],
  templateUrl: './resource-display.component.html',
  styleUrl: './resource-display.component.scss',
})
export class ResourceDisplayComponent {
  public id = input.required<string>();

  public description = computed(
    () => getEntry<GameResource>(this.id())?.description,
  );

  public value = computed(() => getResourceValue(this.id()));
}

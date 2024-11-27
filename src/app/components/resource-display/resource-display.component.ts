import { DecimalPipe } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { TippyDirective } from '@ngneat/helipopper';
import { getEntry, getResourceValue, usedContentIcons } from '../../helpers';
import { GameResource } from '../../interfaces';
import { ContentNameComponent } from '../content-name/content-name.component';

@Component({
    selector: 'app-resource-display',
    imports: [TippyDirective, ContentNameComponent, DecimalPipe, NgIconComponent],
    providers: [provideIcons(usedContentIcons())],
    templateUrl: './resource-display.component.html',
    styleUrl: './resource-display.component.scss'
})
export class ResourceDisplayComponent {
  public id = input.required<string>();
  public value = input<number>(0);

  private resource = computed(() => getEntry<GameResource>(this.id()));

  public description = computed(
    () => `${this.resource()?.name}: ${this.resource()?.description}`,
  );
  public icon = computed(() => this.resource()?.icon);

  public displayValue = computed(
    () => this.value() || getResourceValue(this.id()),
  );
}

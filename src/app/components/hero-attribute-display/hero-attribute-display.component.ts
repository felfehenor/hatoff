import { Component, computed, input } from '@angular/core';
import { TippyDirective } from '@ngneat/helipopper';
import { getEntry, isInjury } from '../../helpers';
import { GameAttribute } from '../../interfaces';
import { ContentNameComponent } from '../content-name/content-name.component';

@Component({
  selector: 'app-hero-attribute-display',
  imports: [ContentNameComponent, TippyDirective],
  templateUrl: './hero-attribute-display.component.html',
  styleUrl: './hero-attribute-display.component.scss',
})
export class HeroAttributeDisplayComponent {
  public id = input.required<string>();

  public attribute = computed(() => getEntry<GameAttribute>(this.id())!);

  public description = computed(
    () => this.attribute()?.description ?? 'Unknown',
  );

  public isInjury = computed(() => isInjury(this.attribute()));
}

import { Component, computed, input } from '@angular/core';
import { TippyDirective } from '@ngneat/helipopper';
import { getEntry } from '../../helpers';
import { GameArchetype } from '../../interfaces';
import { ContentNameComponent } from '../content-name/content-name.component';

@Component({
  selector: 'app-archetype-display',
  standalone: true,
  imports: [ContentNameComponent, TippyDirective],
  templateUrl: './archetype-display.component.html',
  styleUrl: './archetype-display.component.scss',
})
export class ArchetypeDisplayComponent {
  public id = input.required<string>();

  public description = computed(
    () => getEntry<GameArchetype>(this.id())?.description,
  );
}

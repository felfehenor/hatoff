import { Component, computed, input } from '@angular/core';
import { TippyDirective } from '@ngneat/helipopper';
import { HideResearchDirective } from '../../directives/hideresearch.directive';
import { getEntry } from '../../helpers';
import { GameArchetype } from '../../interfaces';
import { ContentNameComponent } from '../content-name/content-name.component';

@Component({
  selector: 'app-archetype-display',
  imports: [ContentNameComponent, TippyDirective, HideResearchDirective],
  templateUrl: './archetype-display.component.html',
  styleUrl: './archetype-display.component.scss',
})
export class ArchetypeDisplayComponent {
  public id = input.required<string>();

  public archetype = computed(() => getEntry<GameArchetype>(this.id())!);

  public unlockedSkill = computed(() => this.archetype().combatSkillId);

  public description = computed(() => this.archetype().description);
}

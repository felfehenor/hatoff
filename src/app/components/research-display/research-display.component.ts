import { Component, computed, input } from '@angular/core';
import { getResearchFor } from '../../helpers';
import { GameResearch } from '../../interfaces';

@Component({
  selector: 'app-research-display',
  standalone: true,
  imports: [],
  templateUrl: './research-display.component.html',
  styleUrl: './research-display.component.scss',
})
export class ResearchDisplayComponent {
  public research = input.required<GameResearch>();
  public active = input<boolean>(false);

  public completion = computed(
    () =>
      (getResearchFor(this.research().id) / this.research().researchRequired) *
      100,
  );
}

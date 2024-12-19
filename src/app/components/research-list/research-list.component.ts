import { NgClass } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { AnalyticsClickDirective } from '../../directives/analytics-click.directive';
import {
  baseCardClasses,
  gamestate,
  isResearchComplete,
  setActiveResearch,
} from '../../helpers';
import { GameResearch } from '../../interfaces';
import { ResearchDisplayComponent } from '../research-display/research-display.component';

@Component({
  selector: 'app-research-list',
  imports: [ResearchDisplayComponent, NgClass, AnalyticsClickDirective],
  templateUrl: './research-list.component.html',
  styleUrl: './research-list.component.scss',
})
export class ResearchListComponent {
  public displayedResearch = input.required<GameResearch[]>();
  public activeResearch = computed(() => gamestate().activeResearch);

  public cardClasses = computed(() => {
    return baseCardClasses();
  });

  public selectResearch(research: GameResearch): void {
    if (isResearchComplete(research.id)) return;
    setActiveResearch(research);
  }
}

import { NgClass } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { AnalyticsClickDirective } from '../../directives/analytics-click.directive';
import { gamestate, setActiveResearch } from '../../helpers';
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
    return [
      'sm:min-w-[45%]',
      'sm:max-w-[45%]',
      'lg:min-w-[30%]',
      'lg:max-w-[30%]',
      'xl:min-w-[23%]',
      'xl:max-w-[23%]',
    ];
  });

  public selectResearch(research: GameResearch): void {
    setActiveResearch(research);
  }
}

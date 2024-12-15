import { NgClass } from '@angular/common';
import { Component, computed, input, signal } from '@angular/core';
import { baseCardClasses, halfCardClasses } from '../../helpers';
import { GameHero } from '../../interfaces';
import { BlacksmithItemPanelComponent } from '../blacksmith-item-panel/blacksmith-item-panel.component';
import { HeroDisplayTallComponent } from '../hero-display-tall/hero-display-tall.component';
import { HeroDisplayComponent } from '../hero-display/hero-display.component';

@Component({
  selector: 'app-blacksmith-hero-list',
  imports: [
    HeroDisplayTallComponent,
    NgClass,
    HeroDisplayComponent,
    BlacksmithItemPanelComponent,
  ],
  templateUrl: './blacksmith-hero-list.component.html',
  styleUrl: './blacksmith-hero-list.component.scss',
})
export class BlacksmithHeroListComponent {
  public heroList = input.required<GameHero[]>();
  public selectedHero = signal<GameHero | undefined>(undefined);
  public shouldShowItemPanel = signal<boolean>(false);

  public allHeroes = computed(() => this.heroList());

  public cardClasses = computed(() => {
    if (this.selectedHero()) {
      return halfCardClasses();
    }

    return baseCardClasses();
  });
}

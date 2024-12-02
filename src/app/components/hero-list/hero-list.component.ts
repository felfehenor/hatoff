import { NgClass } from '@angular/common';
import { Component, computed, input, signal } from '@angular/core';
import { baseCardClasses, halfCardClasses } from '../../helpers';
import { GameHero } from '../../interfaces';
import { HeroDisplayTallComponent } from '../hero-display-tall/hero-display-tall.component';
import { HeroDisplayComponent } from '../hero-display/hero-display.component';
import { ItemUseListComponent } from '../item-use-list/item-use-list.component';

@Component({
  selector: 'app-hero-list',
  imports: [
    HeroDisplayComponent,
    NgClass,
    HeroDisplayTallComponent,
    ItemUseListComponent,
  ],
  templateUrl: './hero-list.component.html',
  styleUrl: './hero-list.component.scss',
})
export class HeroListComponent {
  public heroList = input.required<GameHero[]>();
  public selectedHero = signal<GameHero | undefined>(undefined);
  public shouldShowItems = signal<boolean>(false);

  public allHeroes = computed(() => this.heroList());

  public cardClasses = computed(() => {
    if (this.selectedHero()) {
      return halfCardClasses();
    }

    return baseCardClasses();
  });
}

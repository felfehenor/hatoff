import { NgClass } from '@angular/common';
import { Component, computed, input, signal } from '@angular/core';
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
      return [
        'sm:min-w-[95%]',
        'sm:max-w-[95%]',
        'md:min-w-[95%]',
        'md:max-w-[95%]',
        'lg:min-w-[45%]',
        'lg:max-w-[45%]',
      ];
    }

    return [
      'sm:min-w-[45%]',
      'sm:max-w-[45%]',
      'lg:min-w-[30%]',
      'lg:max-w-[30%]',
      'xl:min-w-[23%]',
      'xl:max-w-[23%]',
    ];
  });
}

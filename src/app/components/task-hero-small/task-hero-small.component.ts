import { Component, input } from '@angular/core';
import { TippyDirective } from '@ngneat/helipopper';
import { GameHero } from '../../interfaces';
import { HeroArtComponent } from '../hero-art/hero-art.component';
import { HeroDamageTypeComponent } from '../hero-damage-type/hero-damage-type.component';
import { LevelDisplayComponent } from '../level-display/level-display.component';

@Component({
  selector: 'app-task-hero-small',
  imports: [
    HeroArtComponent,
    TippyDirective,
    LevelDisplayComponent,
    HeroDamageTypeComponent,
  ],
  templateUrl: './task-hero-small.component.html',
  styleUrl: './task-hero-small.component.scss',
})
export class TaskHeroSmallComponent {
  public hero = input.required<GameHero>();
}

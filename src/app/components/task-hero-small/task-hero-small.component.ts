import { Component, input } from '@angular/core';
import { TippyDirective } from '@ngneat/helipopper';
import { GameHero } from '../../interfaces';
import { DamageTypeComponent } from '../damage-type/damage-type.component';
import { HeroArtComponent } from '../hero-art/hero-art.component';
import { LevelDisplayComponent } from '../level-display/level-display.component';

@Component({
    selector: 'app-task-hero-small',
    imports: [
        HeroArtComponent,
        TippyDirective,
        DamageTypeComponent,
        LevelDisplayComponent,
    ],
    templateUrl: './task-hero-small.component.html',
    styleUrl: './task-hero-small.component.scss'
})
export class TaskHeroSmallComponent {
  public hero = input.required<GameHero>();
}

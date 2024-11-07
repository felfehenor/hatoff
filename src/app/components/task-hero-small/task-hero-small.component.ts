import { Component, input } from '@angular/core';
import { TippyDirective } from '@ngneat/helipopper';
import { GameHero } from '../../interfaces';
import { DamageTypeComponent } from '../damage-type/damage-type.component';
import { HeroArtComponent } from '../hero-art/hero-art.component';

@Component({
  selector: 'app-task-hero-small',
  standalone: true,
  imports: [HeroArtComponent, TippyDirective, DamageTypeComponent],
  templateUrl: './task-hero-small.component.html',
  styleUrl: './task-hero-small.component.scss',
})
export class TaskHeroSmallComponent {
  public hero = input.required<GameHero>();
}

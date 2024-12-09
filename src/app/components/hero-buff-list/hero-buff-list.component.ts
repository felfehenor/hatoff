import { Component, input } from '@angular/core';
import { GameHero } from '../../interfaces';
import { HeroBuffDisplayComponent } from '../hero-buff-display/hero-buff-display.component';

@Component({
  selector: 'app-hero-buff-list',
  imports: [HeroBuffDisplayComponent],
  templateUrl: './hero-buff-list.component.html',
  styleUrl: './hero-buff-list.component.scss',
})
export class HeroBuffListComponent {
  public hero = input.required<GameHero>();
}

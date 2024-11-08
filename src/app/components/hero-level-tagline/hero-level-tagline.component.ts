import { DecimalPipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { GameHero } from '../../interfaces';

@Component({
  selector: 'app-hero-level-tagline',
  standalone: true,
  imports: [DecimalPipe],
  templateUrl: './hero-level-tagline.component.html',
  styleUrl: './hero-level-tagline.component.scss',
})
export class HeroLevelTaglineComponent {
  public hero = input.required<GameHero>();
  public showXp = input<boolean>(true);
}

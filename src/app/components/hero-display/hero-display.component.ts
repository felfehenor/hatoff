import { DecimalPipe, PercentPipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { GameHero } from '../../interfaces';
import { ContentNameComponent } from '../content-name/content-name.component';

@Component({
  selector: 'app-hero-display',
  standalone: true,
  imports: [ContentNameComponent, DecimalPipe, PercentPipe],
  templateUrl: './hero-display.component.html',
  styleUrl: './hero-display.component.scss',
})
export class HeroDisplayComponent {
  public hero = input.required<GameHero>();
  public clickable = input<boolean>(false);
}

import { Component, input } from '@angular/core';
import { GameHero } from '../../interfaces';
import { HeroAttributeDisplayComponent } from '../hero-attribute-display/hero-attribute-display.component';

@Component({
  selector: 'app-hero-attribute-list',
  imports: [HeroAttributeDisplayComponent],
  templateUrl: './hero-attribute-list.component.html',
  styleUrl: './hero-attribute-list.component.scss',
})
export class HeroAttributeListComponent {
  public hero = input.required<GameHero>();
}

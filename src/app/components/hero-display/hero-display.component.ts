import { PercentPipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { GameHero } from '../../interfaces';
import { ContentNameComponent } from '../content-name/content-name.component';
import { DamageTypeComponent } from '../damage-type/damage-type.component';
import { HeroArtComponent } from '../hero-art/hero-art.component';
import { LevelDisplayComponent } from '../level-display/level-display.component';

@Component({
  selector: 'app-hero-display',
  standalone: true,
  imports: [
    ContentNameComponent,
    DamageTypeComponent,
    PercentPipe,
    HeroArtComponent,
    LevelDisplayComponent,
  ],
  templateUrl: './hero-display.component.html',
  styleUrl: './hero-display.component.scss',
})
export class HeroDisplayComponent {
  public hero = input.required<GameHero>();
  public clickable = input<boolean>(false);
  public active = input<boolean>(false);
}

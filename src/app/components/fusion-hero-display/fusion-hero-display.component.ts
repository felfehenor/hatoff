import { Component, input } from '@angular/core';
import { GameHero } from '../../interfaces';
import { ArchetypeDisplayComponent } from '../archetype-display/archetype-display.component';
import { DamageTypeComponent } from '../damage-type/damage-type.component';
import { HeroArchetypeListComponent } from '../hero-archetype-list/hero-archetype-list.component';
import { HeroArtComponent } from '../hero-art/hero-art.component';

@Component({
  selector: 'app-fusion-hero-display',
  standalone: true,
  imports: [
    HeroArtComponent,
    DamageTypeComponent,
    ArchetypeDisplayComponent,
    HeroArchetypeListComponent,
  ],
  templateUrl: './fusion-hero-display.component.html',
  styleUrl: './fusion-hero-display.component.scss',
})
export class FusionHeroDisplayComponent {
  public hero = input.required<GameHero>();
}

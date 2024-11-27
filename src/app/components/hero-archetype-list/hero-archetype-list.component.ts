import { Component, input } from '@angular/core';
import { GameHero } from '../../interfaces';
import { ArchetypeDisplayComponent } from '../archetype-display/archetype-display.component';

@Component({
    selector: 'app-hero-archetype-list',
    imports: [ArchetypeDisplayComponent],
    templateUrl: './hero-archetype-list.component.html',
    styleUrl: './hero-archetype-list.component.scss'
})
export class HeroArchetypeListComponent {
  public hero = input.required<GameHero>();
}

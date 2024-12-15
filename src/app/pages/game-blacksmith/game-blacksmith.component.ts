import { Component, computed } from '@angular/core';
import { BlacksmithHeroListComponent } from '../../components/blacksmith-hero-list/blacksmith-hero-list.component';
import { PageCardComponent } from '../../components/page-card/page-card.component';
import { allAvailableHeroes } from '../../helpers';

@Component({
  selector: 'app-game-blacksmith',
  imports: [PageCardComponent, BlacksmithHeroListComponent],
  templateUrl: './game-blacksmith.component.html',
  styleUrl: './game-blacksmith.component.scss',
})
export class GameBlacksmithComponent {
  validHeroes = computed(() => allAvailableHeroes());
}

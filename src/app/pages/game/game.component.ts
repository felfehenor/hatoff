import { Component, computed } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { gamestate, isSetup } from '../../helpers';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss',
})
export class GameComponent {
  isSetup = computed(() => isSetup());
  townName = computed(() => gamestate().townSetup.townName);
}

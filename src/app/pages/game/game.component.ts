import { Component } from '@angular/core';
import { RouterLink, RouterOutlet, ROUTES } from '@angular/router';
import { gameRoutes } from '../../game.routes';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  providers: [
    {
      provide: ROUTES,
      useValue: gameRoutes,
    },
  ],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss',
})
export class GameComponent {}

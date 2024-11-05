import { Component } from '@angular/core';
import { RouterOutlet, ROUTES } from '@angular/router';
import { gameRoutes } from '../../game.routes';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [RouterOutlet],
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

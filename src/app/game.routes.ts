import { Routes } from '@angular/router';
import { GameTownComponent } from './pages/game-town/game-town.component';

export const gameRoutes: Routes = [
  {
    component: GameTownComponent,
    path: 'town',
  },
  {
    path: '**',
    pathMatch: 'full',
    redirectTo: 'town',
  },
];

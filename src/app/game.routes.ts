import { Routes } from '@angular/router';
import { requireSetupGuard } from './guards/require-setup.guard';
import { GameHeroesComponent } from './pages/game-heroes/game-heroes.component';
import { GameRecruitComponent } from './pages/game-recruit/game-recruit.component';
import { GameResearchComponent } from './pages/game-research/game-research.component';
import { GameSetupComponent } from './pages/game-setup/game-setup.component';
import { GameTownComponent } from './pages/game-town/game-town.component';
import { OptionsComponent } from './pages/options/options.component';

export const gameRoutes: Routes = [
  {
    component: GameSetupComponent,
    path: 'setup',
  },
  {
    component: GameHeroesComponent,
    path: 'heroes',
    canActivate: [requireSetupGuard],
  },
  {
    component: GameTownComponent,
    path: 'town',
    canActivate: [requireSetupGuard],
  },
  {
    component: GameRecruitComponent,
    path: 'recruit',
    canActivate: [requireSetupGuard],
  },
  {
    component: GameResearchComponent,
    path: 'research',
    canActivate: [requireSetupGuard],
  },
  {
    component: OptionsComponent,
    path: 'options',
    canActivate: [requireSetupGuard],
  },
  {
    path: '**',
    pathMatch: 'full',
    redirectTo: 'town',
  },
];

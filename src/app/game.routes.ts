import { Routes } from '@angular/router';
import { requireSetupGuard } from './guards/require-setup.guard';
import { GameFusionComponent } from './pages/game-fusion/game-fusion.component';
import { GameHeroesComponent } from './pages/game-heroes/game-heroes.component';
import { GameRecruitComponent } from './pages/game-recruit/game-recruit.component';
import { GameResearchComponent } from './pages/game-research/game-research.component';
import { GameSetupComponent } from './pages/game-setup/game-setup.component';
import { GameShopComponent } from './pages/game-shop/game-shop.component';
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
    component: GameFusionComponent,
    path: 'fuse',
    canActivate: [requireSetupGuard],
  },
  {
    component: GameResearchComponent,
    path: 'research',
    canActivate: [requireSetupGuard],
  },
  {
    component: GameShopComponent,
    path: 'shop',
    canActivate: [requireSetupGuard],
  },
  {
    component: OptionsComponent,
    path: 'options',
    loadChildren: () =>
      import('./options.routes').then((routes) => routes.optionsRoutes),
  },
  {
    path: '**',
    pathMatch: 'full',
    redirectTo: 'town',
  },
];

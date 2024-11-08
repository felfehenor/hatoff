import { Routes } from '@angular/router';
import { requireSetupGuard } from './guards/require-setup.guard';
import { OptionsSavefileComponent } from './pages/options-savefile/options-savefile.component';

export const optionsRoutes: Routes = [
  {
    component: OptionsSavefileComponent,
    path: 'savefile',
    canActivate: [requireSetupGuard],
  },
  {
    path: '**',
    pathMatch: 'full',
    redirectTo: 'savefile',
  },
];

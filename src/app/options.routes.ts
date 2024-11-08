import { Routes } from '@angular/router';
import { requireSetupGuard } from './guards/require-setup.guard';
import { OptionsDebugComponent } from './pages/options-debug/options-debug.component';
import { OptionsSavefileComponent } from './pages/options-savefile/options-savefile.component';

export const optionsRoutes: Routes = [
  {
    component: OptionsSavefileComponent,
    path: 'savefile',
    canActivate: [requireSetupGuard],
  },
  {
    component: OptionsDebugComponent,
    path: 'debug',
    canActivate: [requireSetupGuard],
  },
  {
    path: '**',
    pathMatch: 'full',
    redirectTo: 'savefile',
  },
];

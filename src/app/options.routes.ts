import { Routes } from '@angular/router';
import { requireSetupGuard } from './guards/require-setup.guard';
import { OptionsDebugComponent } from './pages/options-debug/options-debug.component';
import { OptionsNotificationComponent } from './pages/options-notification/options-notification.component';
import { OptionsSavefileComponent } from './pages/options-savefile/options-savefile.component';
import { OptionsUIComponent } from './pages/options-ui/options-ui.component';

export const optionsRoutes: Routes = [
  {
    component: OptionsUIComponent,
    path: 'ui',
    canActivate: [requireSetupGuard],
  },
  {
    component: OptionsSavefileComponent,
    path: 'savefile',
    canActivate: [requireSetupGuard],
  },
  {
    component: OptionsNotificationComponent,
    path: 'notifications',
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
    redirectTo: 'ui',
  },
];

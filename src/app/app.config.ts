import {
  ApplicationConfig,
  ENVIRONMENT_INITIALIZER,
  inject,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { provideHttpClient } from '@angular/common/http';
import {
  provideNgxWebstorage,
  withLocalStorage,
  withNgxWebstorageConfig,
} from 'ngx-webstorage';
import { routes } from './app.routes';
import { ContentService } from './services/content.service';
import { GamestateService } from './services/gamestate.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideNgxWebstorage(withNgxWebstorageConfig({}), withLocalStorage()),
    {
      provide: ENVIRONMENT_INITIALIZER,
      multi: true,
      useValue: () => inject(ContentService).init(),
    },
    {
      provide: ENVIRONMENT_INITIALIZER,
      multi: true,
      useValue: () => inject(GamestateService).init(),
    },
  ],
};

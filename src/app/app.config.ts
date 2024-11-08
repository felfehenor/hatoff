import {
  ApplicationConfig,
  ENVIRONMENT_INITIALIZER,
  inject,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { provideHttpClient } from '@angular/common/http';
import {
  popperVariation,
  provideTippyConfig,
  tooltipVariation,
  withContextMenuVariation,
} from '@ngneat/helipopper';
import { provideHotToastConfig } from '@ngxpert/hot-toast';
import {
  provideNgxWebstorage,
  withLocalStorage,
  withNgxWebstorageConfig,
} from 'ngx-webstorage';

import { routes } from './app.routes';
import { APIService } from './services/api.service';
import { ContentService } from './services/content.service';
import { GamestateService } from './services/gamestate.service';
import { NotifyService } from './services/notify.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideNgxWebstorage(withNgxWebstorageConfig({}), withLocalStorage()),
    provideHotToastConfig({
      position: 'bottom-right',
      stacking: 'depth',
      visibleToasts: 5,
    }),
    provideTippyConfig({
      defaultVariation: 'tooltip',
      variations: {
        tooltip: tooltipVariation,
        popper: popperVariation,
        contextMenu: withContextMenuVariation(popperVariation),
      },
    }),
    {
      provide: ENVIRONMENT_INITIALIZER,
      multi: true,
      useValue: () => inject(APIService).init(),
    },
    {
      provide: ENVIRONMENT_INITIALIZER,
      multi: true,
      useValue: () => inject(NotifyService).init(),
    },
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

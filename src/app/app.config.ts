import {
  ApplicationConfig,
  ENVIRONMENT_INITIALIZER,
  importProvidersFrom,
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

import { provideNgIconsConfig } from '@ng-icons/core';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { routes } from './app.routes';
import { APIService } from './services/api.service';
import { ContentService } from './services/content.service';
import { GamestateService } from './services/gamestate.service';
import { MetaService } from './services/meta.service';
import { NotifyService } from './services/notify.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideNgxWebstorage(withNgxWebstorageConfig({}), withLocalStorage()),
    provideNgIconsConfig({
      size: '1.5em',
    }),
    importProvidersFrom(
      SweetAlert2Module.forRoot({
        provideSwal: () => import('sweetalert2/dist/sweetalert2.js'),
      }),
    ),
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
      useValue: () => inject(MetaService).init(),
    },
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

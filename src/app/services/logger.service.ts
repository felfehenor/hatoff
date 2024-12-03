/* eslint-disable @typescript-eslint/no-explicit-any */
import { ErrorHandler, inject, Injectable } from '@angular/core';
import { cloneDeep } from 'lodash';
import Rollbar from 'rollbar';
import { environment } from '../../environments/environment';
import { MetaService } from './meta.service';

@Injectable({
  providedIn: 'root',
})
export class LoggerService {
  private metaService = inject(MetaService);

  private rollbar!: Rollbar;

  private readonly ignoredMessageSubstrings: string[] = [
    'Failed to fetch dynamically imported module',
    'is not valid JSON',
    'Script error',
    'jQuery',
    'The object is in an invalid state.',
  ];

  init() {
    if (environment.rollbar.accessToken) {
      const realVersion = this.metaService.versionString();

      const rollbarConfig = cloneDeep(environment.rollbar);
      rollbarConfig.payload.client.javascript.code_version = realVersion;

      this.rollbar = new Rollbar({
        ...rollbarConfig,
        checkIgnore: (uncaught, args) => {
          const argMessage = args[0]?.toString() ?? '';
          return this.ignoredMessageSubstrings.some((msg) =>
            argMessage.includes(msg),
          );
        },
      });
    }
  }

  public debug(...data: any) {
    console.debug(...data);
  }

  public error(...data: any) {
    console.error(...data);
  }

  public rollbarError(error: any) {
    this.rollbar?.error(error.originalError || error);
  }
}

@Injectable()
export class RollbarErrorHandler implements ErrorHandler {
  private logger = inject(LoggerService);

  handleError(error: any) {
    this.logger.error(error);
    this.logger.rollbarError(error);
  }
}

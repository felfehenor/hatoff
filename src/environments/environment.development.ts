export const environment = {
  production: false,
  platform: 'web-dev',
  gameanalytics: {
    game: 'f3a766bb646978ed07300ed0f0a2b147',
    secret: '5a31d474e79571fd1315e05ef7c1c4e77c3f2df0',
  },
  rollbar: {
    accessToken: '86c34b8cc38d49ad8377b514b58874ea',
    captureUncaught: true,
    captureUnhandledRejections: true,
    payload: {
      environment: 'test',
      client: {
        javascript: {
          code_version: '1.0',
          source_map_enabled: true,
          guess_uncaught_frames: true,
        },
      },
    },
  },
};

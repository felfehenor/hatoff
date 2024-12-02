export const environment = {
  production: true,
  platform: 'web',
  gameanalytics: {
    game: 'e1ed45c450518322076fc81e817fd746',
    secret: 'b6dcc95588c672dcac4efbc0a90d5c8f5b14263c',
  },
  rollbar: {
    accessToken: '86c34b8cc38d49ad8377b514b58874ea',
    hostBlockList: ['netlify.app'],
    captureUncaught: true,
    captureUnhandledRejections: true,
    payload: {
      environment: 'production',
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

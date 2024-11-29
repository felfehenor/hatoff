export const environment = {
  production: false,
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

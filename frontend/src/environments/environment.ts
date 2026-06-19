export const environment = {
  production: false,
  /**
   * When true, the mock-backend interceptor intercepts all `/api/*` calls and
   * answers from in-memory data — no Express BE required. Default false so
   * `npm start` keeps using the real BE via proxy.conf.json.
   */
  useMockBackend: false,
};

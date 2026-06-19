export const environment = {
  production: true,
  /**
   * Production build (e.g. when deployed to GitHub Pages/Vercel as a static
   * site) has no BE process — the mock interceptor serves data so the demo
   * works standalone from the browser.
   */
  useMockBackend: true,
};

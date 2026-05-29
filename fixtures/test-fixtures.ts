import { test as base, expect } from '@playwright/test';
import { PlaywrightHomePage } from '../pages/PlaywrightHomePage';

/**
 * Custom test fixtures with page objects
 */
export const test = base.extend<{
  playwrightHomePage: PlaywrightHomePage;
}>({
  playwrightHomePage: async ({ page }, use) => {
    const homePage = new PlaywrightHomePage(page);
    await use(homePage);
  },
});

/**
 * Export expect for consistency
 */
export { expect };
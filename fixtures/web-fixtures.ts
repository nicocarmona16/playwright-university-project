import { test as base, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { HomePage } from '../pages/HomePage';
import { TraineeSearchPage } from '../pages/TraineeSearchPage';

/**
 * Custom test fixtures with page objects for web testing
 */
export const test = base.extend<{
  loginPage: LoginPage;
  homePage: HomePage;
  traineeSearchPage: TraineeSearchPage;
}>({
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await use(loginPage);
  },
  homePage: async ({ page }, use) => {
    const homePage = new HomePage(page);
    await use(homePage);
  },
  traineeSearchPage: async ({ page }, use) => {
    const traineeSearchPage = new TraineeSearchPage(page);
    await use(traineeSearchPage);
  },
});

/**
 * Export expect for consistency
 */
export { expect };

/**
 * Extended test fixture with authenticated state
 */
export const authenticatedTest = test.extend<{
  authenticatedHomePage: HomePage;
}>({
  authenticatedHomePage: async ({ page, homePage }, use) => {
    // Perform login before using the authenticated page
    const loginPage = new LoginPage(page);
    
    // Clear storage for clean state
    await page.context().clearCookies();
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
    
    // Navigate and login with valid credentials
    await loginPage.goto();
    await loginPage.login('testing.skills@globant.com', 'testing123');
    
    // Wait for redirection to home page
    await page.waitForURL('http://localhost:9002/', { timeout: 30000 });
    await homePage.isPageLoaded();
    
    await use(homePage);
  },
});

/**
 * Test fixture with custom timeout for slow pages
 */
export const slowPageTest = test.extend({
  // Extend action timeout for slow pages
  actionTimeout: 45000,
  navigationTimeout: 75000,
});
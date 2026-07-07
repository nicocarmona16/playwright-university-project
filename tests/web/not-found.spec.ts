import { test, expect } from '../../fixtures/web-fixtures';
import { TestUtils } from '../../utils/TestUtils';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const BASE_URL = process.env.BASE_URL || 'http://localhost:9002';
const NON_EXISTENT_PATH = '/this-route-does-not-exist-404';

test.describe('404 Not Found Page Scenarios', () => {
  // 90 seconds timeout - page is simple, less time needed
  test.setTimeout(90000);

  test('ESCENARIO 1: Ruta inexistente muestra página 404', async ({ notFoundPage }) => {
    TestUtils.log('Starting 404 page display test');

    // Step 1: Navigate to a non-existent route
    TestUtils.log(`Navigating to non-existent route: ${NON_EXISTENT_PATH}`);
    await notFoundPage.gotoNonExistentRoute(NON_EXISTENT_PATH);

    // Step 2: Verify the 404 heading is displayed
    const isDisplayed = await notFoundPage.isPageDisplayed();
    TestUtils.log(`404 page displayed: ${isDisplayed}`);
    expect(isDisplayed).toBeTruthy();

    // Step 3: Verify description text is present
    const hasDescription = await notFoundPage.hasDescriptionText();
    TestUtils.log(`Description text visible: ${hasDescription}`);
    expect(hasDescription).toBeTruthy();

    // Step 4: Verify "Go back to Homepage" button is present
    const hasButton = await notFoundPage.hasGoBackButton();
    TestUtils.log(`Go back button visible: ${hasButton}`);
    expect(hasButton).toBeTruthy();

    TestUtils.log('404 page display test completed successfully');
  });

  test('ESCENARIO 2: La página 404 muestra la ruta intentada', async ({ notFoundPage }) => {
    TestUtils.log('Starting path display test');

    // Step 1: Navigate to a specific non-existent route
    const testPath = '/ruta-invalida-para-testing';
    TestUtils.log(`Navigating to: ${testPath}`);
    await notFoundPage.gotoNonExistentRoute(testPath);

    // Step 2: Verify 404 page loads
    const isDisplayed = await notFoundPage.isPageDisplayed();
    expect(isDisplayed).toBeTruthy();

    // Step 3: Verify the attempted path is shown in the <code> element
    const displayedPath = await notFoundPage.getDisplayedPath();
    TestUtils.log(`Path displayed on page: "${displayedPath}"`);
    expect(displayedPath).toContain(testPath);

    TestUtils.log('Path display test completed successfully');
  });

  test('ESCENARIO 3: Botón "Go back to Homepage" redirige al Home', async ({ notFoundPage, page }) => {
    TestUtils.log('Starting go back to homepage test');

    // Step 1: Navigate to a non-existent route
    TestUtils.log(`Navigating to non-existent route: ${NON_EXISTENT_PATH}`);
    await notFoundPage.gotoNonExistentRoute(NON_EXISTENT_PATH);

    // Step 2: Verify 404 page loads
    const isDisplayed = await notFoundPage.isPageDisplayed();
    expect(isDisplayed).toBeTruthy();

    // Step 3: Click "Go back to Homepage"
    TestUtils.log('Clicking "Go back to Homepage" button');
    await notFoundPage.clickGoBackToHomepage();

    // Step 4: Verify navigation to home page
    await page.waitForURL(`${BASE_URL}/`, { timeout: 30000 });
    const currentUrl = page.url();
    TestUtils.log(`Current URL after click: ${currentUrl}`);
    expect(currentUrl).toBe(`${BASE_URL}/`);

    TestUtils.log('Go back to homepage test completed successfully');
  });
});

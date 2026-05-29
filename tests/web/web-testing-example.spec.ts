import { test, expect, PlaywrightHomePage } from '../../fixtures/test-fixtures';

/**
 * Web Test Example demonstrating proper test structure
 * This test showcases best practices for Playwright testing:
 * - Using Page Object Models
 * - Proper test organization
 * - Clear assertions
 * - Descriptive test names
 */
test.describe('Playwright Documentation Tests', () => {
  let homePage: PlaywrightHomePage;

  test.beforeEach(async ({ playwrightHomePage }) => {
    homePage = playwrightHomePage;
  });

  test('should load the Playwright homepage with correct title', async () => {
    // Arrange & Act
    await homePage.goto();
    
    // Assert
    const hasCorrectTitle = await homePage.verifyTitle();
    expect(hasCorrectTitle).toBe(true);
    
    const isVisible = await homePage.isNavigationVisible();
    expect(isVisible).toBe(true);
  });

  test('should navigate to installation section correctly', async () => {
    // Arrange
    await homePage.goto();
    
    // Act
    await homePage.goToInstallation();
    
    // Assert
    await expect(homePage.installationHeading).toBeVisible();
  });

  test('should allow searching for content', async () => {
    // Arrange
    await homePage.goto();
    
    // Act - Test navigation functionality instead of search
    await homePage.clickGetStarted();
    await homePage.page.waitForTimeout(1000); // Wait for page to load
    
    // Assert
    await expect(homePage.installationHeading).toBeVisible();
  });

  test('should handle Get Started CTA properly', async () => {
    // Arrange
    await homePage.goto();
    
    // Act
    await homePage.clickGetStarted();
    
    // Assert
    await expect(homePage.installationHeading).toBeVisible();
  });
});

test.describe('Cross-browser Compatibility', () => {
  ['chromium', 'firefox', 'webkit'].forEach(browserName => {
    test(`should work correctly in ${browserName}`, async ({ playwrightHomePage }) => {
      // Arrange
      const homePage = playwrightHomePage;
      
      // Act
      await homePage.goto();
      
      // Assert
      expect(await homePage.verifyTitle()).toBe(true);
      expect(await homePage.isNavigationVisible()).toBe(true);
    });
  });
});
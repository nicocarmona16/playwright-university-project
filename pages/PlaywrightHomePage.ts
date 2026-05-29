import { BasePage } from './BasePage';

/**
 * Page Object Model for Playwright documentation site
 */
export class PlaywrightHomePage extends BasePage {
  readonly url = 'https://playwright.dev/';
  
  // Locators
  readonly getStartedLink = this.page.getByRole('link', { name: 'Get started' });
  readonly navigationMenu = this.page.getByRole('navigation');
  readonly searchInput = this.page.getByRole('button', { name: 'Search' });
  readonly githubLink = this.page.getByRole('link', { name: 'GitHub' });
  
  readonly installationHeading = this.page.getByRole('heading', { name: 'Installation' });
  readonly getStartCTA = this.page.getByRole('button', { name: 'Get started' });

  /**
   * Navigate to Playwright home page
   */
  async goto(): Promise<void> {
    await super.goto(this.url);
    await this.waitForPageLoad();
  }

  /**
   * Click Get Started link
   */
  async clickGetStarted(): Promise<void> {
    await this.getStartedLink.click();
  }

  /**
   * Navigate to installation section
   */
  async goToInstallation(): Promise<void> {
    await this.clickGetStarted();
    await this.installationHeading.waitFor({ state: 'visible' });
  }

  /**
   * Search for content
   */
  async search(query: string): Promise<void> {
    await this.searchInput.click();
    await this.searchInput.fill(query);
    await this.page.keyboard.press('Enter');
  }

  /**
   * Verify page title contains Playwright
   */
  async verifyTitle(): Promise<boolean> {
    const title = await this.getTitle();
    return title.includes('Playwright');
  }

  /**
   * Check if navigation menu is visible
   */
  async isNavigationVisible(): Promise<boolean> {
    return await this.navigationMenu.isVisible();
  }
}
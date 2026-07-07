import { BasePage } from './BasePage';
import { Page } from '@playwright/test';

/**
 * Page Object Model for the 404 Not Found page
 */
export class NotFoundPage extends BasePage {
  private readonly baseUrl: string;

  constructor(page: Page) {
    super(page);
    this.baseUrl = process.env.BASE_URL || 'http://localhost:9002';
  }

  // Locators
  readonly heading = this.page.getByRole('heading', { name: '404 - Page Not Found' });
  readonly descriptionText = this.page.getByText("Oops! The page you're looking for doesn't seem to exist.");
  readonly pathDisplay = this.page.locator('code');
  readonly goBackButton = this.page.getByRole('link', { name: 'Go back to Homepage' });

  /**
   * Navigate to a non-existent route to trigger the 404 page
   */
  async gotoNonExistentRoute(path: string = '/this-route-does-not-exist'): Promise<void> {
    await this.page.goto(`${this.baseUrl}${path}`, {
      waitUntil: 'domcontentloaded',
      timeout: 60000,
    });
  }

  /**
   * Verify that the 404 page is displayed
   */
  async isPageDisplayed(): Promise<boolean> {
    try {
      await this.heading.waitFor({ state: 'visible', timeout: 15000 });
      return await this.heading.isVisible();
    } catch {
      return false;
    }
  }

  /**
   * Get the path displayed in the <code> element
   */
  async getDisplayedPath(): Promise<string> {
    await this.pathDisplay.waitFor({ state: 'visible', timeout: 5000 });
    const text = await this.pathDisplay.textContent();
    return text?.trim() || '';
  }

  /**
   * Click the "Go back to Homepage" button
   */
  async clickGoBackToHomepage(): Promise<void> {
    await this.goBackButton.waitFor({ state: 'visible', timeout: 5000 });
    await this.goBackButton.click();
  }

  /**
   * Verify the description text is visible
   */
  async hasDescriptionText(): Promise<boolean> {
    try {
      await this.descriptionText.waitFor({ state: 'visible', timeout: 5000 });
      return await this.descriptionText.isVisible();
    } catch {
      return false;
    }
  }

  /**
   * Verify the "Go back to Homepage" button is visible
   */
  async hasGoBackButton(): Promise<boolean> {
    try {
      await this.goBackButton.waitFor({ state: 'visible', timeout: 5000 });
      return await this.goBackButton.isVisible();
    } catch {
      return false;
    }
  }
}

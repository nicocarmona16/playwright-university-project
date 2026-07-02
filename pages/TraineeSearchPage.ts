import { BasePage } from './BasePage';
import { Page } from '@playwright/test';

/**
 * Page Object Model for Trainee Search functionality on Home page
 */
export class TraineeSearchPage extends BasePage {
  private readonly baseUrl: string;
  readonly url: string;

  constructor(page: Page) {
    super(page);
    this.baseUrl = process.env.BASE_URL || 'http://localhost:9002';
    this.url = `${this.baseUrl}/`;
  }

  // Locators - más flexibles y robustos
  readonly searchInput = this.page.locator('input[placeholder*="Search"], input[type="search"], [class*="search"]');
  readonly searchButton = this.page.locator('button:has-text("Search"), [class*="search"]');
  readonly traineeCards = this.page.locator('[data-testid*="trainee"], [data-testid*="card"], article, [class*="card"], [class*="employee"]');
  readonly viewProfileButtons = this.page.getByRole('button', { name: 'View Profile' });
  readonly noResultsMessage = this.page.getByText(/no results|not found|0 trainees|No|Found|empty/i);
  readonly traineeNames = this.page.locator('h3, h2, [class*="name"], [data-testid*="name"]');

  /**
   * Navigate to home page where search functionality is available
   */
  async goto(): Promise<void> {
    await this.page.goto(this.url, { 
      waitUntil: 'domcontentloaded',
      timeout: 60000 
    });
    // Don't use waitForLoadState as Firebase connections may never be idle
    // Instead, wait for specific elements to indicate page is ready
  }

  /**
   * Verify search page is loaded and search input is visible
   */
  async isPageLoaded(): Promise<boolean> {
    try {
      await this.searchInput.waitFor({ state: 'visible', timeout: 30000 });
      return await this.searchInput.isVisible();
    } catch {
      return false;
    }
  }

  /**
   * Wait for trainees to load on the page
   */
  async waitForTraineesToLoad(): Promise<boolean> {
    try {
      // Wait for either trainee cards or "no results" message
      await Promise.race([
        this.traineeCards.first().waitFor({ state: 'visible', timeout: 15000 }),
        this.noResultsMessage.waitFor({ state: 'visible', timeout: 15000 })
      ]);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Perform search by filling search input and clicking search button
   */
  async performSearch(query: string): Promise<void> {
    // Clear any existing content first
    await this.searchInput.clear();
    
    // Fill search query
    await this.searchInput.fill(query);
    
    // Try to click search button, if not available use Enter key
    try {
      await this.searchButton.click({ timeout: 3000 });
    } catch {
      // If button is not clickable (outside viewport), use Enter key
      await this.searchInput.press('Enter');
    }
  }

  /**
   * Clear search input
   */
  async clearSearch(): Promise<void> {
    await this.searchInput.clear();
  }

  /**
   * Get number of visible trainee cards
   */
  async getTraineeCount(): Promise<number> {
    try {
      const count = await this.traineeCards.count();
      return count;
    } catch {
      return 0;
    }
  }

  /**
   * Check if any trainees are visible
   */
  async hasTrainees(): Promise<boolean> {
    const count = await this.getTraineeCount();
    return count > 0;
  }

  /**
   * Check if no results message is displayed
   */
  async hasNoResultsMessage(): Promise<boolean> {
    try {
      await this.noResultsMessage.waitFor({ state: 'visible', timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get the text content of all visible trainee names
   */
  async getVisibleTraineeNames(): Promise<string[]> {
    const names: string[] = [];
    const cards = await this.traineeCards.all();
    
    for (const card of cards) {
      try {
        const nameElement = card.locator('h3, h2, [class*="name"], [data-testid*="name"]').first();
        const nameText = await nameElement.textContent();
        if (nameText && nameText.trim()) {
          names.push(nameText.trim());
        }
      } catch {
        // Skip if name element not found
        continue;
      }
    }
    
    return names;
  }

  /**
   * Check if page has any visible content (cards or loading state)
   */
  async hasContent(): Promise<boolean> {
    try {
      // Check for either cards, loading messages, or the search interface itself
      const hasCards = await this.traineeCards.count() > 0;
      const hasSearchInterface = await this.searchInput.isVisible();
      return hasCards || hasSearchInterface;
    } catch {
      return false;
    }
  }

  /**
   * Check if search results contain the expected query
   */
  async verifySearchResultsContain(query: string): Promise<boolean> {
    const traineeNames = await this.getVisibleTraineeNames();
    const lowerQuery = query.toLowerCase();
    
    return traineeNames.some(name => 
      name.toLowerCase().includes(lowerQuery) || 
      name.toLowerCase().includes(query)
    );
  }

  /**
   * Wait for search results to load and stabilize
   */
  async waitForSearchResults(): Promise<void> {
    // Wait for search to complete
    await this.page.waitForTimeout(2000);
    
    // Wait for either trainees or no results message
    await this.waitForTraineesToLoad();
  }

  /**
   * Get specific trainee card by index
   */
  async getTraineeCard(index: number) {
    return this.traineeCards.nth(index);
  }

  /**
   * Check if trainee at specific index contains the search query
   */
  async traineeContainsQuery(index: number, query: string): Promise<boolean> {
    try {
      const card = await this.getTraineeCard(index);
      const textContent = await card.textContent();
      return textContent?.toLowerCase().includes(query.toLowerCase()) || false;
    } catch {
      return false;
    }
  }

  /**
   * Wait for specified amount of time
   */
  async waitForTimeout(ms: number): Promise<void> {
    await this.page.waitForTimeout(ms);
  }
}
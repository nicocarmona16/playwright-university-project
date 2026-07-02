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
  
  // Location filter locators
  readonly locationButton = this.page.locator('button:has-text("Location"), [data-testid*="location"]');
  readonly locationDropdown = this.page.locator('div[role="menu"][data-state="open"]');
  readonly locationOptions = this.page.locator('div[role="menuitem"][data-orientation="vertical"]');
  
  // English level filter locators
  readonly englishLevelButton = this.page.locator('button:has-text("English Level"), [data-testid*="english"]');
  readonly englishLevelDropdown = this.page.locator('[role="listbox"], [data-placeholder*="English"]');
  readonly englishLevelOptions = this.page.locator('[role="option"], [data-value], [data-state]');
  
  // Skills filter locators
  readonly skillsButton = this.page.locator('button:has-text("Skills"), [data-testid*="skills"]');
  readonly skillsDropdown = this.page.locator('[data-state*="open"], [class*="popover"]');
  readonly skillsOptions = this.page.locator('[role="checkbox"], input[type="checkbox"], [data-testid*="skill"]');

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

  /**
   * Click on location dropdown to open it
   */
  async openLocationDropdown(): Promise<void> {
    await this.locationButton.click();
  }

  /**
   * Select a location from the dropdown
   */
  async selectLocation(location: string): Promise<void> {
    // Open location dropdown first
    await this.openLocationDropdown();
    
    // Wait for dropdown to be visible
    await this.locationDropdown.waitFor({ state: 'visible', timeout: 5000 });
    
    // Click on the specific location option - using exact selector
    const locationOption = this.page.locator(`div[role="menuitem"][data-orientation="vertical"]:has-text("${location}")`).first();
    await locationOption.click();
  }

  /**
   * Apply filters by clicking search button
   */
  async applyFilters(): Promise<void> {
    await this.searchButton.click();
  }

  /**
   * Filter by location (combines selection and application)
   */
  async filterByLocation(location: string): Promise<void> {
    await this.selectLocation(location);
    await this.applyFilters();
  }

  /**
   * Click on English level dropdown to open it
   */
  async openEnglishLevelDropdown(): Promise<void> {
    await this.englishLevelButton.click();
  }

  /**
   * Select an English level from the dropdown
   */
  async selectEnglishLevel(level: string): Promise<void> {
    // Open English level dropdown first
    await this.openEnglishLevelDropdown();
    
    // Wait for dropdown to be visible
    await this.englishLevelDropdown.waitFor({ state: 'visible', timeout: 5000 });
    
    // Click on the specific English level option
    const levelOption = this.page.locator(`[data-value*="${level}"], [data-state*="${level}"], :text("${level}")`).first();
    await levelOption.click();
  }

  /**
   * Filter by English level (combines selection and application)
   */
  async filterByEnglishLevel(level: string): Promise<void> {
    await this.selectEnglishLevel(level);
    await this.applyFilters();
  }

  /**
   * Open skills dropdown
   */
  async openSkillsDropdown(): Promise<void> {
    await this.skillsButton.click();
  }

  /**
   * Select a skill by checking its checkbox
   */
  async selectSkill(skill: string): Promise<void> {
    // Open skills dropdown first
    await this.openSkillsDropdown();
    
    // Wait for skills dropdown to be visible
    await this.skillsDropdown.waitFor({ state: 'visible', timeout: 5000 });
    
    // Click on the specific skill checkbox
    const skillOption = this.page.locator(`[data-value*="${skill}"], :text-is("${skill}"), [data-testid*="${skill}"]`).first();
    await skillOption.check();
  }

  /**
   * Filter by single skill (combines selection and application)
   */
  async filterBySkill(skill: string): Promise<void> {
    await this.selectSkill(skill);
    await this.applyFilters();
  }

  /**
   * Clear all filters by clicking their respective buttons/areas
   */
  async clearFilters(): Promise<void> {
    // Clear search input
    await this.clearSearch();
    
    // If location is selected, click location button to close dropdown
    try {
      if (await this.locationButton.isVisible()) {
        await this.locationButton.click();
        await this.page.waitForTimeout(500);
      }
    } catch {
      // Location dropdown might not be open, continue
    }
    
    // Apply filters to clear them
    await this.applyFilters();
  }
}
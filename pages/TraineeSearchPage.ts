import { BasePage } from './BasePage';
import { Page } from '@playwright/test';
import { TestUtils } from '../utils/TestUtils';

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
  readonly englishLevelDropdown = this.page.locator('div[role="menu"][data-state="open"]');
  readonly englishLevelOptions = this.page.locator('div[role="menuitem"][data-orientation="vertical"]');
  
  // Skills filter locators
  readonly skillsButton = this.page.locator('button:has-text("Skills"), [data-testid*="skills"]');
  readonly skillsDropdown = this.page.locator('div[role="menu"][data-state="open"]');
  readonly skillsOptions = this.page.locator('div[role="menuitemcheckbox"]');

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
    await this.openLocationDropdown();
    const locationOption = this.page.locator(`div[role="menuitem"][data-orientation="vertical"]:has-text("${location}")`).first();
    await locationOption.waitFor({ state: 'visible', timeout: 5000 });
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
    try {
      await this.selectLocation(location);
      await this.applyFilters();
    } catch (error) {
      TestUtils.log(`Error in location filtering: ${error}`);
      // Simpler approach: just skip this test run if filtering fails
      throw new Error(`Location filtering failed: ${error}`);
    }
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
    
    // Wait for level option to be visible
    const levelOption = this.page.locator(`div[role="menuitem"][data-orientation="vertical"]:has-text("${level}")`).first();
    await levelOption.waitFor({ state: 'visible', timeout: 5000 });
    await levelOption.click();
  }

  /**
   * Filter by English level (combines selection and application)
   */
  async filterByEnglishLevel(level: string): Promise<void> {
    try {
      await this.selectEnglishLevel(level);
      await this.applyFilters();
    } catch (error) {
      TestUtils.log(`Error in English level filtering: ${error}`);
      // Simpler approach: just skip this test run if filtering fails
      throw new Error(`English level filtering failed: ${error}`);
    }
  }

  /**
   * Open skills dropdown
   */
  async openSkillsDropdown(): Promise<void> {
    try {
      await this.skillsButton.click();
      await this.skillsDropdown.waitFor({ state: 'visible', timeout: 3000 });
    } catch {
      TestUtils.log('Error clicking Skills button, trying alternative approach');
      // Try alternative selectors
      await this.page.locator('button:has-text("S")').first().click();
      await this.skillsDropdown.waitFor({ state: 'visible', timeout: 3000 });
    }
  }

  /**
   * Select a skill by checking its checkbox
   */
  async selectSkill(skill: string): Promise<void> {
    // Open skills dropdown first
    await this.openSkillsDropdown();
    
    // Check if dropdown is open
    try {
      const dropdownVisible = await this.skillsDropdown.isVisible({ timeout: 3000 });
      if (!dropdownVisible) {
        TestUtils.log('Skills dropdown not visible, trying alternative approach');
        await this.skillsButton.click();
        await this.skillsDropdown.waitFor({ state: 'visible', timeout: 3000 });
      }
    } catch {
      // Continue even if dropdown check fails
      TestUtils.log('Skills dropdown check failed, continuing with skill selection');
    }
    
    // Click on the specific skill checkbox - using exact selector from MCP
    const skillOption = this.page.locator(`div[role="menuitemcheckbox"]:has-text("${skill}")`).first();
    
    try {
      await skillOption.waitFor({ state: 'visible', timeout: 3000 });
      await skillOption.click(); // Click to check/uncheck
    } catch {
      TestUtils.log(`Using alternative approach for skill selection: ${skill}`);
      await this.page.locator(`text="${skill}"`).first().click();
    }
  }

  /**
   * Select multiple skills (for AND logic filtering)
   */
  async selectMultipleSkills(skills: string[]): Promise<void> {
    // Open skills dropdown first
    await this.openSkillsDropdown();
    
    // Select each skill
    for (const skill of skills) {
      TestUtils.log(`Selecting skill: ${skill}`);
      try {
        const skillOption = this.page.locator(`div[role="menuitemcheckbox"]:has-text("${skill}")`).first();
        await skillOption.waitFor({ state: 'visible', timeout: 3000 });
        await skillOption.click();
      } catch {
        TestUtils.log(`Alternative selection for skill: ${skill}`);
        await this.page.locator(`text="${skill}"`).first().click();
      }
    }
  }

  /**
   * Filter by single skill (combines selection and application)
   */
  async filterBySkill(skill: string): Promise<void> {
    try {
      await this.selectSkill(skill);
      await this.closeSkillsDropdown(); // Close dropdown before search
      await this.applyFilters();
    } catch (error) {
      TestUtils.log(`Error in skill filtering: ${error}`);
      // As last resort, try alternative approach
      await this.skillsButton.click();
      await this.skillsDropdown.waitFor({ state: 'visible', timeout: 3000 });
      await this.page.locator(`text="${skill}"`).first().click();
      await this.closeSkillsDropdown();
      await this.applyFilters();
    }
  }

  /**
   * Filter by multiple skills (AND logic - combines selection and application)
   */
  async filterByMultipleSkills(skills: string[]): Promise<void> {
    try {
      await this.selectMultipleSkills(skills);
      await this.closeSkillsDropdown(); // Close dropdown before search
      await this.applyFilters();
    } catch (error) {
      TestUtils.log(`Error in multiple skills filtering: ${error}`);
      // Alternative approach - try each skill individually
      await this.skillsButton.click();
      await this.skillsDropdown.waitFor({ state: 'visible', timeout: 3000 });
      for (const skill of skills) {
        await this.page.locator(`text="${skill}"`).first().click();
      }
      await this.closeSkillsDropdown();
      await this.applyFilters();
    }
  }

  /**
   * Close skills dropdown (important before applying filters)
   */
  async closeSkillsDropdown(): Promise<void> {
    try {
      // Press Escape to close dropdown if it's open
      await this.page.keyboard.press('Escape');
    } catch {
      TestUtils.log('Could not close skills dropdown, continuing...');
    }
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
      }
    } catch {
      // Location dropdown might not be open, continue
    }
    
    // Apply filters to clear them
    await this.applyFilters();
  }
}
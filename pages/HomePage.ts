import { BasePage } from './BasePage';

/**
 * Page Object Model for Home page (after successful login)
 */
export class HomePage extends BasePage {
  readonly url = 'http://localhost:9002/';
  
  // Locators
  readonly availableTraineeTalentHeading = this.page.getByRole('heading', { name: 'Available Trainee Talent' });
  readonly browseTraineesText = this.page.getByText('Browse through our talented trainees ready for their next challenge.');
  readonly searchInput = this.page.getByPlaceholder('Search by name or skill...');
  readonly locationButton = this.page.getByRole('button', { name: 'Location' });
  readonly englishLevelButton = this.page.getByRole('button', { name: 'English Level' });
  readonly skillsButton = this.page.getByRole('button', { name: 'Skills' });
  readonly searchButton = this.page.getByRole('button', { name: 'Search' });
  readonly globantLogo = this.page.getByRole('link', { name: 'Globant Logo' });

  /**
   * Navigate to home page with wait for page load
   */
  async goto(): Promise<void> {
    await this.page.goto(this.url, { 
      waitUntil: 'domcontentloaded',
      timeout: 60000 
    });
    await this.waitForPageLoad();
  }

  /**
   * Verify home page is loaded and visible
   */
  async isPageLoaded(): Promise<boolean> {
    try {
      await this.availableTraineeTalentHeading.waitFor({ state: 'visible', timeout: 30000 });
      return await this.availableTraineeTalentHeading.isVisible();
    } catch {
      return false;
    }
  }

  /**
   * Verify main elements are visible on the home page
   */
  async verifyMainElements(): Promise<boolean> {
    try {
      await Promise.all([
        this.availableTraineeTalentHeading.waitFor({ state: 'visible', timeout: 10000 }),
        this.browseTraineesText.waitFor({ state: 'visible', timeout: 10000 }),
        this.searchInput.waitFor({ state: 'visible', timeout: 10000 }),
        this.locationButton.waitFor({ state: 'visible', timeout: 10000 }),
        this.englishLevelButton.waitFor({ state: 'visible', timeout: 10000 }),
        this.skillsButton.waitFor({ state: 'visible', timeout: 10000 }),
        this.searchButton.waitFor({ state: 'visible', timeout: 10000 })
      ]);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Click on search input
   */
  async clickSearchInput(): Promise<void> {
    await this.searchInput.click();
  }

  /**
   * Fill search input
   */
  async fillSearchQuery(query: string): Promise<void> {
    await this.searchInput.fill(query);
  }

  /**
   * Click search button
   */
  async clickSearchButton(): Promise<void> {
    await this.searchButton.click();
  }

  /**
   * Perform a search
   */
  async search(query: string): Promise<void> {
    await this.clickSearchInput();
    await this.fillSearchQuery(query);
    await this.clickSearchButton();
  }

  /**
   * Click Globant logo (usually goes to home)
   */
  async clickGlobantLogo(): Promise<void> {
    await this.globantLogo.click();
  }

  /**
   * Check if trainee profiles are loaded
   */
  async hasTraineeProfiles(): Promise<boolean> {
    const viewProfileButtons = this.page.getByRole('button', { name: 'View Profile' });
    try {
      await viewProfileButtons.first().waitFor({ state: 'visible', timeout: 10000 });
      const count = await viewProfileButtons.count();
      return count > 0;
    } catch {
      return false;
    }
  }

  /**
   * Get count of trainee profiles visible
   */
  async getTraineeProfileCount(): Promise<number> {
    const viewProfileButtons = this.page.getByRole('button', { name: 'View Profile' });
    return await viewProfileButtons.count();
  }
}
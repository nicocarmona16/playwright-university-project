import { BasePage } from './BasePage';
import { Page } from '@playwright/test';
import { TestUtils } from '../utils/TestUtils';

/**
 * Page Object Model for the Trainee "My Profile" page (/trainee/profile)
 * Handles both read-only view and edit mode.
 * Note: This page requires Firebase Auth state to resolve before showing content.
 */
export class TraineeMyProfilePage extends BasePage {
  private readonly baseUrl: string;
  readonly url: string;

  constructor(page: Page) {
    super(page);
    this.baseUrl = process.env.BASE_URL || 'http://localhost:9002';
    this.url = `${this.baseUrl}/trainee/profile`;
  }

  // Page heading
  readonly myProfileHeading = this.page.getByRole('heading', { name: 'My Profile' });

  // Header navigation link "My Profile"
  readonly myProfileNavLink = this.page.getByRole('link', { name: 'My Profile' });

  // Edit Profile button (visible in read-only mode) — rendered as variant="outline" size="sm"
  readonly editProfileButton = this.page.getByRole('button', { name: 'Edit Profile' });

  // Save and Cancel buttons (visible in edit mode) — rendered as variant="secondary"/"outline" size="sm"
  readonly saveButton = this.page.getByRole('button', { name: 'Save' });
  readonly cancelButton = this.page.getByRole('button', { name: 'Cancel' });

  // Profile sections headings (h3 elements)
  readonly skillsHeading = this.page.getByRole('heading', { name: 'Skills & Technologies' });
  readonly professionalSummaryHeading = this.page.getByRole('heading', { name: 'Professional Summary' });
  readonly languagesHeading = this.page.getByRole('heading', { name: 'Languages' });
  readonly mentorHeading = this.page.getByRole('heading', { name: 'Mentor' });
  readonly internshipPeriodHeading = this.page.getByRole('heading', { name: 'Internship Period' });
  readonly projectExperienceHeading = this.page.getByRole('heading', { name: 'Project Experience at Globant' });
  readonly linksHeading = this.page.getByRole('heading', { name: 'Links' });

  // Professional Summary - read mode (paragraph with class text-muted-foreground after h3)
  readonly professionalSummaryText = this.page.locator('h3:has-text("Professional Summary") ~ p.text-muted-foreground').first();

  // Professional Summary - edit mode (textarea with name attribute)
  readonly professionalSummaryTextarea = this.page.locator('textarea[name="professionalSummary"]');

  // Toast notification
  readonly profileUpdatedToast = this.page.getByText('Profile Updated');

  // Access Denied card (shown when not logged in as trainee)
  readonly accessDeniedTitle = this.page.getByRole('heading', { name: 'Access Denied' });

  /**
   * Navigate directly to the profile page and wait for it to load
   */
  async goto(): Promise<void> {
    await this.page.goto(this.url, {
      waitUntil: 'domcontentloaded',
      timeout: 60000,
    });
    // Wait for Firebase Auth state to resolve — either My Profile loads or Access Denied shows
    await this.waitForPageReady();
  }

  /**
   * Wait for the page to be ready (Firebase Auth resolved)
   * The page shows a skeleton while loading, then either profile or access denied
   */
  async waitForPageReady(): Promise<void> {
    try {
      await Promise.race([
        this.myProfileHeading.waitFor({ state: 'visible', timeout: 30000 }),
        this.accessDeniedTitle.waitFor({ state: 'visible', timeout: 30000 }),
      ]);
    } catch {
      TestUtils.log('Page did not resolve to profile or access denied within timeout');
    }
  }

  /**
   * Navigate to profile via the "My Profile" header link
   */
  async navigateViaHeader(): Promise<void> {
    await this.myProfileNavLink.waitFor({ state: 'visible', timeout: 20000 });
    await this.myProfileNavLink.click();
    // Wait for navigation and Firebase to resolve
    await this.page.waitForURL('**/trainee/profile', { timeout: 30000 });
    await this.waitForPageReady();
  }

  /**
   * Verify the profile page is loaded (My Profile heading visible)
   */
  async isPageLoaded(): Promise<boolean> {
    try {
      await this.myProfileHeading.waitFor({ state: 'visible', timeout: 30000 });
      return await this.myProfileHeading.isVisible();
    } catch {
      return false;
    }
  }

  /**
   * Wait for "My Profile" nav link to appear in header
   * (requires Firebase Auth state to resolve and user to be trainee)
   */
  async isMyProfileNavLinkVisible(): Promise<boolean> {
    try {
      await this.myProfileNavLink.waitFor({ state: 'visible', timeout: 20000 });
      return await this.myProfileNavLink.isVisible();
    } catch {
      return false;
    }
  }

  /**
   * Verify the Edit Profile button is visible (read-only mode)
   */
  async isEditProfileButtonVisible(): Promise<boolean> {
    try {
      await this.editProfileButton.waitFor({ state: 'visible', timeout: 15000 });
      return await this.editProfileButton.isVisible();
    } catch {
      return false;
    }
  }

  /**
   * Click "Edit Profile" to enter edit mode
   */
  async clickEditProfile(): Promise<void> {
    await this.editProfileButton.waitFor({ state: 'visible', timeout: 15000 });
    await this.editProfileButton.click();
  }

  /**
   * Verify we are in edit mode (Save and Cancel buttons visible)
   */
  async isInEditMode(): Promise<boolean> {
    try {
      await this.saveButton.waitFor({ state: 'visible', timeout: 10000 });
      const saveVisible = await this.saveButton.isVisible();
      const cancelVisible = await this.cancelButton.isVisible();
      return saveVisible && cancelVisible;
    } catch {
      return false;
    }
  }

  /**
   * Get the Professional Summary text (read-only mode)
   */
  async getProfessionalSummary(): Promise<string> {
    await this.professionalSummaryText.waitFor({ state: 'visible', timeout: 15000 });
    const text = await this.professionalSummaryText.textContent();
    return text?.trim() || '';
  }

  /**
   * Get the Professional Summary textarea value (edit mode)
   */
  async getProfessionalSummaryEditValue(): Promise<string> {
    await this.professionalSummaryTextarea.waitFor({ state: 'visible', timeout: 10000 });
    const value = await this.professionalSummaryTextarea.inputValue();
    return value || '';
  }

  /**
   * Clear and fill the Professional Summary textarea
   */
  async fillProfessionalSummary(text: string): Promise<void> {
    await this.professionalSummaryTextarea.waitFor({ state: 'visible', timeout: 10000 });
    await this.professionalSummaryTextarea.clear();
    await this.professionalSummaryTextarea.fill(text);
  }

  /**
   * Click the Save button
   */
  async clickSave(): Promise<void> {
    await this.saveButton.waitFor({ state: 'visible', timeout: 10000 });
    await this.saveButton.click();
  }

  /**
   * Click the Cancel button
   */
  async clickCancel(): Promise<void> {
    await this.cancelButton.waitFor({ state: 'visible', timeout: 10000 });
    await this.cancelButton.click();
  }

  /**
   * Verify the "Profile Updated" toast appears
   */
  async isProfileUpdatedToastVisible(): Promise<boolean> {
    try {
      await this.profileUpdatedToast.waitFor({ state: 'visible', timeout: 15000 });
      return await this.profileUpdatedToast.isVisible();
    } catch {
      return false;
    }
  }

  /**
   * Verify profile sections are visible in read-only mode
   */
  async hasProfileSections(): Promise<boolean> {
    try {
      await this.skillsHeading.waitFor({ state: 'visible', timeout: 15000 });
      const skills = await this.skillsHeading.isVisible();
      const summary = await this.professionalSummaryHeading.isVisible();
      const languages = await this.languagesHeading.isVisible();
      return skills && summary && languages;
    } catch {
      return false;
    }
  }

  /**
   * Wait for the page to exit edit mode (Edit Profile button reappears)
   */
  async waitForReadOnlyMode(): Promise<boolean> {
    try {
      await this.editProfileButton.waitFor({ state: 'visible', timeout: 20000 });
      return await this.editProfileButton.isVisible();
    } catch {
      return false;
    }
  }
}

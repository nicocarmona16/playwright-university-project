import { BasePage } from './BasePage';
import { Page } from '@playwright/test';

/**
 * Page Object Model for Access Control verification
 * Tests that protected admin routes show "Access Denied" when not authenticated
 */
export class AccessControlPage extends BasePage {
  private readonly baseUrl: string;

  constructor(page: Page) {
    super(page);
    this.baseUrl = process.env.BASE_URL || 'http://localhost:9002';
  }

  // Access Denied page elements
  readonly accessDeniedHeading = this.page.getByRole('heading', { name: 'Access Denied' });
  readonly permissionMessage = this.page.getByText('You do not have permission to view this part of the application.');
  readonly goBackToHomepageButton = this.page.getByRole('link', { name: /Go Back to Homepage/i });
  
  // Loading state element
  readonly loadingMessage = this.page.getByText('Loading admin area...');

  // Admin sidebar elements (should NOT be visible for unauthorized users)
  readonly adminSidebar = this.page.locator('aside');
  readonly dashboardNavLink = this.page.getByRole('link', { name: 'Dashboard' });
  readonly traineesNavLink = this.page.getByRole('link', { name: 'Trainees' });

  /**
   * Navigate to a protected admin route
   */
  async gotoAdminRoute(path: string): Promise<void> {
    await this.page.goto(`${this.baseUrl}${path}`, {
      waitUntil: 'domcontentloaded',
      timeout: 60000,
    });
  }

  /**
   * Wait for the Access Denied page to appear (after loading state resolves)
   */
  async waitForAccessDenied(): Promise<boolean> {
    try {
      // First, the page may show "Loading admin area..." briefly
      // Then it should resolve to "Access Denied"
      await this.accessDeniedHeading.waitFor({ state: 'visible', timeout: 30000 });
      return await this.accessDeniedHeading.isVisible();
    } catch {
      return false;
    }
  }

  /**
   * Verify the Access Denied heading is displayed
   */
  async isAccessDeniedDisplayed(): Promise<boolean> {
    try {
      return await this.accessDeniedHeading.isVisible();
    } catch {
      return false;
    }
  }

  /**
   * Verify the permission denial message is displayed
   */
  async hasPermissionMessage(): Promise<boolean> {
    try {
      await this.permissionMessage.waitFor({ state: 'visible', timeout: 5000 });
      return await this.permissionMessage.isVisible();
    } catch {
      return false;
    }
  }

  /**
   * Verify the "Go Back to Homepage" button is present
   */
  async hasGoBackButton(): Promise<boolean> {
    try {
      await this.goBackToHomepageButton.waitFor({ state: 'visible', timeout: 5000 });
      return await this.goBackToHomepageButton.isVisible();
    } catch {
      return false;
    }
  }

  /**
   * Click "Go Back to Homepage" button
   */
  async clickGoBackToHomepage(): Promise<void> {
    await this.goBackToHomepageButton.waitFor({ state: 'visible', timeout: 5000 });
    await this.goBackToHomepageButton.click();
  }

  /**
   * Verify admin sidebar is NOT visible (security check)
   */
  async isAdminSidebarHidden(): Promise<boolean> {
    try {
      // Give a short timeout - sidebar should NOT appear
      await this.adminSidebar.waitFor({ state: 'visible', timeout: 3000 });
      return false; // If sidebar is visible, it's a security issue
    } catch {
      return true; // Sidebar not found = correct behavior
    }
  }

  /**
   * Verify admin navigation links are NOT visible (security check)
   */
  async areAdminNavLinksHidden(): Promise<boolean> {
    try {
      const dashboardVisible = await this.dashboardNavLink.isVisible();
      const traineesVisible = await this.traineesNavLink.isVisible();
      return !dashboardVisible && !traineesVisible;
    } catch {
      return true; // Elements not found = correct behavior
    }
  }
}

import { BasePage } from './BasePage';
import { Page } from '@playwright/test';

/**
 * Page Object Model for Login page
 */
export class LoginPage extends BasePage {
  private readonly baseUrl: string;
  readonly url: string;
  
  // Locators using web-first selectors
  readonly accessAccountHeading = this.page.getByRole('heading', { name: 'Access Your Account' });
  readonly emailInput = this.page.locator('#email');
  readonly passwordInput = this.page.locator('#password');
  readonly signInButton = this.page.getByRole('button', { name: 'Sign In' });
  readonly cancelButton = this.page.getByRole('button', { name: 'Cancel' });
  readonly descriptiveText = this.page.getByText('Enter your credentials to sign in.');
  readonly registerLink = this.page.getByRole('link', { name: 'Create one here' });
  readonly dontHaveProfileText = this.page.getByText('Don\'t have a profile yet?');
  
  // Error message locators
  readonly loginFailedMessage = this.page.getByText('Login Failed').first();
  readonly invalidCredentialsMessage = this.page.getByText('Invalid credentials. Please check your email and password.').first();
  
  // Login form container
  readonly loginForm = this.page.locator('form');

  constructor(page: Page) {
    super(page);
    this.baseUrl = process.env.BASE_URL || 'http://localhost:9002';
    this.url = `${this.baseUrl}/login`;
  }

  /**
   * Navigate to login page with wait for page load
   */
  async goto(): Promise<void> {
    await this.page.goto(this.url, { 
      waitUntil: 'domcontentloaded',
      timeout: 60000 
    });
    await this.waitForPageLoad();
  }

  /**
   * Fill in email field
   */
  async fillEmail(email: string): Promise<void> {
    await this.emailInput.fill(email);
  }

  /**
   * Fill in password field
   */
  async fillPassword(password: string): Promise<void> {
    await this.passwordInput.fill(password);
  }

  /**
   * Fill in both email and password
   */
  async fillCredentials(email: string, password: string): Promise<void> {
    await this.fillEmail(email);
    await this.fillPassword(password);
  }

  /**
   * Click Sign In button
   */
  async clickSignIn(): Promise<void> {
    await this.signInButton.click();
  }

  /**
   * Click Cancel button
   */
  async clickCancel(): Promise<void> {
    await this.cancelButton.click();
  }

  /**
   * Perform complete login with credentials
   */
  async login(email: string, password: string): Promise<void> {
    await this.fillCredentials(email, password);
    await this.clickSignIn();
  }

  /**
   * Verify login page is loaded and visible
   */
  async isPageLoaded(): Promise<boolean> {
    try {
      await this.accessAccountHeading.waitFor({ state: 'visible', timeout: 30000 });
      return await this.accessAccountHeading.isVisible();
    } catch {
      return false;
    }
  }

  /**
   * Verify all form elements are visible
   */
  async verifyFormElements(): Promise<boolean> {
    try {
      await Promise.all([
        this.accessAccountHeading.waitFor({ state: 'visible', timeout: 10000 }),
        this.emailInput.waitFor({ state: 'visible', timeout: 10000 }),
        this.passwordInput.waitFor({ state: 'visible', timeout: 10000 }),
        this.signInButton.waitFor({ state: 'visible', timeout: 10000 }),
        this.cancelButton.waitFor({ state: 'visible', timeout: 10000 })
      ]);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Check if error messages are displayed
   */
  async getErrorMessage(): Promise<string | null> {
    const loginFailedMessage = this.page.getByText('Login Failed');
    const invalidCredentialsMessage = this.page.getByText('Invalid credentials. Please check your email and password.');
    
    try {
      if (await loginFailedMessage.isVisible({ timeout: 5000 })) {
        return 'Login Failed';
      }
      if (await invalidCredentialsMessage.isVisible({ timeout: 5000 })) {
        return 'Invalid credentials. Please check your email and password.';
      }
    } catch {
      // Elements not found
    }
    
    return null;
  }

  /**
   * Wait for error message to appear
   */
  async waitForErrorMessage(): Promise<string | null> {
    // Try to find any error message within timeout
    try {
      await Promise.race([
        this.loginFailedMessage.waitFor({ state: 'visible', timeout: 5000 }),
        this.invalidCredentialsMessage.waitFor({ state: 'visible', timeout: 5000 })
      ]);
      
      return await this.getErrorMessage();
    } catch {
      return null;
    }
  }
}
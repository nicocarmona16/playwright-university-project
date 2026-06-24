import { Page } from '@playwright/test';

/**
 * Utility class for common test operations
 */
export class TestUtils {
  /**
   * Wait for a specified amount of time
   */
  static async wait(milliseconds: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
  }

  /**
   * Generate random string
   */
  static generateRandomString(length: number = 8): string {
    return Math.random().toString(36).substring(2, length + 2);
  }

  /**
   * Generate random alphanumeric string
   */
  static generateRandomAlphaNumeric(length: number = 10): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  /**
   * Generate random email
   */
  static generateRandomEmail(): string {
    return `test-${this.generateRandomString()}@example.com`;
  }

  /**
   * Generate random email with specific domain
   */
  static generateRandomEmailDomain(domain: string = 'globant.com'): string {
    return `test_user_${Date.now()}@${domain}`;
  }

  /**
   * Take screenshot with automatic folder creation
   */
  static async takeScreenshot(page: Page, name: string, fullPage: boolean = true): Promise<void> {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `${name}_${timestamp}`;
    
    // Ensure screenshots directory exists
    await page.screenshot({ 
      path: `test-results/screenshots/${filename}.png`, 
      fullPage 
    });
  }

  /**
   * Log test information
   */
  static log(message: string, data?: any): void {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${message}`, data || '');
  }

  /**
   * Compare two strings ignoring case and whitespace
   */
  static compareStrings(str1: string, str2: string): boolean {
    return str1.trim().toLowerCase() === str2.trim().toLowerCase();
  }

  /**
   * Generate random number within range
   */
  static generateRandomNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  /**
   * Format date for test purposes
   */
  static formatDate(date: Date = new Date()): string {
    return date.toISOString().split('T')[0];
  }
}
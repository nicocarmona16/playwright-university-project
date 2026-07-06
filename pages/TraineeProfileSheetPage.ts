import { BasePage } from './BasePage';
import { Page, Locator } from '@playwright/test';
import { TestUtils } from '../utils/TestUtils';

/**
 * Page Object Model for Trainee Profile Sheet (side panel / modal)
 * This sheet opens when clicking "View Profile" on a trainee card
 * Uses Radix UI Dialog primitive - renders with role='dialog'
 */
export class TraineeProfileSheetPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // Sheet container - Radix Dialog renders with role='dialog'
  readonly sheetDialog = this.page.getByRole('dialog');
  readonly closeButton = this.page.getByRole('button', { name: 'Close' });

  // Profile header section
  readonly traineeName = this.sheetDialog.locator('[class*="SheetTitle"], h2').first();
  readonly traineeLocation = this.sheetDialog.locator('[class*="SheetDescription"], p[id]').first();

  // Section headings - using h4 elements with exact text
  readonly skillsHeading = this.sheetDialog.getByRole('heading', { name: 'Skills & Technologies' });
  readonly professionalSummaryHeading = this.sheetDialog.getByRole('heading', { name: 'Professional Summary' });
  readonly languagesHeading = this.sheetDialog.getByRole('heading', { name: 'Languages' });
  readonly mentorHeading = this.sheetDialog.getByRole('heading', { name: 'Mentor' });
  readonly internshipPeriodHeading = this.sheetDialog.getByRole('heading', { name: 'Internship Period' });
  readonly projectExperienceHeading = this.sheetDialog.getByRole('heading', { name: 'Project Experience at Globant' });
  readonly trainingHistoryHeading = this.sheetDialog.getByRole('heading', { name: 'Training History' });
  readonly linksHeading = this.sheetDialog.getByRole('heading', { name: 'Links' });

  // Links section
  readonly viewCvLink = this.sheetDialog.getByRole('link', { name: 'View CV' });
  readonly viewGithubLink = this.sheetDialog.getByRole('link', { name: 'View GitHub Profile' });
  readonly viewCertificatesLink = this.sheetDialog.getByRole('link', { name: 'View Certificates' });

  // Skills badges within the sheet
  readonly skillBadges = this.sheetDialog.locator('h4:has-text("Skills & Technologies") + div >> [class*="badge"], h4:has-text("Skills & Technologies") ~ div >> [class*="badge"]');
  
  // Language badges within the sheet
  readonly languageBadges = this.sheetDialog.locator('h4:has-text("Languages") + div >> [class*="badge"], h4:has-text("Languages") ~ div >> [class*="badge"]');

  /**
   * Verify that the profile sheet is open and visible
   */
  async isSheetOpen(): Promise<boolean> {
    try {
      await this.sheetDialog.waitFor({ state: 'visible', timeout: 10000 });
      return await this.sheetDialog.isVisible();
    } catch {
      return false;
    }
  }

  /**
   * Verify that the profile sheet is closed
   */
  async isSheetClosed(): Promise<boolean> {
    try {
      await this.sheetDialog.waitFor({ state: 'hidden', timeout: 10000 });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Close the profile sheet by clicking the close button
   */
  async closeSheet(): Promise<void> {
    await this.closeButton.click();
  }

  /**
   * Get the trainee name displayed in the sheet header
   */
  async getTraineeName(): Promise<string> {
    await this.traineeName.waitFor({ state: 'visible', timeout: 5000 });
    const text = await this.traineeName.textContent();
    return text?.trim() || '';
  }

  /**
   * Get the trainee location displayed in the sheet
   */
  async getTraineeLocation(): Promise<string> {
    await this.traineeLocation.waitFor({ state: 'visible', timeout: 5000 });
    const text = await this.traineeLocation.textContent();
    return text?.trim() || '';
  }

  /**
   * Verify that the Skills & Technologies section is visible
   */
  async hasSkillsSection(): Promise<boolean> {
    try {
      await this.skillsHeading.waitFor({ state: 'visible', timeout: 5000 });
      return await this.skillsHeading.isVisible();
    } catch {
      return false;
    }
  }

  /**
   * Verify that the Professional Summary section is visible
   */
  async hasProfessionalSummarySection(): Promise<boolean> {
    try {
      await this.professionalSummaryHeading.waitFor({ state: 'visible', timeout: 5000 });
      return await this.professionalSummaryHeading.isVisible();
    } catch {
      return false;
    }
  }

  /**
   * Get the professional summary text
   */
  async getProfessionalSummary(): Promise<string> {
    const summaryParagraph = this.sheetDialog.locator('h4:has-text("Professional Summary") + p, h4:has-text("Professional Summary") ~ p').first();
    await summaryParagraph.waitFor({ state: 'visible', timeout: 5000 });
    const text = await summaryParagraph.textContent();
    return text?.trim() || '';
  }

  /**
   * Verify that the Languages section is visible
   */
  async hasLanguagesSection(): Promise<boolean> {
    try {
      await this.languagesHeading.waitFor({ state: 'visible', timeout: 5000 });
      return await this.languagesHeading.isVisible();
    } catch {
      return false;
    }
  }

  /**
   * Verify that the Mentor section is visible
   */
  async hasMentorSection(): Promise<boolean> {
    try {
      await this.mentorHeading.waitFor({ state: 'visible', timeout: 5000 });
      return await this.mentorHeading.isVisible();
    } catch {
      return false;
    }
  }

  /**
   * Verify that the Internship Period section is visible
   */
  async hasInternshipPeriodSection(): Promise<boolean> {
    try {
      await this.internshipPeriodHeading.waitFor({ state: 'visible', timeout: 5000 });
      return await this.internshipPeriodHeading.isVisible();
    } catch {
      return false;
    }
  }

  /**
   * Verify that the Project Experience section is visible
   */
  async hasProjectExperienceSection(): Promise<boolean> {
    try {
      await this.projectExperienceHeading.waitFor({ state: 'visible', timeout: 5000 });
      return await this.projectExperienceHeading.isVisible();
    } catch {
      return false;
    }
  }

  /**
   * Verify that the Training History section is visible
   */
  async hasTrainingHistorySection(): Promise<boolean> {
    try {
      await this.trainingHistoryHeading.waitFor({ state: 'visible', timeout: 5000 });
      return await this.trainingHistoryHeading.isVisible();
    } catch {
      return false;
    }
  }

  /**
   * Verify that the Links section is visible
   */
  async hasLinksSection(): Promise<boolean> {
    try {
      await this.linksHeading.waitFor({ state: 'visible', timeout: 5000 });
      return await this.linksHeading.isVisible();
    } catch {
      return false;
    }
  }

  /**
   * Check if the CV link is present (either link or "No CV link" text)
   */
  async hasCvLink(): Promise<boolean> {
    try {
      const hasLink = await this.viewCvLink.isVisible();
      if (hasLink) return true;
      // Check for "No CV link" text
      const noCvText = this.sheetDialog.getByText('No CV link');
      return await noCvText.isVisible();
    } catch {
      return false;
    }
  }

  /**
   * Check if the GitHub link is present (either link or "No GitHub link" text)
   */
  async hasGithubLink(): Promise<boolean> {
    try {
      const hasLink = await this.viewGithubLink.isVisible();
      if (hasLink) return true;
      // Check for "No GitHub link" text
      const noGithubText = this.sheetDialog.getByText('No GitHub link');
      return await noGithubText.isVisible();
    } catch {
      return false;
    }
  }

  /**
   * Check if the Certificates link is present (either link or "No certificates link" text)
   */
  async hasCertificatesLink(): Promise<boolean> {
    try {
      const hasLink = await this.viewCertificatesLink.isVisible();
      if (hasLink) return true;
      // Check for "No certificates link" text
      const noCertsText = this.sheetDialog.getByText('No certificates link');
      return await noCertsText.isVisible();
    } catch {
      return false;
    }
  }

  /**
   * Get the name of the first trainee card's name from the main page (for comparison)
   */
  async getFirstTraineeCardName(page: Page): Promise<string> {
    const firstCardName = page.locator('[class*="card"] h3, [class*="card"] [class*="CardTitle"]').first();
    await firstCardName.waitFor({ state: 'visible', timeout: 10000 });
    const text = await firstCardName.textContent();
    return text?.trim() || '';
  }

  /**
   * Scroll down within the sheet to reveal more content
   */
  async scrollToLinksSection(): Promise<void> {
    try {
      await this.linksHeading.scrollIntoViewIfNeeded();
    } catch {
      TestUtils.log('Could not scroll to Links section, content may already be visible');
    }
  }

  /**
   * Verify all main profile sections are present (scrolling as needed)
   */
  async verifyAllSections(): Promise<{
    skills: boolean;
    summary: boolean;
    languages: boolean;
    mentor: boolean;
    internship: boolean;
    projects: boolean;
    training: boolean;
    links: boolean;
  }> {
    const skills = await this.hasSkillsSection();
    const summary = await this.hasProfessionalSummarySection();
    const languages = await this.hasLanguagesSection();
    const mentor = await this.hasMentorSection();
    const internship = await this.hasInternshipPeriodSection();
    
    // Scroll down for sections that might be below the fold
    await this.scrollToLinksSection();
    
    const projects = await this.hasProjectExperienceSection();
    const training = await this.hasTrainingHistorySection();
    const links = await this.hasLinksSection();

    return { skills, summary, languages, mentor, internship, projects, training, links };
  }
}

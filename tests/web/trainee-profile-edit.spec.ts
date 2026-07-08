import { test, expect } from '../../fixtures/web-fixtures';
import { TestUtils } from '../../utils/TestUtils';
import { TraineeMyProfilePage } from '../../pages/TraineeMyProfilePage';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const BASE_URL = process.env.BASE_URL || 'http://localhost:9002';
const TEST_EMAIL = process.env.TEST_EMAIL || 'testing.skills@globant.com';
const TEST_PASSWORD = process.env.TEST_PASSWORD || 'testing123';
const TEST_MARKER = ' [Automation Test Edit]';

test.describe('Trainee Profile Edit Scenarios', () => {
  // 180 seconds timeout - includes login + navigation + edit operations
  test.setTimeout(180000);

  let traineeMyProfilePage: TraineeMyProfilePage;

  test.beforeEach(async ({ page, loginPage }) => {
    TestUtils.log('Test setup - logging in as trainee');
    traineeMyProfilePage = new TraineeMyProfilePage(page);

    // Clear cookies for clean state
    await page.context().clearCookies();

    // Navigate to login page first (gives valid origin for storage access)
    await loginPage.goto();

    // Clear storage now that we have a valid page context
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });

    // Login with trainee credentials
    await loginPage.login(TEST_EMAIL, TEST_PASSWORD);

    // Wait for redirect to home
    await page.waitForURL(`${BASE_URL}/`, { timeout: 60000 });
    TestUtils.log('Login successful, redirected to home');

    // Wait for Firebase Auth state to fully resolve in the home page
    await page.waitForTimeout(3000);
    TestUtils.log('Waited for Firebase Auth state to settle');
  });

  test('ESCENARIO 1: Navegación al perfil — Login → Click "My Profile" → Verificar datos', async ({ page }) => {
    TestUtils.log('Starting profile navigation test');

    // Step 1: Verify "My Profile" link is visible in the header
    const navLinkVisible = await traineeMyProfilePage.isMyProfileNavLinkVisible();
    TestUtils.log(`"My Profile" nav link visible: ${navLinkVisible}`);
    expect(navLinkVisible).toBeTruthy();

    // Step 2: Click "My Profile" to navigate
    TestUtils.log('Clicking "My Profile" nav link');
    await traineeMyProfilePage.navigateViaHeader();

    // Step 3: Verify "My Profile" heading is displayed
    const pageLoaded = await traineeMyProfilePage.isPageLoaded();
    TestUtils.log(`Profile page loaded: ${pageLoaded}`);
    expect(pageLoaded).toBeTruthy();

    // Step 4: Verify URL contains /trainee/profile
    const currentUrl = page.url();
    TestUtils.log(`Current URL: ${currentUrl}`);
    expect(currentUrl).toContain('/trainee/profile');

    // Step 5: Verify profile sections are visible
    const hasSections = await traineeMyProfilePage.hasProfileSections();
    TestUtils.log(`Profile sections visible: ${hasSections}`);
    expect(hasSections).toBeTruthy();

    // Step 6: Verify Professional Summary has content
    const summary = await traineeMyProfilePage.getProfessionalSummary();
    TestUtils.log(`Professional Summary length: ${summary.length} characters`);
    expect(summary.length).toBeGreaterThan(0);

    TestUtils.log('Profile navigation test completed successfully');
  });

  test('ESCENARIO 2: Entrar a modo edición — Click "Edit Profile"', async ({ page }) => {
    TestUtils.log('Starting edit mode test');

    // Step 1: Navigate directly to profile page
    await traineeMyProfilePage.goto();
    const pageLoaded = await traineeMyProfilePage.isPageLoaded();
    TestUtils.log(`Profile page loaded: ${pageLoaded}`);
    expect(pageLoaded).toBeTruthy();

    // Step 2: Verify "Edit Profile" button is visible
    const editButtonVisible = await traineeMyProfilePage.isEditProfileButtonVisible();
    TestUtils.log(`"Edit Profile" button visible: ${editButtonVisible}`);
    expect(editButtonVisible).toBeTruthy();

    // Step 3: Click "Edit Profile"
    TestUtils.log('Clicking "Edit Profile"');
    await traineeMyProfilePage.clickEditProfile();

    // Step 4: Verify we are in edit mode (Save + Cancel visible)
    const inEditMode = await traineeMyProfilePage.isInEditMode();
    TestUtils.log(`In edit mode: ${inEditMode}`);
    expect(inEditMode).toBeTruthy();

    // Step 5: Verify Professional Summary is editable (textarea present)
    const summaryValue = await traineeMyProfilePage.getProfessionalSummaryEditValue();
    TestUtils.log(`Professional Summary textarea value length: ${summaryValue.length}`);
    expect(summaryValue.length).toBeGreaterThan(0);

    // Step 6: Verify "Edit Profile" button is no longer visible
    const editButtonHidden = await traineeMyProfilePage.editProfileButton.isHidden();
    TestUtils.log(`"Edit Profile" button hidden in edit mode: ${editButtonHidden}`);
    expect(editButtonHidden).toBeTruthy();

    TestUtils.log('Edit mode test completed successfully');
  });

  test('ESCENARIO 3: Editar Professional Summary, guardar y restaurar valor original', async ({ page }) => {
    TestUtils.log('Starting edit and save test');

    // Step 1: Navigate to profile page
    await traineeMyProfilePage.goto();
    const pageLoaded = await traineeMyProfilePage.isPageLoaded();
    expect(pageLoaded).toBeTruthy();
    TestUtils.log('Profile page loaded');

    // Step 2: Get the current Professional Summary value and clean any residual test markers
    let currentSummary = await traineeMyProfilePage.getProfessionalSummary();
    const cleanSummary = currentSummary.replace(TEST_MARKER, '');
    TestUtils.log(`Current summary: "${currentSummary.substring(0, 50)}..."`);

    // If there's a residual marker from a previous failed run, clean it first
    if (currentSummary.includes(TEST_MARKER)) {
      TestUtils.log('Found residual test marker, cleaning it first...');
      await traineeMyProfilePage.clickEditProfile();
      await traineeMyProfilePage.isInEditMode();
      await traineeMyProfilePage.fillProfessionalSummary(cleanSummary);
      await traineeMyProfilePage.clickSave();
      await traineeMyProfilePage.waitForReadOnlyMode();
      currentSummary = cleanSummary;
      TestUtils.log('Residual marker cleaned');
    }

    const originalSummary = currentSummary;
    TestUtils.log(`Original (clean) summary: "${originalSummary.substring(0, 50)}..."`);

    // Step 3: Enter edit mode
    await traineeMyProfilePage.clickEditProfile();
    const inEditMode = await traineeMyProfilePage.isInEditMode();
    expect(inEditMode).toBeTruthy();
    TestUtils.log('Entered edit mode');

    // Step 4: Modify Professional Summary (append test marker)
    const modifiedSummary = originalSummary + TEST_MARKER;
    await traineeMyProfilePage.fillProfessionalSummary(modifiedSummary);
    TestUtils.log('Professional Summary modified with test marker');

    // Step 5: Click Save
    TestUtils.log('Clicking Save');
    await traineeMyProfilePage.clickSave();

    // Step 6: Verify we exit edit mode (this confirms the save was successful)
    const backToReadOnly = await traineeMyProfilePage.waitForReadOnlyMode();
    TestUtils.log(`Back to read-only mode (save successful): ${backToReadOnly}`);
    expect(backToReadOnly).toBeTruthy();

    // Step 7: Verify the updated text is displayed
    const updatedSummary = await traineeMyProfilePage.getProfessionalSummary();
    TestUtils.log(`Updated summary contains marker: ${updatedSummary.includes(TEST_MARKER)}`);
    expect(updatedSummary).toContain(TEST_MARKER);

    // Step 8: RESTORE — Edit again and put back original value
    TestUtils.log('Restoring original Professional Summary');
    await traineeMyProfilePage.clickEditProfile();
    const inEditModeAgain = await traineeMyProfilePage.isInEditMode();
    expect(inEditModeAgain).toBeTruthy();

    await traineeMyProfilePage.fillProfessionalSummary(originalSummary);
    await traineeMyProfilePage.clickSave();

    // Step 9: Verify restore succeeded by confirming we exit edit mode
    const restoredReadOnly = await traineeMyProfilePage.waitForReadOnlyMode();
    TestUtils.log(`Restore - back to read-only mode: ${restoredReadOnly}`);
    expect(restoredReadOnly).toBeTruthy();

    const restoredSummary = await traineeMyProfilePage.getProfessionalSummary();
    TestUtils.log(`Summary restored successfully: ${restoredSummary === originalSummary}`);
    expect(restoredSummary).toBe(originalSummary);

    TestUtils.log('Edit, save, and restore test completed successfully');
  });

  test('ESCENARIO 4: Cancelar edición — Descartar cambios', async ({ page }) => {
    TestUtils.log('Starting cancel edit test');

    // Step 1: Navigate to profile page
    await traineeMyProfilePage.goto();
    const pageLoaded = await traineeMyProfilePage.isPageLoaded();
    expect(pageLoaded).toBeTruthy();
    TestUtils.log('Profile page loaded');

    // Step 2: Get the original Professional Summary
    const originalSummary = await traineeMyProfilePage.getProfessionalSummary();
    TestUtils.log(`Original summary: "${originalSummary.substring(0, 50)}..."`);

    // Step 3: Enter edit mode
    await traineeMyProfilePage.clickEditProfile();
    const inEditMode = await traineeMyProfilePage.isInEditMode();
    expect(inEditMode).toBeTruthy();
    TestUtils.log('Entered edit mode');

    // Step 4: Modify the Professional Summary
    const discardedText = 'THIS TEXT SHOULD BE DISCARDED BY CANCEL';
    await traineeMyProfilePage.fillProfessionalSummary(discardedText);
    TestUtils.log('Professional Summary modified with text to discard');

    // Step 5: Click Cancel
    TestUtils.log('Clicking Cancel');
    await traineeMyProfilePage.clickCancel();

    // Step 6: Verify we exit edit mode
    const backToReadOnly = await traineeMyProfilePage.waitForReadOnlyMode();
    TestUtils.log(`Back to read-only mode: ${backToReadOnly}`);
    expect(backToReadOnly).toBeTruthy();

    // Step 7: Verify the text reverts to original (discarded text is NOT shown)
    const currentSummary = await traineeMyProfilePage.getProfessionalSummary();
    TestUtils.log(`Summary reverted to original: ${currentSummary === originalSummary}`);
    expect(currentSummary).toBe(originalSummary);
    expect(currentSummary).not.toContain(discardedText);

    TestUtils.log('Cancel edit test completed successfully');
  });
});

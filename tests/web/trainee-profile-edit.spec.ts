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
  test.setTimeout(180000);

  let traineeMyProfilePage: TraineeMyProfilePage;

  test.beforeEach(async ({ page, loginPage }) => {
    TestUtils.log('Test setup - logging in as trainee');
    traineeMyProfilePage = new TraineeMyProfilePage(page);

    await page.context().clearCookies();
    await loginPage.goto();
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });

    await loginPage.login(TEST_EMAIL, TEST_PASSWORD);
    await page.waitForURL(`${BASE_URL}/`, { timeout: 60000 });
    TestUtils.log('Login successful, redirected to home');

    await page.waitForTimeout(3000);
    TestUtils.log('Waited for Firebase Auth state to settle');
  });

  test('ESCENARIO 1: Navegación al perfil — Login → Click "My Profile" → Verificar datos', async ({ page }) => {

    TestUtils.log('Starting profile navigation test');

    const navLinkVisible = await traineeMyProfilePage.isMyProfileNavLinkVisible();
    TestUtils.log(`"My Profile" nav link visible: ${navLinkVisible}`);
    expect(navLinkVisible).toBeTruthy();

    TestUtils.log('Clicking "My Profile" nav link');
    await traineeMyProfilePage.navigateViaHeader();

    const pageLoaded = await traineeMyProfilePage.isPageLoaded();
    TestUtils.log(`Profile page loaded: ${pageLoaded}`);
    expect(pageLoaded).toBeTruthy();

    const currentUrl = page.url();
    TestUtils.log(`Current URL: ${currentUrl}`);
    expect(currentUrl).toContain('/trainee/profile');

    const hasSections = await traineeMyProfilePage.hasProfileSections();
    TestUtils.log(`Profile sections visible: ${hasSections}`);
    expect(hasSections).toBeTruthy();

    const summary = await traineeMyProfilePage.getProfessionalSummary();
    TestUtils.log(`Professional Summary length: ${summary.length} characters`);
    expect(summary.length).toBeGreaterThan(0);

    TestUtils.log('Profile navigation test completed successfully');
  });

  test('ESCENARIO 2: Entrar a modo edición — Click "Edit Profile"', async ({ page }) => {

    TestUtils.log('Starting edit mode test');

    await traineeMyProfilePage.goto();
    const pageLoaded = await traineeMyProfilePage.isPageLoaded();
    TestUtils.log(`Profile page loaded: ${pageLoaded}`);
    expect(pageLoaded).toBeTruthy();

    const editButtonVisible = await traineeMyProfilePage.isEditProfileButtonVisible();
    TestUtils.log(`"Edit Profile" button visible: ${editButtonVisible}`);
    expect(editButtonVisible).toBeTruthy();

    TestUtils.log('Clicking "Edit Profile"');
    await traineeMyProfilePage.clickEditProfile();

    const inEditMode = await traineeMyProfilePage.isInEditMode();
    TestUtils.log(`In edit mode: ${inEditMode}`);
    expect(inEditMode).toBeTruthy();

    const summaryValue = await traineeMyProfilePage.getProfessionalSummaryEditValue();
    TestUtils.log(`Professional Summary textarea value length: ${summaryValue.length}`);
    expect(summaryValue.length).toBeGreaterThan(0);

    const editButtonHidden = await traineeMyProfilePage.editProfileButton.isHidden();
    TestUtils.log(`"Edit Profile" button hidden in edit mode: ${editButtonHidden}`);
    expect(editButtonHidden).toBeTruthy();

    TestUtils.log('Edit mode test completed successfully');
  });

  test('ESCENARIO 3: Editar Professional Summary, guardar y restaurar valor original', async ({ page }) => {

    TestUtils.log('Starting edit and save test');

    await traineeMyProfilePage.goto();
    const pageLoaded = await traineeMyProfilePage.isPageLoaded();
    expect(pageLoaded).toBeTruthy();
    TestUtils.log('Profile page loaded');

    let currentSummary = await traineeMyProfilePage.getProfessionalSummary();
    const cleanSummary = currentSummary.replace(TEST_MARKER, '');
    TestUtils.log(`Current summary: "${currentSummary.substring(0, 50)}..."`);

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

    await traineeMyProfilePage.clickEditProfile();
    const inEditMode = await traineeMyProfilePage.isInEditMode();
    expect(inEditMode).toBeTruthy();
    TestUtils.log('Entered edit mode');

    const modifiedSummary = originalSummary + TEST_MARKER;
    await traineeMyProfilePage.fillProfessionalSummary(modifiedSummary);
    TestUtils.log('Professional Summary modified with test marker');

    TestUtils.log('Clicking Save');
    await traineeMyProfilePage.clickSave();

    const backToReadOnly = await traineeMyProfilePage.waitForReadOnlyMode();
    TestUtils.log(`Back to read-only mode (save successful): ${backToReadOnly}`);
    expect(backToReadOnly).toBeTruthy();

    const updatedSummary = await traineeMyProfilePage.getProfessionalSummary();
    TestUtils.log(`Updated summary contains marker: ${updatedSummary.includes(TEST_MARKER)}`);
    expect(updatedSummary).toContain(TEST_MARKER);

    TestUtils.log('Restoring original Professional Summary');
    await traineeMyProfilePage.clickEditProfile();
    const inEditModeAgain = await traineeMyProfilePage.isInEditMode();
    expect(inEditModeAgain).toBeTruthy();

    await traineeMyProfilePage.fillProfessionalSummary(originalSummary);
    await traineeMyProfilePage.clickSave();

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

    await traineeMyProfilePage.goto();
    const pageLoaded = await traineeMyProfilePage.isPageLoaded();
    expect(pageLoaded).toBeTruthy();
    TestUtils.log('Profile page loaded');

    const originalSummary = await traineeMyProfilePage.getProfessionalSummary();
    TestUtils.log(`Original summary: "${originalSummary.substring(0, 50)}..."`);

    await traineeMyProfilePage.clickEditProfile();
    const inEditMode = await traineeMyProfilePage.isInEditMode();
    expect(inEditMode).toBeTruthy();
    TestUtils.log('Entered edit mode');

    const discardedText = 'THIS TEXT SHOULD BE DISCARDED BY CANCEL';
    await traineeMyProfilePage.fillProfessionalSummary(discardedText);
    TestUtils.log('Professional Summary modified with text to discard');

    TestUtils.log('Clicking Cancel');
    await traineeMyProfilePage.clickCancel();

    const backToReadOnly = await traineeMyProfilePage.waitForReadOnlyMode();
    TestUtils.log(`Back to read-only mode: ${backToReadOnly}`);
    expect(backToReadOnly).toBeTruthy();

    const currentSummary = await traineeMyProfilePage.getProfessionalSummary();
    TestUtils.log(`Summary reverted to original: ${currentSummary === originalSummary}`);
    expect(currentSummary).toBe(originalSummary);
    expect(currentSummary).not.toContain(discardedText);

    TestUtils.log('Cancel edit test completed successfully');
  });
});

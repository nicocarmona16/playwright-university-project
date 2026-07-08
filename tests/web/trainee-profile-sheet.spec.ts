import { test, expect } from '../../fixtures/web-fixtures';
import { TestUtils } from '../../utils/TestUtils';
import { TraineeProfileSheetPage } from '../../pages/TraineeProfileSheetPage';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const BASE_URL = process.env.BASE_URL || 'http://localhost:9002';

test.describe('Trainee Profile Sheet Scenarios', () => {
  test.setTimeout(120000);

  let profileSheetPage: TraineeProfileSheetPage;

  test.beforeEach(async ({ page, traineeSearchPage }) => {
    TestUtils.log('Test setup - navigating to search page');
    profileSheetPage = new TraineeProfileSheetPage(page);
    
    await traineeSearchPage.goto();

    const pageLoaded = await traineeSearchPage.isPageLoaded();
    expect(pageLoaded).toBeTruthy();
    TestUtils.log('Search page loaded successfully');

    try {
      await traineeSearchPage.waitForTimeout(5000);
      const traineesLoaded = await traineeSearchPage.waitForTraineesToLoad();
      TestUtils.log(`Trainees loading status: ${traineesLoaded ? 'loaded' : 'still loading or none available'}`);

      if (!traineesLoaded) {
        TestUtils.log('Giving extra time for trainees to load...');
        await traineeSearchPage.waitForTimeout(3000);
      }
    } catch (error) {
      TestUtils.log('Trainees may still be loading, continuing with test');
    }
  });

  test('ESCENARIO 1: Apertura del Profile Sheet al hacer click en View Profile', async ({ traineeSearchPage }) => {

    TestUtils.log('Starting profile sheet open test');

    const traineeCount = await traineeSearchPage.getTraineeCount();
    TestUtils.log(`Trainee cards visible: ${traineeCount}`);
    expect(traineeCount).toBeGreaterThan(0);

    TestUtils.log('Clicking on first "View Profile" button');
    await traineeSearchPage.viewProfileButtons.first().click();

    const sheetOpen = await profileSheetPage.isSheetOpen();
    TestUtils.log(`Profile sheet is open: ${sheetOpen}`);
    expect(sheetOpen).toBeTruthy();

    const traineeName = await profileSheetPage.getTraineeName();
    TestUtils.log(`Trainee name in sheet: "${traineeName}"`);
    expect(traineeName.length).toBeGreaterThan(0);

    TestUtils.log('Profile sheet open test completed successfully');
  });

  test('ESCENARIO 2: Verificación del contenido del perfil (Skills, Location, Languages, Summary, Links)', async ({ traineeSearchPage }) => {

    TestUtils.log('Starting profile content verification test');

    TestUtils.log('Opening first trainee profile');
    await traineeSearchPage.viewProfileButtons.first().click();

    const sheetOpen = await profileSheetPage.isSheetOpen();
    expect(sheetOpen).toBeTruthy();
    TestUtils.log('Profile sheet opened successfully');

    const traineeName = await profileSheetPage.getTraineeName();
    TestUtils.log(`Trainee name: "${traineeName}"`);
    expect(traineeName.length).toBeGreaterThan(0);

    const traineeLocation = await profileSheetPage.getTraineeLocation();
    TestUtils.log(`Trainee location: "${traineeLocation}"`);
    expect(traineeLocation.length).toBeGreaterThan(0);

    const hasSkills = await profileSheetPage.hasSkillsSection();
    TestUtils.log(`Skills section visible: ${hasSkills}`);
    expect(hasSkills).toBeTruthy();

    const hasSummary = await profileSheetPage.hasProfessionalSummarySection();
    TestUtils.log(`Professional Summary section visible: ${hasSummary}`);
    expect(hasSummary).toBeTruthy();

    const summary = await profileSheetPage.getProfessionalSummary();
    TestUtils.log(`Professional Summary length: ${summary.length} characters`);
    expect(summary.length).toBeGreaterThan(0);

    const hasLanguages = await profileSheetPage.hasLanguagesSection();
    TestUtils.log(`Languages section visible: ${hasLanguages}`);
    expect(hasLanguages).toBeTruthy();

    await profileSheetPage.scrollToLinksSection();
    const hasLinks = await profileSheetPage.hasLinksSection();
    TestUtils.log(`Links section visible: ${hasLinks}`);
    expect(hasLinks).toBeTruthy();

    TestUtils.log('Profile content verification test completed successfully');
  });

  test('ESCENARIO 3: Verificación de secciones adicionales del perfil (Mentor, Internship, Projects, Training)', async ({ traineeSearchPage }) => {

    TestUtils.log('Starting additional sections verification test');

    TestUtils.log('Opening first trainee profile');
    await traineeSearchPage.viewProfileButtons.first().click();

    const sheetOpen = await profileSheetPage.isSheetOpen();
    expect(sheetOpen).toBeTruthy();
    TestUtils.log('Profile sheet opened');

    const sections = await profileSheetPage.verifyAllSections();
    TestUtils.log(`Sections verification results: ${JSON.stringify(sections)}`);

    expect(sections.skills).toBeTruthy();
    expect(sections.summary).toBeTruthy();
    expect(sections.languages).toBeTruthy();
    expect(sections.mentor).toBeTruthy();
    expect(sections.internship).toBeTruthy();
    expect(sections.projects).toBeTruthy();
    expect(sections.training).toBeTruthy();
    expect(sections.links).toBeTruthy();

    TestUtils.log('Additional sections verification test completed successfully');
  });

  test('ESCENARIO 4: Cierre del Profile Sheet', async ({ traineeSearchPage }) => {

    TestUtils.log('Starting profile sheet close test');

    TestUtils.log('Opening first trainee profile');
    await traineeSearchPage.viewProfileButtons.first().click();

    const sheetOpen = await profileSheetPage.isSheetOpen();
    expect(sheetOpen).toBeTruthy();
    TestUtils.log('Profile sheet opened successfully');

    TestUtils.log('Closing profile sheet via close button');
    await profileSheetPage.closeSheet();

    const sheetClosed = await profileSheetPage.isSheetClosed();
    TestUtils.log(`Profile sheet is closed: ${sheetClosed}`);
    expect(sheetClosed).toBeTruthy();

    const traineeCount = await traineeSearchPage.getTraineeCount();
    TestUtils.log(`Trainee cards visible after closing sheet: ${traineeCount}`);
    expect(traineeCount).toBeGreaterThan(0);

    TestUtils.log('Profile sheet close test completed successfully');
  });
});

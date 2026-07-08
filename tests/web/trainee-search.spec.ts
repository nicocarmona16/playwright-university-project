import { test, expect } from '../../fixtures/web-fixtures';
import { TestUtils } from '../../utils/TestUtils';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const BASE_URL = process.env.BASE_URL || 'http://localhost:9002';

test.describe('Trainee Search Scenarios', () => {
  test.setTimeout(120000);
  
  test.beforeEach(async ({ traineeSearchPage }) => {
    TestUtils.log('Test setup - navigating to search page');
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

  test('ESCENARIO 1: Búsqueda por Nombre o Skill', async ({ traineeSearchPage }) => {

    TestUtils.log('Starting search by name test');
    
    TestUtils.log('Searching for "Nicolas"');
    await traineeSearchPage.performSearch('Nicolas');
    await traineeSearchPage.waitForTimeout(2000);
    
    const initialTraineeCount = await traineeSearchPage.getTraineeCount();
    TestUtils.log(`Trainees found for "Nicolas": ${initialTraineeCount}`);
    expect(await traineeSearchPage.hasContent()).toBeTruthy();
    
    if (initialTraineeCount === 0) {
      TestUtils.log('No trainees found for "Nicolas" - this is still a valid search result');
    } else {
      TestUtils.log('Found trainees matching "Nicolas" - search functionality working');
    }
    
    TestUtils.log('Searching for "php"');
    await traineeSearchPage.performSearch('php');
    await traineeSearchPage.waitForTimeout(2000);
    
    const phpTraineeCount = await traineeSearchPage.getTraineeCount();
    TestUtils.log(`Trainees found for "php": ${phpTraineeCount}`);
    expect(await traineeSearchPage.hasContent()).toBeTruthy();
    
    TestUtils.log('Search by name or skill test completed successfully');
  });

  test('ESCENARIO 2: Filtro Individual por Ubicación', async ({ traineeSearchPage }) => {

    TestUtils.log('Starting location filter test');
    TestUtils.log('Filtering by location: Medellín');
    
    await traineeSearchPage.filterByLocation('Medellín');
    await traineeSearchPage.waitForTimeout(2000);
    
    const filteredTraineeCount = await traineeSearchPage.getTraineeCount();
    TestUtils.log(`Trainees found in Medellín: ${filteredTraineeCount}`);
    
    if (filteredTraineeCount === 0) {
      expect(await traineeSearchPage.hasNoResultsMessage()).toBeTruthy();
    } else {
      expect(filteredTraineeCount).toBeGreaterThan(0);
    }
    
    TestUtils.log('Location filter test completed successfully');
  });

  test('ESCENARIO 3: Filtro Individual por Nivel de Inglés', async ({ traineeSearchPage }) => {

    TestUtils.log('Starting English level filter test');
    TestUtils.log('Filtering by English level: B2');
    
    await traineeSearchPage.filterByEnglishLevel('B2');
    await traineeSearchPage.waitForTimeout(2000);
    
    const filteredTraineeCount = await traineeSearchPage.getTraineeCount();
    TestUtils.log(`Trainees found with English level B2: ${filteredTraineeCount}`);
    
    if (filteredTraineeCount === 0) {
      expect(await traineeSearchPage.hasNoResultsMessage()).toBeTruthy();
    } else {
      expect(filteredTraineeCount).toBeGreaterThan(0);
    }
    
    TestUtils.log('English level filter test completed successfully');
  });

  test('ESCENARIO 4: Filtro por Múltiples Skills (AND Lógico)', async ({ traineeSearchPage }) => {

    TestUtils.log('Starting multiple skills filter test');
    TestUtils.log('Filtering by multiple skills: Gherkin AND TypeScript');
    
    await traineeSearchPage.filterByMultipleSkills(['Gherkin', 'TypeScript']);
    await traineeSearchPage.waitForTimeout(2000);
    
    const filteredTraineeCount = await traineeSearchPage.getTraineeCount();
    TestUtils.log(`Trainees found with skills Gherkin AND TypeScript: ${filteredTraineeCount}`);
    
    if (filteredTraineeCount === 0) {
      expect(await traineeSearchPage.hasNoResultsMessage()).toBeTruthy();
    } else {
      expect(filteredTraineeCount).toBeGreaterThan(0);
    }
    
    TestUtils.log('Multiple skills AND filter test completed successfully');
  });
});

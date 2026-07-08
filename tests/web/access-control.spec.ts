import { test, expect } from '../../fixtures/web-fixtures';
import { TestUtils } from '../../utils/TestUtils';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const BASE_URL = process.env.BASE_URL || 'http://localhost:9002';

test.describe('Access Control - Rutas Protegidas sin Autenticación', () => {
  // 90 seconds timeout
  test.setTimeout(90000);

  test('ESCENARIO 1: Acceso a /admin/dashboard sin login muestra Access Denied', async ({ accessControlPage }) => {

    TestUtils.log('Starting access control test for /admin/dashboard');
    await accessControlPage.gotoAdminRoute('/admin/dashboard');

    const accessDenied = await accessControlPage.waitForAccessDenied();
    TestUtils.log(`Access Denied displayed: ${accessDenied}`);
    expect(accessDenied).toBeTruthy();

    const hasMessage = await accessControlPage.hasPermissionMessage();
    TestUtils.log(`Permission message visible: ${hasMessage}`);
    expect(hasMessage).toBeTruthy();

    const hasButton = await accessControlPage.hasGoBackButton();
    TestUtils.log(`Go Back button visible: ${hasButton}`);
    expect(hasButton).toBeTruthy();

    TestUtils.log('Access control test for /admin/dashboard completed successfully');
  });

  test('ESCENARIO 2: Acceso a /admin/trainees sin login muestra Access Denied', async ({ accessControlPage }) => {

    TestUtils.log('Starting access control test for /admin/trainees');
    await accessControlPage.gotoAdminRoute('/admin/trainees');

    const accessDenied = await accessControlPage.waitForAccessDenied();
    TestUtils.log(`Access Denied displayed: ${accessDenied}`);
    expect(accessDenied).toBeTruthy();

    const hasMessage = await accessControlPage.hasPermissionMessage();
    TestUtils.log(`Permission message visible: ${hasMessage}`);
    expect(hasMessage).toBeTruthy();

    TestUtils.log('Access control test for /admin/trainees completed successfully');
  });

  test('ESCENARIO 3: Acceso a /admin/skills sin login muestra Access Denied', async ({ accessControlPage }) => {

    TestUtils.log('Starting access control test for /admin/skills');
    await accessControlPage.gotoAdminRoute('/admin/skills');

    const accessDenied = await accessControlPage.waitForAccessDenied();
    TestUtils.log(`Access Denied displayed: ${accessDenied}`);
    expect(accessDenied).toBeTruthy();

    const hasMessage = await accessControlPage.hasPermissionMessage();
    TestUtils.log(`Permission message visible: ${hasMessage}`);
    expect(hasMessage).toBeTruthy();

    TestUtils.log('Access control test for /admin/skills completed successfully');
  });

  test('ESCENARIO 4: El sidebar de admin NO se muestra a usuarios no autenticados', async ({ accessControlPage }) => {

    TestUtils.log('Starting admin sidebar hidden test');
    await accessControlPage.gotoAdminRoute('/admin/dashboard');

    const accessDenied = await accessControlPage.waitForAccessDenied();
    expect(accessDenied).toBeTruthy();

    const sidebarHidden = await accessControlPage.isAdminSidebarHidden();
    TestUtils.log(`Admin sidebar hidden: ${sidebarHidden}`);
    expect(sidebarHidden).toBeTruthy();

    const navLinksHidden = await accessControlPage.areAdminNavLinksHidden();
    TestUtils.log(`Admin nav links hidden: ${navLinksHidden}`);
    expect(navLinksHidden).toBeTruthy();

    TestUtils.log('Admin sidebar hidden test completed successfully');
  });

  test('ESCENARIO 5: Botón "Go Back to Homepage" redirige al Home desde Access Denied', async ({ accessControlPage, page }) => {

    TestUtils.log('Starting go back from Access Denied test');
    await accessControlPage.gotoAdminRoute('/admin/users');

    const accessDenied = await accessControlPage.waitForAccessDenied();
    expect(accessDenied).toBeTruthy();

    TestUtils.log('Clicking "Go Back to Homepage" button');
    await accessControlPage.clickGoBackToHomepage();

    await page.waitForURL(`${BASE_URL}/`, { timeout: 30000 });
    const currentUrl = page.url();
    TestUtils.log(`Current URL after click: ${currentUrl}`);
    expect(currentUrl).toBe(`${BASE_URL}/`);

    TestUtils.log('Go back from Access Denied test completed successfully');
  });
});

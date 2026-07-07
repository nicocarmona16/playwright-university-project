import { test, expect } from '../../fixtures/web-fixtures';
import { TestUtils } from '../../utils/TestUtils';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const BASE_URL = process.env.BASE_URL || 'http://localhost:9002';

// Admin routes that should be protected
const PROTECTED_ADMIN_ROUTES = [
  '/admin/dashboard',
  '/admin/trainees',
  '/admin/users',
  '/admin/skills',
];

test.describe('Access Control - Rutas Protegidas sin Autenticación', () => {
  // 90 seconds timeout
  test.setTimeout(90000);

  test('ESCENARIO 1: Acceso a /admin/dashboard sin login muestra Access Denied', async ({ accessControlPage }) => {
    TestUtils.log('Starting access control test for /admin/dashboard');

    // Step 1: Navigate to admin dashboard without being logged in
    TestUtils.log('Navigating to /admin/dashboard without authentication');
    await accessControlPage.gotoAdminRoute('/admin/dashboard');

    // Step 2: Wait for Access Denied to appear (after loading resolves)
    const accessDenied = await accessControlPage.waitForAccessDenied();
    TestUtils.log(`Access Denied displayed: ${accessDenied}`);
    expect(accessDenied).toBeTruthy();

    // Step 3: Verify permission message
    const hasMessage = await accessControlPage.hasPermissionMessage();
    TestUtils.log(`Permission message visible: ${hasMessage}`);
    expect(hasMessage).toBeTruthy();

    // Step 4: Verify "Go Back to Homepage" button is present
    const hasButton = await accessControlPage.hasGoBackButton();
    TestUtils.log(`Go Back button visible: ${hasButton}`);
    expect(hasButton).toBeTruthy();

    TestUtils.log('Access control test for /admin/dashboard completed successfully');
  });

  test('ESCENARIO 2: Acceso a /admin/trainees sin login muestra Access Denied', async ({ accessControlPage }) => {
    TestUtils.log('Starting access control test for /admin/trainees');

    // Step 1: Navigate to admin trainees without being logged in
    TestUtils.log('Navigating to /admin/trainees without authentication');
    await accessControlPage.gotoAdminRoute('/admin/trainees');

    // Step 2: Verify Access Denied is shown
    const accessDenied = await accessControlPage.waitForAccessDenied();
    TestUtils.log(`Access Denied displayed: ${accessDenied}`);
    expect(accessDenied).toBeTruthy();

    // Step 3: Verify permission message
    const hasMessage = await accessControlPage.hasPermissionMessage();
    TestUtils.log(`Permission message visible: ${hasMessage}`);
    expect(hasMessage).toBeTruthy();

    TestUtils.log('Access control test for /admin/trainees completed successfully');
  });

  test('ESCENARIO 3: Acceso a /admin/skills sin login muestra Access Denied', async ({ accessControlPage }) => {
    TestUtils.log('Starting access control test for /admin/skills');

    // Step 1: Navigate to admin skills without being logged in
    TestUtils.log('Navigating to /admin/skills without authentication');
    await accessControlPage.gotoAdminRoute('/admin/skills');

    // Step 2: Verify Access Denied is shown
    const accessDenied = await accessControlPage.waitForAccessDenied();
    TestUtils.log(`Access Denied displayed: ${accessDenied}`);
    expect(accessDenied).toBeTruthy();

    // Step 3: Verify permission message
    const hasMessage = await accessControlPage.hasPermissionMessage();
    TestUtils.log(`Permission message visible: ${hasMessage}`);
    expect(hasMessage).toBeTruthy();

    TestUtils.log('Access control test for /admin/skills completed successfully');
  });

  test('ESCENARIO 4: El sidebar de admin NO se muestra a usuarios no autenticados', async ({ accessControlPage }) => {
    TestUtils.log('Starting admin sidebar hidden test');

    // Step 1: Navigate to any admin route without login
    TestUtils.log('Navigating to /admin/dashboard without authentication');
    await accessControlPage.gotoAdminRoute('/admin/dashboard');

    // Step 2: Wait for Access Denied to appear
    const accessDenied = await accessControlPage.waitForAccessDenied();
    expect(accessDenied).toBeTruthy();

    // Step 3: Verify admin sidebar is NOT visible
    const sidebarHidden = await accessControlPage.isAdminSidebarHidden();
    TestUtils.log(`Admin sidebar hidden: ${sidebarHidden}`);
    expect(sidebarHidden).toBeTruthy();

    // Step 4: Verify admin nav links are NOT visible
    const navLinksHidden = await accessControlPage.areAdminNavLinksHidden();
    TestUtils.log(`Admin nav links hidden: ${navLinksHidden}`);
    expect(navLinksHidden).toBeTruthy();

    TestUtils.log('Admin sidebar hidden test completed successfully');
  });

  test('ESCENARIO 5: Botón "Go Back to Homepage" redirige al Home desde Access Denied', async ({ accessControlPage, page }) => {
    TestUtils.log('Starting go back from Access Denied test');

    // Step 1: Navigate to admin route without login
    TestUtils.log('Navigating to /admin/users without authentication');
    await accessControlPage.gotoAdminRoute('/admin/users');

    // Step 2: Wait for Access Denied
    const accessDenied = await accessControlPage.waitForAccessDenied();
    expect(accessDenied).toBeTruthy();

    // Step 3: Click "Go Back to Homepage"
    TestUtils.log('Clicking "Go Back to Homepage" button');
    await accessControlPage.clickGoBackToHomepage();

    // Step 4: Verify navigation to home page
    await page.waitForURL(`${BASE_URL}/`, { timeout: 30000 });
    const currentUrl = page.url();
    TestUtils.log(`Current URL after click: ${currentUrl}`);
    expect(currentUrl).toBe(`${BASE_URL}/`);

    TestUtils.log('Go back from Access Denied test completed successfully');
  });
});

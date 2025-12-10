import { test, expect } from '@playwright/test';

test.describe('Schedule Builder - Route Management', () => {
  test.beforeEach(async ({ page }) => {
    // Login first
    await page.goto('/account');
    await page.getByLabel(/email/i).fill('test@umass.edu');
    await page.getByLabel(/password/i).fill('test');
    await page.getByRole('button', { name: /^login$/i }).click();
    await page.waitForURL('/', { timeout: 10000 });
    
    // Navigate to schedule builder
    await page.getByRole('button', { name: /schedule builder/i }).click();
    await page.waitForURL('/schedule-builder');
  });

  test('should display schedule builder page with empty route', async ({ page }) => {
    await expect(page.getByText('UMass Campus Navigator')).toBeVisible();
    await expect(page.getByRole('heading', { name: /schedule builder/i })).toBeVisible();
  });

  test('should create and save a new route', async ({ page }) => {
    // Enter route name
    const routeName = `Test Route ${Date.now()}`;
    await page.getByPlaceholder(/enter route name/i).fill(routeName);
    
    // Wait for locations to load
    await page.waitForTimeout(2000);
    
    // Click first group header to expand it (CSS module class - use partial match)
    const firstGroupHeader = page.locator('[class*="groupHeader"]').first();
    await firstGroupHeader.click();
    await page.waitForTimeout(500);
    
    // Click first location card (CSS module class - use partial match)
    const firstLocation = page.locator('[class*="locationCard"]').first();
    await firstLocation.click();
    await page.waitForTimeout(300);
    
    // Save the route (button should now be enabled)
    await page.getByRole('button', { name: /save route/i }).click();
    
    // Verify save success message
    await expect(page.getByText(/saved successfully/i)).toBeVisible({ timeout: 5000 });
  });

  test('should edit an existing route', async ({ page }) => {
    // Wait for page to fully load
    await page.waitForTimeout(1500);
    
    // Try to select first saved route if any exist
    const routeSelector = page.locator('select[class*="routeSelector"]');
    const options = await routeSelector.locator('option').count();
    
    if (options > 1) {
      // Select first actual route (skip "New Route" option)
      await routeSelector.selectOption({ index: 1 });
      await page.waitForTimeout(500);
      
      // Edit the route name
      const routeNameInput = page.getByPlaceholder(/enter route name/i);
      await routeNameInput.clear();
      await routeNameInput.fill(`Edited Route ${Date.now()}`);
      
      // Save changes
      await page.getByRole('button', { name: /save route/i }).click();
      
      // Verify save success
      await expect(page.getByText(/saved successfully/i)).toBeVisible({ timeout: 5000 });
    }
  });

  test('should create route with multiple stops', async ({ page }) => {
    // Enter route name
    const routeName = `Multi-Stop Route ${Date.now()}`;
    await page.getByPlaceholder(/enter route name/i).fill(routeName);
    
    // Wait for locations to load and expand groups
    await page.waitForTimeout(2000);
    
    // Expand first two groups and click locations
    const groupHeaders = page.locator('[class*="groupHeader"]');
    const groupCount = await groupHeaders.count();
    
    if (groupCount >= 2) {
      // Expand first group and add location
      await groupHeaders.nth(0).click();
      await page.waitForTimeout(500);
      await page.locator('[class*="locationCard"]').first().click();
      await page.waitForTimeout(300);
      
      // Expand second group and add location
      await groupHeaders.nth(1).click();
      await page.waitForTimeout(500);
      await page.locator('[class*="locationCard"]').nth(1).click();
      await page.waitForTimeout(300);
    }
    
    // Save the route
    await page.getByRole('button', { name: /save route/i }).click();
    
    // Verify save success
    await expect(page.getByText(/saved successfully/i)).toBeVisible({ timeout: 5000 });
  });

  test('should delete a route', async ({ page }) => {
    // First create a route to delete
    const routeName = `Delete Me ${Date.now()}`;
    await page.getByPlaceholder(/enter route name/i).fill(routeName);
    
    await page.waitForTimeout(2000);
    
    // Expand first group and add a location
    await page.locator('[class*="groupHeader"]').first().click();
    await page.waitForTimeout(500);
    await page.locator('[class*="locationCard"]').first().click();
    await page.waitForTimeout(300);
    
    // Save the route
    await page.getByRole('button', { name: /save route/i }).click();
    await expect(page.getByText(/saved successfully/i)).toBeVisible({ timeout: 5000 });
    
    // Now delete it
    await page.waitForTimeout(500);
    
    // Handle the confirmation dialog
    page.on('dialog', dialog => dialog.accept());
    
    const deleteButton = page.getByRole('button', { name: /delete/i });
    if (await deleteButton.isVisible()) {
      await deleteButton.click();
      
      // Verify deletion success
      await expect(page.getByText(/deleted successfully/i)).toBeVisible({ timeout: 5000 });
    }
  });

  test('should reset current route', async ({ page }) => {
    // Enter some data
    await page.getByPlaceholder(/enter route name/i).fill('Temporary Route');
    await page.waitForTimeout(2000);
    
    // Expand group and add location
    await page.locator('[class*="groupHeader"]').first().click();
    await page.waitForTimeout(500);
    await page.locator('[class*="locationCard"]').first().click();
    await page.waitForTimeout(300);
    
    // Handle confirmation dialog
    page.on('dialog', dialog => dialog.accept());
    
    // Click reset
    const resetButton = page.getByRole('button', { name: /reset/i });
    if (await resetButton.isVisible()) {
      await resetButton.click();
      
      // Verify route name is cleared
      const routeNameInput = page.getByPlaceholder(/enter route name/i);
      await expect(routeNameInput).toHaveValue('');
    }
  });

  test('should validate route name is required', async ({ page }) => {
    // Try to save without route name
    await page.waitForTimeout(2000);
    
    // Expand group and add location
    await page.locator('[class*="groupHeader"]').first().click();
    await page.waitForTimeout(500);
    await page.locator('[class*="locationCard"]').first().click();
    await page.waitForTimeout(300);
    
    // Handle alert dialog
    page.on('dialog', dialog => {
      expect(dialog.message()).toContain('route name');
      dialog.accept();
    });
    
    await page.getByRole('button', { name: /save route/i }).click();
  });

  test('should validate at least one location is required', async ({ page }) => {
    // Enter only route name
    await page.getByPlaceholder(/enter route name/i).fill('Empty Route');
    
    // Wait for name to be set
    await page.waitForTimeout(500);
    
    // Verify save button is disabled when no locations added
    const saveButton = page.getByRole('button', { name: /save route/i });
    await expect(saveButton).toBeDisabled();
  });
});

test.describe('Schedule Builder - Backend Integration', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/account');
    await page.getByLabel(/email/i).fill('test@umass.edu');
    await page.getByLabel(/password/i).fill('test');
    await page.getByRole('button', { name: /^login$/i }).click();
    await page.waitForURL('/', { timeout: 10000 });
    await page.getByRole('button', { name: /schedule builder/i }).click();
    await page.waitForURL('/schedule-builder');
  });

  test('should persist route after page reload', async ({ page }) => {
    // Create a route
    const uniqueName = `Persist Test ${Date.now()}`;
    await page.getByPlaceholder(/enter route name/i).fill(uniqueName);
    await page.waitForTimeout(2000);
    
    // Expand group and add location
    await page.locator('[class*="groupHeader"]').first().click();
    await page.waitForTimeout(500);
    await page.locator('[class*="locationCard"]').first().click();
    await page.waitForTimeout(300);
    
    await page.getByRole('button', { name: /save route/i }).click();
    await expect(page.getByText(/saved successfully/i)).toBeVisible({ timeout: 5000 });
    
    // Wait a bit for save to complete
    await page.waitForTimeout(1000);
    
    // Reload page
    await page.reload();
    await page.waitForURL('/schedule-builder');
    
    // Wait for routes to load
    await page.waitForTimeout(3000);
    
    // Verify route still exists by making an API call directly
    const response = await page.evaluate(async (name) => {
      const userId = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!).id : null;
      if (!userId) return { found: false, error: 'No user ID' };
      
      const res = await fetch(`http://localhost:5000/api/users/${userId}/routes`);
      const routes = await res.json();
      const found = routes.some((route: any) => route.name === name);
      return { found, routes: routes.map((r: any) => r.name) };
    }, uniqueName);
    
    expect(response.found).toBe(true);
  });
});

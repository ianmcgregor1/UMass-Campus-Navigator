import { test, expect } from '@playwright/test';

test.describe('Navigation E2E', () => {
  test('should navigate to home page', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText('UMass Campus Navigator')).toBeVisible();
  });

  test('should navigate to account page', async ({ page }) => {
    await page.goto('/account');
    await expect(page.getByRole('button', { name: /login/i })).toBeVisible();
  });

  test('should navigate to schedule builder', async ({ page }) => {
    await page.goto('/schedule-builder');
    await expect(page.getByText('UMass Campus Navigator')).toBeVisible();
  });
});

test.describe('Responsive Design', () => {
  test('should work on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    
    await page.addInitScript(() => {
      localStorage.setItem('user', JSON.stringify({
        id: 1,
        name: 'Test User',
        email: 'test@umass.edu'
      }));
    });
    await page.goto('/');
    await page.waitForLoadState('networkidle').catch(() => {});
    
    await expect(page.getByText('UMass Campus Navigator')).toBeVisible();
  });

  test('should work on tablet viewport', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    
    await page.addInitScript(() => {
      localStorage.setItem('user', JSON.stringify({
        id: 1,
        name: 'Test User',
        email: 'test@umass.edu'
      }));
    });
    await page.goto('/');
    await page.waitForLoadState('networkidle').catch(() => {});
    
    await expect(page.getByText('UMass Campus Navigator')).toBeVisible();
  });
});

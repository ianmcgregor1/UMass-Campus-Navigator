import { test, expect } from '@playwright/test';

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

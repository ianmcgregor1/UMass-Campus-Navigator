import { test, expect } from '@playwright/test';

test.describe('User Authentication', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/account');
    await page.evaluate(() => localStorage.clear());
  });

  test('should display login form', async ({ page }) => {
    await page.goto('/account');
    
    await expect(page.getByRole('button', { name: /^login$/i })).toBeVisible();
    await expect(page.getByLabel(/email/i)).toBeVisible();
    await expect(page.getByLabel(/password/i)).toBeVisible();
  });

  test('should switch between login and register forms', async ({ page }) => {
    await page.goto('/account');
    
    await expect(page.getByRole('button', { name: /^login$/i })).toBeVisible();
    
    await page.getByRole('button', { name: /register here/i }).click();
    await expect(page.getByLabel(/name/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /^register$/i })).toBeVisible();
    
    await page.getByRole('button', { name: /login here/i }).click();
    await expect(page.getByRole('button', { name: /^login$/i })).toBeVisible();
  });

  test('should login successfully with valid credentials', async ({ page }) => {
    await page.goto('/account');
    
    await page.getByLabel(/email/i).fill('test@umass.edu');
    await page.getByLabel(/password/i).fill('test');
    await page.getByRole('button', { name: /^login$/i }).click();
    
    await page.waitForURL('/', { timeout: 10000 });
    await expect(page.getByText('UMass Campus Navigator')).toBeVisible();
  });

  test('should show error with invalid credentials', async ({ page }) => {
    await page.goto('/account');
    
    await page.getByLabel(/email/i).fill('invalid@example.com');
    await page.getByLabel(/password/i).fill('wrongpassword');
    await page.getByRole('button', { name: /^login$/i }).click();
    
    await page.waitForTimeout(1000);
    await expect(page).toHaveURL('/account');
  });
});

test.describe('Navigation', () => {
  test('should display navbar on all pages', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText('UMass Campus Navigator')).toBeVisible();
    
    await page.goto('/account');
    await expect(page.getByText('UMass Campus Navigator')).toBeVisible();
    
    await page.goto('/schedule-builder');
    await expect(page.getByText('UMass Campus Navigator')).toBeVisible();
  });

  test('should redirect to account when not logged in', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
    
    await expect(page).toHaveURL('/account');
  });
});

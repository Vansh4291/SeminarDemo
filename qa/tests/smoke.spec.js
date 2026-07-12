const { test, expect } = require('@playwright/test');

test.describe('Smoke Verification', () => {
  test('Backend is running and returns products', async ({ request }) => {
    const res = await request.get('http://localhost:4000/api/products');
    expect(res.ok()).toBeTruthy();
    const data = await res.json();
    expect(data.length).toBeGreaterThan(0);
  });

  test('Frontend is running and loads homepage', async ({ page }) => {
    const res = await page.goto('/');
    expect(res.ok()).toBeTruthy();
    await expect(page).toHaveTitle(/frontend|CRUD/i);
    await expect(page.locator('h2').filter({ hasText: /Product Management/i }).first()).toBeVisible();
  });
});

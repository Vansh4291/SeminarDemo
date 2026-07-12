const { test, expect } = require('@playwright/test');

test.describe('Docs Page Verification', () => {
  test('Loads architecture cards and endpoints', async ({ page }) => {
    await page.goto('/docs');
    
    // Check for architecture cards
    await expect(page.locator('h2:has-text("API Documentation")')).toBeVisible();
    
    // Check for REST endpoints
    await expect(page.locator('h3:has-text("REST Architecture")')).toBeVisible();
    
    // Check for GraphQL Schema
    await expect(page.locator('h3:has-text("GraphQL Architecture")')).toBeVisible();
  });
});

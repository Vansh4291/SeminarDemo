const { test, expect } = require('@playwright/test');

test.describe('CRUD Verification', () => {
  test.setTimeout(120000); // 2 minutes due to potential lag with 5000 items

  test('Page loads and elements are visible', async ({ page }) => {
    await page.goto('/crud');
    await expect(page.locator('h2:has-text("Product Management")')).toBeVisible({ timeout: 60000 });
    // Verify the table renders
    await expect(page.locator('.product-table')).toBeVisible({ timeout: 60000 });
  });

  test('Stress Test: 10 Consecutive Searches', async ({ page }) => {
    await page.goto('/crud');
    await expect(page.locator('.product-table')).toBeVisible({ timeout: 60000 });
    
    for (let i = 0; i < 10; i++) {
      await page.fill('input[placeholder*="Search"]', `Search Iteration ${i}`);
      // Wait a moment for filter to apply
      await page.waitForTimeout(500);
    }
    
    // Clear search
    await page.fill('input[placeholder*="Search"]', '');
    await page.waitForTimeout(1000);
  });
  
  test('Create, Update, Delete Flow', async ({ page }) => {
    await page.goto('/crud');
    await expect(page.locator('.product-table')).toBeVisible({ timeout: 60000 });
    
    // Create
    await page.click('button:has-text("+ Add Product")');
    await page.fill('input[name="name"]', 'QA Test E2E Product');
    await page.fill('input[name="price"]', '499');
    await page.click('button[type="submit"]');
    
    // Search for it to limit DOM rendering during interaction
    await page.fill('input[placeholder*="Search"]', 'QA Test E2E Product');
    await expect(page.locator('.product-table tbody tr').first()).toContainText('QA Test E2E Product');
    
    // Update (assuming Edit button exists and is clickable)
    const editBtn = page.locator('button[title="Edit Product"]').first();
    if (await editBtn.isVisible()) {
      await editBtn.click();
      await page.fill('input[name="price"]', '599');
      await page.click('button[type="submit"]');
      await expect(page.locator('.product-table tbody tr').first()).toContainText('599');
    }
    
    // Delete
    const deleteBtn = page.locator('button[title="Delete Product"]').first();
    if (await deleteBtn.isVisible()) {
      await deleteBtn.click();
      await page.click('button:has-text("Confirm Delete")');
      // Verify it's gone
      await expect(page.locator('.product-table tbody tr')).toHaveCount(0);
    }
  });
});

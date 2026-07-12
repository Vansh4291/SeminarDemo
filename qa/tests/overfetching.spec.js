const { test, expect } = require('@playwright/test');

test.describe('Over-fetching Demo Verification', () => {
  test('Stress Test: 10 Consecutive Over-fetching Demos', async ({ page }) => {
    test.setTimeout(90000);
    await page.goto('/overfetching');
    
    const runBtn = page.locator('button:has-text("Run Demo")');
    await expect(runBtn).toBeVisible({ timeout: 15000 });
    
    for (let i = 0; i < 10; i++) {
      await expect(runBtn).toBeEnabled();
      await runBtn.click();
      await expect(page.locator('.payload-bar').first()).toBeVisible({ timeout: 10000 });
      await page.waitForTimeout(500);
    }
  });

  test('Over-fetching Demo correctly compares payloads', async ({ page }) => {
    await page.goto('/overfetching');
    
    const runBtn = page.locator('button:has-text("Run Demo")');
    await expect(runBtn).toBeVisible();
    await expect(runBtn).toBeEnabled({ timeout: 15000 });
    
    await runBtn.click();
    
    // Check for 2 payload bars
    const bars = page.locator('.payload-bar');
    await expect(bars).toHaveCount(2, { timeout: 10000 });
    
    // The code viewer should be present
    const codeViewers = page.locator('.code-viewer');
    await expect(codeViewers).toHaveCount(1); // There is only one CodeViewer component
  });
});

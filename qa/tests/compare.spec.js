const { test, expect } = require('@playwright/test');

test.describe('Compare Demo Verification', () => {
  test('Stress Test: 10 Consecutive Comparisons', async ({ page }) => {
    test.setTimeout(60000);
    await page.goto('/compare');
    await expect(page.locator('h2:has-text("Side-by-Side Comparison")')).toBeVisible();

    for (let i = 0; i < 10; i++) {
      await page.reload();
      await expect(page.locator('h3:has-text("Payload Reduced")')).toBeVisible({ timeout: 15000 });
      await page.waitForTimeout(500); // Small delay to avoid network spamming
    }
  });

  test('Compare Demo calculates reduction and displays timings', async ({ page }) => {
    await page.goto('/compare');
    
    // Check that REST and GraphQL requests fired (implicitly checked by stats appearing)
    const restTiming = page.locator('.metric-card').filter({ hasText: "Time" }).first();
    const gqlTiming = page.locator('.metric-card').filter({ hasText: "Time" }).nth(1);
    
    await expect(restTiming).toBeVisible();
    await expect(gqlTiming).toBeVisible();

    const reductionCard = page.locator('h3:has-text("Payload Reduced")');
    await expect(reductionCard).toBeVisible();
    
    const rawJsonContainers = page.locator('.code-viewer pre');
    await expect(rawJsonContainers).toHaveCount(2); // One for REST, one for GraphQL
  });
});

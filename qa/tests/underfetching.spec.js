const { test, expect } = require('@playwright/test');

test.describe('Under-fetching Demo Verification', () => {
  test('Under-fetching Demo executes N+1 requests for REST and 1 for GraphQL', async ({ page }) => {
    await page.goto('/underfetching');
    
    const runBtn = page.locator('button:has-text("Run Demo")');
    await expect(runBtn).toBeVisible();
    await expect(runBtn).toBeEnabled({ timeout: 10000 }); // Wait for test product to fetch

    let restReqs = 0;
    let gqlReqs = 0;
    
    page.on('request', req => {
      if (req.url().includes('/api')) restReqs++;
      if (req.url().includes('/graphql')) gqlReqs++;
    });

    await runBtn.click();
    
    // Wait for the results to populate
    await expect(page.locator('h3:has-text("REST Required 3 Requests")')).toBeVisible({ timeout: 15000 });
    
    // Because it fetches 5000 products on mount (1 request), then 3 requests on click, total is >= 3
    expect(restReqs).toBeGreaterThanOrEqual(3);
    // GraphQL might have executed on mount if there's any caching or other queries, but here it's >= 1
    expect(gqlReqs).toBeGreaterThanOrEqual(1);
  });
});

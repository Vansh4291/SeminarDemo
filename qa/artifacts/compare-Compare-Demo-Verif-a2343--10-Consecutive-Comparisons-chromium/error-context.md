# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: compare.spec.js >> Compare Demo Verification >> Stress Test: 10 Consecutive Comparisons
- Location: tests\compare.spec.js:4:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('h3:has-text("Payload Reduced")')
Expected: visible
Timeout: 15000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 15000ms
  - waiting for locator('h3:has-text("Payload Reduced")')

```

```yaml
- banner:
  - heading "Inventory Dashboard" [level=1]
  - text: "Active Backend: GRAPHQL"
  - navigation:
    - link "CRUD Demo":
      - /url: /crud
    - link "⚖️Compare Both":
      - /url: /compare
    - link "📦Over-fetching":
      - /url: /overfetching
    - link "🔗Under-fetching":
      - /url: /underfetching
    - link "✍️Query Editor":
      - /url: /query-editor
    - link "📄Docs":
      - /url: /docs
  - text: REST GraphQL
- main:
  - heading "Side-by-Side Comparison" [level=2]
  - paragraph: Execute both APIs simultaneously to compare response times and payload sizes.
  - button "Run Comparison ▶"
  - heading "REST API" [level=3]
  - text: GET /api/products Time - Full Payload - Fields / Object -
  - heading "Raw JSON Response (Envelope)" [level=4]
  - text: Awaiting execution...
  - heading "GraphQL API" [level=3]
  - text: POST /graphql Time - Full Payload - Fields / Object -
  - heading "Raw JSON Response (Envelope)" [level=4]
  - text: Awaiting execution...
- text: Seminar Mode Live
- button "◀ CRUD Foundation"
- text: 2 / 6
- button "Over-fetching Demo ▶"
- text: 🧑‍💻 Network Panel
```

# Test source

```ts
  1  | const { test, expect } = require('@playwright/test');
  2  | 
  3  | test.describe('Compare Demo Verification', () => {
  4  |   test('Stress Test: 10 Consecutive Comparisons', async ({ page }) => {
  5  |     test.setTimeout(60000);
  6  |     await page.goto('/compare');
  7  |     await expect(page.locator('h2:has-text("Side-by-Side Comparison")')).toBeVisible();
  8  | 
  9  |     for (let i = 0; i < 10; i++) {
  10 |       await page.reload();
> 11 |       await expect(page.locator('h3:has-text("Payload Reduced")')).toBeVisible({ timeout: 15000 });
     |                                                                    ^ Error: expect(locator).toBeVisible() failed
  12 |       await page.waitForTimeout(500); // Small delay to avoid network spamming
  13 |     }
  14 |   });
  15 | 
  16 |   test('Compare Demo calculates reduction and displays timings', async ({ page }) => {
  17 |     await page.goto('/compare');
  18 |     
  19 |     // Check that REST and GraphQL requests fired (implicitly checked by stats appearing)
  20 |     const restTiming = page.locator('.metric-card').filter({ hasText: "Time" }).first();
  21 |     const gqlTiming = page.locator('.metric-card').filter({ hasText: "Time" }).nth(1);
  22 |     
  23 |     await expect(restTiming).toBeVisible();
  24 |     await expect(gqlTiming).toBeVisible();
  25 | 
  26 |     const reductionCard = page.locator('h3:has-text("Payload Reduced")');
  27 |     await expect(reductionCard).toBeVisible();
  28 |     
  29 |     const rawJsonContainers = page.locator('.code-viewer pre');
  30 |     await expect(rawJsonContainers).toHaveCount(2); // One for REST, one for GraphQL
  31 |   });
  32 | });
  33 | 
```
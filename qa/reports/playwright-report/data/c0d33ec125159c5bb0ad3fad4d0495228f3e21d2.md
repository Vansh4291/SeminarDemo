# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: overfetching.spec.js >> Over-fetching Demo Verification >> Over-fetching Demo correctly compares payloads
- Location: tests\overfetching.spec.js:19:3

# Error details

```
Error: expect(locator).toHaveCount(expected) failed

Locator:  locator('.code-viewer')
Expected: 1
Received: 0
Timeout:  5000ms

Call log:
  - Expect "toHaveCount" with timeout 5000ms
  - waiting for locator('.code-viewer')
    14 × locator resolved to 0 elements
       - unexpected value "0"

```

# Page snapshot

```yaml
- generic [ref=e3]:
  - banner [ref=e4]:
    - generic [ref=e5]:
      - heading "Inventory Dashboard" [level=1] [ref=e6]
      - generic [ref=e7]: "Active Backend: GRAPHQL"
    - navigation [ref=e8]:
      - link "CRUD Demo" [ref=e9] [cursor=pointer]:
        - /url: /crud
      - link "⚖️Compare Both" [ref=e10] [cursor=pointer]:
        - /url: /compare
      - link "📦Over-fetching" [ref=e11] [cursor=pointer]:
        - /url: /overfetching
      - link "🔗Under-fetching" [ref=e12] [cursor=pointer]:
        - /url: /underfetching
      - link "✍️Query Editor" [ref=e13] [cursor=pointer]:
        - /url: /query-editor
      - link "📄Docs" [ref=e14] [cursor=pointer]:
        - /url: /docs
    - generic [ref=e15]:
      - generic [ref=e16]: REST
      - generic "Switch API Mode" [ref=e17] [cursor=pointer]
      - generic [ref=e19]: GraphQL
  - main [ref=e20]:
    - generic [ref=e21]:
      - generic [ref=e22]:
        - generic [ref=e23]:
          - heading "Over-fetching Demo" [level=2] [ref=e24]
          - paragraph [ref=e25]:
            - text: "Requirement: We only need the product's"
            - strong [ref=e26]: name
            - text: and
            - strong [ref=e27]: price
            - text: .
        - button "Run Demo ▶" [ref=e28] [cursor=pointer]
      - generic [ref=e29]:
        - generic [ref=e30]:
          - generic [ref=e32]: REST Payload (450 Bytes)
          - generic [ref=e35]: GraphQL Payload (90 Bytes)
        - generic [ref=e37]:
          - generic [ref=e38]:
            - button "Request" [ref=e39] [cursor=pointer]
            - button "Response" [ref=e40] [cursor=pointer]
          - generic [ref=e41]:
            - generic [ref=e42]:
              - generic [ref=e43]: REST
              - generic [ref=e44]: GET /api/products/6a47e0c050de3da6387dff04
            - generic [ref=e45]:
              - generic [ref=e46]: GraphQL
              - generic [ref=e47]: "query GetOptimizedProduct($id: ID!) { product(id: $id) { name price } } Variables: { \"id\": \"6a47e0c050de3da6387dff04\" }"
  - generic [ref=e49]:
    - generic [ref=e52]: Seminar Mode Live
    - generic [ref=e53]:
      - button "◀ Side-by-Side Comparison" [ref=e54] [cursor=pointer]
      - generic [ref=e55]: 3 / 6
      - button "Under-fetching Demo ▶" [ref=e56] [cursor=pointer]
  - generic [ref=e57] [cursor=pointer]:
    - generic [ref=e58]: 🧑‍💻
    - generic [ref=e59]: Network Panel
    - generic [ref=e60]: "4"
```

# Test source

```ts
  1  | const { test, expect } = require('@playwright/test');
  2  | 
  3  | test.describe('Over-fetching Demo Verification', () => {
  4  |   test('Stress Test: 10 Consecutive Over-fetching Demos', async ({ page }) => {
  5  |     test.setTimeout(90000);
  6  |     await page.goto('/overfetching');
  7  |     
  8  |     const runBtn = page.locator('button:has-text("Run Demo")');
  9  |     await expect(runBtn).toBeVisible({ timeout: 15000 });
  10 |     
  11 |     for (let i = 0; i < 10; i++) {
  12 |       await expect(runBtn).toBeEnabled();
  13 |       await runBtn.click();
  14 |       await expect(page.locator('.payload-bar').first()).toBeVisible({ timeout: 10000 });
  15 |       await page.waitForTimeout(500);
  16 |     }
  17 |   });
  18 | 
  19 |   test('Over-fetching Demo correctly compares payloads', async ({ page }) => {
  20 |     await page.goto('/overfetching');
  21 |     
  22 |     const runBtn = page.locator('button:has-text("Run Demo")');
  23 |     await expect(runBtn).toBeVisible();
  24 |     await expect(runBtn).toBeEnabled({ timeout: 15000 });
  25 |     
  26 |     await runBtn.click();
  27 |     
  28 |     // Check for 2 payload bars
  29 |     const bars = page.locator('.payload-bar');
  30 |     await expect(bars).toHaveCount(2, { timeout: 10000 });
  31 |     
  32 |     // The code viewer should be present
  33 |     const codeViewers = page.locator('.code-viewer');
> 34 |     await expect(codeViewers).toHaveCount(1); // There is only one CodeViewer component
     |                               ^ Error: expect(locator).toHaveCount(expected) failed
  35 |   });
  36 | });
  37 | 
```
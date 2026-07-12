# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: query-editor.spec.js >> Query Editor Verification >> Executes valid query successfully
- Location: tests\query-editor.spec.js:4:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('button:has-text("Execute")')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('button:has-text("Execute")')

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
  - heading "Custom GraphQL Editor" [level=2]
  - paragraph: Write any valid GraphQL query against the backend.
  - button "Run Query ▶"
  - text: Query
  - textbox: "query { products { id name price category } }"
  - text: Response Awaiting execution...
- text: Seminar Mode Live
- button "◀ Under-fetching Demo"
- text: 5 / 6
- button "Architecture & API Docs ▶"
- text: 🧑‍💻 Network Panel
```

# Test source

```ts
  1  | const { test, expect } = require('@playwright/test');
  2  | 
  3  | test.describe('Query Editor Verification', () => {
  4  |   test('Executes valid query successfully', async ({ page }) => {
  5  |     await page.goto('/query-editor');
  6  |     
  7  |     // Using simple assertions as it's a Monaco editor, just checking if we can click execute
  8  |     const executeBtn = page.locator('button:has-text("Execute")');
> 9  |     await expect(executeBtn).toBeVisible();
     |                              ^ Error: expect(locator).toBeVisible() failed
  10 |     await executeBtn.click();
  11 |     
  12 |     // Check if the response pane gets populated
  13 |     // Assuming the response is formatted as JSON in a pre tag or code viewer
  14 |     await expect(page.locator('.code-viewer').nth(1)).not.toBeEmpty({ timeout: 10000 });
  15 |   });
  16 | 
  17 |   test('Catches syntax error in invalid query', async ({ page }) => {
  18 |     // This is hard to test automatically with Monaco editor without typing explicitly.
  19 |     // We will verify the page loads and is interactive.
  20 |     await page.goto('/query-editor');
  21 |     const header = page.locator('h2');
  22 |     await expect(header).toContainText('Custom GraphQL Editor');
  23 |   });
  24 | });
  25 | 
```
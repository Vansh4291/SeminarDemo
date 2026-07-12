# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: crud.spec.js >> CRUD Verification >> Create, Update, Delete Flow
- Location: tests\crud.spec.js:28:3

# Error details

```
Error: expect(locator).toContainText(expected) failed

Locator: locator('.product-table tbody tr').first()
Expected substring: "QA Test E2E Product"
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toContainText" with timeout 5000ms
  - waiting for locator('.product-table tbody tr').first()
    2 × locator resolved to <tr>…</tr>
      - unexpected value "Umbrella Laptop Stand Premium 834 - ID4934This is a high-quality Umbrella Laptop Stand Premium 834 - ID4934. Perfect for your needs.Computer Accessories₹35,554.00In Stock (51)✏️🗑️"

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
  - heading "Product Management" [level=2]
  - button "+ Add Product"
  - text: 📦 0 Total Products 💰 ₹0.00 Inventory Value 🏷️ 0 Active Categories ⚠️ 0 Out of Stock 🔍
  - textbox "Search products by name or description...": QA Test E2E Product
  - combobox:
    - option "All Categories" [selected]
    - option "Accessories"
    - option "Audio Devices"
    - option "Cameras"
    - option "Computer Accessories"
    - option "Electronics"
    - option "Gaming"
    - option "Home Appliance"
    - option "Home Appliances"
    - option "Mobile Phones"
    - option "Office Supplies"
  - text: 📦
  - heading "No Products Found" [level=3]
  - paragraph: No items match your active search filter settings.
  - heading "Add New Product" [level=3]
  - button "🗙"
  - text: Product Name *
  - textbox "Product Name *":
    - /placeholder: e.g. Mechanical Keyboard
    - text: QA Test E2E Product
  - text: Category *
  - textbox "Category *":
    - /placeholder: e.g. Electronics
  - text: Category is required Price (₹) *
  - spinbutton "Price (₹) *": "499"
  - text: Stock Level *
  - spinbutton "Stock Level *"
  - text: Stock level is required Description
  - textbox "Description":
    - /placeholder: Optional details about this item...
  - button "Cancel"
  - button "Create Product"
- text: Seminar Mode Live 1 / 6
- button "Side-by-Side Comparison ▶"
- text: 🧑‍💻 Network Panel 2
```

# Test source

```ts
  1  | const { test, expect } = require('@playwright/test');
  2  | 
  3  | test.describe('CRUD Verification', () => {
  4  |   test.setTimeout(120000); // 2 minutes due to potential lag with 5000 items
  5  | 
  6  |   test('Page loads and elements are visible', async ({ page }) => {
  7  |     await page.goto('/crud');
  8  |     await expect(page.locator('h2:has-text("Product Management")')).toBeVisible({ timeout: 60000 });
  9  |     // Verify the table renders
  10 |     await expect(page.locator('.product-table')).toBeVisible({ timeout: 60000 });
  11 |   });
  12 | 
  13 |   test('Stress Test: 10 Consecutive Searches', async ({ page }) => {
  14 |     await page.goto('/crud');
  15 |     await expect(page.locator('.product-table')).toBeVisible({ timeout: 60000 });
  16 |     
  17 |     for (let i = 0; i < 10; i++) {
  18 |       await page.fill('input[placeholder*="Search"]', `Search Iteration ${i}`);
  19 |       // Wait a moment for filter to apply
  20 |       await page.waitForTimeout(500);
  21 |     }
  22 |     
  23 |     // Clear search
  24 |     await page.fill('input[placeholder*="Search"]', '');
  25 |     await page.waitForTimeout(1000);
  26 |   });
  27 |   
  28 |   test('Create, Update, Delete Flow', async ({ page }) => {
  29 |     await page.goto('/crud');
  30 |     await expect(page.locator('.product-table')).toBeVisible({ timeout: 60000 });
  31 |     
  32 |     // Create
  33 |     await page.click('button:has-text("+ Add Product")');
  34 |     await page.fill('input[name="name"]', 'QA Test E2E Product');
  35 |     await page.fill('input[name="price"]', '499');
  36 |     await page.click('button[type="submit"]');
  37 |     
  38 |     // Search for it to limit DOM rendering during interaction
  39 |     await page.fill('input[placeholder*="Search"]', 'QA Test E2E Product');
> 40 |     await expect(page.locator('.product-table tbody tr').first()).toContainText('QA Test E2E Product');
     |                                                                   ^ Error: expect(locator).toContainText(expected) failed
  41 |     
  42 |     // Update (assuming Edit button exists and is clickable)
  43 |     const editBtn = page.locator('button[title="Edit Product"]').first();
  44 |     if (await editBtn.isVisible()) {
  45 |       await editBtn.click();
  46 |       await page.fill('input[name="price"]', '599');
  47 |       await page.click('button[type="submit"]');
  48 |       await expect(page.locator('.product-table tbody tr').first()).toContainText('599');
  49 |     }
  50 |     
  51 |     // Delete
  52 |     const deleteBtn = page.locator('button[title="Delete Product"]').first();
  53 |     if (await deleteBtn.isVisible()) {
  54 |       await deleteBtn.click();
  55 |       await page.click('button:has-text("Confirm Delete")');
  56 |       // Verify it's gone
  57 |       await expect(page.locator('.product-table tbody tr')).toHaveCount(0);
  58 |     }
  59 |   });
  60 | });
  61 | 
```
import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  
  let errors = 0;
  let warnings = 0;
  
  page.on('console', msg => {
    if (msg.type() === 'error') errors++;
    if (msg.type() === 'warning') warnings++;
  });
  
  page.on('pageerror', err => {
    console.error(`[PAGE ERROR] ${err.message}`);
    errors++;
  });

  console.log('--- Verifying CRUD Demo ---');
  await page.goto('http://localhost:5173/crud');
  await page.waitForSelector('.product-table');
  
  // Verify Create
  await page.click('button:has-text("+ Add Product")');
  await page.fill('input[name="name"]', 'Test Seed Product');
  await page.fill('input[name="price"]', '999');
  await page.click('button[type="submit"]');
  await page.waitForTimeout(1000);
  
  // Verify Search Filter
  await page.fill('input[placeholder*="Search"]', 'Test Seed Product');
  await page.waitForTimeout(1000);
  const rowsCount = await page.locator('.product-table tbody tr').count();
  console.log(`CRUD Search Results for "Test Seed Product": ${rowsCount}`);
  
  // Verify Delete
  if (rowsCount > 0) {
    await page.click('button[title="Delete Product"]');
    await page.click('button:has-text("Confirm Delete")');
    await page.waitForTimeout(1000);
  }

  console.log('\n--- Verifying Compare Demo ---');
  await page.goto('http://localhost:5173/');
  await page.waitForSelector('.stats-card');
  const reductionText = await page.textContent('.stats-card:has-text("Payload Reduction") .stat-value');
  console.log(`Compare Payload Reduction metric displayed: ${reductionText.trim() !== ''}`);
  
  console.log('\n--- Verifying Over-fetching Demo ---');
  await page.goto('http://localhost:5173/overfetching');
  await page.waitForSelector('button:has-text("Run Demo")');
  const overfetchBtn = page.locator('button:has-text("Run Demo")');
  
  // Wait for it to become enabled
  try {
    await overfetchBtn.waitFor({ state: 'visible', timeout: 5000 });
    const isDisabled = await overfetchBtn.isDisabled();
    if (!isDisabled) {
      await overfetchBtn.click();
      await page.waitForTimeout(1000);
      const barsCount = await page.locator('.payload-bar').count();
      console.log(`Over-fetching Payload Bars rendered: ${barsCount === 2}`);
    } else {
      console.log(`Over-fetching Demo button is still disabled!`);
      errors++;
    }
  } catch (e) {
    console.log(`Over-fetching Demo button error: ${e.message}`);
    errors++;
  }

  console.log('\n--- Verifying Under-fetching Demo ---');
  await page.goto('http://localhost:5173/underfetching');
  await page.waitForSelector('button:has-text("Run Demo")');
  
  let restReqs = 0;
  let gqlReqs = 0;
  
  page.on('request', req => {
    if (req.url().includes('/api')) restReqs++;
    if (req.url().includes('/graphql')) gqlReqs++;
  });
  
  const underfetchBtn = page.locator('button:has-text("Run Demo")');
  const underfetchDisabled = await underfetchBtn.isDisabled();
  if (!underfetchDisabled) {
    await underfetchBtn.click();
    await page.waitForTimeout(3000);
    console.log(`Under-fetching REST requests: ${restReqs}`);
    console.log(`Under-fetching GraphQL requests: ${gqlReqs}`);
  } else {
    console.log(`Under-fetching Demo button is disabled!`);
    errors++;
  }

  console.log('\n--- Final Checks ---');
  console.log(`Total console errors: ${errors}`);
  console.log(`Total console warnings: ${warnings}`);

  await browser.close();
})();

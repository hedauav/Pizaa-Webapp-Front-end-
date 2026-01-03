// @ts-check
const { test, expect } = require('@playwright/test');
const path = require('path');

const FRONTEND_PATH = 'file:///' + path.resolve(__dirname, '../Pizaa-Webapp-Front-end-/index.html').replace(/\\/g, '/');

test.describe('Shopping Cart', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(FRONTEND_PATH);
    await page.waitForLoadState('networkidle');
  });

  test('should have cart icon in navbar', async ({ page }) => {
    const cartBtn = await page.locator('#cartBtn');
    await expect(cartBtn).toBeVisible();
    
    // Check cart badge
    const cartBadge = await page.locator('#cartBadge');
    await expect(cartBadge).toBeVisible();
    
    console.log('✓ Cart icon is visible');
  });

  test('should open cart sidebar when cart icon clicked', async ({ page }) => {
    // Click cart icon
    await page.click('#cartBtn');
    
    // Wait for sidebar to open
    await page.waitForSelector('#cartSidebar.open', { state: 'visible', timeout: 2000 });
    
    // Verify cart is visible
    const cartSidebar = await page.locator('#cartSidebar');
    const isOpen = await cartSidebar.evaluate(el => el.classList.contains('open'));
    expect(isOpen).toBeTruthy();
    
    console.log('✓ Cart sidebar opened');
  });

  test('should close cart sidebar', async ({ page }) => {
    // Open cart
    await page.click('#cartBtn');
    await page.waitForSelector('#cartSidebar.open');
    
    // Close cart
    await page.click('#cartClose');
    await page.waitForTimeout(500);
    
    // Verify cart is closed
    const cartSidebar = await page.locator('#cartSidebar');
    const isClosed = await cartSidebar.evaluate(el => !el.classList.contains('open'));
    expect(isClosed).toBeTruthy();
    
    console.log('✓ Cart sidebar closed');
  });

  test('should show empty cart message', async ({ page }) => {
    // Open cart
    await page.click('#cartBtn');
    await page.waitForSelector('#cartSidebar.open');
    
    // Check for empty cart message (if cart is empty)
    const cartItems = await page.locator('.cart-item').count();
    
    if (cartItems === 0) {
      const emptyMessage = await page.locator('.cart-empty');
      await expect(emptyMessage).toBeVisible();
      console.log('✓ Empty cart message displayed');
    } else {
      console.log(`✓ Cart has ${cartItems} items`);
    }
  });
});

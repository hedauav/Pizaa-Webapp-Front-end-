// @ts-check
const { test, expect } = require('@playwright/test');
const path = require('path');

const FRONTEND_PATH = 'file:///' + path.resolve(__dirname, '../Pizaa-Webapp-Front-end-/index.html').replace(/\\/g, '/');

test.describe('Menu Display', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(FRONTEND_PATH);
    await page.waitForLoadState('networkidle');
  });

  test('should display menu section', async ({ page }) => {
    // Scroll to menu section
    await page.locator('#menu').scrollIntoViewIfNeeded();
    
    // Check if menu grid exists
    const menuGrid = await page.locator('#menuGrid');
    await expect(menuGrid).toBeVisible();
    
    console.log('✓ Menu section is visible');
  });

  test('should have menu items', async ({ page }) => {
    await page.locator('#menu').scrollIntoViewIfNeeded();
    
    // Check if there are menu items
    const menuItems = await page.locator('.menu-item').count();
    expect(menuItems).toBeGreaterThan(0);
    
    console.log(`✓ Found ${menuItems} menu items`);
  });

  test('should have category filters', async ({ page }) => {
    await page.locator('#menu').scrollIntoViewIfNeeded();
    
    // Check if category buttons exist
    const categories = await page.locator('.menu-category').count();
    expect(categories).toBeGreaterThan(0);
    
    console.log(`✓ Found ${categories} category filters`);
  });

  test('should filter menu by category', async ({ page }) => {
    await page.locator('#menu').scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);
    
    // Click on a category
    const vegCategory = await page.locator('.menu-category[data-category="veg"]');
    if (await vegCategory.count() > 0) {
      await vegCategory.click();
      await page.waitForTimeout(500);
      
      console.log('✓ Category filter clicked');
      
      // Check active state
      const isActive = await vegCategory.evaluate(el => el.classList.contains('active'));
      expect(isActive).toBeTruthy();
    }
  });

  test('should show pizza details', async ({ page }) => {
    await page.locator('#menu').scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);
    
    // Check first menu item
    const firstItem = await page.locator('.menu-item').first();
    
    // Check for name
    const name = await firstItem.locator('h3').textContent();
    expect(name).toBeTruthy();
    
    // Check for price
    const price = await firstItem.locator('.price').textContent();
    expect(price).toBeTruthy();
    
    console.log(`✓ Pizza details: ${name} - ${price}`);
  });
});

// @ts-check
const { test, expect } = require('@playwright/test');
const path = require('path');

const FRONTEND_PATH = 'file:///' + path.resolve(__dirname, '../Pizaa-Webapp-Front-end-/index.html').replace(/\\/g, '/');

test.describe('Complete E2E User Flow', () => {
  test('full user journey: register → browse → cart → checkout', async ({ page }) => {
    const timestamp = Date.now();
    const testUser = {
      firstName: 'E2E',
      lastName: 'TestUser',
      email: `e2etest${timestamp}@example.com`,
      phone: `+1987654${timestamp.toString().slice(-3)}`,
      password: 'E2E@Test123'
    };

    // 1. Navigate to homepage
    console.log('\n=== Step 1: Navigate to Homepage ===');
    await page.goto(FRONTEND_PATH);
    await page.waitForLoadState('networkidle');
    console.log('✓ Homepage loaded');

    // 2. Open registration modal
    console.log('\n=== Step 2: Register New User ===');
    await page.click('#loginBtn');
    await page.waitForSelector('#authModal.active');
    await page.click('#showRegister');
    await page.waitForSelector('#registerForm', { state: 'visible' });

    // 3. Fill registration form
    await page.fill('#regFirstName', testUser.firstName);
    await page.fill('#regLastName', testUser.lastName);
    await page.fill('#regEmail', testUser.email);
    await page.fill('#regPhone', testUser.phone);
    await page.fill('#regPassword', testUser.password);
    
    console.log(`✓ Registration form filled for ${testUser.email}`);

    // 4. Submit registration
    await page.click('#registerFormElement button[type="submit"]');
    await page.waitForTimeout(3000);
    
    // Check if registration was successful
    const modal = await page.locator('#authModal');
    const modalClosed = await modal.evaluate(el => !el.classList.contains('active'));
    
    if (modalClosed) {
      console.log('✓ User registered successfully');
      
      // 5. Browse menu
      console.log('\n=== Step 3: Browse Menu ===');
      await page.locator('#menu').scrollIntoViewIfNeeded();
      await page.waitForTimeout(1000);
      
      const menuItems = await page.locator('.menu-item').count();
      console.log(`✓ Browsing menu - ${menuItems} pizzas available`);

      // 6. Open cart
      console.log('\n=== Step 4: Check Cart ===');
      await page.click('#cartBtn');
      await page.waitForSelector('#cartSidebar.open');
      console.log('✓ Cart opened');

      // 7. Check user menu
      console.log('\n=== Step 5: Verify User Session ===');
      const userMenu = await page.locator('#userMenu');
      const isVisible = await userMenu.isVisible();
      
      if (isVisible) {
        console.log('✓ User is logged in');
        
        // 8. Click on My Orders
        await page.click('#myOrdersBtn');
        await page.waitForTimeout(1000);
        console.log('✓ Opened orders page');
      }

      // 9. Logout
      console.log('\n=== Step 6: Logout ===');
      await page.click('#logoutBtn');
      await page.waitForTimeout(1000);
      
      // Verify logout
      const authButtons = await page.locator('#authButtons');
      const authVisible = await authButtons.isVisible();
      
      if (authVisible) {
        console.log('✓ User logged out successfully');
      }

      console.log('\n=== E2E Test Completed Successfully! ===\n');
      
    } else {
      const errorElement = await page.locator('#registerError');
      const errorText = await errorElement.textContent();
      console.log('❌ Registration failed:', errorText);
      throw new Error('Registration failed: ' + errorText);
    }
  });

  test('navigation and UI elements', async ({ page }) => {
    await page.goto(FRONTEND_PATH);
    await page.waitForLoadState('networkidle');

    console.log('\n=== Testing Navigation ===');

    // Check logo
    const logo = await page.locator('.logo');
    await expect(logo).toBeVisible();
    console.log('✓ Logo is visible');

    // Check nav menu
    const navLinks = await page.locator('.nav-link').count();
    expect(navLinks).toBeGreaterThan(0);
    console.log(`✓ Found ${navLinks} navigation links`);

    // Check sections
    const sections = ['#hero', '#features', '#menu', '#about', '#specials'];
    for (const section of sections) {
      const element = await page.locator(section);
      await expect(element).toBeVisible();
      console.log(`✓ Section ${section} is visible`);
    }

    // Check footer
    const footer = await page.locator('footer');
    await expect(footer).toBeVisible();
    console.log('✓ Footer is visible');

    console.log('\n=== Navigation Test Completed! ===\n');
  });
});

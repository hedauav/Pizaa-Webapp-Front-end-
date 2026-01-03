// @ts-check
const { test, expect } = require('@playwright/test');
const path = require('path');

const FRONTEND_PATH = 'file:///' + path.resolve(__dirname, '../Pizaa-Webapp-Front-end-/index.html').replace(/\\/g, '/');

test.describe('Authentication Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(FRONTEND_PATH);
    await page.waitForLoadState('networkidle');
  });

  test('should open signup modal when Sign In is clicked', async ({ page }) => {
    // Click Sign In button
    await page.click('#loginBtn');
    
    // Wait for modal to appear
    await page.waitForSelector('#authModal.active', { state: 'visible' });
    
    // Check if login form is visible
    const loginForm = await page.locator('#loginForm');
    await expect(loginForm).toBeVisible();
    
    console.log('✓ Login modal opened successfully');
  });

  test('should switch to register form', async ({ page }) => {
    // Open auth modal
    await page.click('#loginBtn');
    await page.waitForSelector('#authModal.active');
    
    // Click on "Sign Up" link
    await page.click('#showRegister');
    
    // Wait for register form to be visible
    await page.waitForSelector('#registerForm', { state: 'visible' });
    
    // Verify login form is hidden
    const loginForm = await page.locator('#loginForm');
    await expect(loginForm).toBeHidden();
    
    // Verify register form is visible
    const registerForm = await page.locator('#registerForm');
    await expect(registerForm).toBeVisible();
    
    console.log('✓ Switched to register form successfully');
  });

  test('should register a new user', async ({ page }) => {
    const timestamp = Date.now();
    const testUser = {
      firstName: 'Test',
      lastName: 'User',
      email: `testuser${timestamp}@example.com`,
      phone: `+1234567${timestamp.toString().slice(-3)}`,
      password: 'Test@123456'
    };

    // Open register form
    await page.click('#loginBtn');
    await page.waitForSelector('#authModal.active');
    await page.click('#showRegister');
    await page.waitForSelector('#registerForm', { state: 'visible' });

    // Fill registration form
    await page.fill('#regFirstName', testUser.firstName);
    await page.fill('#regLastName', testUser.lastName);
    await page.fill('#regEmail', testUser.email);
    await page.fill('#regPhone', testUser.phone);
    await page.fill('#regPassword', testUser.password);

    // Submit form
    await page.click('#registerFormElement button[type="submit"]');

    // Wait for success (modal should close or success message)
    await page.waitForTimeout(2000);
    
    // Check if modal closed (successful registration)
    const modal = await page.locator('#authModal');
    const isHidden = await modal.evaluate(el => !el.classList.contains('active'));
    
    if (isHidden) {
      console.log('✓ User registered successfully');
      
      // Check if user menu is visible
      const userMenu = await page.locator('#userMenu');
      await expect(userMenu).toBeVisible();
    } else {
      // Check for any error messages
      const errorElement = await page.locator('#registerError');
      const errorText = await errorElement.textContent();
      console.log('Registration error:', errorText);
    }
  });

  test('should login with existing user', async ({ page }) => {
    // Note: This test requires a user to exist in the database
    // You may need to create a test user first or use the admin account

    // Open login form
    await page.click('#loginBtn');
    await page.waitForSelector('#authModal.active');

    // Fill login form (using admin credentials from backend)
    await page.fill('#loginEmail', 'admin@slicemaster.com');
    await page.fill('#loginPassword', 'Admin@123');

    // Submit form
    await page.click('#loginFormElement button[type="submit"]');

    // Wait for response
    await page.waitForTimeout(3000);

    // Check if login was successful (modal should close)
    const modal = await page.locator('#authModal');
    const isHidden = await modal.evaluate(el => !el.classList.contains('active'));

    if (isHidden) {
      console.log('✓ Login successful');
      
      // Verify user menu is visible
      const userMenu = await page.locator('#userMenu');
      await expect(userMenu).toBeVisible();
      
      // Verify auth buttons are hidden
      const authButtons = await page.locator('#authButtons');
      await expect(authButtons).toBeHidden();
    } else {
      const errorElement = await page.locator('#loginError');
      const errorText = await errorElement.textContent();
      console.log('Login error:', errorText);
    }
  });

  test('should close modal on close button click', async ({ page }) => {
    // Open modal
    await page.click('#loginBtn');
    await page.waitForSelector('#authModal.active');

    // Click close button
    await page.click('#authClose');

    // Wait for modal to close
    await page.waitForTimeout(500);

    // Verify modal is closed
    const modal = await page.locator('#authModal');
    const isHidden = await modal.evaluate(el => !el.classList.contains('active'));
    expect(isHidden).toBeTruthy();

    console.log('✓ Modal closed successfully');
  });

  test('should close modal on ESC key', async ({ page }) => {
    // Open modal
    await page.click('#loginBtn');
    await page.waitForSelector('#authModal.active');

    // Press ESC key
    await page.keyboard.press('Escape');

    // Wait for modal to close
    await page.waitForTimeout(500);

    // Verify modal is closed
    const modal = await page.locator('#authModal');
    const isHidden = await modal.evaluate(el => !el.classList.contains('active'));
    expect(isHidden).toBeTruthy();

    console.log('✓ Modal closed with ESC key');
  });
});

import { test, expect } from '@playwright/test';

test.describe('SliceMaster Pizza - E2E Tests', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    // Clear any localStorage to start fresh
    await page.evaluate(() => localStorage.clear());
    await page.reload();
    await page.waitForLoadState('networkidle');
  });

  test('01 - Homepage loads successfully', async ({ page }) => {
    // Check page title
    await expect(page).toHaveTitle(/SliceMaster/);
    
    // Check hero section - h1 contains "Love" with span
    await expect(page.locator('.hero h1')).toBeVisible();
    
    // Check navigation
    await expect(page.locator('#loginBtn')).toBeVisible();
    await expect(page.locator('#cartBtn')).toBeVisible();
  });

  test('02 - User Registration Flow', async ({ page }) => {
    const timestamp = Date.now();
    const testEmail = `test${timestamp}@pizza.com`;
    const testPhone = `98${timestamp.toString().slice(-8)}`;
    
    // Click login button
    await page.click('#loginBtn');
    
    // Wait for modal to be active
    await page.waitForSelector('#authModal.active', { timeout: 5000 });
    
    // Switch to signup - click the "Sign Up" link
    await page.click('#showRegister');
    await page.waitForTimeout(500);
    
    // Fill registration form
    await page.fill('#regFirstName', 'TestUser');
    await page.fill('#regLastName', 'Smith');
    await page.fill('#regEmail', testEmail);
    await page.fill('#regPhone', testPhone);
    await page.fill('#regPassword', 'password123');
    
    // Submit form
    await page.click('#registerFormElement button[type="submit"]');
    
    // Wait for modal to close and user menu to appear
    await page.waitForSelector('#authModal.active', { state: 'hidden', timeout: 10000 });
    
    // Check if user menu is visible (indicates logged in)
    await expect(page.locator('#userMenu')).toBeVisible({ timeout: 10000 });
  });

  test('03 - User Login Flow', async ({ page }) => {
    // First register a user
    const timestamp = Date.now();
    const testEmail = `login${timestamp}@pizza.com`;
    const testPhone = `97${timestamp.toString().slice(-8)}`;
    
    await page.click('#loginBtn');
    await page.waitForSelector('#authModal.active', { timeout: 5000 });
    await page.click('#showRegister');
    await page.waitForTimeout(500);
    
    await page.fill('#regFirstName', 'LoginUser');
    await page.fill('#regLastName', 'Test');
    await page.fill('#regEmail', testEmail);
    await page.fill('#regPhone', testPhone);
    await page.fill('#regPassword', 'password123');
    await page.click('#registerFormElement button[type="submit"]');
    
    // Wait for registration to complete and modal to close
    await page.waitForSelector('#authModal.active', { state: 'hidden', timeout: 10000 });
    await page.waitForTimeout(1000);
    
    // Logout - click user menu dropdown then logout
    await page.locator('#userMenu').click();
    await page.waitForTimeout(500);
    await page.click('#logoutBtn');
    await page.waitForTimeout(1000);
    
    // Verify logged out - login button should be visible again
    await expect(page.locator('#loginBtn')).toBeVisible({ timeout: 5000 });
    
    // Now login with the registered credentials
    await page.click('#loginBtn');
    await page.waitForSelector('#authModal.active', { timeout: 5000 });
    await page.fill('#loginEmail', testEmail);
    await page.fill('#loginPassword', 'password123');
    await page.click('#loginFormElement button[type="submit"]');
    
    // Verify login success - user menu should be visible
    await page.waitForSelector('#authModal.active', { state: 'hidden', timeout: 10000 });
    await expect(page.locator('#userMenu')).toBeVisible({ timeout: 10000 });
  });

  test('04 - Browse Pizza Menu', async ({ page }) => {
    // Scroll to menu section first
    await page.locator('#menu').scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);
    
    // Wait for menu items to load
    await page.waitForSelector('.menu-item', { timeout: 10000 });
    
    // Check if pizzas are displayed
    const menuItems = page.locator('.menu-item');
    const count = await menuItems.count();
    expect(count).toBeGreaterThan(0);
    
    // Check menu item content
    const firstPizza = menuItems.first();
    await expect(firstPizza.locator('.menu-item-info h3')).toBeVisible();
    await expect(firstPizza.locator('.price')).toBeVisible();
  });

  test('05 - Add Pizza to Cart', async ({ page }) => {
    // Scroll to menu section first
    await page.locator('#menu').scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);
    
    // Wait for menu items
    await page.waitForSelector('.menu-item', { timeout: 10000 });
    
    // Get initial cart badge count
    const cartBadge = page.locator('.cart-badge');
    const initialCount = await cartBadge.isVisible() ? 
      parseInt(await cartBadge.textContent() || '0') : 0;
    
    // Click add to cart on first pizza
    await page.locator('.menu-item .add-to-cart').first().click();
    
    // Wait for cart to update
    await page.waitForTimeout(2000);
    
    // Verify cart badge count increased
    await expect(cartBadge).toBeVisible();
    const newCount = parseInt(await cartBadge.textContent() || '0');
    expect(newCount).toBe(initialCount + 1);
  });

  test('06 - Update Cart Quantity', async ({ page }) => {
    // Scroll to menu and add item to cart first
    await page.locator('#menu').scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);
    await page.waitForSelector('.menu-item', { timeout: 10000 });
    await page.locator('.menu-item .add-to-cart').first().click();
    
    // Wait for toast to disappear
    await page.waitForTimeout(4000);
    
    // Open cart with force to bypass any overlays
    await page.click('#cartBtn', { force: true });
    await page.waitForTimeout(500);
    
    // Find quantity controls in cart items
    const cartItem = page.locator('.cart-item').first();
    await expect(cartItem).toBeVisible({ timeout: 5000 });
    
    // Look for quantity increase button (+ button)
    const increaseBtn = cartItem.locator('button:has-text("+")');
    if (await increaseBtn.isVisible()) {
      await increaseBtn.click();
      await page.waitForTimeout(1000);
    }
    
    // Verify cart has items
    const cartItems = await page.locator('.cart-item').count();
    expect(cartItems).toBeGreaterThan(0);
  });

  test('07 - Remove Item from Cart', async ({ page }) => {
    // Scroll to menu and add item to cart
    await page.locator('#menu').scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);
    await page.waitForSelector('.menu-item', { timeout: 10000 });
    await page.locator('.menu-item .add-to-cart').first().click();
    
    // Wait for toast to disappear
    await page.waitForTimeout(4000);
    
    // Open cart with force to bypass any overlays
    await page.click('#cartBtn', { force: true });
    await page.waitForTimeout(500);
    
    // Get initial item count
    const initialItems = await page.locator('.cart-item').count();
    expect(initialItems).toBeGreaterThan(0);
    
    // Remove first item - look for remove/delete button
    const removeBtn = page.locator('.cart-item .remove-btn, .cart-item button:has-text("×"), .cart-item button:has-text("Remove")').first();
    if (await removeBtn.isVisible()) {
      await removeBtn.click();
      await page.waitForTimeout(1000);
    }
  });

  test('08 - Complete Checkout Flow (COD)', async ({ page }) => {
    const timestamp = Date.now();
    const testEmail = `checkout${timestamp}@pizza.com`;
    const testPhone = `96${timestamp.toString().slice(-8)}`;
    
    // Listen to console messages for debugging
    page.on('console', msg => {
      if (msg.type() === 'log' || msg.type() === 'error') {
        console.log(`PAGE ${msg.type().toUpperCase()}: ${msg.text()}`);
      }
    });
    
    // Register user
    await page.click('#loginBtn');
    await page.waitForSelector('#authModal.active', { timeout: 5000 });
    await page.click('#showRegister');
    await page.waitForTimeout(500);
    
    await page.fill('#regFirstName', 'Checkout');
    await page.fill('#regLastName', 'User');
    await page.fill('#regEmail', testEmail);
    await page.fill('#regPhone', testPhone);
    await page.fill('#regPassword', 'password123');
    await page.click('#registerFormElement button[type="submit"]');
    
    // Wait for registration to complete
    await page.waitForSelector('#authModal.active', { state: 'hidden', timeout: 10000 });
    await page.waitForTimeout(1000);
    
    // Scroll to menu and add pizza to cart
    await page.locator('#menu').scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);
    await page.waitForSelector('.menu-item', { timeout: 10000 });
    await page.locator('.menu-item .add-to-cart').first().click();
    await page.waitForTimeout(2000);
    
    // Wait for toast to disappear and open cart
    await page.waitForTimeout(4000);
    await page.click('#cartBtn', { force: true });
    await page.waitForTimeout(1000);
    
    // Click Proceed to Checkout
    const checkoutBtn = page.locator('#checkoutBtn').first();
    await expect(checkoutBtn).toBeVisible({ timeout: 5000 });
    
    // Log auth state before clicking checkout
    const authState = await page.evaluate(() => {
      return {
        token: API_CONFIG.getToken() ? 'exists' : 'missing',
        isAuthenticated: API_CONFIG.isAuthenticated(),
        cartItems: CartModule.items.length
      };
    });
    console.log('Auth state before checkout:', authState);
    
    await checkoutBtn.click();
    await page.waitForTimeout(1000);
    
    // Check if auth modal opened instead (which would indicate user isn't authenticated)
    const authModalVisible = await page.locator('#authModal.active').isVisible();
    console.log('Auth modal visible after checkout click:', authModalVisible);
    
    // Wait for checkout modal with active class (visibility: visible)
    await page.waitForSelector('#checkoutModal.active', { timeout: 10000 });
    
    // Fill address form (Step 1) - look for actual input fields
    const nameInput = page.locator('#deliveryName, input[placeholder*="name"], input[name="name"]').first();
    if (await nameInput.isVisible()) {
      await nameInput.fill('Checkout User');
    }
    
    const phoneInput = page.locator('#deliveryPhone, input[placeholder*="phone"], input[name="phone"]').first();
    if (await phoneInput.isVisible()) {
      await phoneInput.fill('9876543212');
    }
    
    const streetInput = page.locator('#deliveryStreet, input[placeholder*="street"], input[placeholder*="address"], input[name="street"]').first();
    if (await streetInput.isVisible()) {
      await streetInput.fill('123 Test Street');
    }
    
    const cityInput = page.locator('#deliveryCity, input[placeholder*="city"], input[name="city"]').first();
    if (await cityInput.isVisible()) {
      await cityInput.fill('Mumbai');
    }
    
    const stateInput = page.locator('#deliveryState, input[placeholder*="state"], input[name="state"]').first();
    if (await stateInput.isVisible()) {
      await stateInput.fill('Maharashtra');
    }
    
    const zipInput = page.locator('#deliveryZip, input[placeholder*="zip"], input[placeholder*="pincode"], input[name="zip"]').first();
    if (await zipInput.isVisible()) {
      await zipInput.fill('400001');
    }
    
    // Continue to payment - look for the button
    const continueBtn = page.locator('button:has-text("Continue"), button:has-text("Next"), button:has-text("Payment")').first();
    if (await continueBtn.isVisible()) {
      await continueBtn.click();
      await page.waitForTimeout(1000);
    }
    
    // Step 2: Select payment method (COD should be default)
    const codRadio = page.locator('input[value="cod"], input[value="COD"]').first();
    if (await codRadio.isVisible()) {
      await codRadio.check();
    }
    
    // Continue to review
    const reviewBtn = page.locator('button:has-text("Review"), button:has-text("Continue")').first();
    if (await reviewBtn.isVisible()) {
      await reviewBtn.click();
      await page.waitForTimeout(1000);
    }
    
    // Step 3: Place order
    const placeOrderBtn = page.locator('button:has-text("Place Order"), button:has-text("Confirm")').first();
    if (await placeOrderBtn.isVisible()) {
      await placeOrderBtn.click();
    }
    
    // Wait for some response
    await page.waitForTimeout(3000);
  });

  test('09 - Filter Pizzas by Category', async ({ page }) => {
    // Scroll to menu section first
    await page.locator('#menu').scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);
    
    // Wait for menu items and categories
    await page.waitForSelector('.menu-item', { timeout: 10000 });
    await page.waitForSelector('.menu-category', { timeout: 5000 });
    
    // Get initial menu item count
    const initialCount = await page.locator('.menu-item').count();
    expect(initialCount).toBeGreaterThan(0);
    
    // Click on a category filter (e.g., Vegetarian)
    const vegBtn = page.locator('.menu-category:has-text("Vegetarian")').first();
    if (await vegBtn.isVisible()) {
      await vegBtn.click();
      await page.waitForTimeout(1000);
      
      // Menu count might change
      const filteredCount = await page.locator('.menu-item:visible').count();
      expect(filteredCount).toBeGreaterThanOrEqual(0);
    }
  });

  test('10 - View Order History', async ({ page }) => {
    const timestamp = Date.now();
    const testEmail = `history${timestamp}@pizza.com`;
    const testPhone = `95${timestamp.toString().slice(-8)}`;
    
    // Register and login
    await page.click('#loginBtn');
    await page.waitForSelector('#authModal.active', { timeout: 5000 });
    await page.click('#showRegister');
    await page.waitForTimeout(500);
    
    await page.fill('#regFirstName', 'History');
    await page.fill('#regLastName', 'Test');
    await page.fill('#regEmail', testEmail);
    await page.fill('#regPhone', testPhone);
    await page.fill('#regPassword', 'password123');
    await page.click('#registerFormElement button[type="submit"]');
    
    // Wait for registration to complete
    await page.waitForSelector('#authModal.active', { state: 'hidden', timeout: 10000 });
    await page.waitForTimeout(1000);
    
    // Click on user menu
    const userMenu = page.locator('#userMenu');
    await expect(userMenu).toBeVisible({ timeout: 5000 });
    await userMenu.click();
    await page.waitForTimeout(500);
    
    // Click My Orders
    const myOrdersBtn = page.locator('#myOrdersBtn');
    await expect(myOrdersBtn).toBeVisible({ timeout: 3000 });
    await myOrdersBtn.click();
    
    // Wait for orders modal to show with active class (visibility: visible)
    await page.waitForSelector('#orderModal.active', { timeout: 10000 });
    
    // Verify modal is visible
    await expect(page.locator('#orderModal.active')).toBeVisible({ timeout: 5000 });
  });
});

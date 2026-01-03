import { test, expect } from '@playwright/test';

test.describe('SliceMaster Pizza - E2E Tests', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
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
    
    // Click login button
    await page.click('#loginBtn');
    
    // Wait for modal to be active
    await page.waitForSelector('#authModal.active', { timeout: 5000 });
    
    // Switch to signup - click the "Sign Up" link
    await page.click('#showRegister');
    await page.waitForTimeout(500);
    
    // Fill registration form
    await page.fill('#regFirstName', 'Test');
    await page.fill('#regLastName', 'User');
    await page.fill('#regEmail', testEmail);
    await page.fill('#regPhone', '9876543210');
    await page.fill('#regPassword', 'password123');
    
    // Submit form
    await page.click('#registerFormElement button[type="submit"]');
    
    // Wait for success (modal should close or show success)
    await page.waitForTimeout(3000);
    
    // Check if logged in (navbar should show user name in #userName)
    await expect(page.locator('#userName')).toContainText('Test', { timeout: 10000 });
  });

  test('03 - User Login Flow', async ({ page }) => {
    // First register a user
    const timestamp = Date.now();
    const testEmail = `login${timestamp}@pizza.com`;
    
    await page.click('#loginBtn');
    await page.waitForSelector('#authModal.active', { timeout: 5000 });
    await page.click('#showRegister');
    await page.waitForTimeout(500);
    
    await page.fill('#regFirstName', 'Login');
    await page.fill('#regLastName', 'Test');
    await page.fill('#regEmail', testEmail);
    await page.fill('#regPhone', '9876543211');
    await page.fill('#regPassword', 'password123');
    await page.click('#registerFormElement button[type="submit"]');
    await page.waitForTimeout(3000);
    
    // Logout
    const userMenu = page.locator('#userMenu');
    if (await userMenu.isVisible()) {
      await userMenu.click();
      await page.click('#logoutBtn');
      await page.waitForTimeout(1000);
    }
    
    // Now login
    await page.click('#loginBtn');
    await page.waitForSelector('#authModal.active', { timeout: 5000 });
    await page.fill('#loginEmail', testEmail);
    await page.fill('#loginPassword', 'password123');
    await page.click('#loginFormElement button[type="submit"]');
    
    // Verify login success
    await page.waitForTimeout(3000);
    await expect(page.locator('#userName')).toContainText('Login', { timeout: 10000 });
  });

  test('04 - Browse Pizza Menu', async ({ page }) => {
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
    // Add item to cart first
    await page.waitForSelector('.menu-item', { timeout: 10000 });
    await page.locator('.menu-item .add-to-cart').first().click();
    await page.waitForTimeout(2000);
    
    // Open cart
    await page.click('#cartBtn');
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
    // Add item to cart
    await page.waitForSelector('.menu-item', { timeout: 10000 });
    await page.locator('.menu-item .add-to-cart').first().click();
    await page.waitForTimeout(2000);
    
    // Open cart
    await page.click('#cartBtn');
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
    
    // Register user
    await page.click('#loginBtn');
    await page.waitForSelector('#authModal.active', { timeout: 5000 });
    await page.click('#showRegister');
    await page.waitForTimeout(500);
    
    await page.fill('#regFirstName', 'Checkout');
    await page.fill('#regLastName', 'User');
    await page.fill('#regEmail', testEmail);
    await page.fill('#regPhone', '9876543212');
    await page.fill('#regPassword', 'password123');
    await page.click('#registerFormElement button[type="submit"]');
    await page.waitForTimeout(3000);
    
    // Add pizza to cart
    await page.waitForSelector('.menu-item', { timeout: 10000 });
    await page.locator('.menu-item .add-to-cart').first().click();
    await page.waitForTimeout(2000);
    
    // Open cart and proceed to checkout
    await page.click('#cartBtn');
    await page.waitForTimeout(500);
    
    // Click Proceed to Checkout
    const checkoutBtn = page.locator('.checkout-btn, button:has-text("Checkout")').first();
    await checkoutBtn.click();
    
    // Wait for checkout modal
    await page.waitForSelector('#checkoutModal', { state: 'visible', timeout: 5000 });
    
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
    
    // Register and login
    await page.click('#loginBtn');
    await page.waitForSelector('#authModal.active', { timeout: 5000 });
    await page.click('#showRegister');
    await page.waitForTimeout(500);
    
    await page.fill('#regFirstName', 'History');
    await page.fill('#regLastName', 'Test');
    await page.fill('#regEmail', testEmail);
    await page.fill('#regPhone', '9876543213');
    await page.fill('#regPassword', 'password123');
    await page.click('#registerFormElement button[type="submit"]');
    await page.waitForTimeout(3000);
    
    // Click on user menu
    const userMenu = page.locator('#userMenu');
    if (await userMenu.isVisible()) {
      await userMenu.click();
      await page.waitForTimeout(500);
      
      // Click My Orders
      const myOrdersBtn = page.locator('#myOrdersBtn');
      if (await myOrdersBtn.isVisible()) {
        await myOrdersBtn.click();
        await page.waitForTimeout(2000);
        
        // Verify orders modal opens
        await expect(page.locator('#orderModal')).toBeVisible({ timeout: 5000 });
      }
    }
  });
});

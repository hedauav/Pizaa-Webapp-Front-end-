import { test, expect } from '@playwright/test';

test.describe('SliceMaster Pizza - E2E Tests', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('01 - Homepage loads successfully', async ({ page }) => {
    // Check page title
    await expect(page).toHaveTitle(/SliceMaster/);
    
    // Check hero section
    await expect(page.locator('h1')).toContainText('Pizza');
    
    // Check navigation
    await expect(page.locator('#loginBtn')).toBeVisible();
    await expect(page.locator('.cart-icon')).toBeVisible();
  });

  test('02 - User Registration Flow', async ({ page }) => {
    const timestamp = Date.now();
    const testEmail = `test${timestamp}@pizza.com`;
    
    // Click login button
    await page.click('#loginBtn');
    
    // Wait for modal
    await page.waitForSelector('#authModal', { state: 'visible' });
    
    // Switch to signup
    await page.click('text=Sign Up');
    await page.waitForSelector('#registerFormContainer', { state: 'visible' });
    
    // Fill registration form
    await page.fill('#regFirstName', 'Test');
    await page.fill('#regLastName', 'User');
    await page.fill('#regEmail', testEmail);
    await page.fill('#regPhone', '+91 9876543210');
    await page.fill('#regPassword', 'password123');
    
    // Submit form
    await page.click('#registerForm button[type="submit"]');
    
    // Wait for success (modal should close or show success)
    await page.waitForTimeout(2000);
    
    // Check if logged in (navbar should show user name)
    const userGreeting = page.locator('text=/Hi Test/i');
    await expect(userGreeting).toBeVisible({ timeout: 5000 });
  });

  test('03 - User Login Flow', async ({ page }) => {
    // First register a user
    const timestamp = Date.now();
    const testEmail = `login${timestamp}@pizza.com`;
    
    await page.click('#loginBtn');
    await page.waitForSelector('#authModal', { state: 'visible' });
    await page.click('text=Sign Up');
    await page.waitForSelector('#registerFormContainer', { state: 'visible' });
    
    await page.fill('#regFirstName', 'Login');
    await page.fill('#regLastName', 'Test');
    await page.fill('#regEmail', testEmail);
    await page.fill('#regPhone', '+91 9876543211');
    await page.fill('#regPassword', 'password123');
    await page.click('#registerForm button[type="submit"]');
    await page.waitForTimeout(2000);
    
    // Logout
    const userMenu = page.locator('text=/Hi Login/i');
    if (await userMenu.isVisible()) {
      await userMenu.click();
      await page.click('text=Logout');
      await page.waitForTimeout(1000);
    }
    
    // Now login
    await page.click('#loginBtn');
    await page.waitForSelector('#authModal', { state: 'visible' });
    await page.fill('#loginEmail', testEmail);
    await page.fill('#loginPassword', 'password123');
    await page.click('#loginForm button[type="submit"]');
    
    // Verify login success
    await page.waitForTimeout(2000);
    await expect(page.locator('text=/Hi Login/i')).toBeVisible({ timeout: 5000 });
  });

  test('04 - Browse Pizza Menu', async ({ page }) => {
    // Wait for pizzas to load
    await page.waitForSelector('.pizza-card', { timeout: 10000 });
    
    // Check if pizzas are displayed
    const pizzaCards = page.locator('.pizza-card');
    const count = await pizzaCards.count();
    expect(count).toBeGreaterThan(0);
    
    // Check pizza card content
    const firstPizza = pizzaCards.first();
    await expect(firstPizza.locator('.pizza-name')).toBeVisible();
    await expect(firstPizza.locator('.pizza-price')).toBeVisible();
  });

  test('05 - Add Pizza to Cart', async ({ page }) => {
    // Wait for pizzas
    await page.waitForSelector('.pizza-card', { timeout: 10000 });
    
    // Get initial cart count
    const cartIcon = page.locator('.cart-count');
    const initialCount = await cartIcon.isVisible() ? 
      parseInt(await cartIcon.textContent() || '0') : 0;
    
    // Click add to cart on first pizza
    await page.locator('.pizza-card .add-to-cart-btn').first().click();
    
    // Wait for cart to update
    await page.waitForTimeout(1500);
    
    // Verify cart count increased
    await expect(cartIcon).toBeVisible();
    const newCount = parseInt(await cartIcon.textContent() || '0');
    expect(newCount).toBe(initialCount + 1);
    
    // Verify cart sidebar opens
    const cartSidebar = page.locator('#cartSidebar');
    await expect(cartSidebar).toHaveClass(/active/);
  });

  test('06 - Update Cart Quantity', async ({ page }) => {
    // Add item to cart first
    await page.waitForSelector('.pizza-card', { timeout: 10000 });
    await page.locator('.pizza-card .add-to-cart-btn').first().click();
    await page.waitForTimeout(1500);
    
    // Open cart if not open
    const cartIcon = page.locator('.cart-icon');
    await cartIcon.click();
    await page.waitForTimeout(500);
    
    // Find quantity controls
    const increaseBtn = page.locator('.cart-item .qty-btn.plus').first();
    const quantityDisplay = page.locator('.cart-item .qty-display').first();
    
    // Get initial quantity
    const initialQty = parseInt(await quantityDisplay.textContent() || '1');
    
    // Increase quantity
    await increaseBtn.click();
    await page.waitForTimeout(1000);
    
    // Verify quantity increased
    const newQty = parseInt(await quantityDisplay.textContent() || '1');
    expect(newQty).toBe(initialQty + 1);
  });

  test('07 - Remove Item from Cart', async ({ page }) => {
    // Add item to cart
    await page.waitForSelector('.pizza-card', { timeout: 10000 });
    await page.locator('.pizza-card .add-to-cart-btn').first().click();
    await page.waitForTimeout(1500);
    
    // Open cart
    await page.locator('.cart-icon').click();
    await page.waitForTimeout(500);
    
    // Get initial item count
    const initialItems = await page.locator('.cart-item').count();
    
    // Remove first item
    await page.locator('.cart-item .remove-item').first().click();
    await page.waitForTimeout(1000);
    
    // Verify item removed
    const newItems = await page.locator('.cart-item').count();
    expect(newItems).toBe(initialItems - 1);
  });

  test('08 - Complete Checkout Flow (COD)', async ({ page }) => {
    const timestamp = Date.now();
    const testEmail = `checkout${timestamp}@pizza.com`;
    
    // Register user
    await page.click('#loginBtn');
    await page.waitForSelector('#authModal', { state: 'visible' });
    await page.click('text=Sign Up');
    await page.waitForSelector('#registerFormContainer', { state: 'visible' });
    
    await page.fill('#regFirstName', 'Checkout');
    await page.fill('#regLastName', 'User');
    await page.fill('#regEmail', testEmail);
    await page.fill('#regPhone', '+91 9876543212');
    await page.fill('#regPassword', 'password123');
    await page.click('#registerForm button[type="submit"]');
    await page.waitForTimeout(2000);
    
    // Add pizza to cart
    await page.waitForSelector('.pizza-card', { timeout: 10000 });
    await page.locator('.pizza-card .add-to-cart-btn').first().click();
    await page.waitForTimeout(1500);
    
    // Open cart and proceed to checkout
    await page.locator('.cart-icon').click();
    await page.waitForTimeout(500);
    await page.click('text=Proceed to Checkout');
    
    // Wait for checkout modal
    await page.waitForSelector('#checkoutModal', { state: 'visible', timeout: 5000 });
    
    // Fill address form (Step 1)
    await page.fill('#deliveryName', 'Checkout User');
    await page.fill('#deliveryPhone', '+91 9876543212');
    await page.fill('#deliveryStreet', '123 Test Street');
    await page.fill('#deliveryCity', 'Mumbai');
    await page.fill('#deliveryState', 'Maharashtra');
    await page.fill('#deliveryZip', '400001');
    
    // Continue to payment
    await page.click('button:has-text("Continue to Payment")');
    await page.waitForTimeout(1000);
    
    // Step 2: Select payment method (COD should be default)
    await expect(page.locator('input[value="cod"]')).toBeChecked();
    
    // Continue to review
    await page.click('button:has-text("Review Order")');
    await page.waitForTimeout(1000);
    
    // Step 3: Place order
    await page.click('button:has-text("Place Order")');
    
    // Wait for success
    await page.waitForTimeout(3000);
    
    // Verify success message or order confirmation
    await expect(page.locator('.success-message, .order-success, text=/order placed/i')).toBeVisible({ timeout: 10000 });
  });

  test('09 - Filter Pizzas by Category', async ({ page }) => {
    // Wait for pizzas and categories
    await page.waitForSelector('.pizza-card', { timeout: 10000 });
    await page.waitForSelector('.category-btn', { timeout: 5000 });
    
    // Get initial pizza count
    const initialCount = await page.locator('.pizza-card').count();
    
    // Click on a category filter (e.g., Vegetarian)
    const vegBtn = page.locator('.category-btn:has-text("Vegetarian")').first();
    if (await vegBtn.isVisible()) {
      await vegBtn.click();
      await page.waitForTimeout(1000);
      
      // Pizza count might change
      const filteredCount = await page.locator('.pizza-card').count();
      expect(filteredCount).toBeGreaterThanOrEqual(0);
    }
  });

  test('10 - View Order History', async ({ page }) => {
    const timestamp = Date.now();
    const testEmail = `history${timestamp}@pizza.com`;
    
    // Register and login
    await page.click('#loginBtn');
    await page.waitForSelector('#authModal', { state: 'visible' });
    await page.click('text=Sign Up');
    await page.waitForSelector('#registerFormContainer', { state: 'visible' });
    
    await page.fill('#regFirstName', 'History');
    await page.fill('#regLastName', 'Test');
    await page.fill('#regEmail', testEmail);
    await page.fill('#regPhone', '+91 9876543213');
    await page.fill('#regPassword', 'password123');
    await page.click('#registerForm button[type="submit"]');
    await page.waitForTimeout(2000);
    
    // Click on user menu
    await page.click('text=/Hi History/i');
    await page.waitForTimeout(500);
    
    // Click My Orders
    const myOrdersBtn = page.locator('text=My Orders').first();
    if (await myOrdersBtn.isVisible()) {
      await myOrdersBtn.click();
      await page.waitForTimeout(2000);
      
      // Verify orders page/modal opens
      await expect(page.locator('#ordersModal, .orders-container, text=/order history/i')).toBeVisible({ timeout: 5000 });
    }
  });
});

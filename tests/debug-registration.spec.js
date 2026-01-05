import { test, expect } from '@playwright/test';

test('Debug Registration', async ({ page }) => {
  // Capture console messages
  const consoleLogs = [];
  page.on('console', msg => {
    consoleLogs.push(`[${msg.type()}] ${msg.text()}`);
  });
  
  page.on('pageerror', error => {
    consoleLogs.push(`[ERROR] ${error.message}`);
  });

  await page.goto('http://localhost:5500/');
  await page.waitForLoadState('networkidle');
  
  // Click login button
  await page.click('#loginBtn');
  await page.waitForSelector('#authModal.active', { timeout: 5000 });
  
  // Switch to signup
  await page.click('#showRegister');
  await page.waitForTimeout(500);
  
  // Fill registration form
  const testEmail = `debug${Date.now()}@pizza.com`;
  await page.fill('#regFirstName', 'TestUser');
  await page.fill('#regLastName', 'Smith');
  await page.fill('#regEmail', testEmail);
  await page.fill('#regPhone', '9876543210');
  await page.fill('#regPassword', 'password123');
  
  // Submit form
  console.log('Clicking submit button...');
  await page.click('#registerFormElement button[type="submit"]');
  
  // Wait a bit for the async operation
  await page.waitForTimeout(5000);
  
  // Print console logs
  console.log('\n--- Console Logs ---');
  consoleLogs.forEach(log => console.log(log));
  console.log('--- End Console Logs ---\n');
  
  // Check current state
  const modalVisible = await page.locator('#authModal.active').isVisible();
  console.log('Modal still visible:', modalVisible);
  
  const userMenuVisible = await page.locator('#userMenu').isVisible();
  console.log('User menu visible:', userMenuVisible);
});

import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { testConfig } from '../test-data/testData';

test.describe('Saucedemo Checkout Flow', () => {
  test('Complete checkout flow with 3 random items', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);

    const numberOfItems = 3;
    const waitTime = 1000;

    // Login
    await loginPage.goto();
    await loginPage.login(testConfig.credentials.username, testConfig.credentials.password);
    await expect(page).toHaveURL(/.*inventory.html/);
    await page.waitForTimeout(waitTime);

    // Add random items to cart
    const addedItemNames = await inventoryPage.addRandomItemsToCart(numberOfItems);
    expect(addedItemNames.length).toBe(numberOfItems);
    expect(await inventoryPage.getCartItemCount()).toBe(numberOfItems);
    await page.waitForTimeout(waitTime);
    
    await inventoryPage.goToCart();
    await expect(page).toHaveURL(/.*cart.html/);
    const cartItemNames = await cartPage.getCartItemNames();
    expect(await cartPage.getCartItemCount()).toBe(numberOfItems);
    for (const itemName of addedItemNames) {
      expect(cartItemNames).toContain(itemName);
    }
    await page.waitForTimeout(waitTime);

    // Proceed to checkout
    await cartPage.proceedToCheckout();
    await expect(page).toHaveURL(/.*checkout-step-one.html/);
    await page.waitForTimeout(waitTime);

    // Fill checkout information and continue
    await checkoutPage.fillCheckoutInformation(
      testConfig.checkoutInfo.firstName,
      testConfig.checkoutInfo.lastName,
      testConfig.checkoutInfo.postalCode
    );
    await checkoutPage.continueToOverview();
    await expect(page).toHaveURL(/.*checkout-step-two.html/);
    await page.waitForTimeout(waitTime);

    // Verify order summary
    const summaryItems = await checkoutPage.getOrderSummaryItems();
    expect(summaryItems.length).toBe(numberOfItems);
    for (const itemName of addedItemNames) {
      expect(summaryItems).toContain(itemName);
    }
    const subtotal = await checkoutPage.getSubtotal();
    const tax = await checkoutPage.getTax();
    const total = await checkoutPage.getTotal();
    expect(subtotal).toMatch(/\$\d+\.\d{2}/);
    expect(tax).toMatch(/\$\d+\.\d{2}/);
    expect(total).toMatch(/\$\d+\.\d{2}/);
    await page.waitForTimeout(waitTime);

    // Complete order
    await checkoutPage.finishOrder();
    await expect(page).toHaveURL(/.*checkout-complete.html/);
    expect(await checkoutPage.isOrderComplete()).toBe(true);
    expect(await checkoutPage.getCompleteHeaderText()).toContain('Thank you for your order');
    await page.waitForTimeout(waitTime);
  });
});


import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';

test.describe('Saucedemo Checkout Flow', () => {
  test('Complete checkout flow with 3 random items', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);

    // Login
    await loginPage.goto();
    await loginPage.login('standard_user', 'secret_sauce');
    await expect(page).toHaveURL(/.*inventory.html/);
    await page.waitForTimeout(1000);

    // Add 3 random items to cart
    const addedItemNames = await inventoryPage.addRandomItemsToCart(3);
    expect(addedItemNames.length).toBe(3);
    expect(await inventoryPage.getCartItemCount()).toBe(3);
    await page.waitForTimeout(1000);

    // Go to cart and verify items
    await inventoryPage.goToCart();
    await expect(page).toHaveURL(/.*cart.html/);
    const cartItemNames = await cartPage.getCartItemNames();
    expect(await cartPage.getCartItemCount()).toBe(3);
    for (const itemName of addedItemNames) {
      expect(cartItemNames).toContain(itemName);
    }
    await page.waitForTimeout(1000);

    // Proceed to checkout
    await cartPage.proceedToCheckout();
    await expect(page).toHaveURL(/.*checkout-step-one.html/);
    await page.waitForTimeout(1000);

    // Fill checkout information and continue
    await checkoutPage.fillCheckoutInformation('Ajay', 'Thakkar', '388001');
    await checkoutPage.continueToOverview();
    await expect(page).toHaveURL(/.*checkout-step-two.html/);
    await page.waitForTimeout(1000);

    // Verify order summary
    const summaryItems = await checkoutPage.getOrderSummaryItems();
    expect(summaryItems.length).toBe(3);
    for (const itemName of addedItemNames) {
      expect(summaryItems).toContain(itemName);
    }
    const subtotal = await checkoutPage.getSubtotal();
    const tax = await checkoutPage.getTax();
    const total = await checkoutPage.getTotal();
    expect(subtotal).toMatch(/\$\d+\.\d{2}/);
    expect(tax).toMatch(/\$\d+\.\d{2}/);
    expect(total).toMatch(/\$\d+\.\d{2}/);
    await page.waitForTimeout(1000);

    // Complete order
    await checkoutPage.finishOrder();
    await expect(page).toHaveURL(/.*checkout-complete.html/);
    expect(await checkoutPage.isOrderComplete()).toBe(true);
    expect(await checkoutPage.getCompleteHeaderText()).toContain('Thank you for your order');
    await page.waitForTimeout(1000);
  });
});


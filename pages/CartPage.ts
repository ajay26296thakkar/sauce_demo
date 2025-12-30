import { Page, Locator } from '@playwright/test';

export class CartPage {
  readonly page: Page;
  readonly cartItems: Locator;
  readonly cartItemNames: Locator;
  readonly checkoutButton: Locator;
  readonly continueShoppingButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.cartItems = page.locator('.cart_item');
    this.cartItemNames = page.locator('.inventory_item_name');
    this.checkoutButton = page.locator('#checkout');
    this.continueShoppingButton = page.locator('#continue-shopping');
  }

  async getCartItemCount(): Promise<number> {
    return await this.cartItems.count();
  }

  async getCartItemNames(): Promise<string[]> {
    const count = await this.cartItemNames.count();
    const names: string[] = [];
    for (let i = 0; i < count; i++) {
      const name = await this.cartItemNames.nth(i).textContent();
      if (name) {
        names.push(name);
      }
    }
    return names;
  }

  async proceedToCheckout() {
    await this.checkoutButton.click();
  }
}


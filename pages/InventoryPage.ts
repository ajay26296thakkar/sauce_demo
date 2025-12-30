import { Page, Locator } from '@playwright/test';

export class InventoryPage {
  readonly page: Page;
  readonly inventoryItems: Locator;
  readonly cartBadge: Locator;
  readonly cartLink: Locator;
  readonly inventoryItemNames: Locator;
  readonly inventoryItemPrices: Locator;
  readonly addToCartButtons: Locator;

  constructor(page: Page) {
    this.page = page;
    this.inventoryItems = page.locator('.inventory_item');
    this.cartBadge = page.locator('.shopping_cart_badge');
    this.cartLink = page.locator('.shopping_cart_link');
    this.inventoryItemNames = page.locator('.inventory_item_name');
    this.inventoryItemPrices = page.locator('.inventory_item_price');
    this.addToCartButtons = page.locator('[data-test^="add-to-cart"]');
  }

  async getItemCount(): Promise<number> {
    return await this.inventoryItems.count();
  }

  async getCartItemCount(): Promise<number> {
    const isVisible = await this.cartBadge.isVisible();
    if (!isVisible) return 0;
    const text = await this.cartBadge.textContent();
    return parseInt(text || '0');
  }

  async addRandomItemsToCart(count: number): Promise<string[]> {
    const totalItems = await this.getItemCount();
    const itemsToAdd: number[] = [];
    const addedItemNames: string[] = [];

    // generate random unique indices
    while (itemsToAdd.length < count) {
      const randomIndex = Math.floor(Math.random() * totalItems);
      if (!itemsToAdd.includes(randomIndex)) {
        itemsToAdd.push(randomIndex);
      }
    }

    for (const index of itemsToAdd) {
      const item = this.inventoryItems.nth(index);
      const itemName = await item.locator('.inventory_item_name').textContent();
      if (itemName) {
        console.log(`Adding item to cart: ${itemName}`);
        addedItemNames.push(itemName);
      }
      
      const addButton = item.locator('button[id^="add-to-cart"]');
      await addButton.click();
    }

    return addedItemNames;
  }

  async goToCart() {
    await this.cartLink.click();
  }
}


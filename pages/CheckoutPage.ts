import { Page, Locator } from '@playwright/test';

export class CheckoutPage {
  readonly page: Page;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly postalCodeInput: Locator;
  readonly continueButton: Locator;
  readonly finishButton: Locator;
  readonly completeHeader: Locator;
  readonly completeText: Locator;
  readonly summaryItemNames: Locator;
  readonly summarySubtotal: Locator;
  readonly summaryTax: Locator;
  readonly summaryTotal: Locator;

  constructor(page: Page) {
    this.page = page;
    this.firstNameInput = page.locator('#first-name');
    this.lastNameInput = page.locator('#last-name');
    this.postalCodeInput = page.locator('#postal-code');
    this.continueButton = page.locator('#continue');
    this.finishButton = page.locator('#finish');
    this.completeHeader = page.locator('.complete-header');
    this.completeText = page.locator('.complete-text');
    this.summaryItemNames = page.locator('.inventory_item_name');
    this.summarySubtotal = page.locator('.summary_subtotal_label');
    this.summaryTax = page.locator('.summary_tax_label');
    this.summaryTotal = page.locator('.summary_total_label');
  }

  async fillCheckoutInformation(firstName: string, lastName: string, postalCode: string) {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.postalCodeInput.fill(postalCode);
  }

  async continueToOverview() {
    await this.continueButton.click();
  }

  async getOrderSummaryItems(): Promise<string[]> {
    const count = await this.summaryItemNames.count();
    const names: string[] = [];
    for (let i = 0; i < count; i++) {
      const name = await this.summaryItemNames.nth(i).textContent();
      if (name) {
        names.push(name);
      }
    }
    return names;
  }

  async getSubtotal(): Promise<string> {
    const text = await this.summarySubtotal.textContent();
    return text || '';
  }

  async getTax(): Promise<string> {
    const text = await this.summaryTax.textContent();
    return text || '';
  }

  async getTotal(): Promise<string> {
    const text = await this.summaryTotal.textContent();
    return text || '';
  }

  async finishOrder() {
    await this.finishButton.click();
  }

  async isOrderComplete(): Promise<boolean> {
    return await this.completeHeader.isVisible();
  }

  async getCompleteHeaderText(): Promise<string> {
    const text = await this.completeHeader.textContent();
    return text || '';
  }
}


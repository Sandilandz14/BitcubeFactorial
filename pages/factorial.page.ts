import { expect, type Locator, type Page, type Request, type Response } from '@playwright/test';

export class FactorialPage {
  readonly page: Page;
  readonly heading: Locator;
  readonly numberInput: Locator;
  readonly calculateButton: Locator;
  readonly result: Locator;
  readonly aboutLink: Locator;
  readonly termsLink: Locator;
  readonly privacyLink: Locator;
  readonly qxf2Link: Locator;
  readonly copyright: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.getByRole('heading', { level: 1 });
    this.numberInput = page.locator('#number');
    this.calculateButton = page.locator('#getFactorial');
    this.result = page.locator('#resultDiv');
    this.aboutLink = page.getByRole('link', { name: 'About', exact: true });
    this.termsLink = page.getByRole('link', { name: 'Terms and Conditions', exact: true });
    this.privacyLink = page.getByRole('link', { name: 'Privacy', exact: true });
    this.qxf2Link = page.getByRole('link', { name: /Qxf2 Services/i });
    this.copyright = page.locator('.wor_copyright').last();
  }

  async goto(): Promise<void> {
    await this.page.goto('/');
    await expect(this.heading).toBeVisible();
  }

  async submit(value: string): Promise<void> {
    await this.numberInput.fill(value);
    await this.calculateButton.click();
  }

  async calculate(value: string, expected: string): Promise<void> {
    await this.submit(value);
    await expect(this.result).toContainText(expected);
  }

  async submitAndCaptureRequest(value: string): Promise<{ request: Request; response: Response }> {
    await this.numberInput.fill(value);
    const requestPromise = this.page.waitForRequest(request => request.url().endsWith('/factorial'));
    const responsePromise = this.page.waitForResponse(response => response.url().endsWith('/factorial'));
    await this.calculateButton.click();
    return { request: await requestPromise, response: await responsePromise };
  }

  async expectIntegerValidation(): Promise<void> {
    await expect(this.result).toHaveText(/Please enter an integer/i);
    await expect(this.result).toHaveCSS('color', 'rgb(255, 0, 0)');
  }
}

import { expect, test } from '@playwright/test';
import { FactorialPage } from '../../pages/factorial.page';

test.describe('Reliability and responsive behaviour', () => {
  test('EXP-036 blocks invalid input before the API', async ({ page }) => {
    const calculator = new FactorialPage(page);
    await calculator.goto();
    const requests: string[] = [];
    page.on('request', request => {
      if (request.url().endsWith('/factorial')) requests.push(request.url());
    });
    await calculator.submit('abc');
    await calculator.expectIntegerValidation();
    expect(requests).toEqual([]);
  });

  test('EXP-037 remains consistent after five rapid submissions', async ({ page }) => {
    const calculator = new FactorialPage(page);
    await calculator.goto();
    await calculator.numberInput.fill('5');
    const responses: number[] = [];
    page.on('response', response => {
      if (response.url().endsWith('/factorial')) responses.push(response.status());
    });
    await calculator.calculateButton.evaluate(button => {
      for (let click = 0; click < 5; click += 1) (button as HTMLButtonElement).click();
    });
    await expect.poll(() => responses.length).toBe(5);
    expect(responses).toEqual([200, 200, 200, 200, 200]);
    await expect(calculator.result).toHaveText('The factorial of 5 is: 120');
  });

  test('EXP-038 remains usable at a 390x844 viewport', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const calculator = new FactorialPage(page);
    await calculator.goto();
    await calculator.calculate('5', 'The factorial of 5 is: 120');
    for (const locator of [calculator.heading, calculator.numberInput, calculator.calculateButton, calculator.result, calculator.aboutLink]) {
      await expect(locator).toBeVisible();
    }
    const horizontalOverflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
    expect(horizontalOverflow).toBe(false);
  });

  test('EXP-039 refresh, Back and Forward leave the calculator usable', async ({ page }) => {
    const calculator = new FactorialPage(page);
    await calculator.goto();
    await calculator.calculate('5', 'The factorial of 5 is: 120');
    await page.reload();
    await expect(calculator.numberInput).toBeVisible();
    await calculator.aboutLink.click();
    await page.goBack();
    await expect(calculator.numberInput).toBeVisible();
    await page.goForward();
    await page.goBack();
    await calculator.calculate('5', 'The factorial of 5 is: 120');
  });
});

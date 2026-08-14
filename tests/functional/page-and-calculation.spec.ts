import { expect, test } from '@playwright/test';
import { FactorialPage } from '../../pages/factorial.page';
import { validFactorials } from '../../test-data/factorial-cases';
import { factorial } from '../../utils/factorial';

test.describe('Page and factorial calculations', () => {
  test.beforeEach(async ({ page }) => new FactorialPage(page).goto());

  test('EXP-001 @smoke loads the calculator page', async ({ page }) => {
    const calculator = new FactorialPage(page);
    await expect(calculator.heading).toHaveText('The greatest factorial calculator!');
    await expect(calculator.numberInput).toBeVisible();
    await expect(calculator.calculateButton).toHaveText('Calculate!');
    await expect(calculator.aboutLink).toBeVisible();
    await expect(calculator.termsLink).toBeVisible();
    await expect(calculator.privacyLink).toBeVisible();
  });

  test('EXP-002 @known-defect BUG-001 has a correctly spelled descriptive title', async ({ page }) => {
    await expect(page).toHaveTitle('Factorial Calculator');
  });

  test('EXP-003 heading and instructional copy are clear', async ({ page }) => {
    const calculator = new FactorialPage(page);
    await expect(calculator.heading).toHaveText('The greatest factorial calculator!');
    await expect(calculator.numberInput).toHaveAttribute('placeholder', 'Enter an integer');
    await expect(calculator.calculateButton).toHaveText('Calculate!');
  });

  for (const data of validFactorials) {
    test(`${data.id} calculates ${data.input}!`, async ({ page }) => {
      const calculator = new FactorialPage(page);
      await calculator.calculate(data.input, `The factorial of ${data.input} is: ${data.expected}`);
    });
  }

  test('EXP-011 repeated identical calculations are consistent', async ({ page }) => {
    const calculator = new FactorialPage(page);
    await calculator.calculate('5', 'The factorial of 5 is: 120');
    await calculator.calculateButton.click();
    await expect(calculator.result).toHaveText('The factorial of 5 is: 120');
  });

  test('EXP-012 replaces the old result when a new value is calculated', async ({ page }) => {
    const calculator = new FactorialPage(page);
    await calculator.calculate('5', 'The factorial of 5 is: 120');
    await calculator.calculate('6', 'The factorial of 6 is: 720');
    await expect(calculator.result).not.toContainText('factorial of 5');
  });

  test('EXP-024 verifies controlled upper-bound examples', async ({ page }) => {
    test.slow();
    const calculator = new FactorialPage(page);
    for (const value of [50, 100, 170]) {
      const { response } = await calculator.submitAndCaptureRequest(String(value));
      expect(response.status()).toBe(200);
      const body = await response.json() as { answer: number };
      expect(Number.isFinite(body.answer)).toBe(true);
      expect(body.answer).toBe(Number(factorial(value)));
      await expect(calculator.result).toContainText(String(body.answer));
    }
  });
});

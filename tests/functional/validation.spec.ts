import { expect, test } from '@playwright/test';
import { FactorialPage } from '../../pages/factorial.page';
import { clearlyInvalidInputs } from '../../test-data/factorial-cases';

test.describe('Input validation', () => {
  test.beforeEach(async ({ page }) => new FactorialPage(page).goto());

  for (const data of clearlyInvalidInputs) {
    test(`${data.id} rejects ${data.label}`, async ({ page }) => {
      const calculator = new FactorialPage(page);
      let calculationRequests = 0;
      page.on('request', request => {
        if (request.url().endsWith('/factorial')) calculationRequests += 1;
      });
      await calculator.submit(data.input);
      await calculator.expectIntegerValidation();
      expect(calculationRequests).toBe(0);
    });
  }

  for (const data of [
    { id: 'EXP-018', label: 'decimal', input: '3.5' },
    { id: 'EXP-020', label: 'scientific notation', input: '1e3' }
  ]) {
    test(`${data.id} rejects ${data.label} without a server error`, async ({ page }) => {
      const calculator = new FactorialPage(page);
      const serverErrors: number[] = [];
      page.on('response', response => {
        if (response.url().endsWith('/factorial') && response.status() >= 500) serverErrors.push(response.status());
      });
      await calculator.submit(data.input);
      await calculator.expectIntegerValidation();
      expect(serverErrors).toEqual([]);
    });
  }

  test('EXP-017 @known-defect BUG-006 rejects a negative integer without a server error', async ({ page }) => {
    const calculator = new FactorialPage(page);
    let responseStatus: number | undefined;
    page.on('response', response => {
      if (response.url().endsWith('/factorial')) responseStatus = response.status();
    });

    await calculator.submit('-1');
    await expect.poll(async () => {
      const message = (await calculator.result.textContent())?.trim();
      return message || responseStatus;
    }, { message: 'Expected client validation or a controlled backend response' }).toBeTruthy();

    if (responseStatus !== undefined) {
      expect(responseStatus, 'Invalid input must not cause a 5xx response').toBeGreaterThanOrEqual(400);
      expect(responseStatus, 'Invalid input must not cause a 5xx response').toBeLessThan(500);
    } else {
      await calculator.expectIntegerValidation();
    }
  });

  test('EXP-021 handles an explicitly positive integer consistently', async ({ page }) => {
    const calculator = new FactorialPage(page);
    await calculator.submit('+5');
    await expect(calculator.result).toContainText(/120|Please enter an integer/i);
  });

  test('EXP-022 safely handles leading zeroes', async ({ page }) => {
    const calculator = new FactorialPage(page);
    await calculator.submit('0005');
    await expect(calculator.result).toContainText(/120|Please enter an integer/i);
  });

  test('EXP-023 safely handles surrounding whitespace', async ({ page }) => {
    const calculator = new FactorialPage(page);
    await calculator.submit(' 5 ');
    await expect(calculator.result).toContainText(/120|Please enter an integer/i);
  });

  test('EXP-029 clears the invalid state after correction', async ({ page }) => {
    const calculator = new FactorialPage(page);
    await calculator.submit('abc');
    await calculator.expectIntegerValidation();
    await calculator.calculate('5', 'The factorial of 5 is: 120');
    await expect(calculator.result).toHaveCSS('color', 'rgb(0, 0, 0)');
  });
});

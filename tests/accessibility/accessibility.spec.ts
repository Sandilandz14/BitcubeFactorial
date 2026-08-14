import { expect, test } from '@playwright/test';
import { FactorialPage } from '../../pages/factorial.page';

test.describe('Accessibility and keyboard operation', () => {
  test.beforeEach(async ({ page }) => new FactorialPage(page).goto());

  test('EXP-004 @known-defect BUG-002 input has a programmatic accessible name', async ({ page }) => {
    const calculator = new FactorialPage(page);
    const programmaticLabel = await calculator.numberInput.evaluate(input => ({
      ariaLabel: input.getAttribute('aria-label'),
      ariaLabelledBy: input.getAttribute('aria-labelledby'),
      labelledByElement: Boolean(document.querySelector(`label[for="${input.id}"]`))
    }));

    expect(
      Boolean(programmaticLabel.ariaLabel) ||
      Boolean(programmaticLabel.ariaLabelledBy) ||
      programmaticLabel.labelledByElement,
      'The input must use an associated <label>, aria-label or aria-labelledby; placeholder text alone is insufficient.'
    ).toBe(true);
  });

  test('EXP-005 keyboard-only operation completes a calculation', async ({ page }) => {
    const calculator = new FactorialPage(page);
    await page.keyboard.press('Tab');
    await expect(calculator.numberInput).toBeFocused();
    await page.keyboard.type('5');
    await page.keyboard.press('Tab');
    await expect(calculator.calculateButton).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(calculator.result).toHaveText('The factorial of 5 is: 120');
  });
});

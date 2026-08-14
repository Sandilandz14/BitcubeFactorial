import { expect, test } from '@playwright/test';
import { FactorialPage } from '../../pages/factorial.page';

test.describe('Footer links and copyright', () => {
  test.beforeEach(async ({ page }) => new FactorialPage(page).goto());

  test('EXP-030 About link targets the About route', async ({ page }) => {
    const calculator = new FactorialPage(page);
    await expect(calculator.aboutLink).toHaveAttribute('href', /about/i);
  });

  test('EXP-031 @known-defect BUG-003 Terms link targets the Terms route', async ({ page }) => {
    const calculator = new FactorialPage(page);
    await expect(calculator.termsLink).toHaveAttribute('href', /terms/i);
  });

  test('EXP-032 @known-defect BUG-004 Privacy link targets the Privacy route', async ({ page }) => {
    const calculator = new FactorialPage(page);
    await expect(calculator.privacyLink).toHaveAttribute('href', /privacy/i);
  });

  test('EXP-033 Qxf2 Services points to a secure Qxf2 destination', async ({ page }) => {
    const calculator = new FactorialPage(page);
    await expect(calculator.qxf2Link).toHaveAttribute('href', /^https:\/\/(www\.)?qxf2\.com\//i);
  });

  test('EXP-034 @known-defect BUG-005 copyright avoids a redundant same-year range', async ({ page }) => {
    const calculator = new FactorialPage(page);
    const currentYear = new Date().getFullYear();
    await expect(calculator.copyright).not.toContainText(`${currentYear} - ${currentYear}`);
  });
});

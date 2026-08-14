import { expect, test } from '@playwright/test';
import { FactorialPage } from '../../pages/factorial.page';

test.describe('Bitcube mandatory tests', () => {
  test.beforeEach(async ({ page }) => new FactorialPage(page).goto());

  test('MAND-01 validation styling is applied and cleared', async ({ page }, testInfo) => {
    const calculator = new FactorialPage(page);
    await calculator.submit('abc');
    await expect(calculator.result).toHaveText('Please enter an integer');
    await expect(calculator.result).toHaveCSS('color', 'rgb(255, 0, 0)');
    await expect(calculator.numberInput).toHaveCSS('border-top-color', 'rgb(255, 0, 0)');
    await expect(calculator.numberInput).toHaveCSS('border-top-width', '2px');
    const invalidMetadata = await calculator.numberInput.evaluate(input => ({
      className: input.className,
      ariaInvalid: input.getAttribute('aria-invalid')
    }));
    await testInfo.attach('invalid-state-accessibility-metadata', {
      body: JSON.stringify(invalidMetadata, null, 2),
      contentType: 'application/json'
    });
    await calculator.calculate('5', 'The factorial of 5 is: 120');
    await expect(calculator.result).toHaveCSS('color', 'rgb(0, 0, 0)');
    await expect(calculator.numberInput).toHaveCSS('border-top-color', 'rgb(204, 204, 204)');
    await expect(calculator.numberInput).toHaveCSS('border-top-width', '1px');
  });

  test('MAND-02 calculates 12 factorial exactly', async ({ page }) => {
    const calculator = new FactorialPage(page);
    await calculator.calculate('12', 'The factorial of 12 is: 479001600');
  });

  test('MAND-03 validates request method, endpoint, headers, parameter and response', async ({ page }, testInfo) => {
    const calculator = new FactorialPage(page);
    const { request, response } = await calculator.submitAndCaptureRequest('12');
    const contentType = request.headers()['content-type'];
    const responseContentType = response.headers()['content-type'];

    expect(request.method()).toBe('POST');
    expect(new URL(request.url()).pathname).toBe('/factorial');
    expect(contentType).toContain('application/x-www-form-urlencoded');
    expect(request.postData()).toBe('number=12');
    expect(response.status()).toBe(200);
    expect(responseContentType).toContain('application/json');
    expect(await response.json()).toEqual({ answer: 479001600 });
    await expect(calculator.result).toHaveText('The factorial of 12 is: 479001600');

    await testInfo.attach('request-response-evidence', {
      body: JSON.stringify({
        method: request.method(),
        url: request.url(),
        contentType,
        postData: request.postData(),
        status: response.status(),
        responseContentType,
        responseBody: await response.json()
      }, null, 2),
      contentType: 'application/json'
    });
  });
});

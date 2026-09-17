import { test, expect } from '@playwright/test';
import { restaurantConfig } from '../../src/config/restaurant.config';

test.describe('Customer Checkout Flow (Zero-Backend Autonomy)', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage to ensure fresh autonomous state
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test('completes end-to-end customer purchase journey to WhatsApp checkout', async ({ page }) => {
    // 1. Visit Storefront Home & verify brand name
    await page.goto('/');
    await expect(page.locator('h1')).toContainText(restaurantConfig.brand.name);

    // 2. Select first featured category
    const firstCategoryLink = page.locator('a[href^="/category/"]').first();
    await expect(firstCategoryLink).toBeVisible();
    await firstCategoryLink.click();

    // 3. In Category page, add product to cart
    const addToCartBtn = page.getByRole('button', { name: /add to cart|agregar/i }).first();
    await expect(addToCartBtn).toBeVisible();
    await addToCartBtn.click();

    // 4. Validate CartButton badge indicates 1 item
    const cartButton = page.getByTestId('cart-button');
    await expect(cartButton).toBeVisible();
    await expect(cartButton).toContainText('1');

    // 5. Open Cart Drawer
    await cartButton.click();
    const checkoutDrawerBtn = page.getByRole('button', { name: /checkout|proceder|finalizar/i });
    await expect(checkoutDrawerBtn).toBeVisible();
    await checkoutDrawerBtn.click();

    // 6. Checkout page: fill order form
    await expect(page).toHaveURL(/\/checkout/);
    
    // Fill customer name
    const nameInput = page.locator('#customer-name');
    await expect(nameInput).toBeVisible();
    await nameInput.fill('Carlos Santana');

    // Fill delivery address
    const addressInput = page.locator('#delivery-address');
    if (await addressInput.isVisible()) {
      await addressInput.fill('Av. Corrientes 1234, CABA');
    }

    // Intercept window.open to capture the WhatsApp URL
    await page.evaluate(() => {
      (window as unknown as { __capturedUrl: string }).__capturedUrl = '';
      window.open = (url) => {
        (window as unknown as { __capturedUrl: string }).__capturedUrl = String(url);
        return null;
      };
    });

    // 7. Click confirm order / send via WhatsApp
    const sendWhatsAppBtn = page.getByRole('button', { name: /whatsapp/i });
    await expect(sendWhatsAppBtn).toBeEnabled();
    await sendWhatsAppBtn.click();

    // 8. Retrieve captured WhatsApp URL and verify format
    const capturedUrl = await page.evaluate(() => (window as unknown as { __capturedUrl: string }).__capturedUrl);
    expect(capturedUrl).toContain('https://wa.me/');
    expect(capturedUrl).toContain(restaurantConfig.contact.whatsappNumber.replace(/[^0-9]/g, ''));
    expect(capturedUrl).toContain(encodeURIComponent('Carlos Santana'));

    // 9. Verify confirmation screen rendered
    await expect(page.getByText(/order processed|pedido confirmado/i)).toBeVisible();
  });
});

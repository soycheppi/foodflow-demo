import { test, expect } from '@playwright/test';

test.describe('Cart Drawer & Zero-Backend Storage Persistence', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test('adds items, updates quantities and retains state after browser reload', async ({ page }) => {
    // 1. Go to category page
    const firstCategoryLink = page.locator('a[href^="/category/"]').first();
    await expect(firstCategoryLink).toBeVisible();
    await firstCategoryLink.click();

    // 2. Add product to cart
    const addBtns = page.getByRole('button', { name: /add to cart|agregar/i });
    await expect(addBtns.first()).toBeVisible();
    await addBtns.first().click();

    // 3. Open CartDrawer
    const cartButton = page.getByTestId('cart-button');
    await cartButton.click();

    // 4. Verify product exists in drawer
    const drawer = page.locator('[role="dialog"]');
    await expect(drawer).toBeVisible();
    await expect(drawer.getByText(/qty:/i)).toBeVisible();

    // 5. Reload page to test localStorage persistence
    await page.reload();

    // 6. Verify cart count persists
    const reloadedCartButton = page.getByTestId('cart-button');
    await expect(reloadedCartButton).toBeVisible();
    await expect(reloadedCartButton).toContainText('1');

    // 7. Open drawer and remove item
    await reloadedCartButton.click();
    const trashBtn = page.getByTestId('remove-item').first();
    await expect(trashBtn).toBeVisible();
    await trashBtn.click();

    // 8. Verify empty cart message
    await expect(page.getByText(/your cart is empty|carrito vac[ií]o/i)).toBeVisible();
  });
});

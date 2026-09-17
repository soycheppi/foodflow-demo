import { test, expect } from '@playwright/test';
import { restaurantConfig } from '../../src/config/restaurant.config';

test.describe('Public Secondary Pages & Navigation', () => {
  test('navigates to About page and verifies branding and contact information', async ({ page }) => {
    await page.goto('/about');
    await expect(page.locator('h1, h2').first()).toBeVisible();
    await expect(page.getByText(restaurantConfig.brand.name).first()).toBeVisible();
    await expect(page.locator(`text=${restaurantConfig.contact.phone}`).first()).toBeVisible();
  });

  test('views product detail page, increments quantity and adds to cart', async ({ page }) => {
    await page.goto('/product/prod-truffle-burger');
    await expect(page.locator('h1')).toContainText('Truffle Bacon Smash Burger');

    // Increase quantity using plus button
    const plusBtn = page.locator('button').filter({ has: page.locator('svg line[x1="12"]') }).first();
    if (await plusBtn.isVisible()) {
      await plusBtn.click();
    }

    // Click add to cart button
    const addBtn = page.getByRole('button', { name: /add to cart|agregar al carrito/i });
    await expect(addBtn).toBeVisible();
    await addBtn.click();

    // Verify cart button badge is updated
    const cartButton = page.getByTestId('cart-button');
    await expect(cartButton).toBeVisible();
    await expect(cartButton).toContainText(/[1-9]/);
  });

  test('navigates to login page and allows instant 1-click Demo Admin login', async ({ page }) => {
    await page.goto('/login');
    const demoLoginBtn = page.getByRole('button', { name: /enter admin dashboard|demo admin/i });
    await expect(demoLoginBtn).toBeVisible();
    await demoLoginBtn.click();

    // Verify redirection to Admin Dashboard
    await expect(page).toHaveURL(/\/admin/);
    await expect(page.locator('h1, h2').first()).toBeVisible();
  });
});

import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Universal Accessibility Audit (WCAG 2.1 AA & 2.2 AAA+)', () => {
  test('Storefront Home complies with WCAG 2.1 AA standards with 0 critical violations', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('Category page complies with WCAG 2.1 AA standards with 0 critical violations', async ({ page }) => {
    await page.goto('/category/cat-burgers');
    await page.waitForLoadState('networkidle');

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('Checkout order page complies with WCAG 2.1 AA standards with 0 critical violations', async ({ page }) => {
    // Seed an item in cart via localStorage
    await page.goto('/');
    await page.evaluate(() => {
      const state = {
        state: {
          articulos: [
            {
              id: 'prod-test',
              nombre: 'Burger Test',
              precio: 2500,
              cantidad: 1,
              stock: 10,
              categoria: 'cat-burgers',
              descripcion: 'Test product for accessibility',
              imagenUrl: '',
            },
          ],
        },
        version: 0,
      };
      localStorage.setItem('foodflow-cart-storage', JSON.stringify(state));
    });

    await page.goto('/checkout');
    await page.waitForLoadState('networkidle');

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('About page complies with WCAG 2.1 AA standards with 0 critical violations', async ({ page }) => {
    await page.goto('/about');
    await page.waitForLoadState('networkidle');

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('Product detail page complies with WCAG 2.1 AA standards with 0 critical violations', async ({ page }) => {
    await page.goto('/product/prod-truffle-burger');
    await page.waitForLoadState('networkidle');

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('Login page complies with WCAG 2.1 AA standards with 0 critical violations', async ({ page }) => {
    await page.goto('/login');
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('button[type="submit"]');
    await page.waitForTimeout(650);

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('Admin Dashboard complies with WCAG 2.1 AA standards with 0 critical violations', async ({ page }) => {
    // Seed authenticated Demo Admin in localStorage before page load
    await page.addInitScript(() => {
      window.localStorage.setItem(
        'foodflow_demo_admin_user',
        JSON.stringify({
          uid: 'demo-admin-uid',
          email: 'admin@foodflow.dev',
          displayName: 'FoodFlow Demo Admin',
          photoURL: null,
          isAdmin: true,
          role: 'admin',
          userData: {
            email: 'admin@foodflow.dev',
            displayName: 'FoodFlow Demo Admin',
            createdAt: new Date().toISOString(),
          },
        })
      );
    });
    await page.goto('/admin');
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('h1');
    await page.waitForTimeout(650);

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });
});

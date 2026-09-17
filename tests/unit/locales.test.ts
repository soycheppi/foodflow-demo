import { describe, it, expect } from 'vitest';
import { t } from '@/config/locales';

describe('Centralized Locales Dictionary (i18n)', () => {
  it('has non-empty common translation keys', () => {
    expect(t.common.save.trim().length).toBeGreaterThan(0);
    expect(t.common.cancel.trim().length).toBeGreaterThan(0);
    expect(t.common.loading.trim().length).toBeGreaterThan(0);
    expect(t.common.delete.trim().length).toBeGreaterThan(0);
  });

  it('has complete shopping cart and checkout dictionary entries', () => {
    expect(t.cart.title.trim().length).toBeGreaterThan(0);
    expect(t.cart.checkout.trim().length).toBeGreaterThan(0);
    expect(t.cart.emptyTitle.trim().length).toBeGreaterThan(0);
    expect(t.cart.delivery.trim().length).toBeGreaterThan(0);
    expect(t.cart.pickup.trim().length).toBeGreaterThan(0);
    expect(t.cart.cash.trim().length).toBeGreaterThan(0);
    expect(t.cart.transfer.trim().length).toBeGreaterThan(0);
    expect(t.cart.total.trim().length).toBeGreaterThan(0);
  });

  it('has descriptive admin and navigation keys', () => {
    expect(t.nav.home.trim().length).toBeGreaterThan(0);
    expect(t.nav.mainMenu.trim().length).toBeGreaterThan(0);
    expect(t.nav.about.trim().length).toBeGreaterThan(0);
    expect(t.admin.dashboard.trim().length).toBeGreaterThan(0);
    expect(t.admin.totalProducts.trim().length).toBeGreaterThan(0);
    expect(t.admin.totalCategories.trim().length).toBeGreaterThan(0);
  });
});

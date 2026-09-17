import { describe, it, expect } from 'vitest';
import { restaurantConfig } from '@/config/restaurant.config';

describe('Restaurant Configuration Contract', () => {
  it('has valid brand attributes and colors', () => {
    expect(restaurantConfig.brand.name).toBeDefined();
    expect(restaurantConfig.brand.name.length).toBeGreaterThan(0);
    expect(restaurantConfig.brand.primaryColor).toMatch(/^#([0-9a-fA-F]{3}){1,2}$/);
    expect(restaurantConfig.brand.faviconUrl).toBeDefined();
  });

  it('has valid contact information and phone formats', () => {
    expect(restaurantConfig.contact.whatsappNumber).toBeDefined();
    // WhatsApp number should contain only digits and optional leading +
    expect(restaurantConfig.contact.whatsappNumber.replace(/\D/g, '').length).toBeGreaterThanOrEqual(8);
    expect(restaurantConfig.contact.email).toContain('@');
    expect(restaurantConfig.contact.address.street).toBeDefined();
  });

  it('has valid business rules and operational settings', () => {
    expect(restaurantConfig.business.currencySymbol).toBeDefined();
    expect(restaurantConfig.business.deliveryFee).toBeGreaterThanOrEqual(0);
    expect(restaurantConfig.business.minOrderAmount).toBeGreaterThanOrEqual(0);
    expect(restaurantConfig.business.openingHours.days.length).toBeGreaterThan(0);
    expect(typeof restaurantConfig.business.allowPickup).toBe('boolean');
    expect(typeof restaurantConfig.business.allowDelivery).toBe('boolean');
  });

  it('has valid intro message template for WhatsApp checkout', () => {
    expect(restaurantConfig.orderMessage.intro).toBeDefined();
    expect(restaurantConfig.orderMessage.intro.length).toBeGreaterThan(5);
  });
});

import { describe, it, expect } from 'vitest';
import { calculateOrderSummary, checkLoyaltyDiscountEligibility, getLoyaltyDiscountAmount } from '@/core/logic/pricing';
import { CartItem } from '@/core/types/order';
import { StoreSettings } from '@/core/types/settings';

const mockSettings: StoreSettings = {
  costoEnvio: 350,
  montoDescuentoBienvenida: 500,
  descuentoPedido3: 200,
  descuentoPedido5: 400,
  descuentoPedido10: 1000,
  totalUsers: 1,
  userLimit: 100,
};

const mockItems: CartItem[] = [
  {
    id: 'prod-1',
    nombre: 'Burger Classic',
    precio: 1200,
    cantidad: 2,
    stock: 10,
    categoria: 'cat-1',
    descripcion: 'Delicious burger',
    imagenUrl: '',
    orden: 1,
    permiteReserva: false,
  },
];

describe('Pricing Engine', () => {
  it('calculates subtotal and delivery fee correctly for delivery orders', () => {
    const summary = calculateOrderSummary({
      items: mockItems,
      deliveryType: 'delivery',
      settings: mockSettings,
      isRegisteredCustomer: false,
    });

    expect(summary.subtotal).toBe(2400);
    expect(summary.deliveryFee).toBe(350);
    expect(summary.discountAmount).toBe(0);
    expect(summary.finalTotal).toBe(2750);
  });

  it('sets delivery fee to 0 when takeaway is chosen', () => {
    const summary = calculateOrderSummary({
      items: mockItems,
      deliveryType: 'takeaway',
      settings: mockSettings,
      isRegisteredCustomer: false,
    });

    expect(summary.subtotal).toBe(2400);
    expect(summary.deliveryFee).toBe(0);
    expect(summary.finalTotal).toBe(2400);
  });

  it('applies welcome discount for first order of a registered customer', () => {
    const isEligible = checkLoyaltyDiscountEligibility(0, mockSettings);
    expect(isEligible).toBe(true);

    const discountAmount = getLoyaltyDiscountAmount(0, mockSettings);
    expect(discountAmount).toBe(500);

    const summary = calculateOrderSummary({
      items: mockItems,
      deliveryType: 'takeaway',
      settings: mockSettings,
      rewardCycle: 0,
      isRegisteredCustomer: true,
    });

    expect(summary.discountAmount).toBe(500);
    expect(summary.finalTotal).toBe(1900);
  });

  it('correctly calculates tiers 3, 5, and 10 of the loyalty cycle', () => {
    // 2 completed orders -> next is 3rd order
    expect(checkLoyaltyDiscountEligibility(2, mockSettings)).toBe(true);
    expect(getLoyaltyDiscountAmount(2, mockSettings)).toBe(200);

    // 4 completed orders -> next is 5th order
    expect(checkLoyaltyDiscountEligibility(4, mockSettings)).toBe(true);
    expect(getLoyaltyDiscountAmount(4, mockSettings)).toBe(400);

    // 9 completed orders -> next is 10th order
    expect(checkLoyaltyDiscountEligibility(9, mockSettings)).toBe(true);
    expect(getLoyaltyDiscountAmount(9, mockSettings)).toBe(1000);

    // Order 2 (cycle 1) is not a discount milestone
    expect(checkLoyaltyDiscountEligibility(1, mockSettings)).toBe(false);
    expect(getLoyaltyDiscountAmount(1, mockSettings)).toBe(0);

    // Null settings returns false and 0
    expect(checkLoyaltyDiscountEligibility(0, null)).toBe(false);
    expect(getLoyaltyDiscountAmount(0, null)).toBe(0);
  });

  it('handles null settings and discount capping in calculateOrderSummary gracefully', () => {
    const summary = calculateOrderSummary({
      items: mockItems,
      deliveryType: 'delivery',
      settings: null,
      isRegisteredCustomer: true,
      rewardCycle: 0,
    });

    expect(summary.deliveryFee).toBe(0);
    expect(summary.discountAmount).toBe(0);
    expect(summary.finalTotal).toBe(2400);
  });

  it('falls back to 0 when loyalty discounts are unset or falsy in settings', () => {
    const emptySettings: StoreSettings = {
      costoEnvio: 0,
      totalUsers: 0,
      userLimit: 100,
      montoDescuentoBienvenida: 0,
      descuentoPedido3: 0,
      descuentoPedido5: 0,
      descuentoPedido10: 0,
    };

    // next = 1
    expect(getLoyaltyDiscountAmount(0, emptySettings)).toBe(0);
    // next = 3
    expect(getLoyaltyDiscountAmount(2, emptySettings)).toBe(0);
    // next = 5
    expect(getLoyaltyDiscountAmount(4, emptySettings)).toBe(0);
    // next = 10
    expect(getLoyaltyDiscountAmount(9, emptySettings)).toBe(0);
  });
});

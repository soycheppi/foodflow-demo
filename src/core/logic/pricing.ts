import { CartItem, OrderCalculationSummary } from '@/core/types/order';
import { StoreSettings } from '@/core/types/settings';

export interface PricingOptions {
  readonly items: readonly CartItem[];
  readonly deliveryType: 'delivery' | 'takeaway';
  readonly settings: StoreSettings | null | undefined;
  readonly rewardCycle?: number;
  readonly isRegisteredCustomer: boolean;
}

/**
 * Evaluates whether a registered user is eligible for a loyalty discount on their next order.
 */
export const checkLoyaltyDiscountEligibility = (
  rewardCycle: number = 0,
  settings: StoreSettings | null | undefined
): boolean => {
  if (!settings) return false;
  const nextOrder = (rewardCycle % 10) + 1;

  if (nextOrder === 1 && settings.montoDescuentoBienvenida > 0) return true;
  if (nextOrder === 3 && settings.descuentoPedido3 > 0) return true;
  if (nextOrder === 5 && settings.descuentoPedido5 > 0) return true;
  if (nextOrder === 10 && settings.descuentoPedido10 > 0) return true;

  return false;
};

/**
 * Returns raw discount amount based on customer's current points cycle.
 */
export const getLoyaltyDiscountAmount = (
  rewardCycle: number = 0,
  settings: StoreSettings | null | undefined
): number => {
  if (!settings) return 0;
  const next = (rewardCycle % 10) + 1;

  if (next === 1) return Number(settings.montoDescuentoBienvenida || 0);
  if (next === 3) return Number(settings.descuentoPedido3 || 0);
  if (next === 5) return Number(settings.descuentoPedido5 || 0);
  if (next === 10) return Number(settings.descuentoPedido10 || 0);

  return 0;
};

/**
 * Pure calculation engine for order pricing: subtotal, discounts, shipping, and final total.
 */
export const calculateOrderSummary = ({
  items,
  deliveryType,
  settings,
  rewardCycle = 0,
  isRegisteredCustomer,
}: PricingOptions): OrderCalculationSummary => {
  const subtotal = items.reduce((acc, item) => acc + item.precio * item.cantidad, 0);
  const deliveryFeeConfig = Number(settings?.costoEnvio || 0);
  const deliveryFee = deliveryType === 'delivery' ? deliveryFeeConfig : 0;

  let discountAmount = 0;
  if (isRegisteredCustomer && checkLoyaltyDiscountEligibility(rewardCycle, settings)) {
    const rawDiscount = getLoyaltyDiscountAmount(rewardCycle, settings);
    discountAmount = Math.min(rawDiscount, subtotal);
  }

  const finalTotal = Math.max(0, subtotal - discountAmount + deliveryFee);

  return {
    subtotal,
    discountAmount,
    deliveryFee,
    finalTotal,
  };
};

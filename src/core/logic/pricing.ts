import { CartItem, OrderCalculationSummary } from '@/core/types/order';
import { StoreSettings } from '@/core/types/settings';
import { restaurantConfig } from '@/config/restaurant.config';

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat(restaurantConfig.business.locale, {
    style: 'currency',
    currency: restaurantConfig.business.currencyCode,
  }).format(amount);
};

export interface PricingOptions {
  readonly items: readonly CartItem[];
  readonly deliveryType: 'delivery' | 'takeaway';
  readonly settings: StoreSettings | null | undefined;
  readonly rewardCycle?: number;
  readonly isRegisteredCustomer: boolean;
}

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

export const calculateSubtotal = (items: readonly CartItem[]): number => {
  return items.reduce((acc, item) => acc + item.precio * item.cantidad, 0);
};

export const calculateOrderSummary = ({
  items,
  deliveryType,
  settings,
  rewardCycle = 0,
  isRegisteredCustomer,
}: PricingOptions): OrderCalculationSummary => {
  const subtotal = calculateSubtotal(items);
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

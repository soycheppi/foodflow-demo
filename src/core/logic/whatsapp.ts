import { CustomerOrderInfo, OrderItemPayload } from '@/core/types/order';
import { restaurantConfig } from '@/config/restaurant.config';
import { t } from '@/config/locales';
import { formatCurrency } from './pricing';

export interface WhatsAppMessageOptions {
  readonly customerInfo: CustomerOrderInfo;
  readonly items: readonly OrderItemPayload[];
  readonly finalTotal: number;
  readonly originUrl: string;
  readonly currentUid?: string;
}

export const buildWhatsAppOrderMessage = ({
  customerInfo,
  items,
  finalTotal,
  originUrl,
  currentUid,
}: WhatsAppMessageOptions): string => {
  const { customerName, deliveryAddress, deliveryType, paymentMethod } = customerInfo;

  const pointsSection = currentUid
    ? `\n---\n*Validate Points:*\n${originUrl}/admin/validate-points?uid=${currentUid}`
    : '';

  const itemsText = items.map((a) => `• ${a.name} x${a.quantity}`).join('\n');

  const msgLines = [
    restaurantConfig.orderMessage.intro,
    '',
    `*${t.cart.customerLabel}:* ${customerName}`,
    `*${t.cart.methodLabel}:* ${deliveryType === 'delivery' ? t.cart.delivery : t.cart.pickup}`,
    `*${t.cart.paymentLabel}:* ${paymentMethod === 'cash' ? t.cart.cash : t.cart.transfer}`,
    deliveryType === 'delivery' ? `*${t.cart.addressLabel}:* ${deliveryAddress}` : null,
    '',
    `*${t.cart.orderDetails}*`,
    itemsText,
    '',
    `*${t.cart.total}: ${formatCurrency(finalTotal)}*`,
    currentUid ? pointsSection : null,
  ].filter((line) => line !== null);

  return msgLines.join('\n');
};

export const createWhatsAppUrl = (
  phone: string,
  message: string
): string => {
  const cleanPhone = phone.replace(/[^0-9]/g, '');
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
};

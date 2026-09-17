import { Product } from '@/core/types/catalog';

export interface CartItem extends Product {
  readonly cantidad: number;
}

export type PaymentMethod = 'cash' | 'transfer';
export type DeliveryType = 'delivery' | 'takeaway';

export interface OrderItemPayload {
  readonly id: string;
  readonly name: string;
  readonly price: number;
  readonly quantity: number;
}

export interface CustomerOrderInfo {
  readonly customerName: string;
  readonly deliveryAddress?: string;
  readonly postalCode?: string;
  readonly paymentMethod: PaymentMethod;
  readonly deliveryType: DeliveryType;
}

export interface OrderCalculationSummary {
  readonly subtotal: number;
  readonly discountAmount: number;
  readonly deliveryFee: number;
  readonly finalTotal: number;
}

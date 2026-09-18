import { describe, it, expect, beforeEach } from 'vitest';
import { useCartStore } from '@/features/cart/useCartStore';
import { calculateOrderSummary, formatCurrency } from '@/core/logic/pricing';
import { buildWhatsAppOrderMessage, createWhatsAppUrl } from '@/core/logic/whatsapp';
import { StoreSettings } from '@/core/types/settings';
import { Product } from '@/core/types/catalog';
import { CustomerOrderInfo, CartItem } from '@/core/types/order';

describe('Order & WhatsApp Checkout Flow (Integration)', () => {
  beforeEach(() => {
    localStorage.clear();
    useCartStore.getState().vaciarCarrito();
  });

  const burger: Product = {
    id: 'prod-burger',
    nombre: 'Smash Bacon Double',
    descripcion: 'Double smash patty with smoked bacon',
    precio: 2500,
    stock: 20,
    categoria: 'cat-burgers',
    imagenUrl: '',
    orden: 1,
    permiteReserva: false,
  };

  const drink: Product = {
    id: 'prod-drink',
    nombre: 'Craft IPA Beer',
    descripcion: 'Cold artisanal IPA',
    precio: 800,
    stock: 50,
    categoria: 'cat-drinks',
    imagenUrl: '',
    orden: 2,
    permiteReserva: false,
  };

  const storeSettings: StoreSettings = {
    costoEnvio: 450,
    montoDescuentoBienvenida: 500,
    descuentoPedido3: 250,
    descuentoPedido5: 500,
    descuentoPedido10: 1200,
    totalUsers: 1,
    userLimit: 500,
  };

  it('completes the entire customer journey from cart selection to WhatsApp URL payload', () => {
    // 1. Customer adds 2 Burgers and 1 Drink to cart
    const cart = useCartStore.getState();
    cart.agregarAlCarrito({ ...burger, cantidad: 2 });
    cart.agregarAlCarrito({ ...drink, cantidad: 1 });

    const currentCart = useCartStore.getState();
    expect(currentCart.articulos.length).toBe(2);
    expect(currentCart.totalArticulos()).toBe(3);
    // Subtotal: (2500 * 2) + 800 = 5800
    expect(currentCart.totalCarrito()).toBe(5800);

    // 2. Checkout Calculation Engine for Delivery order with Welcome Discount
    const pricingSummary = calculateOrderSummary({
      items: currentCart.articulos,
      deliveryType: 'delivery',
      settings: storeSettings,
      rewardCycle: 0,
      isRegisteredCustomer: true,
    });

    expect(pricingSummary.subtotal).toBe(5800);
    expect(pricingSummary.deliveryFee).toBe(450);
    expect(pricingSummary.discountAmount).toBe(500);
    // Final total: 5800 + 450 - 500 = 5750
    expect(pricingSummary.finalTotal).toBe(5750);

    // 3. WhatsApp Message Formulation
    const customerInfo: CustomerOrderInfo = {
      customerName: 'Santiago Rossi',
      deliveryAddress: 'Av. Libertador 4500, 4B',
      deliveryType: 'delivery',
      paymentMethod: 'cash',
    };

    const orderPayload = currentCart.articulos.map((item: CartItem) => ({
      id: item.id,
      name: item.nombre,
      price: item.precio,
      quantity: item.cantidad,
    }));

    const message = buildWhatsAppOrderMessage({
      customerInfo,
      items: orderPayload,
      finalTotal: pricingSummary.finalTotal,
      originUrl: 'https://foodflow-store.com',
      currentUid: 'user-vip-123',
    });

    // 4. Validate formatting and WhatsApp URL generation
    expect(message).toContain('Santiago Rossi');
    expect(message).toContain('• Smash Bacon Double x2');
    expect(message).toContain('• Craft IPA Beer x1');
    expect(message).toContain('Av. Libertador 4500, 4B');
    expect(message).toContain(formatCurrency(5750));
    expect(message).toContain('validate-points?uid=user-vip-123');

    const whatsappUrl = createWhatsAppUrl('+54 9 11 9876-5432', message);
    expect(whatsappUrl).toContain('https://wa.me/5491198765432?text=');
    expect(whatsappUrl).toContain(encodeURIComponent('Santiago Rossi'));
  });
});

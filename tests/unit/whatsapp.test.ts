import { describe, it, expect } from 'vitest';
import { buildWhatsAppOrderMessage, createWhatsAppUrl } from '@/core/logic/whatsapp';

describe('WhatsApp Logic Engine', () => {
  it('creates clean wa.me url with encoded message and stripped phone symbols', () => {
    const phone = '+54 (911) 555-1234';
    const message = 'Hello FoodFlow!';
    const url = createWhatsAppUrl(phone, message);

    expect(url).toBe('https://wa.me/549115551234?text=Hello%20FoodFlow!');
  });

  it('formats order details correctly in WhatsApp message text', () => {
    const msg = buildWhatsAppOrderMessage({
      customerInfo: {
        customerName: 'John Doe',
        deliveryAddress: 'Main Ave 123',
        deliveryType: 'delivery',
        paymentMethod: 'cash',
      },
      items: [
        { id: '1', name: 'Burger', quantity: 2, price: 1200 },
        { id: '2', name: 'Soda', quantity: 1, price: 400 },
      ],
      finalTotal: 2800,
      originUrl: 'https://foodflow.dev',
    });

    expect(msg).toContain('John Doe');
    expect(msg).toContain('• Burger x2');
    expect(msg).toContain('• Soda x1');
    expect(msg).toContain('Main Ave 123');
    expect(msg).toContain('2800.00');
  });

  it('formats takeaway order with bank transfer payment correctly without address line', () => {
    const msg = buildWhatsAppOrderMessage({
      customerInfo: {
        customerName: 'Alice Green',
        deliveryType: 'takeaway',
        paymentMethod: 'transfer',
      },
      items: [{ id: '1', name: 'Pizza', quantity: 1, price: 1500 }],
      finalTotal: 1500,
      originUrl: 'https://foodflow.dev',
    });

    expect(msg).toContain('Alice Green');
    expect(msg).toContain('• Pizza x1');
    expect(msg).not.toContain('*Address:*');
    expect(msg).not.toContain('*Dirección:*');
    expect(msg).not.toContain('validate-points');
  });
});

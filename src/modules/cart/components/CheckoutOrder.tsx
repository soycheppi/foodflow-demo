import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IconCircleCheck } from '@/shared/icons/StatusIcons';
import { IconWhatsapp } from '@/shared/icons/SocialIcons';

import { useCart } from '@/modules/cart/context/CartProvider';
import { t } from '@/config/locales';
import { restaurantConfig } from '@/config/restaurant.config';
import { calculateOrderSummary } from '@/core/logic/pricing';
import { buildWhatsAppOrderMessage, createWhatsAppUrl } from '@/core/logic/whatsapp';
import { PATHS } from '@/routes/paths';

export default function CheckoutOrder() {
  const { articulos, vaciarCarrito } = useCart();
  const navigate = useNavigate();

  const [customerName, setCustomerName] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'transfer'>('cash');
  const [deliveryType, setDeliveryType] = useState<'delivery' | 'takeaway'>('delivery');
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [whatsappUrl, setWhatsappUrl] = useState('');

  const { subtotal, deliveryFee, finalTotal } = calculateOrderSummary({
    items: articulos,
    deliveryType,
    settings: {
      costoEnvio: restaurantConfig.business.deliveryFee,
      montoDescuentoBienvenida: 0,
      descuentoPedido3: 0,
      descuentoPedido5: 0,
      descuentoPedido10: 0,
      totalUsers: 0,
      userLimit: 1000,
    },
    isRegisteredCustomer: false,
  });

  const handleConfirmOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (articulos.length === 0 || !customerName) return;

    const message = buildWhatsAppOrderMessage({
      customerInfo: {
        customerName,
        deliveryAddress: deliveryType === 'delivery' ? deliveryAddress : '',
        deliveryType,
        paymentMethod,
      },
      items: articulos.map((item) => ({
        id: item.id,
        name: item.nombre,
        price: item.precio,
        quantity: item.cantidad,
      })),
      finalTotal,
      originUrl: window.location.origin,
    });

    const url = createWhatsAppUrl(restaurantConfig.contact.whatsappNumber, message);
    setWhatsappUrl(url);
    setIsConfirmed(true);
    vaciarCarrito();
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  if (isConfirmed) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-lg text-center">
        <div className="bg-white dark:bg-[#20232b] rounded-3xl p-8 border border-gray-100 dark:border-white/5 shadow-xl">
          <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <IconCircleCheck size={36} />
          </div>
          <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-2">¡Pedido Generado!</h2>
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-6">
            Se ha abierto WhatsApp para enviar los detalles de tu pedido directamente a la cocina.
          </p>
          <div className="space-y-3">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3.5 px-6 rounded-2xl font-black text-white bg-emerald-600 hover:bg-emerald-700 transition-all flex items-center justify-center gap-2"
            >
              <IconWhatsapp size={20} />
              <span>Abrir WhatsApp Nuevamente</span>
            </a>
            <button
              type="button"
              onClick={() => navigate(PATHS.HOME)}
              className="w-full py-3.5 px-6 rounded-2xl font-bold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 transition-all"
            >
              Volver a la Tienda
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10 max-w-2xl">
      <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-8 font-questrial">
        {t.cart.title}
      </h1>

      {articulos.length === 0 ? (
        <div className="bg-white dark:bg-[#20232b] rounded-3xl p-12 text-center border border-gray-100 dark:border-white/5">
          <p className="text-gray-500 mb-6">{t.cart.emptyTitle}</p>
          <button
            type="button"
            onClick={() => navigate(PATHS.HOME)}
            className="px-6 py-3 bg-brand-red text-white font-bold rounded-2xl"
          >
            Explorar Menú
          </button>
        </div>
      ) : (
        <form onSubmit={handleConfirmOrder} className="space-y-6">
          <div className="bg-white dark:bg-[#20232b] rounded-3xl p-6 border border-gray-100 dark:border-white/5 space-y-4">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Datos de Entrega</h2>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                {t.cart.customerLabel}
              </label>
              <input
                type="text"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white"
                placeholder="Tu nombre completo"
              />
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeliveryType('delivery')}
                className={`py-3 px-4 rounded-2xl border font-bold text-sm transition-all ${
                  deliveryType === 'delivery'
                    ? 'border-brand-red bg-brand-red/10 text-brand-red'
                    : 'border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-400'
                }`}
              >
                🛵 {t.cart.delivery}
              </button>
              <button
                type="button"
                onClick={() => setDeliveryType('takeaway')}
                className={`py-3 px-4 rounded-2xl border font-bold text-sm transition-all ${
                  deliveryType === 'takeaway'
                    ? 'border-brand-red bg-brand-red/10 text-brand-red'
                    : 'border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-400'
                }`}
              >
                🏪 {t.cart.pickup}
              </button>
            </div>

            {deliveryType === 'delivery' && (
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                  {t.cart.addressLabel}
                </label>
                <input
                  type="text"
                  required
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white"
                  placeholder="Calle, altura, piso/depto"
                />
              </div>
            )}
          </div>

          <div className="bg-white dark:bg-[#20232b] rounded-3xl p-6 border border-gray-100 dark:border-white/5 space-y-4">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Forma de Pago</h2>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setPaymentMethod('cash')}
                className={`py-3 px-4 rounded-2xl border font-bold text-sm transition-all ${
                  paymentMethod === 'cash'
                    ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400'
                    : 'border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-400'
                }`}
              >
                💵 {t.cart.cash}
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('transfer')}
                className={`py-3 px-4 rounded-2xl border font-bold text-sm transition-all ${
                  paymentMethod === 'transfer'
                    ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400'
                    : 'border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-400'
                }`}
              >
                🏦 {t.cart.transfer}
              </button>
            </div>
          </div>

          <div className="bg-white dark:bg-[#20232b] rounded-3xl p-6 border border-gray-100 dark:border-white/5 space-y-3">
            <div className="flex justify-between text-gray-600 dark:text-gray-400">
              <span>{t.cart.subtotal}</span>
              <span>{restaurantConfig.business.currencySymbol}{subtotal.toFixed(2)}</span>
            </div>
            {deliveryType === 'delivery' && (
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>{t.cart.delivery}</span>
                <span>{restaurantConfig.business.currencySymbol}{deliveryFee.toFixed(2)}</span>
              </div>
            )}
            <div className="pt-3 border-t border-gray-100 dark:border-white/5 flex justify-between text-xl font-black text-gray-900 dark:text-white">
              <span>{t.cart.total}</span>
              <span>{restaurantConfig.business.currencySymbol}{finalTotal.toFixed(2)}</span>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-lg transition-all shadow-lg flex items-center justify-center gap-3 cursor-pointer"
          >
            <IconWhatsapp size={24} />
            <span>Confirmar Pedido vía WhatsApp</span>
          </button>
        </form>
      )}
    </div>
  );
}

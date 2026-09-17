import { forwardRef, useImperativeHandle, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PATHS } from '@/routes/paths';
import { IconTrash } from '@/shared/icons/ActionIcons';
import { IconCheck } from '@/shared/icons/StatusIcons';

import { useCart } from '@/modules/cart/context/CartProvider';
import Drawer from '@/shared/ui/Drawer';
import { t } from '@/config/locales';

export interface CartDrawerHandle {
  show: () => void;
  hide: () => void;
}

const CartDrawer = forwardRef<CartDrawerHandle, {}>((_props, ref) => {
  const { articulos, removerDelCarrito } = useCart();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  useImperativeHandle(ref, () => ({
    show: () => setIsOpen(true),
    hide: () => setIsOpen(false),
  }));

  const subtotal = articulos.reduce((sum, item) => sum + item.precio * item.cantidad, 0);

  const close = () => setIsOpen(false);

  const goToCheckout = () => {
    close();
    navigate(PATHS.CHECKOUT);
  };

  return (
    <Drawer
      isOpen={isOpen}
      onClose={close}
      position="right"
      title={t.cart.title}
      className="border-l border-gray-200 dark:border-white/10"
    >
      <div className="flex flex-col h-full">
        {/* Items List */}
        <div className="flex-1 overflow-y-auto">
          {articulos.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-500 dark:text-gray-400 space-y-4">
              <span className="text-4xl opacity-20 dark:opacity-40">🛒</span>
              <p>{t.cart.emptyTitle}</p>
            </div>
          ) : (
            <ul className="space-y-4">
              {articulos.map((item) => (
                <li
                  key={item.id}
                  className="flex justify-between items-start pb-4 border-b border-gray-100 dark:border-white/5 last:border-0"
                >
                  <div>
                    <div className="text-base font-bold text-gray-900 dark:text-white mb-1">
                      {item.nombre}
                    </div>
                    <div className="text-xs text-brand-red font-medium">
                      Qty: <span className="font-mono">{item.cantidad}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className="text-sm font-bold text-gray-900 dark:text-gray-100 font-mono">
                      ${(item.precio * item.cantidad).toFixed(0)}
                    </span>
                    <button
                      data-testid="remove-item"
                      aria-label={`${t.common.delete} ${item.nombre}`}
                      className="text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors p-1"
                      onClick={() => removerDelCarrito(item.id)}
                      title={t.common.delete}
                    >
                      <IconTrash size={18} />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Cart Footer */}
        {articulos.length > 0 && (
          <div className="pt-6 border-t border-gray-100 dark:border-white/5 mt-4">
            <div className="flex justify-between items-center mb-6">
              <span className="text-lg font-medium text-gray-600 dark:text-gray-400">{t.cart.total}</span>
              <span className="text-3xl font-black text-gray-900 dark:text-white font-questrial tracking-tight">
                ${subtotal.toFixed(0)}
              </span>
            </div>
            <button
              className="w-full bg-brand-black dark:bg-brand-red text-white py-4 rounded-xl font-bold uppercase tracking-widest hover:bg-gray-800 dark:hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-lg"
              onClick={goToCheckout}
            >
              {t.cart.checkout} <IconCheck size={20} />
            </button>
          </div>
        )}
      </div>
    </Drawer>
  );
});

CartDrawer.displayName = 'CartDrawer';

export default CartDrawer;

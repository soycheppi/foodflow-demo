import React from 'react';
import { IconWhatsapp } from '@/shared/icons/SocialIcons';
import { restaurantConfig } from '@/config/restaurant.config';
import { t } from '@/config/locales';
import { formatCurrency } from '@/core/logic/pricing';
import type { CartItem } from '@/core/types/order';

interface CheckoutSummaryCardProps {
  articulos: CartItem[];
  subtotal: number;
  discountAmount: number;
  deliveryFee: number;
  finalTotal: number;
  deliveryType: 'delivery' | 'takeaway';
  userRewardCycle?: number;
  minOrderResult: {
    isValid: boolean;
    minAmount: number;
    amountMissing: number;
  };
  storeStatus: {
    isOpen: boolean;
  };
  canConfirm: boolean;
  isSaving: boolean;
}

const CheckoutSummaryCard: React.FC<CheckoutSummaryCardProps> = ({
  articulos,
  subtotal,
  discountAmount,
  deliveryFee,
  finalTotal,
  deliveryType,
  userRewardCycle = 0,
  minOrderResult,
  storeStatus,
  canConfirm,
  isSaving,
}) => {
  return (
    <div className="sticky top-24 bg-white dark:bg-[#111317] rounded-[2.5rem] shadow-2xl border border-gray-100 dark:border-white/5 overflow-hidden flex flex-col">
      <div className="p-8 pb-4">
        <h3 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight italic">
          {t.cart.title}
        </h3>
      </div>

      <div className="px-8 flex-1 max-h-[40vh] overflow-y-auto custom-scrollbar">
        <ul className="divide-y divide-gray-50 dark:divide-white/5">
          {articulos.map((item) => (
            <li key={item.id} className="py-5 flex justify-between gap-4">
              <div>
                <p className="font-bold text-gray-800 dark:text-gray-200">{item.nombre}</p>
                <p className="text-sm text-gray-400 font-bold">
                  x{item.cantidad} • {restaurantConfig.business.currencySymbol}{item.precio}
                </p>
              </div>
              <p className="font-mono font-black text-gray-900 dark:text-white">
                {formatCurrency(item.precio * item.cantidad)}
              </p>
            </li>
          ))}
        </ul>
      </div>

      <div className="p-8 bg-gray-50 dark:bg-white/5 space-y-4">
        <div className="flex justify-between text-gray-500 font-medium">
          <span>{t.cart.subtotal}</span>
          <span>{formatCurrency(subtotal)}</span>
        </div>
        {discountAmount > 0 && (
          <div className="flex justify-between text-green-600 dark:text-green-400 font-bold">
            <span>{t.cart.discountBenefit(userRewardCycle + 1)}</span>
            <span>-{formatCurrency(discountAmount)}</span>
          </div>
        )}
        {deliveryType === 'delivery' && (
          <div className="flex justify-between text-gray-500 font-medium">
            <span>{t.cart.deliveryFee}</span>
            <span>{formatCurrency(deliveryFee)}</span>
          </div>
        )}
        <div className="pt-4 border-t border-gray-200 dark:border-white/10 flex justify-between items-center text-3xl font-black text-brand-black dark:text-white tracking-tighter">
          <span>{t.cart.total}</span>
          <span>{formatCurrency(finalTotal)}</span>
        </div>

        {!minOrderResult.isValid && (
          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-bold flex flex-col gap-1">
            <span>Minimum order requirement: {formatCurrency(minOrderResult.minAmount)}</span>
            <span>Add {formatCurrency(minOrderResult.amountMissing)} more to enable checkout.</span>
          </div>
        )}

        {!storeStatus.isOpen && (
          <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-xs font-medium text-center">
            Kitchen is currently closed. Your order will be scheduled for opening.
          </div>
        )}

        <button
          type="submit"
          disabled={!canConfirm || isSaving}
          className={`w-full mt-2 py-5 px-4 rounded-2xl font-black uppercase tracking-wider text-sm sm:text-base transition-all transform hover:-translate-y-1 shadow-xl flex items-center justify-center text-center gap-2.5 ${
            !canConfirm || isSaving
              ? 'bg-gray-200 dark:bg-white/10 text-gray-400 cursor-not-allowed'
              : 'bg-green-600 text-white hover:bg-green-700 shadow-green-500/20'
          }`}
        >
          {isSaving ? (
            t.common.saving
          ) : (
            <>
              <IconWhatsapp size={22} className="shrink-0" />
              <span>{t.cart.sendWhatsAppOrder}</span>
            </>
          )}
        </button>

        {!canConfirm && minOrderResult.isValid && (
          <p className="text-center text-xs text-red-600 dark:text-red-400 font-bold uppercase tracking-wider mt-4">
            {t.cart.requiredFieldsWarning}
          </p>
        )}
      </div>
    </div>
  );
};

export default CheckoutSummaryCard;

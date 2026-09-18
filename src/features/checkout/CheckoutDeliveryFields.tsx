import React from 'react';
import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { t } from '@/config/locales';
import type { CheckoutFormData } from './checkoutSchema';

interface CheckoutDeliveryFieldsProps {
  register: UseFormRegister<CheckoutFormData>;
  errors: FieldErrors<CheckoutFormData>;
  deliveryType: 'delivery' | 'takeaway';
  paymentMethod: 'cash' | 'transfer';
  onDeliveryTypeChange: (type: 'delivery' | 'takeaway') => void;
  onPaymentMethodChange: (method: 'cash' | 'transfer') => void;
}

const inputClass =
  'w-full bg-white dark:bg-[#1a1c21] border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white text-base rounded-2xl focus:ring-2 focus:ring-brand-red block p-4 shadow-sm transition-all focus:outline-none';
const labelClass =
  'block mb-2 text-xs font-black text-gray-700 dark:text-gray-300 uppercase tracking-[0.2em]';

const CheckoutDeliveryFields: React.FC<CheckoutDeliveryFieldsProps> = ({
  register,
  errors,
  deliveryType,
  paymentMethod,
  onDeliveryTypeChange,
  onPaymentMethodChange,
}) => {
  return (
    <div className="bg-white dark:bg-[#111317] rounded-4xl shadow-xl border border-gray-100 dark:border-white/5 p-8 md:p-10 relative overflow-hidden">
      <div className="flex items-center gap-4 mb-10 pb-6 border-b border-gray-50 dark:border-white/5">
        <span className="bg-brand-black dark:bg-brand-red text-white w-10 h-10 rounded-full flex items-center justify-center font-black text-xl">
          1
        </span>
        <h3 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight italic">
          {t.cart.deliveryMethod}
        </h3>
      </div>

      <div className="grid grid-cols-1 gap-8">
        <div>
          <label htmlFor="customer-name" className={labelClass}>
            {t.cart.customerName}
          </label>
          <input
            id="customer-name"
            type="text"
            className={`${inputClass} ${errors.customerName ? 'border-red-500 focus:ring-red-500' : ''}`}
            placeholder={t.cart.customerNamePlaceholder}
            {...register('customerName')}
          />
          {errors.customerName && (
            <p className="text-xs text-red-500 font-bold mt-1.5">
              {errors.customerName.message}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <label className={labelClass}>{t.cart.deliveryMethod}</label>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => onDeliveryTypeChange('delivery')}
                className={`flex-1 py-4 rounded-2xl border-2 font-bold transition-all ${deliveryType === 'delivery' ? 'border-brand-red bg-brand-red/5 text-brand-red' : 'border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300 hover:border-gray-300'}`}
              >
                🛵 {t.cart.delivery}
              </button>
              <button
                type="button"
                onClick={() => onDeliveryTypeChange('takeaway')}
                className={`flex-1 py-4 rounded-2xl border-2 font-bold transition-all ${deliveryType === 'takeaway' ? 'border-brand-red bg-brand-red/5 text-brand-red' : 'border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300 hover:border-gray-300'}`}
              >
                🥡 {t.cart.pickup}
              </button>
            </div>
          </div>
          <div>
            <label className={labelClass}>{t.cart.paymentMethod}</label>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => onPaymentMethodChange('cash')}
                className={`flex-1 py-4 rounded-2xl border-2 font-bold transition-all ${paymentMethod === 'cash' ? 'border-brand-red bg-brand-red/5 text-brand-red' : 'border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300 hover:border-gray-300'}`}
              >
                💵 {t.cart.cash}
              </button>
              <button
                type="button"
                onClick={() => onPaymentMethodChange('transfer')}
                className={`flex-1 py-4 rounded-2xl border-2 font-bold transition-all ${paymentMethod === 'transfer' ? 'border-brand-red bg-brand-red/5 text-brand-red' : 'border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300 hover:border-gray-300'}`}
              >
                📱 {t.cart.transfer}
              </button>
            </div>
          </div>
        </div>

        {deliveryType === 'delivery' && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 animate-fade-in-down">
            <div className="md:col-span-3">
              <label htmlFor="delivery-address" className={labelClass}>
                {t.cart.deliveryAddress}
              </label>
              <input
                id="delivery-address"
                type="text"
                className={`${inputClass} ${errors.deliveryAddress ? 'border-red-500 focus:ring-red-500' : ''}`}
                placeholder={t.cart.deliveryAddressPlaceholder}
                {...register('deliveryAddress')}
              />
              {errors.deliveryAddress && (
                <p className="text-xs text-red-500 font-bold mt-1.5">
                  {errors.deliveryAddress.message}
                </p>
              )}
            </div>
            <div className="md:col-span-1">
              <label htmlFor="postal-code" className={labelClass}>
                {t.cart.postalCode}
              </label>
              <input
                id="postal-code"
                type="text"
                className={inputClass}
                placeholder={t.cart.postalCodePlaceholder}
                {...register('postalCode')}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckoutDeliveryFields;

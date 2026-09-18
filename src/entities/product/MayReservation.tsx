import React, { useState, useEffect } from 'react';
import { useAuth } from '@/features/auth/useAuth';
import { useUserProfile } from '@/entities/user/userHooks';
import { IconWhatsapp } from '@/shared/icons/SocialIcons';
import { IconCalendar, IconMinus } from '@/shared/icons/MiscIcons';
import { IconPlus, IconXMark } from '@/shared/icons/ActionIcons';
import { Product } from '@/core/types/catalog';
import { restaurantConfig } from '@/config/restaurant.config';
import { t } from '@/config/locales';

interface MayReservationProps {
  product: Product;
}

export default function MayReservation({ product }: MayReservationProps) {
  const { currentUser } = useAuth();
  const { data: userProfile } = useUserProfile(currentUser?.uid || '');

  const [isOpen, setIsOpen] = useState(false);
  const [portions, setPortions] = useState(2);
  const [clientName, setClientName] = useState('');

  useEffect(() => {
    if (userProfile?.displayName) {
      setClientName(userProfile.displayName);
    } else if (currentUser?.displayName) {
      setClientName(currentUser.displayName);
    }
  }, [userProfile, currentUser]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  if (!product.permiteReserva) return null;

  const handleOpen = () => {
    setIsOpen(true);
    setPortions(2);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleIncrement = () => {
    setPortions((prev) => prev + 1);
  };

  const handleDecrement = () => {
    if (portions > 1) {
      setPortions((prev) => prev - 1);
    }
  };

  const handleSendReservation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim()) return;

    const targetPhone = restaurantConfig.contact.whatsappNumber.replace(/[^0-9]/g, '');
    const portionsText = portions === 1 ? 'portion' : 'portions';
    const message = t.catalog.reservationWhatsAppMessage(
      clientName.trim(),
      portions,
      portionsText,
      product.nombre
    );

    const whatsappUrl = `https://wa.me/${targetPhone}?text=${encodeURIComponent(message)}`;

    window.open(whatsappUrl, '_blank');
    handleClose();
  };

  return (
    <>
      <div className="mb-8 p-6 rounded-3xl bg-gray-50/50 dark:bg-white/2 border border-gray-150/70 dark:border-white/5 shadow-lg flex flex-col gap-5 transition-all duration-300 hover:shadow-xl hover:border-gray-250 dark:hover:border-white/10">
        <div className="flex items-start gap-4">
          <div className="bg-brand-red/10 dark:bg-brand-red/20 text-brand-red dark:text-red-400 p-3 rounded-2xl shrink-0">
            <IconCalendar size={24} />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="inline-block bg-brand-red/10 dark:bg-brand-red/20 text-brand-red dark:text-red-450 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md">
                {t.catalog.specialReservation}
              </span>
            </div>
            <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight font-questrial italic mt-2.5">
              {t.catalog.reserveProductTitle(product.nombre)}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1 leading-relaxed font-medium">
              {t.catalog.reserveProductDescription}
            </p>
          </div>
        </div>

        <button
          onClick={handleOpen}
          className="w-full bg-[#128c7e] hover:bg-[#075e54] text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2.5 transition-all duration-300 active:scale-95 shadow-md hover:shadow-lg shadow-emerald-950/10 hover:shadow-emerald-950/20"
        >
          <IconWhatsapp className="w-4.5 h-4.5" />
          {t.catalog.reserveViaWhatsApp}
        </button>
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-[2px] flex items-center justify-center p-4 transition-opacity duration-200"
          role="dialog"
          aria-modal="true"
          aria-label={t.catalog.reserveProductTitle(product.nombre)}
        >
          <div className="bg-white dark:bg-[#111317] border border-gray-150 dark:border-white/5 rounded-4xl w-full max-w-md p-8 shadow-2xl relative overflow-hidden flex flex-col gap-6 transition-all duration-200">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="bg-brand-red/10 dark:bg-brand-red/20 text-brand-red dark:text-red-400 p-2.5 rounded-xl">
                  <IconCalendar size={24} />
                </div>
                <div>
                  <h4 className="text-xl font-black text-gray-900 dark:text-white font-questrial tracking-tight">
                    {t.catalog.reserveProductTitle(product.nombre)}
                  </h4>
                  <p className="text-xs text-gray-450 dark:text-gray-500 font-bold uppercase tracking-wider">
                    {t.catalog.specialReservation}
                  </p>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-white/5"
                aria-label={t.common.close}
              >
                <IconXMark size={20} />
              </button>
            </div>

            <form onSubmit={handleSendReservation} className="flex flex-col gap-6">
              <div>
                <label className="block mb-2 text-xs font-black text-gray-450 dark:text-gray-500 uppercase tracking-widest">
                  {t.catalog.portionsServings}
                </label>
                <div className="flex items-center justify-between bg-gray-50 dark:bg-[#1a1c21] rounded-2xl p-2 border border-gray-200/50 dark:border-white/5">
                  <button
                    type="button"
                    onClick={handleDecrement}
                    disabled={portions <= 1}
                    className="w-12 h-12 flex items-center justify-center rounded-xl bg-white dark:bg-[#2d3038] hover:bg-gray-100 dark:hover:bg-white/5 text-gray-700 dark:text-gray-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-95 shadow-xs"
                    aria-label={t.catalog.decreasePortions}
                  >
                    <IconMinus size={20} />
                  </button>
                  <span className="text-2xl font-black text-gray-900 dark:text-white font-questrial">
                    {portions}
                  </span>
                  <button
                    type="button"
                    onClick={handleIncrement}
                    className="w-12 h-12 flex items-center justify-center rounded-xl bg-white dark:bg-[#2d3038] hover:bg-gray-100 dark:hover:bg-white/5 text-gray-700 dark:text-gray-300 transition-all active:scale-95 shadow-xs"
                    aria-label={t.catalog.increasePortions}
                  >
                    <IconPlus size={20} />
                  </button>
                </div>
              </div>

              <div>
                <label className="block mb-2 text-xs font-black text-gray-450 dark:text-gray-500 uppercase tracking-widest">
                  {t.cart.customerName}
                </label>
                <input
                  type="text"
                  required
                  placeholder={t.cart.customerNamePlaceholder}
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-[#1a1c21] border border-gray-250/30 dark:border-white/5 text-gray-900 dark:text-white text-base rounded-2xl focus:ring-2 focus:ring-[#128c7e] block p-4 shadow-sm transition-all focus:outline-none placeholder:text-gray-400 dark:placeholder:text-gray-600 font-medium"
                />
              </div>

              <button
                type="submit"
                disabled={!clientName.trim()}
                className="w-full bg-[#128c7e] hover:bg-[#075e54] disabled:bg-gray-250 dark:disabled:bg-white/10 disabled:text-gray-400 dark:disabled:text-gray-600 disabled:shadow-none text-white py-4 rounded-2xl font-black uppercase tracking-widest text-sm flex items-center justify-center gap-3 transition-all duration-300 active:scale-95 shadow-md shadow-emerald-950/10 hover:shadow-emerald-950/20"
              >
                <IconWhatsapp className="w-5 h-5" />
                {t.catalog.confirmReservationWhatsApp}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

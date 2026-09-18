import React from 'react';
import { IconCrown, IconGift } from '@/shared/icons/MiscIcons';
import { IconCircleCheck } from '@/shared/icons/StatusIcons';
import { restaurantConfig } from '@/config/restaurant.config';
import { t } from '@/config/locales';
import type { UserProfile } from '@/core/types/auth';

interface CheckoutLoyaltyBannerProps {
  isRegistered: boolean;
  userProfile?: UserProfile | null;
  appliesDiscount: boolean;
  welcomeDiscount: number;
  onJoinClick: () => void;
}

const CheckoutLoyaltyBanner: React.FC<CheckoutLoyaltyBannerProps> = ({
  isRegistered,
  userProfile,
  appliesDiscount,
  welcomeDiscount,
  onJoinClick,
}) => {
  if (!isRegistered) {
    return (
      <div className="bg-linear-to-r from-blue-600 to-indigo-700 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 group">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none group-hover:scale-110 transition-transform duration-1000"></div>
        <div className="flex-1 z-10 text-center md:text-left">
          <h4 className="font-black text-3xl mb-3 flex items-center justify-center md:justify-start gap-4 uppercase italic tracking-tighter">
            <span className="text-4xl">🎁</span> {restaurantConfig.brand.name} {t.cart.clubTitle}
          </h4>
          <p className="text-blue-50 text-xl font-medium max-w-lg">
            {t.cart.clubBannerSubtitle}{' '}
            <strong className="text-white bg-blue-500 px-2 py-1 rounded-lg">
              ${welcomeDiscount || 2000} {t.cart.clubBannerOffText}
            </strong>
          </p>
          <p className="text-blue-200/60 text-[10px] mt-4 uppercase font-bold tracking-widest italic">
            {t.cart.clubBannerNotice}
          </p>
        </div>
        <button
          type="button"
          onClick={onJoinClick}
          className="z-10 px-10 py-4 bg-white text-blue-700 font-black rounded-2xl text-lg hover:bg-blue-50 transition shadow-[0_15px_30px_-5px_rgba(255,255,255,0.2)] active:scale-95 uppercase tracking-tight"
        >
          {t.cart.joinFree}
        </button>
      </div>
    );
  }

  const cycle = userProfile?.rewardCycle || 0;

  return (
    <div className="bg-[#111317] rounded-[2.5rem] p-8 md:p-12 text-white shadow-2xl border border-white/5 relative overflow-hidden group">
      <div className="absolute -top-40 -right-40 w-125 h-125 bg-brand-red opacity-10 rounded-full blur-[100px] group-hover:opacity-20 transition-opacity"></div>
      <div className="relative z-10 flex flex-col lg:flex-row gap-12 items-center">
        <div className="flex-1 text-center lg:text-left">
          <IconCrown
            size={48}
            className="text-brand-red mb-4 mx-auto lg:mx-0 animate-pulse"
          />
          <h4 className="text-3xl md:text-4xl font-black uppercase tracking-tighter italic">
            {restaurantConfig.brand.name} <span className="text-brand-red">{t.cart.clubTitle}</span>
          </h4>
          <p className="text-gray-400 font-medium text-lg mt-3">
            {t.cart.currentCycle}{' '}
            <strong className="text-white text-2xl mx-1">{cycle}</strong>
            /10 {t.cart.pointsLabel}.
            {appliesDiscount && (
              <span className="block text-green-400 mt-2 font-black uppercase tracking-widest text-sm">
                {t.cart.nextOrderWithBenefit}
              </span>
            )}
          </p>
        </div>

        <div className="flex-2 w-full py-8">
          <div className="relative flex items-center justify-between px-4">
            <div className="absolute left-0 right-0 h-2 bg-white/5 top-1/2 -translate-y-1/2 rounded-full"></div>
            <div
              className="absolute left-0 h-2 bg-brand-red top-1/2 -translate-y-1/2 rounded-full transition-all duration-1000 shadow-[0_0_15px_rgba(176,42,55,0.5)]"
              style={{
                width: `${Math.min((cycle / 10) * 100, 100)}%`,
              }}
            ></div>
            {[1, 3, 5, 10].map((step, i) => (
              <div key={i} className="relative z-10 flex flex-col items-center">
                <div
                  className={`w-12 h-12 md:w-14 md:h-14 rounded-full border-4 flex items-center justify-center transition-all duration-500 ${cycle >= step ? 'bg-brand-red border-[#111317]' : 'bg-[#1a1c21] border-white/10 text-gray-700'} ${cycle + 1 === step ? 'scale-125 ring-8 ring-brand-red/10 bg-white text-brand-red border-brand-red' : ''}`}
                >
                  {cycle >= step ? (
                    <IconCircleCheck size={24} />
                  ) : (
                    <IconGift size={20} />
                  )}
                </div>
                <span
                  className={`mt-4 text-[10px] font-black uppercase tracking-widest ${cycle + 1 === step ? 'text-brand-red' : 'text-gray-500'}`}
                >
                  {t.cart.pointStep(step)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutLoyaltyBanner;

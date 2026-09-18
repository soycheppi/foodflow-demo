import React, { useMemo } from 'react';
import { restaurantConfig } from '@/config/restaurant.config';
import { evaluateStoreOpenStatus } from '@/core/logic/businessRules';
import { t } from '@/config/locales';

interface HeroSectionProps {
  searchTerm?: string;
  onSearchChange?: (term: string) => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ searchTerm = '', onSearchChange }) => {
  const { brand, business } = restaurantConfig;

  const scheduleStatus = useMemo(() => {
    return evaluateStoreOpenStatus(business);
  }, [business]);

  return (
    <section className="relative text-center pt-10 md:pt-14 pb-8 md:pb-10 px-4">
      <div className="max-w-4xl mx-auto">
        {}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-6 transition-all duration-300 border bg-white dark:bg-[#1a1c21] shadow-xs">
          <span
            className={`w-2 h-2 rounded-full ${
              scheduleStatus.isOpen ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
            }`}
          />
          <span className="text-gray-700 dark:text-gray-300">
            {scheduleStatus.isOpen ? (
              <span className="text-emerald-600 dark:text-emerald-400">Open Now • Taking Orders</span>
            ) : (
              <span className="text-amber-600 dark:text-amber-400">
                {scheduleStatus.nextOpenTime
                  ? `Kitchen Closed • Opens at ${scheduleStatus.nextOpenTime}`
                  : 'Kitchen Closed'}
              </span>
            )}
          </span>
        </div>

        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-3">
          {brand.name}
        </h1>
        <p className="text-lg md:text-xl font-medium text-brand-red dark:text-red-400 mb-4">
          {brand.tagline}
        </p>
        <p className="text-sm md:text-base text-gray-600 dark:text-gray-300 max-w-xl mx-auto mb-8 leading-relaxed">
          {brand.description}
        </p>

        {onSearchChange && (
          <div className="max-w-md mx-auto">
            <input
              id="hero-search-input"
              name="search"
              type="text"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={t.home.heroSearchPlaceholder}
              aria-label={t.home.heroSearchPlaceholder}
              className="w-full px-5 py-3 rounded-full bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 text-gray-900 dark:text-white placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-red text-sm transition-all"
            />
          </div>
        )}
      </div>
    </section>
  );
};

export default HeroSection;

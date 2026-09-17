import React from 'react';
import { restaurantConfig } from '@/config/restaurant.config';
import { t } from '@/config/locales';

interface HeroSectionProps {
  searchTerm?: string;
  onSearchChange?: (term: string) => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ searchTerm = '', onSearchChange }) => {
  const { brand } = restaurantConfig;

  return (
    <section className="relative text-center pt-10 md:pt-14 pb-8 md:pb-10 px-4">
      <div className="max-w-4xl mx-auto">
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

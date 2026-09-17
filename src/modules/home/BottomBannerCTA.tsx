import React, { memo } from 'react';
import { t } from '@/config/locales';

const BottomBannerCTA: React.FC = memo(() => {
  return (
    <section className="text-center bg-transparent pt-4 pb-20 md:pb-24 transition-colors duration-300">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="flex flex-col items-center text-center space-y-4">
          <h3 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white uppercase tracking-tighter mb-2">
            {t.home.bottomCtaTitle}
          </h3>
          <div className="w-24 h-1 bg-brand-red rounded-full mx-auto mb-6"></div>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 leading-relaxed font-light">
            {t.home.bottomCtaSubtitle}
          </p>
        </div>
      </div>
    </section>
  );
});

BottomBannerCTA.displayName = 'BottomBannerCTA';

export default BottomBannerCTA;

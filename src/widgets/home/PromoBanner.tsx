import { memo } from 'react';
import { Link } from 'react-router-dom';
import { IconArrowRight } from '@/shared/icons/ActionIcons';
import { t } from '@/config/locales';

const PromoBanner = memo(function PromoBanner() {
  return (
    <section className="container mx-auto px-4 pb-16 md:pb-20">
      <div className="bg-white dark:bg-[#111317] rounded-[2.5rem] p-8 md:p-16 relative overflow-hidden shadow-xl dark:shadow-2xl border border-gray-100 dark:border-white/5 transition-colors duration-300">
        <div className="relative z-10 max-w-lg">
          <h2 className="text-3xl md:text-5xl font-black text-gray-900 dark:text-white mb-6 leading-tight">
            {t.home.promoHeading} <br />
            <span className="text-brand-red">{t.home.promoHeadingHighlight}</span>
          </h2>
          <p className="text-gray-700 dark:text-gray-200 mb-8 text-lg font-medium">
            {t.home.promoSubtitle}
          </p>
          <Link
            to="/category/cat-burgers"
            className="inline-flex items-center bg-brand-red dark:bg-white text-white dark:text-gray-900 px-8 py-4 rounded-2xl font-bold hover:opacity-90 transition-all shadow-lg shadow-red-500/20 dark:shadow-none"
          >
            {t.home.exploreMenu} <IconArrowRight className="ml-3 w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  );
});

export default PromoBanner;

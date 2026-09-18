import { lazy, Suspense } from 'react';
import Spinner from '@/shared/ui/Spinner';
import BottomBannerCTA from '@/widgets/home/BottomBannerCTA';
import SEO from '@/shared/ui/SEO';
import { t } from '@/config/locales';
import { restaurantConfig } from '@/config/restaurant.config';

const ProductList = lazy(() => import('@/entities/product/ProductList'));

export default function CategoryPage() {
  return (
    <div className="pb-12 bg-gray-50 dark:bg-[#1a1c21] min-h-screen transition-colors duration-300">
      <SEO
        title={`${t.common.menu} | ${restaurantConfig.brand.name}`}
        description={restaurantConfig.brand.description}
      />
      <Suspense fallback={<Spinner variant="inline" label={t.catalog.loadingCategory} />}>
        <ProductList />
      </Suspense>

      <BottomBannerCTA />
    </div>
  );
}

import { lazy, Suspense } from 'react';
import Spinner from '@/shared/ui/Spinner';
import SEO from '@/shared/ui/SEO';
import { t } from '@/config/locales';
import { restaurantConfig } from '@/config/restaurant.config';

const CheckoutOrder = lazy(() => import('@/modules/cart/components/CheckoutOrder'));

export default function CheckoutPage() {
  return (
    <div className="pb-20 bg-gray-50 dark:bg-[#1a1c21] min-h-screen">
      <SEO
        title={`${t.cart.checkout} | ${restaurantConfig.brand.name}`}
        description={`${t.cart.checkout} - ${restaurantConfig.brand.name}`}
      />
      <Suspense fallback={<Spinner label={t.common.loading} />}>
        <CheckoutOrder />
      </Suspense>
    </div>
  );
}

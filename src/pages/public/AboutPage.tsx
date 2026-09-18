import { lazy, Suspense } from 'react';
import Spinner from '@/shared/ui/Spinner';
import SEO from '@/shared/ui/SEO';
import { t } from '@/config/locales';
import { restaurantConfig } from '@/config/restaurant.config';

const AboutStory = lazy(() => import('@/widgets/about/AboutStory'));
const LocationMap = lazy(() => import('@/widgets/about/LocationMap'));

export default function AboutPage() {
  return (
    <>
      <SEO
        title={`${t.nav.about} | ${restaurantConfig.brand.name}`}
        description={restaurantConfig.about?.title || restaurantConfig.brand.description}
      />
      <Suspense fallback={<Spinner variant="inline" label={t.common.loading} />}>
        <AboutStory />
      </Suspense>

      <Suspense fallback={<Spinner variant="inline" label={t.common.loading} />}>
        <LocationMap />
      </Suspense>
    </>
  );
}

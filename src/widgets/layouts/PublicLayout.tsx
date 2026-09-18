import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import NavFront from '@/widgets/layouts/components/NavFront';
import Footer from '@/widgets/layouts/components/Footer';
import Spinner from '@/shared/ui/Spinner';
import { t } from '@/config/locales';

export default function PublicLayout() {
  return (
    <div className="flex flex-col min-h-screen font-questrial selection:bg-brand-red selection:text-white bg-gray-50 dark:bg-[#1a1c21] text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <NavFront showSidebarButton={false} />

      <main className="flex-1 w-full pt-20">
        <div className="w-full">
          <Suspense fallback={<Spinner variant="inline" label={t.common.loading} />}>
            <Outlet />
          </Suspense>
        </div>
      </main>

      <Footer />
    </div>
  );
}

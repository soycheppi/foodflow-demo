import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import LenisProvider from '@/app/providers/LenisProvider';
import { CartProvider } from '@/features/cart/CartProvider';
import Spinner from '@/shared/ui/Spinner';
import ErrorBoundary from '@/shared/ui/ErrorBoundary';

export default function RootWrapper() {
  return (
    <CartProvider>
      <LenisProvider>
        <ErrorBoundary>
          <Suspense fallback={<Spinner />}>
            <Outlet />
          </Suspense>
        </ErrorBoundary>
      </LenisProvider>
    </CartProvider>
  );
}

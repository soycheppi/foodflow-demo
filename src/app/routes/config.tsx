/* eslint-disable react-refresh/only-export-components */
import { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom';
import LenisProvider from '@/app/providers/LenisProvider';
import { ThemeProvider } from '@/app/providers/ThemeProvider';
import { CartProvider } from '@/features/cart/CartProvider';
import Spinner from '@/shared/ui/Spinner';
import ErrorBoundary from '@/shared/ui/ErrorBoundary';

import HomePage from '@/pages/public/HomePage';
import PublicLayout from '@/widgets/layouts/PublicLayout';

const CategoryPage = lazy(() => import('@/pages/public/CategoryPage'));
const AboutPage = lazy(() => import('@/pages/public/AboutPage'));
const CheckoutPage = lazy(() => import('@/pages/public/CheckoutPage'));
const ProductDetailPage = lazy(() => import('@/pages/public/ProductDetailPage'));

const RootWrapper = () => (
  <ThemeProvider>
    <CartProvider>
      <LenisProvider>
        <ErrorBoundary>
          <Suspense fallback={<Spinner />}>
            <Outlet />
          </Suspense>
        </ErrorBoundary>
      </LenisProvider>
    </CartProvider>
  </ThemeProvider>
);

export const router = createBrowserRouter([
  {
    element: <RootWrapper />,
    children: [
      {
        path: '/',
        element: <PublicLayout />,
        children: [
          { index: true, element: <HomePage /> },
          { path: 'category/:categoria', element: <CategoryPage /> },
          { path: 'product/:id', element: <ProductDetailPage /> },
          { path: 'about', element: <AboutPage /> },
          { path: 'checkout', element: <CheckoutPage /> },
        ],
      },
      {
        path: '*',
        element: <Navigate to="/" replace />,
      },
    ],
  },
]);

import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { toast } from 'sonner';

import { useProduct, useCategories } from '@/features/catalog-filters/catalogHooks';
import { useCart } from '@/features/cart/useCartStore';
import AppImage from '@/shared/ui/AppImage';
import SEO from '@/shared/ui/SEO';
import Spinner from '@/shared/ui/Spinner';
import { IconArrowLeft } from '@/shared/icons/ActionIcons';
import MayReservation from '@/entities/product/MayReservation';
import ProductActionsBar from '@/entities/product/ProductActionsBar';
import { t } from '@/config/locales';
import { restaurantConfig } from '@/config/restaurant.config';

export default function PublicProductDetail() {
  const { id } = useParams<{ id: string }>();
  const { agregarAlCarrito } = useCart();

  const { data: product, isLoading: loadingProduct, error: errorProduct } = useProduct(id || '');
  const { data: categories = [], isLoading: loadingCategories } = useCategories();

  const [quantity, setQuantity] = useState(1);

  const categoryObj = categories.find(
    (c) => (c.id || '').toLowerCase() === (product?.categoria || '').toLowerCase()
  );
  const categoryName = categoryObj?.nombre || t.catalog.category;
  const categoryUrl = product ? `/category/${product.categoria}` : '/';

  const handleShare = async () => {
    if (!product) return;
    const shareData = {
      title: `${product.nombre} | ${restaurantConfig.brand.name}`,
      text: product.descripcion || `Check out ${product.nombre} at ${restaurantConfig.brand.name}.`,
      url: window.location.href,
    };

    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          console.error('Error sharing:', err);
        }
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href);
        toast.success('Link copied to clipboard!');
      } catch (err) {
        console.error('Error copying to clipboard:', err);
        toast.error('Could not copy link.');
      }
    }
  };

  const handleAddToCart = () => {
    if (!product) return;
    if (product.stock === 0) {
      toast.error(t.catalog.noStockAvailable);
      return;
    }

    agregarAlCarrito({ ...product, cantidad: quantity });
    toast.success(t.catalog.addedToCart(quantity, product.nombre));
  };

  const increment = () => {
    if (product && quantity < product.stock) {
      setQuantity((prev) => prev + 1);
    }
  };

  const decrement = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  if (loadingProduct || loadingCategories) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-gray-50 dark:bg-[#1a1c21]">
        <Spinner variant="inline" label={t.common.loading} />
      </div>
    );
  }

  if (errorProduct || !product) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 bg-gray-50 dark:bg-[#1a1c21] text-center">
        <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-4">
          {t.catalog.itemNotFound}
        </h2>
        <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md">
          {t.catalog.itemNotFoundDesc}
        </p>
        <Link
          to="/"
          className="bg-brand-red text-white px-6 py-3 rounded-2xl font-bold hover:opacity-90 transition-all shadow-lg"
        >
          {t.cart.backToMenu}
        </Link>
      </div>
    );
  }

  const hasLowStock = product.stock > 0 && product.stock < 5;
  const isOutOfStock = product.stock === 0;

  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.nombre,
    description: product.descripcion || product.nombre,
    image: product.imagenUrl,
    offers: {
      '@type': 'Offer',
      price: product.precio,
      priceCurrency: restaurantConfig.business.currencyCode,
      availability: product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      seller: {
        '@type': 'Restaurant',
        name: restaurantConfig.brand.name,
      },
    },
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#1a1c21] transition-colors duration-300 py-12 px-4">
      <SEO
        title={`${product.nombre} | ${restaurantConfig.brand.name}`}
        description={product.descripcion || `${product.nombre} at ${restaurantConfig.brand.name}.`}
        image={product.imagenUrl}
        schema={productSchema}
      />

      <div className="container mx-auto max-w-6xl">
        {}
        <Link
          to={categoryUrl}
          className="inline-flex items-center text-gray-500 dark:text-gray-400 hover:text-brand-red dark:hover:text-brand-red mb-8 transition-colors font-bold gap-2 animate-fade-in-up"
        >
          <IconArrowLeft size={14} /> {t.common.back} to {categoryName}
        </Link>

        {}
        <div className="bg-white dark:bg-brand-black rounded-4xl border border-gray-100 dark:border-white/5 shadow-2xl overflow-hidden p-6 md:p-12 animate-fade-in-up delay-100">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
            {}
            <div className="lg:col-span-6">
              <div className="rounded-3xl overflow-hidden shadow-lg border border-gray-100 dark:border-white/5 aspect-3/2 bg-gray-100 dark:bg-[#2d3038] relative">
                <AppImage
                  src={product.imagenUrl}
                  alt={product.nombre}
                  aspect="3/2"
                  className="w-full h-full object-cover"
                />

                {isOutOfStock && (
                  <div className="absolute inset-0 bg-white/60 dark:bg-black/60 backdrop-blur-[2px] flex items-center justify-center p-4">
                    <span className="bg-red-500 text-white px-6 py-2.5 rounded-full text-sm font-black uppercase tracking-widest shadow-xl ring-4 ring-red-500/20 animate-pulse">
                      {t.common.outOfStock}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {}
            <div className="lg:col-span-6 flex flex-col justify-between">
              <div>
                {}
                <div className="flex items-center gap-3 mb-4">
                  <span className="inline-block bg-brand-red/10 dark:bg-brand-red/20 text-brand-red dark:text-red-400 text-xs font-black uppercase tracking-widest px-4 py-1.5 rounded-full">
                    {categoryName}
                  </span>

                  {isOutOfStock ? (
                    <span className="bg-red-100 dark:bg-red-950/40 text-red-600 dark:text-red-400 text-xs font-bold px-3 py-1 rounded-full">
                      {t.common.outOfStock}
                    </span>
                  ) : hasLowStock ? (
                    <span className="bg-amber-100 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 text-xs font-bold px-3 py-1 rounded-full">
                      {t.catalog.lowStockLeft(product.stock)}
                    </span>
                  ) : (
                    <span className="bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 text-xs font-bold px-3 py-1 rounded-full">
                      {t.common.available}
                    </span>
                  )}
                </div>

                {}
                <h1 className="text-3xl md:text-5xl font-black text-gray-900 dark:text-white leading-tight font-questrial tracking-tight mb-6">
                  {product.nombre}
                </h1>

                {}
                <div className="mb-6">
                  <span className="block text-[10px] text-gray-600 dark:text-gray-400 uppercase tracking-widest font-bold mb-1">
                    {t.catalog.price}
                  </span>
                  <span className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white font-questrial tracking-tighter">
                    {restaurantConfig.business.currencySymbol}{product.precio.toFixed(2)}
                  </span>
                </div>

                {}
                <div className="prose dark:prose-invert max-w-none text-gray-600 dark:text-gray-400 leading-relaxed font-medium mb-8 text-base md:text-lg border-t border-gray-100 dark:border-white/5 pt-6">
                  {product.descripcion || 'No description available for this item.'}
                </div>
              </div>

              {}
              <MayReservation product={product} />

              {}
              <ProductActionsBar
                isOutOfStock={isOutOfStock}
                quantity={quantity}
                stock={product.stock}
                onIncrement={increment}
                onDecrement={decrement}
                onAddToCart={handleAddToCart}
                onShare={handleShare}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

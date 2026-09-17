import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { toast } from 'sonner';

import { useProduct, useCategories } from '@/modules/catalog/hooks/catalogHooks';
import { useCart } from '@/modules/cart/context/CartProvider';
import AppImage from '@/shared/ui/AppImage';
import SEO from '@/shared/ui/SEO';
import Spinner from '@/shared/ui/Spinner';
import { IconArrowLeft, IconPlus } from '@/shared/icons/ActionIcons';
import { t } from '@/config/locales';
import { restaurantConfig } from '@/config/restaurant.config';

// Custom Minus icon to maintain consistency with project icons
const IconMinus: React.FC<React.SVGProps<SVGSVGElement> & { size?: number | string }> = ({
  size = 24,
  ...props
}) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

// Custom Share icon (Share nodes)
const IconShare: React.FC<React.SVGProps<SVGSVGElement> & { size?: number | string }> = ({
  size = 24,
  ...props
}) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <circle cx="18" cy="5" r="3" />
    <circle cx="6" cy="12" r="3" />
    <circle cx="18" cy="19" r="3" />
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
  </svg>
);

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
      <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 dark:bg-[#1a1c21]">
        <Spinner label={t.common.loading} />
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
        {/* BACK BUTTON */}
        <Link
          to={categoryUrl}
          className="inline-flex items-center text-gray-500 dark:text-gray-400 hover:text-brand-red dark:hover:text-brand-red mb-8 transition-colors font-bold gap-2 animate-fade-in-up"
        >
          <IconArrowLeft size={14} /> {t.common.back} to {categoryName}
        </Link>

        {/* MAIN CONTAINER */}
        <div className="bg-white dark:bg-brand-black rounded-4xl border border-gray-100 dark:border-white/5 shadow-2xl overflow-hidden p-6 md:p-12 animate-fade-in-up delay-100">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
            {/* LEFT COLUMN: IMAGE */}
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

            {/* RIGHT COLUMN: DETAILS & ACTIONS */}
            <div className="lg:col-span-6 flex flex-col justify-between">
              <div>
                {/* Category Badge */}
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

                {/* Name */}
                <h1 className="text-3xl md:text-5xl font-black text-gray-900 dark:text-white leading-tight font-questrial tracking-tight mb-6">
                  {product.nombre}
                </h1>

                {/* Price */}
                <div className="mb-6">
                  <span className="block text-[10px] text-gray-600 dark:text-gray-400 uppercase tracking-widest font-bold mb-1">
                    {t.catalog.price}
                  </span>
                  <span className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white font-questrial tracking-tighter">
                    {restaurantConfig.business.currencySymbol}{product.precio.toFixed(2)}
                  </span>
                </div>

                {/* Description */}
                <div className="prose dark:prose-invert max-w-none text-gray-600 dark:text-gray-400 leading-relaxed font-medium mb-8 text-base md:text-lg border-t border-gray-100 dark:border-white/5 pt-6">
                  {product.descripcion || 'No description available for this item.'}
                </div>
              </div>

              {/* Special reservation */}
              

              {/* Actions */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mt-auto pt-6 border-t border-gray-100 dark:border-white/5">
                {!isOutOfStock ? (
                  <>
                    {/* Quantity selector */}
                    <div className="flex items-center justify-between bg-gray-100 dark:bg-[#2d3038] rounded-2xl p-1.5 min-w-35 border border-gray-200/50 dark:border-white/5">
                      <button
                        onClick={decrement}
                        disabled={quantity <= 1}
                        className="w-11 h-11 flex items-center justify-center rounded-xl hover:bg-white dark:hover:bg-[#1a1c21] text-gray-500 hover:text-brand-red disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-gray-500 transition-all active:scale-90"
                        aria-label={t.common.decreaseQuantity}
                      >
                        <IconMinus size={18} />
                      </button>
                      <span className="text-lg font-black text-gray-900 dark:text-white font-questrial min-w-8 text-center">
                        {quantity}
                      </span>
                      <button
                        onClick={increment}
                        disabled={quantity >= product.stock}
                        className="w-11 h-11 flex items-center justify-center rounded-xl hover:bg-white dark:hover:bg-[#1a1c21] text-gray-500 hover:text-brand-red disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-gray-500 transition-all active:scale-90"
                        aria-label={t.common.increaseQuantity}
                      >
                        <IconPlus size={18} />
                      </button>
                    </div>

                    {/* Add to Cart */}
                    <button
                      onClick={handleAddToCart}
                      className="flex-1 bg-brand-red text-white hover:bg-brand-red/90 px-8 py-4 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-3 transition-all duration-300 active:scale-95 shadow-lg shadow-brand-red/20 text-sm"
                    >
                      <IconPlus size={18} strokeWidth="3" />
                      {t.catalog.addToCart}
                    </button>
                  </>
                ) : (
                  <button
                    disabled
                    className="flex-1 bg-gray-100 dark:bg-white/5 text-gray-400 dark:text-gray-600 py-4 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-3 cursor-not-allowed text-sm"
                  >
                    {t.common.outOfStock}
                  </button>
                )}

                {/* Share */}
                <button
                  onClick={handleShare}
                  className="bg-gray-100 dark:bg-[#2d3038] text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/10 px-5 py-4 rounded-2xl transition-all duration-300 active:scale-95 flex items-center justify-center border border-gray-200/50 dark:border-white/5"
                  title={t.common.shareItem}
                >
                  <IconShare size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

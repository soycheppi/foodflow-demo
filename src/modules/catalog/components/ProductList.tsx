import { useState, useMemo, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';

import { IconArrowLeft, IconSearch } from '@/shared/icons/ActionIcons';
import { useCartStore } from '@/modules/cart/context/CartProvider';

import ProductCard from './ProductCard';
import { useCategories, useProductsByCategory } from '@/modules/catalog/hooks/catalogHooks';
import { t } from '@/config/locales';

export default function ProductList() {
  const { categoria } = useParams<{ categoria: string }>();
  const agregarAlCarrito = useCartStore((s) => s.agregarAlCarrito);

  const { data: categories = [], isLoading: loadingCategories } = useCategories();
  const {
    data: productos = [],
    isLoading: loadingProducts,
    error: errorProds,
  } = useProductsByCategory(categoria || '');

  const [searchTerm, setSearchTerm] = useState('');

  const categoryObj = useMemo(
    () => categories.find((c) => (c.id || '').toLowerCase() === (categoria || '').toLowerCase()),
    [categories, categoria]
  );
  const visibleName = categoryObj?.nombre || categoria;

  const filteredProducts = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) return productos;
    return productos.filter(
      (p) =>
        p.nombre.toLowerCase().includes(term) ||
        p.descripcion?.toLowerCase().includes(term)
    );
  }, [productos, searchTerm]);

  const handleAddToCart = useCallback(
    (item: Parameters<typeof agregarAlCarrito>[0]) => {
      agregarAlCarrito(item);
    },
    [agregarAlCarrito]
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#1a1c21] transition-colors duration-300">
      {/* Category Hero / Header */}
      <section className="relative pt-12 pb-16 px-4">
        <div className="container mx-auto relative z-10">
          <Link
            to="/"
            className="inline-flex items-center text-gray-500 dark:text-gray-400 hover:text-brand-red dark:hover:text-brand-red mb-8 transition-colors font-bold gap-2"
          >
            <IconArrowLeft size={14} /> {t.common.back} to {t.nav.home}
          </Link>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
            <div>
              <h1 className="text-4xl md:text-6xl font-black text-gray-900 dark:text-white font-questrial tracking-tight animate-fade-in-up">
                {visibleName}
              </h1>
              <p className="text-gray-500 dark:text-gray-400 mt-2 text-lg animate-fade-in-up delay-100 italic">
                {t.catalog.featuredCategoriesSubtitle}
              </p>
            </div>

            {/* In-category search */}
            <div className="w-full md:w-80 relative group animate-fade-in-up delay-200">
              <input
                type="text"
                placeholder={t.catalog.searchInCategoryPlaceholder}
                aria-label={t.catalog.searchInCategoryPlaceholder}
                className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white dark:bg-[#2d3038] border border-gray-200 dark:border-white/5 focus:border-brand-red dark:focus:border-brand-red shadow-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <IconSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-brand-red transition-colors" />
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="container mx-auto px-4 pb-24">
        {loadingProducts || loadingCategories ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div
                key={i}
                className="h-96 bg-gray-200 dark:bg-white/5 rounded-3xl animate-pulse"
              ></div>
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((prod, index) => (
                  <ProductCard
                    key={prod.id}
                    product={prod}
                    onAddToCart={handleAddToCart}
                    index={index}
                  />
                ))
              ) : (
                <div className="col-span-full text-center py-20 text-gray-400 dark:text-gray-500 bg-white dark:bg-[#1a1c21] rounded-3xl border-2 border-dashed border-gray-200 dark:border-white/5">
                  <p className="text-xl">
                    {t.catalog.noProductsFound}
                  </p>
                </div>
              )}
            </div>
            {errorProds && (
              <div className="text-red-500 py-12 text-center font-bold text-xl">
                {(errorProds as Error).message}
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}

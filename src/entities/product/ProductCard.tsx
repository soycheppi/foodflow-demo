import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import AppImage from '@/shared/ui/AppImage';
import { IconPlus } from '@/shared/icons/ActionIcons';
import { Product } from '@/core/types/catalog';
import type { CartItem } from '@/core/types/order';
import { formatCurrency } from '@/core/logic/pricing';
import { t } from '@/config/locales';

const stripHtml = (html: string = ''): string => html.replace(/<[^>]*>/g, '');

interface ProductCardProps {
  product: Product;
  onAddToCart: (item: CartItem) => void;
  index?: number;
}

const ProductCard: React.FC<ProductCardProps> = memo(({ product, onAddToCart }) => {
  const descriptionText = stripHtml(product.descripcion || '');

  const handleAddClick = () => {
    onAddToCart?.({ ...product, cantidad: 1 });
  };

  const outOfStock = product.stock === 0;

  return (
    <div className="bg-white dark:bg-[#1a1c21] rounded-4xl shadow-sm hover:shadow-2xl transition-all duration-500 h-full flex flex-col overflow-hidden group border border-gray-100 dark:border-white/5 hover:-translate-y-2">
      {}
      <Link to={`/product/${product.id}`} className="block overflow-hidden relative">
        <AppImage
          src={product.imagenUrl}
          alt={product.nombre}
          aspect="3/2"
          className="group-hover:scale-110"
        >
          <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

          {outOfStock && (
            <div className="absolute inset-0 bg-white/60 dark:bg-black/60 backdrop-blur-[2px] flex items-center justify-center p-4">
              <span className="bg-red-500 text-white px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest shadow-xl ring-4 ring-red-500/20">
                {t.common.outOfStock}
              </span>
            </div>
          )}
        </AppImage>
      </Link>

      {}
      <div className="p-6 flex flex-col flex-1">
        <div className="flex-1 mb-6">
          <div className="flex justify-between items-start gap-2 mb-2">
            <Link to={`/product/${product.id}`} className="block w-full">
              <h3 className="font-black text-xl text-gray-900 dark:text-white leading-tight group-hover:text-brand-red dark:group-hover:text-red-400 transition-colors font-questrial tracking-tight">
                {product.nombre}
              </h3>
            </Link>
          </div>
          <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-3 leading-relaxed font-medium mb-4">
            {descriptionText}
          </p>
        </div>

        {}
        <div className="flex items-center justify-between pt-4 border-t border-gray-50 dark:border-white/5 mt-auto">
          <div>
            <span className="block text-[10px] text-gray-600 dark:text-gray-400 uppercase tracking-widest font-bold mb-0.5">
              {t.catalog.price}
            </span>
            <span className="text-2xl font-black text-gray-900 dark:text-white font-questrial tracking-tighter">
              {formatCurrency(product.precio)}
            </span>
          </div>

          {!outOfStock ? (
            <button
              className="bg-brand-red/10 dark:bg-brand-red/20 text-brand-red dark:text-red-400 hover:bg-brand-red hover:text-white dark:hover:bg-brand-red dark:hover:text-white px-5 py-2.5 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all duration-300 active:scale-95 text-sm"
              onClick={handleAddClick}
              aria-label={t.catalog.addToCart}
            >
              <IconPlus size={18} strokeWidth="3" />
              {t.catalog.addToCart}
            </button>
          ) : (
            <button
              disabled
              className="w-full md:w-auto bg-gray-100 dark:bg-white/5 text-gray-400 dark:text-gray-600 px-6 py-3 rounded-2xl font-bold flex items-center justify-center gap-3 cursor-not-allowed"
            >
              <span className="text-sm">{t.common.outOfStock}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
});

ProductCard.displayName = 'ProductCard';

export default ProductCard;

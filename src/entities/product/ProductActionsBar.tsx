import React from 'react';
import { IconPlus } from '@/shared/icons/ActionIcons';
import { t } from '@/config/locales';

interface ProductActionsBarProps {
  isOutOfStock: boolean;
  quantity: number;
  stock: number;
  onIncrement: () => void;
  onDecrement: () => void;
  onAddToCart: () => void;
  onShare: () => void;
}

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

const ProductActionsBar: React.FC<ProductActionsBarProps> = ({
  isOutOfStock,
  quantity,
  stock,
  onIncrement,
  onDecrement,
  onAddToCart,
  onShare,
}) => {
  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mt-auto pt-6 border-t border-gray-100 dark:border-white/5">
      {!isOutOfStock ? (
        <>
          <div className="flex items-center justify-between bg-gray-100 dark:bg-[#2d3038] rounded-2xl p-1.5 min-w-35 border border-gray-200/50 dark:border-white/5">
            <button
              onClick={onDecrement}
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
              onClick={onIncrement}
              disabled={quantity >= stock}
              className="w-11 h-11 flex items-center justify-center rounded-xl hover:bg-white dark:hover:bg-[#1a1c21] text-gray-500 hover:text-brand-red disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-gray-500 transition-all active:scale-90"
              aria-label={t.common.increaseQuantity}
            >
              <IconPlus size={18} />
            </button>
          </div>

          <button
            onClick={onAddToCart}
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

      <button
        onClick={onShare}
        className="bg-gray-100 dark:bg-[#2d3038] text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/10 px-5 py-4 rounded-2xl transition-all duration-300 active:scale-95 flex items-center justify-center border border-gray-200/50 dark:border-white/5"
        title={t.common.shareItem}
      >
        <IconShare size={18} />
      </button>
    </div>
  );
};

export default ProductActionsBar;

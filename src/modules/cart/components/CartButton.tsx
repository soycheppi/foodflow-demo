import { useEffect, useRef, useState, memo } from 'react';
import { IconShoppingBag } from '@/shared/icons/CommerceIcons';
import { t } from '@/config/locales';

interface CartButtonProps {
  onClick: () => void;
  totalUnits: number;
  className?: string;
}

const CartButton: React.FC<CartButtonProps> = memo(({ onClick, totalUnits, className }) => {
  const [animate, setAnimate] = useState(false);
  const prevCount = useRef(totalUnits);

  useEffect(() => {
    if (totalUnits !== prevCount.current) {
      setAnimate(true);
      const timer = setTimeout(() => setAnimate(false), 300);
      prevCount.current = totalUnits;
      return () => clearTimeout(timer);
    }
  }, [totalUnits]);

  const hasProducts = totalUnits > 0;

  return (
    <button
      type="button"
      data-testid="cart-button"
      className={`${className || ''} relative group flex items-center justify-center p-3 rounded-xl transition-all duration-300 bg-brand-red text-white ${animate ? 'animate-cart-bump' : 'active:scale-95'}`}
      aria-label={t.cart.title}
      onClick={onClick}
    >
      <IconShoppingBag size={18} className="transform group-hover:scale-110 transition-transform" />
      {hasProducts && (
        <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-brand-black dark:bg-white text-white dark:text-gray-900 text-[10px] font-black shadow-xl ring-2 ring-white dark:ring-[#111317]">
          {totalUnits}
        </span>
      )}
    </button>
  );
});

CartButton.displayName = 'CartButton';

export default CartButton;

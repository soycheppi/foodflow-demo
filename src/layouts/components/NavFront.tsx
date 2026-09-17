import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { IconSun, IconMoon, IconBars } from '@/shared/icons/ThemeIcons';
import { useTheme } from '@/context/ThemeProvider';
import { PATHS } from '@/routes/paths';

import { useCartStore } from '@/modules/cart/context/CartProvider';
import CartDrawer, { CartDrawerHandle } from '@/modules/cart/components/CartDrawer';
import CartButton from '@/modules/cart/components/CartButton';
import { BrandLogoIcon } from '@/shared/icons/BrandLogoIcon';
import HeaderShell from '@/layouts/components/HeaderShell';
import { restaurantConfig } from '@/config/restaurant.config';
import { t } from '@/config/locales';

interface NavFrontProps {
  toggleSidebar?: () => void;
  showSidebarButton?: boolean;
}

export default function NavFront({ toggleSidebar, showSidebarButton }: NavFrontProps) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';
  const offcanvasRef = useRef<CartDrawerHandle>(null);
  const totalArticulos = useCartStore((s) => s.articulos.reduce((acc, item) => acc + item.cantidad, 0));

  const openDrawer = () => {
    offcanvasRef.current?.show();
  };

  return (
    <>
      <HeaderShell transparent={false}>
        <div className="w-full h-full flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {showSidebarButton && (
              <button
                onClick={toggleSidebar}
                className="p-2.5 -ml-2 rounded-xl text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 md:hidden transition-all"
                aria-label={t.common.toggleNavigation}
              >
                <IconBars size={20} />
              </button>
            )}

            <Link
              to={PATHS.HOME}
              className="flex items-center gap-3 no-underline group cursor-pointer"
            >
              <div className="w-10 h-10 bg-brand-red text-white rounded-2xl flex items-center justify-center shadow-lg group-hover:rotate-6 group-hover:scale-105 transition-all duration-300 p-2">
                <BrandLogoIcon size={22} className="text-white" />
              </div>
              <span className="font-questrial text-xl md:text-2xl tracking-tighter text-gray-900 dark:text-white font-black group-hover:text-brand-red transition-colors duration-300">
                {restaurantConfig.brand.name}
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-2 sm:gap-4 h-full">
            <button
              onClick={toggleTheme}
              className="p-3 rounded-2xl text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#20232b] transition-all flex items-center justify-center"
              aria-label={isDark ? t.nav.lightMode : t.nav.darkMode}
            >
              {isDark ? <IconSun size={20} className="text-amber-400" /> : <IconMoon size={20} />}
            </button>

            <CartButton totalUnits={totalArticulos} onClick={openDrawer} />
          </div>
        </div>
      </HeaderShell>

      <CartDrawer ref={offcanvasRef} />
    </>
  );
}

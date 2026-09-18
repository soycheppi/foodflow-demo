import { Link, useNavigate } from 'react-router-dom';
import { IconSun, IconMoon, IconBars } from '@/shared/icons/ThemeIcons';
import { IconUser } from '@/shared/icons/MiscIcons';
import { IconLogout } from '@/shared/icons/NavIcons';
import { useTheme } from '@/app/providers/useTheme';
import { PATHS } from '@/app/routes/paths';

import { useCartStore } from '@/features/cart/useCartStore';
import { useAuth } from '@/features/auth/useAuth';
import CartDrawer from '@/widgets/cart-drawer/CartDrawer';
import CartButton from '@/features/cart/CartButton';
import { BrandLogoIcon } from '@/shared/icons/BrandLogoIcon';
import HeaderShell from '@/widgets/layouts/components/HeaderShell';
import { restaurantConfig } from '@/config/restaurant.config';
import { t } from '@/config/locales';

interface NavFrontProps {
  toggleSidebar?: () => void;
  showSidebarButton?: boolean;
}

export default function NavFront({ toggleSidebar, showSidebarButton }: NavFrontProps) {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';
  const openCart = useCartStore((s) => s.openCart);
  const totalArticulos = useCartStore((s) => s.articulos.reduce((acc, item) => acc + item.cantidad, 0));

  const handleLogout = async () => {
    if (logout) {
      await logout();
    }
    navigate(PATHS.HOME);
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
              className="p-2.5 rounded-xl bg-gray-50 dark:bg-white/5 text-gray-500 dark:text-gray-400 hover:text-brand-red dark:hover:text-red-400 transition-all border border-transparent hover:border-gray-200 dark:hover:border-white/10"
              title={t.nav.switchTheme}
              aria-label={t.nav.switchTheme}
            >
              {isDark ? <IconSun size={18} /> : <IconMoon size={18} />}
            </button>

            {currentUser ? (
              <div className="flex items-center gap-2 sm:gap-3">
                {!showSidebarButton && (
                  <Link
                    to={PATHS.ADMIN.ROOT}
                    className="hidden sm:flex items-center bg-brand-black dark:bg-white text-white dark:text-gray-900 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest hover:opacity-80 transition-all no-underline"
                  >
                    {t.nav.adminPanel}
                  </Link>
                )}

                <div className="h-10 w-px bg-gray-100 dark:bg-white/5 mx-1 hidden sm:block" />

                <div className="flex items-center gap-3 pl-1">
                  <span className="text-gray-500 dark:text-gray-400 hidden lg:block text-xs font-black uppercase tracking-widest">
                    {currentUser.isAdmin ? 'ADMIN' : currentUser.displayName?.split(' ')[0]}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="p-2.5 text-gray-400 hover:text-brand-red transition-all rounded-xl hover:bg-red-50 dark:hover:bg-red-900/10"
                    title={t.nav.signOut}
                    aria-label={t.nav.signOut}
                  >
                    <IconLogout size={16} />
                  </button>
                </div>
              </div>
            ) : (
              <Link
                to={PATHS.LOGIN}
                className="flex items-center gap-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest hover:opacity-80 transition-all"
                title={t.auth.signIn}
              >
                <IconUser size={14} className="mb-0.5" />
                <span className="hidden sm:inline">{t.auth.signIn}</span>
              </Link>
            )}

            <CartButton
              onClick={openCart}
              totalUnits={totalArticulos}
              className="hover:rotate-12 transition-transform"
            />
          </div>
        </div>
      </HeaderShell>
      <CartDrawer />
    </>
  );
}

export const PATHS = {

  HOME: '/',
  LOGIN: '/login',
  ABOUT: '/about',
  CATEGORY: '/category/:category',
  PRODUCT: '/product/:id',
  CHECKOUT: '/checkout',

  ADMIN: {
    ROOT: '/admin',
    CATEGORIES: '/admin/categories',
    CATEGORIES_NEW: '/admin/categories/create',
    CATEGORIES_EDIT: '/admin/categories/edit/:id',
    PRODUCTS_ROOT: '/admin/products',
    PRODUCTS: '/admin/products/:category',
    PRODUCTS_NEW: '/admin/products/:category/create',
    PRODUCTS_EDIT: '/admin/products/:category/edit/:id',
    SETTINGS: '/admin/settings',
    BANNERS: '/admin/banners',
    BANNERS_NEW: '/admin/banners/create',
    BANNERS_EDIT: '/admin/banners/edit/:id',
    USERS: '/admin/users',
    VALIDATE_POINTS: '/admin/validate-points',
  },
} as const;

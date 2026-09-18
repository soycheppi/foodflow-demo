import { Category, Product } from '@/core/types/catalog';
import { Banner } from '@/core/types/banner';
import { MOCK_CATEGORIES, MOCK_PRODUCTS, MOCK_BANNERS } from './mockCatalog';

const MOCK_CATS_KEY = 'foodflow_mock_categories';
const MOCK_PRODS_KEY = 'foodflow_mock_products';
const MOCK_BANNERS_KEY = 'foodflow_mock_banners';

const memoryFallback = new Map<string, string>();

const getStored = <T>(key: string, fallback: T): T => {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : fallback;
    }
  } catch (err) {
    console.warn(`[Storage Fallback] Access denied or failed for ${key}, using in-memory store.`, err);
  }
  const inMemory = memoryFallback.get(key);
  return inMemory ? JSON.parse(inMemory) : fallback;
};

const setStored = <T>(key: string, value: T): void => {
  const serialized = JSON.stringify(value);
  memoryFallback.set(key, serialized);

  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(key, serialized);
    }
  } catch (err) {
    console.warn(`[Storage Fallback] Could not write ${key} to localStorage, retained in-memory.`, err);
  }
};

export const mockCatalogService = {
  getCategories: async (): Promise<Category[]> => {
    return getStored<Category[]>(MOCK_CATS_KEY, MOCK_CATEGORIES).sort((a, b) => a.orden - b.orden);
  },

  getAllProducts: async (): Promise<Product[]> => {
    return getStored<Product[]>(MOCK_PRODS_KEY, MOCK_PRODUCTS).sort((a, b) => a.orden - b.orden);
  },

  getProductById: async (id: string): Promise<Product | null> => {
    const prods = getStored<Product[]>(MOCK_PRODS_KEY, MOCK_PRODUCTS);
    return prods.find((p) => p.id === id) || null;
  },

  getProductsByCategory: async (categoryId: string): Promise<Product[]> => {
    const prods = getStored<Product[]>(MOCK_PRODS_KEY, MOCK_PRODUCTS);
    return prods.filter((p) => p.categoria === categoryId).sort((a, b) => a.orden - b.orden);
  },

  addCategory: async (cat: Omit<Category, 'orden'>): Promise<void> => {
    const cats = getStored<Category[]>(MOCK_CATS_KEY, MOCK_CATEGORIES);
    const newCat: Category = { ...cat, orden: cats.length + 1 };
    setStored(MOCK_CATS_KEY, [...cats, newCat]);
  },

  updateCategory: async (id: string, updates: Partial<Category>): Promise<void> => {
    const cats = getStored<Category[]>(MOCK_CATS_KEY, MOCK_CATEGORIES);
    setStored(
      MOCK_CATS_KEY,
      cats.map((c) => (c.id === id ? { ...c, ...updates } : c))
    );
  },

  deleteCategory: async (id: string): Promise<void> => {
    const cats = getStored<Category[]>(MOCK_CATS_KEY, MOCK_CATEGORIES);
    setStored(MOCK_CATS_KEY, cats.filter((c) => c.id !== id));
  },

  addProduct: async (prod: Omit<Product, 'id' | 'orden'>): Promise<void> => {
    const prods = getStored<Product[]>(MOCK_PRODS_KEY, MOCK_PRODUCTS);
    const newProd: Product = {
      ...prod,
      id: `prod-${Date.now()}`,
      orden: prods.length + 1,
    };
    setStored(MOCK_PRODS_KEY, [...prods, newProd]);
  },

  updateProduct: async (id: string, updates: Partial<Product>): Promise<void> => {
    const prods = getStored<Product[]>(MOCK_PRODS_KEY, MOCK_PRODUCTS);
    setStored(
      MOCK_PRODS_KEY,
      prods.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
  },

  deleteProduct: async (id: string): Promise<void> => {
    const prods = getStored<Product[]>(MOCK_PRODS_KEY, MOCK_PRODUCTS);
    setStored(MOCK_PRODS_KEY, prods.filter((p) => p.id !== id));
  },

  getBanners: async (): Promise<Banner[]> => {
    return getStored<Banner[]>(MOCK_BANNERS_KEY, MOCK_BANNERS).filter((b) => b.active).sort((a, b) => a.order - b.order);
  },

  getAllBanners: async (): Promise<Banner[]> => {
    return getStored<Banner[]>(MOCK_BANNERS_KEY, MOCK_BANNERS).sort((a, b) => a.order - b.order);
  },

  addBanner: async (banner: Omit<Banner, 'id' | 'order' | 'createdAt'>): Promise<void> => {
    const banners = getStored<Banner[]>(MOCK_BANNERS_KEY, MOCK_BANNERS);
    const newBanner: Banner = {
      ...banner,
      id: `banner-${Date.now()}`,
      order: banners.length + 1,
      createdAt: new Date(),
    };
    setStored(MOCK_BANNERS_KEY, [...banners, newBanner]);
  },

  updateBanner: async (id: string, updates: Partial<Banner>): Promise<void> => {
    const banners = getStored<Banner[]>(MOCK_BANNERS_KEY, MOCK_BANNERS);
    setStored(
      MOCK_BANNERS_KEY,
      banners.map((b) => (b.id === id ? { ...b, ...updates } : b))
    );
  },

  deleteBanner: async (id: string): Promise<void> => {
    const banners = getStored<Banner[]>(MOCK_BANNERS_KEY, MOCK_BANNERS);
    setStored(MOCK_BANNERS_KEY, banners.filter((b) => b.id !== id));
  },
};

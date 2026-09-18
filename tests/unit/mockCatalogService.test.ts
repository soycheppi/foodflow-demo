import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mockCatalogService } from '@/adapters/mock/mockCatalogService';

describe('MockCatalogService (Autonomous Zero-Backend Engine)', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('retrieves default categories ordered by orden asc', async () => {
    const categories = await mockCatalogService.getCategories();
    expect(categories.length).toBeGreaterThan(0);
    for (let i = 0; i < categories.length - 1; i++) {
      expect(categories[i].orden).toBeLessThanOrEqual(categories[i + 1].orden);
    }
  });

  it('retrieves products by category correctly', async () => {
    const categories = await mockCatalogService.getCategories();
    const firstCat = categories[0];
    const products = await mockCatalogService.getProductsByCategory(firstCat.id);

    expect(Array.isArray(products)).toBe(true);
    products.forEach((p) => {
      expect(p.categoria).toBe(firstCat.id);
    });
  });

  it('adds, updates and deletes a product in mock storage', async () => {
    const initialProducts = await mockCatalogService.getAllProducts();
    const initialCount = initialProducts.length;

    await mockCatalogService.addProduct({
      nombre: 'Mega Cheddar Deluxe',
      descripcion: 'Burger with triple cheddar',
      precio: 1500,
      stock: 25,
      categoria: 'cat-hamburguesas',
      imagenUrl: 'https://images.unsplash.com/test',
      permiteReserva: false,
    });

    const productsAfter = await mockCatalogService.getAllProducts();
    expect(productsAfter.length).toBe(initialCount + 1);

    const created = productsAfter.find((p) => p.nombre === 'Mega Cheddar Deluxe');
    expect(created).toBeDefined();

    if (created) {
      await mockCatalogService.updateProduct(created.id, { precio: 1750 });
      const updated = await mockCatalogService.getProductById(created.id);
      expect(updated?.precio).toBe(1750);

      await mockCatalogService.deleteProduct(created.id);
      const deleted = await mockCatalogService.getProductById(created.id);
      expect(deleted).toBeNull();
    }
  });

  it('handles banner CRUD operations in mock storage', async () => {
    const banners = await mockCatalogService.getAllBanners();
    expect(Array.isArray(banners)).toBe(true);

    await mockCatalogService.addBanner({
      title: 'Promo 2x1 Viernes',
      description: 'En todas las burgers',
      active: true,
      imageUrl: '',
    });

    const bannersAfter = await mockCatalogService.getAllBanners();
    const createdBanner = bannersAfter.find((b) => b.title === 'Promo 2x1 Viernes');
    expect(createdBanner).toBeDefined();

    if (createdBanner) {
      await mockCatalogService.updateBanner(createdBanner.id, { active: false });
      const activeBanners = await mockCatalogService.getBanners();
      expect(activeBanners.find((b) => b.id === createdBanner.id)).toBeUndefined();

      await mockCatalogService.deleteBanner(createdBanner.id);
      const remainingBanners = await mockCatalogService.getAllBanners();
      expect(remainingBanners.find((b) => b.id === createdBanner.id)).toBeUndefined();
    }
  });

  it('updates and deletes categories in mock storage', async () => {
    await mockCatalogService.addCategory({
      id: 'cat-to-delete',
      nombre: 'Temporary Category',
      imagenUrl: '',
    });

    await mockCatalogService.updateCategory('cat-to-delete', { nombre: 'Renamed Category' });
    let cats = await mockCatalogService.getCategories();
    expect(cats.find((c) => c.id === 'cat-to-delete')?.nombre).toBe('Renamed Category');

    await mockCatalogService.deleteCategory('cat-to-delete');
    cats = await mockCatalogService.getCategories();
    expect(cats.find((c) => c.id === 'cat-to-delete')).toBeUndefined();
  });

  it('handles corrupted localStorage JSON gracefully with fallback', async () => {
    localStorage.setItem('foodflow_mock_categories', 'corrupted-invalid-json{{{');
    const categories = await mockCatalogService.getCategories();
    expect(categories.length).toBeGreaterThan(0);
  });

  it('handles localStorage quota/write errors gracefully', async () => {
    const spy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('QuotaExceededError');
    });

    await expect(
      mockCatalogService.addCategory({ id: 'cat-fail', nombre: 'Fail Cat', imagenUrl: '' })
    ).resolves.not.toThrow();

    spy.mockRestore();
  });

  it('falls back gracefully when storage is unavailable or access is denied', async () => {
    const originalLocalStorage = window.localStorage;
    Object.defineProperty(window, 'localStorage', {
      value: null,
      configurable: true,
      writable: true,
    });

    const categories = await mockCatalogService.getCategories();
    expect(categories.length).toBeGreaterThan(0);

    await expect(
      mockCatalogService.addCategory({ id: 'cat-no-storage', nombre: 'No Storage', imagenUrl: '' })
    ).resolves.not.toThrow();

    Object.defineProperty(window, 'localStorage', {
      value: originalLocalStorage,
      configurable: true,
      writable: true,
    });
  });

  it('falls back gracefully when storage access throws a SecurityError', async () => {
    Object.defineProperty(window, 'localStorage', {
      get: () => {
        throw new Error('SecurityError: The operation is insecure.');
      },
      configurable: true,
    });

    const categories = await mockCatalogService.getCategories();
    expect(categories.length).toBeGreaterThan(0);

    // Restaurar a un Storage mock normal
    const storageMock: Record<string, string> = {};
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: (k: string) => storageMock[k] ?? null,
        setItem: (k: string, v: string) => {
          storageMock[k] = v;
        },
        removeItem: (k: string) => {
          delete storageMock[k];
        },
        clear: () => {
          Object.keys(storageMock).forEach((k) => delete storageMock[k]);
        },
        length: 0,
        key: () => null,
      },
      configurable: true,
      writable: true,
    });
  });
});

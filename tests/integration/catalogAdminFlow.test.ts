import { describe, it, expect, beforeEach } from 'vitest';
import { mockCatalogService } from '@/adapters/mock/mockCatalogService';

describe('Catalog Administration & Store Front Sync (Integration)', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('allows admin to create a new category, assign dishes, and query storefront catalog seamlessly', async () => {
    // 1. Admin adds a new category "Postres Artesanales"
    const newCategory = {
      id: 'cat-postres',
      nombre: 'Postres Artesanales',
      imagenUrl: 'https://images.unsplash.com/desserts',
    };
    await mockCatalogService.addCategory(newCategory);

    const categories = await mockCatalogService.getCategories();
    const createdCat = categories.find((c) => c.id === 'cat-postres');
    expect(createdCat).toBeDefined();
    expect(createdCat?.nombre).toBe('Postres Artesanales');

    // 2. Admin adds products to the new category
    await mockCatalogService.addProduct({
      nombre: 'Tiramisú Clásico',
      descripcion: 'Italian recipe with espresso and mascarpone',
      precio: 950,
      stock: 12,
      categoria: 'cat-postres',
      imagenUrl: '',
      permiteReserva: true,
    });

    await mockCatalogService.addProduct({
      nombre: 'Cheesecake Frutos Rojos',
      descripcion: 'New York style cheesecake with red berries',
      precio: 1100,
      stock: 8,
      categoria: 'cat-postres',
      imagenUrl: '',
      permiteReserva: false,
    });

    // 3. Storefront queries dishes belonging to this new category
    const dessertProducts = await mockCatalogService.getProductsByCategory('cat-postres');
    expect(dessertProducts.length).toBe(2);
    expect(dessertProducts.map((p) => p.nombre)).toEqual(
      expect.arrayContaining(['Tiramisú Clásico', 'Cheesecake Frutos Rojos'])
    );

    // 4. Update stock and price
    const tiramisu = dessertProducts.find((p) => p.nombre === 'Tiramisú Clásico');
    expect(tiramisu).toBeDefined();
    if (tiramisu) {
      await mockCatalogService.updateProduct(tiramisu.id, { stock: 0, precio: 1050 });
      const updatedTiramisu = await mockCatalogService.getProductById(tiramisu.id);
      expect(updatedTiramisu?.stock).toBe(0);
      expect(updatedTiramisu?.precio).toBe(1050);
    }
  });
});

import { Category, Product } from '@/core/types/catalog';
import { mockCatalogService } from '@/adapters/mock/mockCatalogService';

export const getCategories = async (): Promise<Category[]> => {
  return mockCatalogService.getCategories();
};

export const getProductById = async (id: string): Promise<Product | null> => {
  return mockCatalogService.getProductById(id);
};

export const getProductsByCategory = async (categoryId: string): Promise<Product[]> => {
  return mockCatalogService.getProductsByCategory(categoryId);
};

export const getAllProducts = async (): Promise<Product[]> => {
  return mockCatalogService.getAllProducts();
};

export const updateCategoryOrder = async (_categories: Category[]): Promise<void> => {};

export const updateProductOrder = async (_products: Product[]): Promise<void> => {};

export const addCategory = async (cat: Omit<Category, 'orden'> & { id?: string }): Promise<void> => {
  return mockCatalogService.addCategory(cat as Omit<Category, 'orden'>);
};

export const updateCategory = async (id: string, updates: Partial<Category>): Promise<void> => {
  return mockCatalogService.updateCategory(id, updates);
};

export const deleteCategory = async (id: string): Promise<void> => {
  return mockCatalogService.deleteCategory(id);
};

export const addProduct = async (product: Omit<Product, 'orden' | 'creadoEl' | 'actualizadoEl'> & { id?: string }): Promise<void> => {
  return mockCatalogService.addProduct(product);
};

export const updateProduct = async (id: string, updates: Partial<Product>): Promise<void> => {
  return mockCatalogService.updateProduct(id, updates);
};

export const deleteProduct = async (id: string): Promise<void> => {
  return mockCatalogService.deleteProduct(id);
};

export const getPublishedBundle = async (): Promise<{
  categories: Category[];
  products: Product[];
} | null> => {
  const categories = await mockCatalogService.getCategories();
  const products = await mockCatalogService.getAllProducts();
  return { categories, products };
};

export const publishCatalogBundle = async (): Promise<void> => {};

export const getCatalogMetrics = async () => {
  const categories = await mockCatalogService.getCategories();
  const products = await mockCatalogService.getAllProducts();
  const total = products.length;
  const lowStock = products.filter((p) => p.stock < 5).length;
  const totalCats = categories.length;
  const usagePercentage = Math.round(((totalCats + total) / 200) * 100);
  return { total, lowStock, totalCats, usagePercentage };
};

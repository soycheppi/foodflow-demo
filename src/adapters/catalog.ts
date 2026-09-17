import { Category, Product } from '@/core/types/catalog';
import { mockCatalogService } from '@/adapters/mockCatalogService';

export const getCategories = async (): Promise<Category[]> => {
  return mockCatalogService.getCategories();
};

export const getAllProducts = async (): Promise<Product[]> => {
  return mockCatalogService.getAllProducts();
};

export const getProductsByCategory = async (categoryId: string): Promise<Product[]> => {
  return mockCatalogService.getProductsByCategory(categoryId);
};

export const getProductById = async (id: string): Promise<Product | null> => {
  return mockCatalogService.getProductById(id);
};

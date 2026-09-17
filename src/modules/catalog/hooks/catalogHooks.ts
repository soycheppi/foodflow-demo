import { useQuery } from '@tanstack/react-query';
import * as CatalogService from '@/adapters/catalog';

export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: CatalogService.getCategories,
    staleTime: 1000 * 60 * 60,
  });
};

export const useProductsByCategory = (categoryId: string) => {
  return useQuery({
    queryKey: ['products', categoryId],
    queryFn: () => CatalogService.getProductsByCategory(categoryId),
    enabled: Boolean(categoryId),
    staleTime: 1000 * 60 * 60,
  });
};

export const useAllProducts = () => {
  return useQuery({
    queryKey: ['all-products'],
    queryFn: CatalogService.getAllProducts,
    staleTime: 1000 * 60 * 60,
  });
};

export const useProduct = (id: string) => {
  return useQuery({
    queryKey: ['product', id],
    queryFn: () => CatalogService.getProductById(id),
    enabled: Boolean(id),
  });
};

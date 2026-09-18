import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Category, Product } from '@/core/types/catalog';
import * as CatalogService from '@/adapters/catalog';

export const useCategories = () => {
  const { data: bundle } = useCatalogBundle();

  return useQuery({
    queryKey: ['categories'],
    queryFn: CatalogService.getCategories,
    initialData: bundle?.categories,
    staleTime: 1000 * 60 * 60,
  });
};

export const useProductsByCategory = (categoryId: string) => {
  const { data: bundle } = useCatalogBundle();

  return useQuery({
    queryKey: ['products', categoryId],
    queryFn: () => CatalogService.getProductsByCategory(categoryId),
    initialData: bundle?.products.filter((p) => p.categoria === categoryId),
    enabled: Boolean(categoryId),
    staleTime: 1000 * 60 * 60,
  });
};

export const useAllProducts = () => {
  const { data: bundle } = useCatalogBundle();

  return useQuery({
    queryKey: ['all-products'],
    queryFn: CatalogService.getAllProducts,
    initialData: bundle?.products,
    staleTime: 1000 * 5,
  });
};

export const useProduct = (id: string) => {
  const { data: bundle } = useCatalogBundle();

  return useQuery({
    queryKey: ['product', id],
    queryFn: () => CatalogService.getProductById(id),
    initialData: bundle?.products.find((p) => p.id === id),
    enabled: Boolean(id),
  });
};

export const useUpdateCategoryOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: CatalogService.updateCategoryOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });
};

export const useUpdateProductOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: CatalogService.updateProductOrder,
    onSuccess: (_, variables) => {
      const firstProduct = variables[0];
      if (firstProduct) {
        queryClient.invalidateQueries({ queryKey: ['products', firstProduct.categoria] });
      }
    },
  });
};

export const useAddCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: CatalogService.addCategory,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['categories'] }),
  });
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Category> }) =>
      CatalogService.updateCategory(id, updates),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['categories'] }),
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: CatalogService.deleteCategory,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['categories'] }),
  });
};

export const useAddProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: CatalogService.addProduct,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['products', variables.categoria] });
      queryClient.invalidateQueries({ queryKey: ['catalog-metrics'] });
    },
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Product> }) =>
      CatalogService.updateProduct(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['all-products'] });
      queryClient.invalidateQueries({ queryKey: ['catalog-metrics'] });
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id }: { id: string; categoryId: string }) => CatalogService.deleteProduct(id),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['products', variables.categoryId] });
      queryClient.invalidateQueries({ queryKey: ['catalog-metrics'] });
    },
  });
};

export const useCatalogMetrics = () => {
  return useQuery({
    queryKey: ['catalog-metrics'],
    queryFn: CatalogService.getCatalogMetrics,
    staleTime: 1000 * 60 * 10,
  });
};

export const usePublishCatalog = () => {
  return useMutation({
    mutationFn: CatalogService.publishCatalogBundle,
  });
};

const useCatalogBundle = () => {
  return useQuery({
    queryKey: ['catalog-bundle'],
    queryFn: CatalogService.getPublishedBundle,
  });
};

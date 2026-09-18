import { Banner } from '@/core/types/banner';
import { mockCatalogService } from '@/adapters/mock/mockCatalogService';

export const getBanners = async (): Promise<Banner[]> => {
  return mockCatalogService.getBanners();
};

export const getBannerById = async (id: string): Promise<Banner | null> => {
  const banners = await getBanners();
  return banners.find((b) => b.id === id) || null;
};

export const addBanner = async (banner: Omit<Banner, 'id'>): Promise<void> => {
  return mockCatalogService.addBanner(banner);
};

export const updateBanner = async (id: string, updates: Partial<Banner>): Promise<void> => {
  return mockCatalogService.updateBanner(id, updates);
};

export const deleteBanner = async (id: string): Promise<void> => {
  return mockCatalogService.deleteBanner(id);
};

export const upsertDefaultBanner = async (_banner: Omit<Banner, 'id' | 'createdAt' | 'order'>): Promise<void> => {};

export const updateBannerOrder = async (_banners: Banner[]): Promise<void> => {};

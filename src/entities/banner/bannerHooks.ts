import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Banner } from '@/core/types/banner';
import * as BannersService from '@/adapters/banners';

export const useBanners = () => {
  return useQuery({
    queryKey: ['banners'],
    queryFn: BannersService.getBanners,
  });
};

export const useBanner = (id: string) => {
  return useQuery({
    queryKey: ['banner', id],
    queryFn: () => BannersService.getBannerById(id),
    enabled: Boolean(id),
  });
};

export const useAddBanner = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: BannersService.addBanner,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['banners'] }),
  });
};

export const useUpdateBanner = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Banner> }) =>
      BannersService.updateBanner(id, updates),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['banners'] }),
  });
};

export const useDeleteBanner = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: BannersService.deleteBanner,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['banners'] }),
  });
};

export const useUpsertDefaultBanner = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: BannersService.upsertDefaultBanner,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['banners'] }),
  });
};

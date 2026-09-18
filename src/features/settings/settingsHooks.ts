import { useQuery } from '@tanstack/react-query';
import * as SettingsService from '@/adapters/settings';

export const useAppSettings = () => {
  return useQuery({
    queryKey: ['app-settings'],
    queryFn: SettingsService.getSettings,
    staleTime: 30 * 60 * 1000,
  });
};

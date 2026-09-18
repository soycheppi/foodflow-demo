import { useQuery } from '@tanstack/react-query';
import * as UserService from '@/adapters/users';

export const useUserProfile = (uid: string) => {
  return useQuery({
    queryKey: ['user-profile', uid],
    queryFn: () => UserService.getUserProfile(uid),
    enabled: Boolean(uid),
  });
};

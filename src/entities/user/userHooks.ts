import { useQuery } from '@tanstack/react-query';
import { UserProfile } from '@/core/types/auth';

const GUEST_PROFILE: UserProfile = {
  displayName: 'Cliente Invitado',
  email: 'invitado@foodflow.local',
  totalOrders: 1,
  rewardCycle: 1,
  createdAt: new Date(),
};

export const useUserProfile = (_uid: string) => {
  return useQuery({
    queryKey: ['user-profile', _uid],
    queryFn: async () => GUEST_PROFILE,
    enabled: Boolean(_uid),
  });
};

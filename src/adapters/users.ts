import { UserProfile } from '@/core/types/auth';

const DEFAULT_MOCK_USER: UserProfile = {
  displayName: 'Cliente Invitado',
  email: 'invitado@foodflow.local',
  totalOrders: 1,
  rewardCycle: 1,
  createdAt: new Date(),
};

export const getUserProfile = async (_uid: string): Promise<UserProfile | null> => {
  return DEFAULT_MOCK_USER;
};

export const getTopUsers = async (_limitCount: number = 10): Promise<UserProfile[]> => {
  return [DEFAULT_MOCK_USER];
};

export const getUsersCount = async (): Promise<number> => {
  return 1;
};

export const getAllUsers = async (): Promise<UserProfile[]> => {
  return [DEFAULT_MOCK_USER];
};

export const validateAndAwardPoint = async (_uid: string): Promise<{ newCycle: number }> => {
  return { newCycle: 1 };
};

import { AuthUser } from '@/core/types/auth';

export const syncUserService = async (): Promise<AuthUser | null> => {
  return null;
};

export const loginWithGoogle = async (): Promise<AuthUser | null> => {
  return null;
};

export const logoutUser = async (): Promise<void> => {};

export const subscribeToAuthChanges = (callback: (user: AuthUser | null) => void): (() => void) => {
  callback(null);
  return () => {};
};

export const updateUserProfile = async (): Promise<void> => {};

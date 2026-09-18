import { createContext } from 'react';
import type { AuthUser } from '@/core/types/auth';

export interface AuthContextType {
  currentUser: AuthUser | null;
  userProfile: null;
  isAdmin: boolean;
  isLoading: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  userProfile: null,
  isAdmin: false,
  isLoading: false,
  login: async () => {},
  logout: async () => {},
});

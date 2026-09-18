import { useMemo } from 'react';
import { AuthContext } from './authContext';

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const value = useMemo(
    () => ({
      currentUser: null,
      userProfile: null,
      isAdmin: false,
      isLoading: false,
      login: async () => {},
      logout: async () => {},
    }),
    []
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export interface UserProfile {
  email: string;
  displayName: string;
  createdAt: Date | string | null | { seconds: number; nanoseconds: number } | unknown;
  address?: string;
  postalCode?: string;
  rewardCycle?: number;
  totalOrders?: number;
  lastOrderDate?: Date | string | null | { seconds: number; nanoseconds: number } | unknown;
}

export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  isAdmin?: boolean;
  role?: 'admin' | 'customer';
  userData?: UserProfile;
}

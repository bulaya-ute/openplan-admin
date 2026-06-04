import { create } from 'zustand';
import type { AuthUser } from '../types';

interface AuthState {
  user: AuthUser | null;
  setUser: (user: AuthUser) => void;
  logout: () => void;
}

const stored = localStorage.getItem('openplan_admin_user');

export const useAuthStore = create<AuthState>((set) => ({
  user: stored ? JSON.parse(stored) : null,
  setUser: (user) => {
    localStorage.setItem('openplan_admin_token', user.accessToken);
    localStorage.setItem('openplan_admin_user', JSON.stringify(user));
    set({ user });
  },
  logout: () => {
    localStorage.removeItem('openplan_admin_token');
    localStorage.removeItem('openplan_admin_user');
    set({ user: null });
  },
}));

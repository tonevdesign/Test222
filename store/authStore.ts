import { create } from 'zustand';
import { User } from '@/types/user';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  isInitialized: boolean;
  
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setInitialized: (initialized: boolean) => void; // 🔥 NEW
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: false,
  error: null,
  isInitialized: false,
  
  setUser: (user) => set({ user, error: null, isInitialized: true }), 
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  setInitialized: (isInitialized) => set({ isInitialized }), 
  
  logout: () => set({ 
    user: null, 
    error: null, 
    isLoading: false,
    isInitialized: true 
  }),
}));

// Computed selector for authentication status
export const selectIsAuthenticated = (state: AuthState) => !!state.user;
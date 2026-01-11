'use client';

import { useCallback, useEffect, useRef } from 'react';
import { useAuthStore } from '@/store/authStore';
import { apiClient } from '@/lib/api';
import { User } from '@/types/user';

interface AuthResponse {
  user: User;
  token?: string;
}

// Helper to check if we should attempt to fetch user
const shouldFetchUser = (user: User | null, hasAttempted: boolean): boolean => {
  if (user) return false;
  if (hasAttempted) return false;
  return true;
};

export const useAuth = () => {
  const {
    user,
    isLoading,
    error,
    isInitialized,
    setUser,
    setLoading,
    setError,
    setInitialized,
  } = useAuthStore();

  const hasAttemptedFetch = useRef(false);
  const isFetching = useRef(false);
  const isAuthenticated = !!user;

  const login = useCallback(
    async (email: string, password: string) => {
      setLoading(true);
      setError(null);
      try {
        const response = await apiClient.post<AuthResponse>('/auth/login', {
          email,
          password,
        });

        if (response.data?.user) {

          await new Promise(resolve => setTimeout(resolve, 100));

          setUser(response.data.user);

          try {
            localStorage.setItem('login-event', Date.now().toString());
          } catch (e) {
            console.warn('localStorage not available');
          }

          return response.data;
        }
      } catch (err) {
        console.error('❌ Login failed:', err);
        const message = err instanceof Error ? err.message : 'Login failed';
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [setLoading, setError, setUser]
  );

  const register = useCallback(
    async (data: {
      email: string;
      password: string;
      first_name: string;
      last_name: string;
    }) => {
      setLoading(true);
      setError(null);
      try {
        const response = await apiClient.post<AuthResponse>('/auth/register', data);

        if (response.data?.user) {

          await new Promise(resolve => setTimeout(resolve, 100));
          
          setUser(response.data.user);

          try {
            localStorage.setItem('login-event', Date.now().toString());
          } catch (e) {
            console.warn('localStorage not available');
          }

          return response.data;
        }
      } catch (err) {
        console.error('❌ Registration failed:', err);
        const message = err instanceof Error ? err.message : 'Registration failed';
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [setLoading, setError, setUser]
  );

  const logout = useCallback(async () => {
    setLoading(true);
    try {
      await apiClient.post('/auth/logout');
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setUser(null);
      setLoading(false);

      try {
        localStorage.setItem('logout-event', Date.now().toString());
      } catch (e) {
        console.warn('localStorage not available');
      }
    }
  }, [setLoading, setUser]);

  const fetchUser = useCallback(async () => {
    if (isFetching.current) {
      return;
    }

    if (!shouldFetchUser(user, hasAttemptedFetch.current)) {
      return;
    }

    isFetching.current = true;
    setLoading(true);
    
    try {
      const response = await apiClient.get<User>('/auth/me');
      if (response.data) {
        setUser(response.data);
      }
    } catch (err: any) {
      // 🔥 FIX: Suppress expected 401 errors for guests
      if (err?.status === 401) {
        // This is expected for guests - don't log as error
        setUser(null);
      } else {
        // Only log actual errors (network issues, server errors, etc.)
        console.error('❌ Fetch user error:', err);
      }
    } finally {
      setLoading(false);
      isFetching.current = false;
      hasAttemptedFetch.current = true;
      setInitialized(true); // 🔥 Mark as initialized regardless of result
    }
  }, [setLoading, setUser, setInitialized, user]);

  const updateProfile = useCallback(
    async (data: {
      first_name?: string;
      last_name?: string;
      phone?: string;
      email?: string;
    }) => {
      setLoading(true);
      setError(null);
      try {
        const response = await apiClient.put<User>('/auth/profile', data);
        if (response.data) {
          setUser(response.data);
          return response.data;
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Profile update failed';
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [setLoading, setError, setUser]
  );

  // Cross-tab auth sync
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.storageArea !== localStorage) return;

      if (e.key === 'logout-event') {
        setUser(null);
      }

      if (e.key === 'login-event') {
        if (!user) {
          fetchUser();
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [user, fetchUser, setUser]);

  return {
    user,
    isAuthenticated,
    isLoading,
    isInitialized,
    error,
    login,
    register,
    logout,
    fetchUser,
    updateProfile,
  };
};
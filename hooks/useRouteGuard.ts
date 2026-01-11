'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

export function useRequireAuth(redirectTo: string = '/login') {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      const redirect = `${redirectTo}?redirect=${encodeURIComponent(pathname)}`;
      router.replace(redirect);
    }
  }, [isLoading, isAuthenticated, redirectTo, pathname, router]);

  return { isAuthenticated, isLoading };
}

export function useRequireGuest(redirectTo: string = '/') {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace(redirectTo);
    }
  }, [isLoading, isAuthenticated, redirectTo, router]);

  return { isAuthenticated, isLoading };
}
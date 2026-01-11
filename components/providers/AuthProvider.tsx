'use client';

import { useEffect, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { fetchUser } = useAuth();
  const hasInitialized = useRef(false);

  useEffect(() => {
    // Only fetch user once on mount
    if (!hasInitialized.current) {
      hasInitialized.current = true;
      fetchUser();
    }
  }, [fetchUser]);

  return <>{children}</>;
}
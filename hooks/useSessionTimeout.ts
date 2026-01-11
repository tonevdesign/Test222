'use client';

import { useEffect, useRef, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';

export function useSessionTimeout(timeoutMinutes: number = 7) {
  const { logout, isAuthenticated } = useAuth();
  const router = useRouter();
  const [showWarning, setShowWarning] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const warningRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!isAuthenticated) return;

    const resetTimers = () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (warningRef.current) clearTimeout(warningRef.current);
      setShowWarning(false);

      // Show warning 2 minutes before timeout
      warningRef.current = setTimeout(() => {
        setShowWarning(true);
      }, (timeoutMinutes - 2) * 60 * 1000);

      // Auto logout after timeout
      timeoutRef.current = setTimeout(() => {
        logout();
        router.push('/login?timeout=true');
      }, timeoutMinutes * 60 * 1000);
    };

    // Reset on user activity
    const events = ['mousedown', 'keydown', 'scroll', 'touchstart'];
    events.forEach(event => {
      document.addEventListener(event, resetTimers);
    });

    resetTimers();

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, resetTimers);
      });
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (warningRef.current) clearTimeout(warningRef.current);
    };
  }, [isAuthenticated, logout, router, timeoutMinutes]);

  const extendSession = () => {
    setShowWarning(false);
    document.dispatchEvent(new Event('mousedown'));
  };

  return { showWarning, extendSession };
}
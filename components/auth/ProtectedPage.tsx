'use client';

import { useEffect, useState, useRef } from 'react';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';

interface ProtectedPageProps {
  children: React.ReactNode;
  loadingText?: string;
}

export function ProtectedPage({ 
  children, 
  loadingText = 'Зареждане...' 
}: ProtectedPageProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isLoading, isInitialized } = useAuthStore();
  const [isChecking, setIsChecking] = useState(true);
  const hasChecked = useRef(false);

  useEffect(() => {
    // 🔥 FIX: Wait for auth to be initialized before checking
    const checkAuth = async () => {
      // Prevent multiple checks
      if (hasChecked.current) {
        return;
      }

      // Wait for initialization to complete
      if (!isInitialized || isLoading) {
        return;
      }

      // Mark as checked
      hasChecked.current = true;

      // Small delay to let state settle
      await new Promise(resolve => setTimeout(resolve, 50));

      // Check authentication
      if (!user) {
        router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
      } else {
        setIsChecking(false);
      }
    };

    checkAuth();
  }, [user, isLoading, isInitialized, router, pathname]);

  // Show loading while waiting for initialization or checking
  if (!isInitialized || isLoading || isChecking) {
    return <LoadingSpinner fullScreen text={loadingText} />;
  }

  // Don't render anything if no user (will redirect)
  if (!user) {
    return null;
  }

  // User is authenticated - render protected content
  return <>{children}</>;
}
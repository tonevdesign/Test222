import { useEffect, useRef } from 'react';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { useComparisonStore } from '@/store/comparisonStore';
import { useNotificationStore } from '@/store/notificationStore';
import { useAuth } from '@/hooks/useAuth';

export const useHeaderData = () => {
  const hasLoadedRef = useRef(false);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) return;

    useWishlistStore.getState().fetchWishlistIds();
  }, [isAuthenticated]);

};

export const useHeaderCounts = () => {
  const cartCount = useCartStore((s) => 
    s.items?.reduce((total, item) => total + item.quantity, 0) || 0
  );
  const wishlistCount = useWishlistStore((s) => s.productIds.length + s.bundleIds.length);
  const comparisonCount = useComparisonStore((s) => s.productIds.length);
  const notificationCount = useNotificationStore((s) => s.unreadCount);

  return {
    cartCount,
    wishlistCount,
    comparisonCount,
    notificationCount,
  };
};
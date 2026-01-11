import { useCallback, useEffect, useRef } from 'react';
import { useWishlistStore } from '@/store/wishlistStore';
import { useAuth } from '@/hooks/useAuth';

export const useWishlist = () => {
  const { isAuthenticated } = useAuth();
  const hasFetchedRef = useRef(false);
  
  const {
    items,
    wishlistId,
    isLoading,
    productIds,
    fetchWishlistIds,
    fetchWishlist,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    isVariantInWishlist,
    getWishlistItemForVariant,
    getItemCount,
    clearWishlist,
  } = useWishlistStore();

  useEffect(() => {
    if (!isAuthenticated) {
      clearWishlist();
      hasFetchedRef.current = false;
    } else if (!hasFetchedRef.current) {
      hasFetchedRef.current = true;
      fetchWishlistIds();
    }
  }, [isAuthenticated, clearWishlist, fetchWishlistIds]);

  /**
   * Toggle wishlist for a specific variant
   * ✅ FIXED: Load full wishlist if items not loaded yet
   */
  const toggleWishlist = useCallback(
    async (id: number, options?: { variantId?: number; isBundle?: boolean }) => {
      if (!isAuthenticated) {
        throw new Error('Please login to add items to wishlist');
      }

      const { variantId, isBundle = false } = options || {};

      if (isBundle) {
        // Bundle logic
        if (isInWishlist(id, true)) {
          // ✅ Ensure items are loaded before trying to remove
          if (items.length === 0) {
            await fetchWishlist();
          }
          const item = useWishlistStore.getState().items.find((i) => i.bundle?.id === id);
          if (item) {
            await removeFromWishlist(item.id);
          }
        } else {
          await addToWishlist(undefined, undefined, id);
        }
      } else {
        // Product/Variant logic
        if (isVariantInWishlist(id, variantId)) {
          // ✅ Ensure items are loaded before trying to remove
          if (items.length === 0) {
            await fetchWishlist();
          }
          const item = useWishlistStore.getState().getWishlistItemForVariant(id, variantId);
          if (item) {
            await removeFromWishlist(item.id);
          } else {
            // If still not found, force refresh and try again
            console.warn('Item not found after loading wishlist, forcing refresh');
            await fetchWishlist();
            const retryItem = useWishlistStore.getState().getWishlistItemForVariant(id, variantId);
            if (retryItem) {
              await removeFromWishlist(retryItem.id);
            }
          }
        } else {
          await addToWishlist(id, variantId);
        }
      }
    },
    [
      isAuthenticated, 
      items.length, 
      isInWishlist, 
      isVariantInWishlist,
      addToWishlist, 
      removeFromWishlist,
      fetchWishlist
    ]
  );

  const ensureWishlistLoaded = useCallback(async () => {
    if (isAuthenticated && items.length === 0 && productIds.length > 0 && !isLoading) {
      await fetchWishlist();
    }
  }, [isAuthenticated, items.length, productIds.length, isLoading, fetchWishlist]);

  return {
    items,
    wishlistId,
    isLoading,
    itemCount: getItemCount(),
    isInWishlist,
    isVariantInWishlist,
    getWishlistItemForVariant,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    fetchWishlist,
    ensureWishlistLoaded,
  };
};
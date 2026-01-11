import { useState, useEffect, useCallback } from 'react';
import { Wishlist, WishlistItem } from '@/types/wishlist';
import { apiClient } from '@/lib/api';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';

// Helper to get variant display name
const getVariantDisplayName = (item: WishlistItem): string => {
  if (!item.product) return '';
  
  // Use selectedVariant if provided by backend
  if (item.product.selectedVariant && item.product.selectedVariant.name) {
    return item.product.selectedVariant.name;
  }
  
  // Otherwise get from variants array
  if (item.variant_id && item.product.variants) {
    const variant = item.product.variants.find(v => v.id === item.variant_id);
    if (variant?.variant_name) {
      return variant.variant_name;
    }
  }
  
  return '';
};

export function useWishlistManager(initialSlug?: string | null) {
  const [wishlists, setWishlists] = useState<Wishlist[]>([]);
  const [currentWishlist, setCurrentWishlist] = useState<Wishlist | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { addToCart } = useCartStore();

  const fetchWishlists = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await apiClient.get<Wishlist[]>('/wishlist');
      
      if (response.data) {
        setWishlists(response.data);
        
        if (initialSlug) {
          const found = response.data.find(
            (w) => w.slug === initialSlug || w.id.toString() === initialSlug
          );
          setCurrentWishlist(found || response.data.find((w) => w.is_default) || null);
        } else {
          const defaultWishlist = response.data.find((w) => w.is_default);
          setCurrentWishlist(defaultWishlist || null);
        }
      }
    } catch (error) {
      console.error('Failed to fetch wishlists:', error);
    } finally {
      setIsLoading(false);
    }
  }, [initialSlug]);

  useEffect(() => {
    fetchWishlists();
  }, [fetchWishlists]);

  const selectWishlist = useCallback((wishlistId: number) => {
    const wishlist = wishlists.find((w) => w.id === wishlistId);
    if (wishlist) {
      setCurrentWishlist(wishlist);
    }
  }, [wishlists]);

  const createWishlist = useCallback(async (name: string, isPublic: boolean) => {
    try {
      const response = await apiClient.post<Wishlist>('/wishlist', {
        name,
        is_public: isPublic,
      });

      if (response.data) {
        await fetchWishlists();
        setCurrentWishlist(response.data);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create wishlist';
      throw new Error(message);
    }
  }, [fetchWishlists]);

  const updateWishlist = useCallback(
    async (wishlistId: number, updates: Partial<Wishlist>) => {
      try {
        await apiClient.patch(`/wishlist/${wishlistId}`, updates);
        await fetchWishlists();
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to update wishlist';
        throw new Error(message);
      }
    },
    [fetchWishlists]
  );

  const deleteWishlist = useCallback(
    async (wishlistId: number) => {
      try {
        await apiClient.delete(`/wishlist/${wishlistId}`);
        useWishlistStore.setState({ lastFetchTime: 0 });
        await useWishlistStore.getState().fetchWishlistIds();
        await fetchWishlists();
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to delete wishlist';
        throw new Error(message);
      }
    },
    [fetchWishlists]
  );

  const removeItem = useCallback(
    async (itemId: number) => {
      if (!currentWishlist) return;

      try {
        await apiClient.delete(
          `/wishlist/${currentWishlist.id}/items/${itemId}`
        );

        // 🔥 1. Invalidate GLOBAL wishlist cache
        useWishlistStore.setState({ lastFetchTime: 0 });

        // 🔄 2. Sync GLOBAL wishlist state
        await useWishlistStore.getState().fetchWishlistIds();
        await useWishlistStore.getState().fetchWishlist();

        // 🔄 3. Update LOCAL wishlist manager state
        setCurrentWishlist((prev) =>
          prev
            ? {
                ...prev,
                items: prev.items?.filter((item) => item.id !== itemId) || [],
              }
            : prev
        );

        setWishlists((prev) =>
          prev.map((w) =>
            w.id === currentWishlist.id
              ? {
                  ...w,
                  items: w.items?.filter((item) => item.id !== itemId) || [],
                }
              : w
          )
        );
      } catch (error) {
        const message =
          error instanceof Error ? error.message : 'Failed to remove item';
        throw new Error(message);
      }
    },
    [currentWishlist]
  );


  const moveToCart = useCallback(
    async (item: WishlistItem) => {
      if (!item.product) {
        throw new Error('Product information is missing');
      }

      // ✅ Get the correct variant (either selectedVariant or find by variant_id)
      let selectedVariant = null;
      
      if (item.product.selectedVariant) {
        selectedVariant = {
          id: item.product.selectedVariant.id,
          price: item.product.selectedVariant.price,
          sale_price: item.product.selectedVariant.sale_price,
          stock_quantity: item.product.selectedVariant.stock_quantity,
        };
      } else if (item.variant_id && item.product.variants) {
        const foundVariant = item.product.variants.find(v => v.id === item.variant_id);
        if (foundVariant) {
          selectedVariant = foundVariant;
        }
      }
      
      // Fallback to default variant
      if (!selectedVariant) {
        selectedVariant = item.product.variants?.find((v) => v.is_default) ||
                         item.product.variants?.[0];
      }

      if (!selectedVariant) {
        throw new Error('No variant available');
      }

      // ✅ Get variant display name
      const variantDisplayName = getVariantDisplayName(item);

      // ✅ Get variant-specific image (already filtered by backend)
      const imageUrl = item.product.images?.[0]?.thumbnail_url ||
                      item.product.images?.[0]?.image_url ||
                      '';

      addToCart({
        id: Date.now(),
        variant_id: selectedVariant.id,
        product_id: item.product.id,
        product_name: item.product.name,
        product_slug: item.product.slug,
        variant_name: variantDisplayName || undefined,
        quantity: 1,
        unit_price: String(selectedVariant.sale_price || selectedVariant.price),
        regular_price: String(selectedVariant.price),
        sale_price: selectedVariant.sale_price ? String(selectedVariant.sale_price) : undefined,
        total_amount: String(selectedVariant.sale_price || selectedVariant.price),
        image_url: imageUrl,
      });

      await removeItem(item.id);
    },
    [addToCart, removeItem]
  );

  return {
    wishlists,
    currentWishlist,
    isLoading,
    selectWishlist,
    createWishlist,
    updateWishlist,
    deleteWishlist,
    removeItem,
    moveToCart,
    refresh: fetchWishlists,
  };
}
import { create } from 'zustand';
import { WishlistItem, Wishlist } from '@/types/wishlist';
import { apiClient } from '@/lib/api';

interface WishlistState {
  productIds: number[];
  bundleIds: number[];
  variantItems: Map<number, number[]>;
  items: WishlistItem[];
  wishlistId: number | null;
  isLoading: boolean;
  lastFetchTime: number;
  
  fetchWishlistIds: () => Promise<void>;
  fetchWishlist: () => Promise<void>;
  addToWishlist: (productId?: number, variantId?: number, bundleId?: number) => Promise<void>;
  removeFromWishlist: (itemId: number) => Promise<void>;
  isInWishlist: (id: number, isBundle?: boolean) => boolean;
  isVariantInWishlist: (productId: number, variantId?: number) => boolean;
  getWishlistItemForVariant: (productId: number, variantId?: number) => WishlistItem | undefined;
  getItemCount: () => number;
  clearWishlist: () => void;
}

interface AddWishlistPayload {
  product_id?: number;
  variant_id?: number;
  bundle_id?: number;
}

interface ApiError {
  status?: number;
  message?: string;
}

let pendingIdsRequest: Promise<void> | null = null;
let pendingFullRequest: Promise<void> | null = null;

const CACHE_DURATION = 30000;

export const useWishlistStore = create<WishlistState>((set, get) => ({
  productIds: [],
  bundleIds: [],
  variantItems: new Map(),
  items: [],
  wishlistId: null,
  isLoading: false,
  lastFetchTime: 0,

  fetchWishlistIds: async () => {
    const now = Date.now();
    const lastFetch = get().lastFetchTime;
    if (now - lastFetch < CACHE_DURATION) {
      return;
    }

    if (pendingIdsRequest) {
      return pendingIdsRequest;
    }

    pendingIdsRequest = (async () => {
      try {
        const response = await apiClient.get<{
          product_ids: number[];
          bundle_ids: number[];
          variant_map?: Record<number, number[]>;
        }>('/wishlist/item-ids');
        
        if (response.data) {
          const variantItems = new Map<number, number[]>();
          if (response.data.variant_map) {
            Object.entries(response.data.variant_map).forEach(([productId, variantIds]) => {
              variantItems.set(Number(productId), variantIds);
            });
          }
          
          set({
            productIds: response.data.product_ids || [],
            bundleIds: response.data.bundle_ids || [],
            variantItems,
            lastFetchTime: Date.now(),
          });
        }
      } catch (error) {
        const apiError = error as ApiError;
        if (apiError.status === 401) {
          set({ productIds: [], bundleIds: [], items: [], variantItems: new Map() });
        } else {
          console.error('Failed to fetch wishlist IDs:', error);
        }
      } finally {
        pendingIdsRequest = null;
      }
    })();

    return pendingIdsRequest;
  },

  fetchWishlist: async () => {
    if (pendingFullRequest) {
      return pendingFullRequest;
    }

    pendingFullRequest = (async () => {
      try {
        set({ isLoading: true });
        const response = await apiClient.get<Wishlist>('/wishlist/default');
        
        if (response.data) {
          const productIdsSet = new Set<number>();
          const bundleIdsSet = new Set<number>();
          const variantItems = new Map<number, number[]>();
          
          response.data.items?.forEach(item => {
            if (item.product_id) {
              productIdsSet.add(item.product_id);
              const variants = variantItems.get(item.product_id) || [];
              if (item.variant_id) {
                variants.push(item.variant_id);
              }
              variantItems.set(item.product_id, variants);
            }
            if (item.bundle_id) {
              bundleIdsSet.add(item.bundle_id);
            }
          });
          
          set({
            items: response.data.items || [],
            productIds: Array.from(productIdsSet),
            bundleIds: Array.from(bundleIdsSet),
            variantItems,
            wishlistId: response.data.id,
            isLoading: false,
            lastFetchTime: Date.now(),
          });
        }
      } catch (error) {
        const apiError = error as ApiError;
        if (apiError.status === 401) {
          set({ 
            items: [], 
            productIds: [], 
            bundleIds: [], 
            variantItems: new Map(),
            wishlistId: null,
            isLoading: false 
          });
        } else {
          console.error('Failed to fetch wishlist:', error);
          set({ isLoading: false });
        }
      } finally {
        pendingFullRequest = null;
      }
    })();

    return pendingFullRequest;
  },

  addToWishlist: async (productId?: number, variantId?: number, bundleId?: number) => {
    try {
      if (!productId && !bundleId) {
        throw new Error('Either productId or bundleId is required');
      }

      const payload: AddWishlistPayload = {};
      
      if (productId) {
        payload.product_id = productId;
        if (variantId) payload.variant_id = variantId;
        
        set((state) => {
          const newVariantItems = new Map(state.variantItems);
          const variants = [...(newVariantItems.get(productId) || [])];
          if (variantId && !variants.includes(variantId)) {
            variants.push(variantId);
            newVariantItems.set(productId, variants);
          }
          
          return {
            productIds: state.productIds.includes(productId) 
              ? state.productIds 
              : [...state.productIds, productId],
            variantItems: newVariantItems,
            lastFetchTime: Date.now(),
          };
        });
      }
      
      if (bundleId) {
        payload.bundle_id = bundleId;
        set((state) => ({
          bundleIds: [...state.bundleIds, bundleId],
          lastFetchTime: Date.now(),
        }));
      }

      await apiClient.post('/wishlist/add', payload);
      await get().fetchWishlist();
      
      return;
    } catch (error) {
      const apiError = error as ApiError;
      
      if (productId) {
        set((state) => {
          const newVariantItems = new Map(state.variantItems);
          if (variantId) {
            const variants = [...(newVariantItems.get(productId) || [])];
            const filtered = variants.filter(v => v !== variantId);
            if (filtered.length > 0) {
              newVariantItems.set(productId, filtered);
            } else {
              newVariantItems.delete(productId);
            }
          }
          
          return {
            productIds: state.productIds.filter(id => id !== productId),
            variantItems: newVariantItems,
          };
        });
      }
      if (bundleId) {
        set((state) => ({
          bundleIds: state.bundleIds.filter(id => id !== bundleId)
        }));
      }
      
      if (apiError.status === 409) {
        await get().fetchWishlist();
        return;
      }
      throw error;
    }
  },

  removeFromWishlist: async (itemId: number) => {
    try {
      const item = get().items.find(i => i.id === itemId);
      
      set((state) => {
        const newVariantItems = new Map(state.variantItems);
        
        if (item?.product_id && item?.variant_id) {
          const variants = [...(newVariantItems.get(item.product_id) || [])];
          const filtered = variants.filter(v => v !== item.variant_id);
          if (filtered.length > 0) {
            newVariantItems.set(item.product_id, filtered);
          } else {
            newVariantItems.delete(item.product_id);
          }
        }
        
        const hasOtherVariants = item?.product_id && newVariantItems.has(item.product_id);
        
        return {
          items: state.items.filter((item) => item.id !== itemId),
          productIds: item?.product_id && !hasOtherVariants
            ? state.productIds.filter(id => id !== item.product_id)
            : state.productIds,
          bundleIds: item?.bundle_id
            ? state.bundleIds.filter(id => id !== item.bundle_id)
            : state.bundleIds,
          variantItems: newVariantItems,
          lastFetchTime: Date.now(),
        };
      });
        
      await apiClient.delete(`/wishlist/items/${itemId}`);

      set({ lastFetchTime: 0 });

      await get().fetchWishlistIds();
      await get().fetchWishlist();
    } catch (error) {
      console.error('Failed to remove from wishlist:', error);
      await get().fetchWishlist();
      throw error;
    }
  },

  isInWishlist: (id: number, isBundle: boolean = false) => {
    const { productIds, bundleIds } = get();
    return isBundle ? bundleIds.includes(id) : productIds.includes(id);
  },

  isVariantInWishlist: (productId: number, variantId?: number) => {
    const { variantItems } = get();
    const variants = variantItems.get(productId);
    
    if (!variants || variants.length === 0) {
      return false;
    }
    
    if (!variantId) {
      return true;
    }
    
    return variants.includes(variantId);
  },

  getWishlistItemForVariant: (productId: number, variantId?: number) => {
    const { items } = get();
    
    return items.find(item => {
      if (item.product_id !== productId) return false;
      
      if (variantId) {
        return item.variant_id === variantId;
      }
      
      return true;
    });
  },

  // ✅ FIXED: Proper count calculation that works with both IDs-only and full items
  getItemCount: () => {
    const { items, variantItems, bundleIds, productIds } = get();
    
    // If full items are loaded, use that (most accurate)
    if (items.length > 0) {
      return items.length;
    }
    
    // Otherwise calculate from variantItems map + bundles
    let totalVariants = 0;
    variantItems.forEach((variants) => {
      // Each entry represents variants for one product
      // If variants array is empty, count as 1 (product without specific variant)
      totalVariants += variants.length > 0 ? variants.length : 1;
    });
    
    // Add products that don't have variant entries (legacy or default variants)
    const productsWithoutVariantMap = productIds.filter(id => !variantItems.has(id)).length;
    
    return totalVariants + productsWithoutVariantMap + bundleIds.length;
  },

  clearWishlist: () => {
    set({ 
      items: [], 
      productIds: [],
      bundleIds: [],
      variantItems: new Map(),
      wishlistId: null,
      lastFetchTime: 0,
    });
  },
}));
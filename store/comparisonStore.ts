import { create } from 'zustand';
import { ComparisonItem } from '@/types/comparison';
import { apiClient } from '@/lib/api';

interface ComparisonState {
  productIds: number[];
  variantItems: Map<number, number[]>;
  items: ComparisonItem[];
  isLoading: boolean;
  lastFetchTime: number;
  maxItems: number;
  
  fetchComparisonIds: () => Promise<void>;
  fetchComparison: () => Promise<void>;
  addToComparison: (productId: number, variantId?: number) => Promise<void>;
  removeFromComparison: (itemId: number) => Promise<void>;
  removeProductFromComparison: (productId: number, variantId?: number) => Promise<void>;
  clearComparison: () => Promise<void>;
  isInComparison: (productId: number) => boolean;
  isVariantInComparison: (productId: number, variantId?: number) => boolean;
  getComparisonItemForVariant: (productId: number, variantId?: number) => ComparisonItem | undefined;
  getItemCount: () => number;
  canAddMore: () => boolean;
  clearLocalComparison: () => void;
}

interface ApiError {
  status?: number;
  message?: string;
}

let pendingIdsRequest: Promise<void> | null = null;
let pendingFullRequest: Promise<void> | null = null;

const CACHE_DURATION = 30000;
const MAX_COMPARISON_ITEMS = 4;

export const useComparisonStore = create<ComparisonState>((set, get) => ({
  productIds: [],
  variantItems: new Map(),
  items: [],
  isLoading: false,
  lastFetchTime: 0,
  maxItems: MAX_COMPARISON_ITEMS,

  fetchComparisonIds: async () => {
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
          variant_map: Record<number, number[]>;
        }>('/comparison/item-ids');
        
        if (response.data) {
          const variantItems = new Map<number, number[]>();
          Object.entries(response.data.variant_map || {}).forEach(([productId, variantIds]) => {
            variantItems.set(Number(productId), variantIds);
          });
          
          set({
            productIds: response.data.product_ids || [],
            variantItems,
            lastFetchTime: Date.now(),
          });
        }
      } catch (error) {
        console.error('Failed to fetch comparison IDs:', error);
        set({ productIds: [], variantItems: new Map() });
      } finally {
        pendingIdsRequest = null;
      }
    })();

    return pendingIdsRequest;
  },

  fetchComparison: async () => {
    if (pendingFullRequest) {
      return pendingFullRequest;
    }

    pendingFullRequest = (async () => {
      try {
        set({ isLoading: true });
        const response = await apiClient.get<{
          items: ComparisonItem[];
          count: number;
          max: number;
        }>('/comparison');
        
        if (response.data) {
          const productIds = response.data.items?.map(i => i.product_id) || [];
          
          const variantItems = new Map<number, number[]>();
          response.data.items?.forEach(item => {
            if (item.variant_id) {
              const variants = variantItems.get(item.product_id) || [];
              variants.push(item.variant_id);
              variantItems.set(item.product_id, variants);
            }
          });
          
          set({
            items: response.data.items || [],
            productIds,
            variantItems,
            maxItems: response.data.max || MAX_COMPARISON_ITEMS,
            isLoading: false,
            lastFetchTime: Date.now(),
          });
        }
      } catch (error) {
        console.error('Failed to fetch comparison:', error);
        set({ 
          items: [], 
          productIds: [],
          variantItems: new Map(),
          isLoading: false 
        });
      } finally {
        pendingFullRequest = null;
      }
    })();

    return pendingFullRequest;
  },

  addToComparison: async (productId: number, variantId?: number) => {
    try {
      const { productIds, maxItems, variantItems } = get();
      
      if (variantId) {
        const variants = variantItems.get(productId) || [];
        if (variants.includes(variantId)) {
          return;
        }
      } else {
        if (productIds.includes(productId) && !variantItems.has(productId)) {
          return;
        }
      }
      
      // FIX 1: Use getItemCount() instead of productIds.length
      if (get().getItemCount() >= maxItems) {
        throw new Error(`Maximum ${maxItems} items allowed in comparison`);
      }

      set((state) => {
        const newVariantItems = new Map(state.variantItems);
        if (variantId) {
          const variants = [...(newVariantItems.get(productId) || [])];
          if (!variants.includes(variantId)) {
            variants.push(variantId);
            newVariantItems.set(productId, variants);
          }
        }
        
        return {
          productIds: state.productIds.includes(productId)
            ? state.productIds
            : [...state.productIds, productId],
          variantItems: newVariantItems,
          lastFetchTime: Date.now(),
        };
      });

      const payload: { product_id: number; variant_id?: number } = { product_id: productId };
      if (variantId) payload.variant_id = variantId;

      await apiClient.post('/comparison/add', payload);
      await get().fetchComparison();
      
    } catch (error) {
      const apiError = error as ApiError;
      
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
      
      if (apiError.status === 409) {
        await get().fetchComparison();
      }
      
      throw error;
    }
  },

  removeFromComparison: async (itemId: number) => {
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
          variantItems: newVariantItems,
          lastFetchTime: 0, // FIX 2: Invalidate cache instead of refreshing
        };
      });
        
      await apiClient.delete(`/comparison/items/${itemId}`);
      // FIX 3: Refetch both IDs and full comparison after mutation
      await get().fetchComparisonIds();
      await get().fetchComparison();
    } catch (error) {
      console.error('Failed to remove from comparison:', error);
      // FIX 4: Invalidate cache on error and refetch
      set({ lastFetchTime: 0 });
      await get().fetchComparisonIds();
      await get().fetchComparison();
      throw error;
    }
  },

  removeProductFromComparison: async (productId: number, variantId?: number) => {
    try {
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
        } else {
          newVariantItems.delete(productId);
        }
        
        const hasOtherVariants = newVariantItems.has(productId);
        
        return {
          items: state.items.filter((item) => {
            if (item.product_id !== productId) return true;
            if (variantId) return item.variant_id !== variantId;
            return false;
          }),
          productIds: !hasOtherVariants
            ? state.productIds.filter(id => id !== productId)
            : state.productIds,
          variantItems: newVariantItems,
          lastFetchTime: 0, // FIX 5: Invalidate cache instead of refreshing
        };
      });
      
      const url = variantId 
        ? `/comparison/product/${productId}?variant_id=${variantId}`
        : `/comparison/product/${productId}`;
        
      await apiClient.delete(url);
      // FIX 6: Refetch both IDs and full comparison after mutation
      await get().fetchComparisonIds();
      await get().fetchComparison();
    } catch (error) {
      console.error('Failed to remove product from comparison:', error);
      // FIX 7: Invalidate cache on error and refetch
      set({ lastFetchTime: 0 });
      await get().fetchComparisonIds();
      await get().fetchComparison();
      throw error;
    }
  },

  clearComparison: async () => {
    try {
      set({ 
        items: [], 
        productIds: [],
        variantItems: new Map(),
        lastFetchTime: 0, // FIX 8: Invalidate cache instead of refreshing
      });
        
      await apiClient.delete('/comparison/clear');
      // FIX 9: Refetch IDs after clearing
      await get().fetchComparisonIds();
    } catch (error) {
      console.error('Failed to clear comparison:', error);
      // FIX 10: Invalidate cache on error and refetch
      set({ lastFetchTime: 0 });
      await get().fetchComparisonIds();
      await get().fetchComparison();
      throw error;
    }
  },

  isInComparison: (productId: number) => {
    return get().productIds.includes(productId);
  },

  isVariantInComparison: (productId: number, variantId?: number) => {
    const { variantItems } = get();
    const variants = variantItems.get(productId);
    
    // FIX 11: Handle empty variants correctly
    if (!variants) {
      return false;
    }
    
    if (variants.length === 0) {
      return true; // Product exists without specific variant
    }
    
    if (!variantId) {
      return true;
    }
    
    return variants.includes(variantId);
  },

  getComparisonItemForVariant: (productId: number, variantId?: number) => {
    const { items } = get();
    
    return items.find(item => {
      if (item.product_id !== productId) return false;
      
      if (variantId) {
        return item.variant_id === variantId;
      }
      
      // FIX 12: More specific matching when no variantId provided
      return item.variant_id == null;
    });
  },

  getItemCount: () => {
    const { items, variantItems, productIds } = get();
    
    // If full items are loaded, use that (most accurate)
    if (items.length > 0) {
      return items.length;
    }
    
    // Otherwise calculate from variantItems map
    let totalVariants = 0;
    variantItems.forEach((variants) => {
      // Each entry represents variants for one product
      // If variants array is empty, count as 1 (product without specific variant)
      totalVariants += variants.length > 0 ? variants.length : 1;
    });
    
    // Add products that don't have variant entries (legacy or default variants)
    const productsWithoutVariantMap = productIds.filter(id => !variantItems.has(id)).length;
    
    return totalVariants + productsWithoutVariantMap;
  },

  canAddMore: () => {
    const { maxItems } = get();
    const currentCount = get().getItemCount();
    return currentCount < maxItems;
  },

  clearLocalComparison: () => {
    set({ 
      items: [], 
      productIds: [],
      variantItems: new Map(),
      lastFetchTime: 0,
    });
  },
}));
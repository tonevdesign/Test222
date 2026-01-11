import { useCallback, useEffect, useRef } from 'react';
import { useComparisonStore } from '@/store/comparisonStore';

export const useComparison = () => {
  const hasFetchedRef = useRef(false);
  
  const {
    items,
    isLoading,
    productIds,
    maxItems,
    fetchComparisonIds,
    fetchComparison,
    addToComparison,
    removeFromComparison,
    removeProductFromComparison,
    clearComparison,
    isInComparison,
    isVariantInComparison,
    getComparisonItemForVariant,
    getItemCount,
    canAddMore,
  } = useComparisonStore();

  useEffect(() => {
    if (!hasFetchedRef.current) {
      hasFetchedRef.current = true;
      fetchComparisonIds();
    }
  }, [fetchComparisonIds]);

  /**
   * Toggle product/variant in/out of comparison
   * ✅ FIXED: Load full comparison if items not loaded yet
   */
  const toggleComparison = useCallback(
    async (productId: number, variantId?: number) => {
      if (isVariantInComparison(productId, variantId)) {
        // ✅ Ensure items are loaded before trying to remove
        if (items.length === 0) {
          await fetchComparison();
        }
        
        const item = useComparisonStore.getState().getComparisonItemForVariant(productId, variantId);
        if (item) {
          await removeFromComparison(item.id);
        } else {
          // If still not found, force refresh and try again
          console.warn('Item not found after loading comparison, forcing refresh');
          await fetchComparison();
          const retryItem = useComparisonStore.getState().getComparisonItemForVariant(productId, variantId);
          if (retryItem) {
            await removeFromComparison(retryItem.id);
          } else {
            // Fallback to removing by product/variant
            await removeProductFromComparison(productId, variantId);
          }
        }
      } else {
        await addToComparison(productId, variantId);
      }
    },
    [
      items.length,
      isVariantInComparison,
      addToComparison,
      removeFromComparison,
      removeProductFromComparison,
      fetchComparison
    ]
  );

  /**
   * Ensure full comparison data is loaded (for comparison page)
   */
  const ensureComparisonLoaded = useCallback(async () => {
    if (items.length === 0 && productIds.length > 0 && !isLoading) {
      await fetchComparison();
    }
  }, [items.length, productIds.length, isLoading, fetchComparison]);

  return {
    items,
    isLoading,
    itemCount: getItemCount(),
    maxItems,
    canAddMore: canAddMore(),
    isInComparison,
    isVariantInComparison,
    getComparisonItemForVariant,
    addToComparison,
    removeFromComparison,
    removeProductFromComparison,
    clearComparison,
    toggleComparison,
    fetchComparison,
    ensureComparisonLoaded,
  };
};
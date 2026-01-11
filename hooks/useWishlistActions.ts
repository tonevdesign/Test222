import { useState } from 'react';
import { apiClient } from '@/lib/api';

interface ApiError {
  status?: number;
  message?: string;
}

export function useWishlistActions() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pendingProduct, setPendingProduct] = useState<{
    productId: number;
    variantId?: number;
  } | null>(null);

  /**
   * Open modal to select wishlist for adding product
   */
  const openAddToWishlistModal = (productId: number, variantId?: number) => {
    setPendingProduct({ productId, variantId });
    setIsModalOpen(true);
  };

  /**
   * Close the modal
   */
  const closeModal = () => {
    setIsModalOpen(false);
    setPendingProduct(null);
  };

  /**
   * Move product from one wishlist to another
   */
  const moveToWishlist = async (
    itemId: number,
    fromWishlistId: number,
    toWishlistId: number,
    productId: number,
    variantId?: number
  ) => {
    try {
      // Remove from current wishlist
      await apiClient.delete(`/wishlist/${fromWishlistId}/items/${itemId}`);

      // Add to target wishlist
      await apiClient.post(`/wishlist/${toWishlistId}/items`, {
        product_id: productId,
        variant_id: variantId,
      });

      return true;
    } catch (error) {
      const apiError = error as ApiError;
      if (apiError.status === 409) {
        throw new Error('Продуктът вече е в целевия списък');
      }
      throw error;
    }
  };

  return {
    isModalOpen,
    pendingProduct,
    openAddToWishlistModal,
    closeModal,
    moveToWishlist,
  };
}
'use client';

import { useCallback, useEffect, useState } from 'react';
import { useCartStore } from '@/store/cartStore';
import { CartItem } from '@/types/cart';

export const useCart = () => {
  const [isHydrated, setIsHydrated] = useState(false);
  const { items, total, addToCart, removeFromCart, updateQuantity, clearCart, calculateTotal } =
    useCartStore();

  // Handle hydration
  useEffect(() => {
    // Add small delay to ensure localStorage is fully loaded
    const timer = setTimeout(() => {
      setIsHydrated(true);
      // Recalculate total after hydration
      try {
        calculateTotal();
      } catch (error) {
        console.error('Error calculating total:', error);
      }
    }, 50);

    return () => clearTimeout(timer);
  }, [calculateTotal]);

  const addItem = useCallback(
    (item: CartItem) => {
      try {
        addToCart(item);
      } catch (error) {
        console.error('Error adding item to cart:', error);
      }
    },
    [addToCart]
  );

  const removeItem = useCallback(
    (itemId: number) => {
      try {
        removeFromCart(itemId);
      } catch (error) {
        console.error('Error removing item from cart:', error);
      }
    },
    [removeFromCart]
  );

  const updateItem = useCallback(
    (itemId: number, quantity: number) => {
      try {
        updateQuantity(itemId, quantity);
      } catch (error) {
        console.error('Error updating item quantity:', error);
      }
    },
    [updateQuantity]
  );

  const getItemCount = useCallback(() => {
    try {
      return items.reduce((total, item) => total + item.quantity, 0);
    } catch (error) {
      console.error('Error calculating item count:', error);
      return 0;
    }
  }, [items]);

  const isEmpty = items.length === 0;

  return {
    items: isHydrated ? items : [],
    total: isHydrated ? total : 0,
    itemCount: isHydrated ? getItemCount() : 0,
    isEmpty: isHydrated ? isEmpty : true,
    isHydrated,
    addItem,
    removeItem,
    updateItem,
    clearCart,
  };
};
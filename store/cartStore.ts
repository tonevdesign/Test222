import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { CartItem } from '@/types/cart';

interface CartState {
  items: CartItem[];
  total: number;
  lastFetchTime: number;
  addToCart: (item: CartItem) => void;
  removeFromCart: (itemId: number) => void;
  updateQuantity: (itemId: number, quantity: number) => void;
  clearCart: () => void;
  calculateTotal: () => void;
  fetchCart: () => Promise<void>;
}

const CACHE_DURATION = 30000; // 30 seconds

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      total: 0,
      lastFetchTime: 0,

      fetchCart: async () => {
        const now = Date.now();
        const lastFetch = get().lastFetchTime;
        
        if (now - lastFetch < CACHE_DURATION) {
          return;
        }

        set({ lastFetchTime: Date.now() });
      },

      addToCart: (item) => {
        const { items, calculateTotal } = get();

        const isBundleItem = Boolean(item.is_bundle && item.bundle_id);

        const existingItem = items.find((i) => {
          if (isBundleItem) {
            return (
              i.is_bundle &&
              i.bundle_id === item.bundle_id
            );
          }

          if (i.is_bundle) {
            return false;
          }

          return (
            i.variant_id === item.variant_id &&
            i.product_id === item.product_id
          );
        });

        let updatedItems;
        if (existingItem) {
          updatedItems = items.map((i) =>
            i === existingItem
              ? {
                  ...i,
                  quantity: i.quantity + item.quantity,
                  total_amount: (
                    (parseFloat(i.unit_price) * (i.quantity + item.quantity))
                  ).toFixed(2),
                }
              : i
          );
        } else {
          updatedItems = [...items, item];
        }

        set({ items: updatedItems, lastFetchTime: Date.now() });
        calculateTotal();
      },

      removeFromCart: (itemId) => {
        const { items, calculateTotal } = get();
        set({ 
          items: items.filter((item) => item.id !== itemId),
          lastFetchTime: Date.now() 
        });
        calculateTotal();
      },

      updateQuantity: (itemId, quantity) => {
        const { items, calculateTotal } = get();
        
        if (quantity <= 0) {
          set({ 
            items: items.filter((i) => i.id !== itemId),
            lastFetchTime: Date.now() 
          });
        } else {
          const updatedItems = items.map((item) =>
            item.id === itemId
              ? {
                  ...item,
                  quantity,
                  total_amount: (parseFloat(item.unit_price) * quantity).toFixed(2),
                }
              : item
          );
          set({ items: updatedItems, lastFetchTime: Date.now() });
        }
        
        calculateTotal();
      },

      clearCart: () => set({ items: [], total: 0, lastFetchTime: Date.now() }),

      calculateTotal: () => {
        const { items } = get();
        const total = items.reduce(
          (sum, item) => sum + parseFloat(item.total_amount),
          0
        );
        set({ total: Math.round(total * 100) / 100 });
      },
    }),
    {
      name: 'cart-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        items: state.items,
        total: state.total,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.calculateTotal();
        }
      },
    }
  )
);
'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useCart } from '@/hooks/useCart';
import { apiClient } from '@/lib/api';
import CartItem from './CartItem';
import CartSummary from './CartSummary';
import ContinueShopping from './ContinueShopping';
import RelatedProducts from './RelatedProducts';
import EmptyCart from './EmptyCart';

export default function CartContent() {
  const { items, total, removeItem, updateItem, isHydrated } = useCart();
  const [deletingItems, setDeletingItems] = useState<Set<number>>(new Set());
  const [cancellingItems, setCancellingItems] = useState<Set<number>>(new Set());
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [loadingRelated, setLoadingRelated] = useState(false);
  const cancellingRef = useRef<Set<number>>(new Set());

  useEffect(() => {
    if (isHydrated && items.length > 0) {
      fetchRelatedProducts();
    } else {
      setRelatedProducts([]);
    }
  }, [items.length, isHydrated]);

  useEffect(() => {
    cancellingRef.current = new Set(cancellingItems);
  }, [cancellingItems]);

  const fetchRelatedProducts = async () => {
    setLoadingRelated(true);
    try {
      const relatedMap = new Map();
      const productsPerItem = Math.max(1, Math.floor(4 / items.length));

      for (const item of items) {
        if (item.is_bundle) {
          continue;
        }

        if (item.product_slug) {
          try {
            const response = await apiClient.get(`/products/${item.product_slug}`);
            const productData = response.data as { relatedProducts?: any[] };

            if (productData.relatedProducts && productData.relatedProducts.length > 0) {
              const filtered = productData.relatedProducts
                .filter((rp: any) => !items.some(ci => ci.product_id === rp.id))
                .slice(0, productsPerItem);

              filtered.forEach((rp: any) => {
                if (!relatedMap.has(rp.id)) {
                  relatedMap.set(rp.id, rp);
                }
              });
            }
          } catch (error) {
            console.error(`Error fetching related products for ${item.product_slug}:`, error);
          }
        }
      }

      setRelatedProducts(Array.from(relatedMap.values()).slice(0, 4));
    } catch (error) {
      console.error('Error fetching related products:', error);
    } finally {
      setLoadingRelated(false);
    }
  };

  const handleRemoveItem = (itemId: number) => {
    setDeletingItems(prev => new Set(prev).add(itemId));
    setCancellingItems(prev => new Set(prev).add(itemId));

    const timeoutId = setTimeout(() => {
      if (cancellingRef.current.has(itemId)) {
        removeItem(itemId);

        setDeletingItems(prev => {
          const newSet = new Set(prev);
          newSet.delete(itemId);
          return newSet;
        });

        setCancellingItems(prev => {
          const newSet = new Set(prev);
          newSet.delete(itemId);
          return newSet;
        });
      }
    }, 3000);

    (window as any)[`removeTimeout_${itemId}`] = timeoutId;
  };

  const handleCancelRemove = (itemId: number) => {
    const timeoutId = (window as any)[`removeTimeout_${itemId}`];
    if (timeoutId) {
      clearTimeout(timeoutId);
      delete (window as any)[`removeTimeout_${itemId}`];
    }

    setDeletingItems((prev) => {
      const newSet = new Set(prev);
      newSet.delete(itemId);
      return newSet;
    });
    setCancellingItems((prev) => {
      const newSet = new Set(prev);
      newSet.delete(itemId);
      return newSet;
    });
  };

  const handleQuantityChange = (itemId: number, newQuantity: number) => {
    if (newQuantity >= 1) {
      updateItem(itemId, newQuantity);
    }
  };

  if (!isHydrated) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#00BFA6] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[#777777]">Зареждаме на количката...</p>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return <EmptyCart />;
  }

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Cart Items */}
      <div className="lg:col-span-2">
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="text-3xl font-bold text-[#1F1F1F] mb-6"
        >
          Количка ({totalItems} {totalItems === 1 ? 'продукт' : 'продукта'})
        </motion.h1>

        <div className="space-y-4">
          {items.map((item, index) => (
            <CartItem
              key={item.id}
              item={item}
              index={index}
              isDeleting={deletingItems.has(item.id)}
              isCancellable={cancellingItems.has(item.id)}
              onRemove={handleRemoveItem}
              onCancelRemove={handleCancelRemove}
              onQuantityChange={handleQuantityChange}
            />
          ))}
        </div>

        {relatedProducts.length > 0 && (
          <RelatedProducts products={relatedProducts} loading={loadingRelated} />
        )}

        <ContinueShopping />
      </div>

      {/* Cart Summary */}
      <CartSummary items={items} total={total} totalItems={totalItems} />
    </div>
  );
}
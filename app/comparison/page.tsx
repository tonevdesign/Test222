'use client';

import { useEffect, useState } from 'react';
import { ShoppingCart, Trash2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useComparisonStore } from '@/store/comparisonStore';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { Breadcrumbs } from '@/components/common/Breadcrumbs';
import { formatPrice } from '@/lib/utils';
import { getImageUrl } from '@/lib/imageUtils';
import { useCartStore } from '@/store/cartStore';
import EmptyComparison from '@/components/comparison/EmptyComparison';
import { ComparisonItem } from '@/types/comparison';
import { VariantAttribute, ProductVariant } from '@/types/product';

// Helper to get variant display name
const getVariantDisplayName = (item: ComparisonItem): string => {
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
    
    // Build from attributes
    if (variant?.variantAttributes && variant.variantAttributes.length > 0) {
      return variant.variantAttributes
        .map(va => va.attributeValue.value)
        .join(' - ');
    }
  }
  
  return '';
};

export default function ComparisonPage() {
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [removingIds, setRemovingIds] = useState<Set<number>>(new Set());

  // Access store directly for better performance
  const items = useComparisonStore((state) => state.items);
  const isLoading = useComparisonStore((state) => state.isLoading);
  const fetchComparison = useComparisonStore((state) => state.fetchComparison);
  const removeFromComparison = useComparisonStore((state) => state.removeFromComparison);
  const clearComparison = useComparisonStore((state) => state.clearComparison);
  
  const addToCart = useCartStore((state) => state.addToCart);

  // Only fetch full comparison data when page loads
  useEffect(() => {
    fetchComparison().finally(() => setIsInitialLoad(false));
  }, [fetchComparison]);

  const handleRemove = async (itemId: number) => {
    const item = items.find(i => i.id === itemId);
    if (!item) return;
    
    const productId = item.product_id;
    
    // Prevent duplicate clicks
    if (removingIds.has(productId)) {
      return;
    }
    
    setRemovingIds(prev => new Set([...prev, productId]));
    
    try {
      await removeFromComparison(itemId);
    } catch (error) {
      console.error('Error removing item:', error);
    } finally {
      // Remove from local tracking after a delay
      setTimeout(() => {
        setRemovingIds(prev => {
          const next = new Set(prev);
          next.delete(productId);
          return next;
        });
      }, 300);
    }
  };

  const handleClearAll = async () => {
    if (isLoading) return;
    
    try {
      await clearComparison();
    } catch (error) {
      console.error('Error clearing comparison:', error);
    }
  };

  const handleAddToCart = async (item: ComparisonItem) => {
    // Get the correct variant
    let variant: ProductVariant | undefined;
    
    if (item.product?.selectedVariant) {
      variant = {
        id: item.product.selectedVariant.id,
        price: item.product.selectedVariant.price,
        sale_price: item.product.selectedVariant.sale_price,
        stock_quantity: item.product.selectedVariant.stock_quantity,
      } as ProductVariant;
    } else if (item.variant_id && item.product?.variants) {
      variant = item.product.variants.find(v => v.id === item.variant_id);
    } else {
      variant = item.product?.variants?.[0];
    }

    if (!variant || !item.product) {
      return;
    }

    try {
      const variantDisplayName = getVariantDisplayName(item);

      const cartItem = {
        id: Date.now(),
        product_id: item.product.id,
        variant_id: variant.id,
        product_name: item.product.name,
        product_slug: item.product.slug,
        variant_name: variantDisplayName || undefined,
        quantity: 1,
        unit_price: variant.sale_price || variant.price,
        regular_price: variant.price,
        sale_price: variant.sale_price || undefined,
        total_amount: variant.sale_price || variant.price,
        image_url: item.product.images?.[0]?.thumbnail_url || '',
      };

      addToCart(cartItem);
      
      // Remove from comparison after adding to cart
      await removeFromComparison(item.id);

    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  // Show loading only on initial load
  if (isInitialLoad && isLoading) {
    return <LoadingSpinner fullScreen text="Зареждане на сравнение..." />;
  }

  // Empty state
  if (items.length === 0 && !isLoading) {
    return (
      <div className="min-h-screen bg-[#F5F5F5] py-6 md:py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs
            items={[{ label: 'Сравнение на продукти' }]}
            className="mb-6"
          />

          <EmptyComparison />
        </div>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-[#F5F5F5] py-6 md:py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <Breadcrumbs
            items={[{ label: 'Сравнение на продукти' }]}
            className="mb-4"
          />

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-[#1F1F1F] mb-1">
                Сравнение на продукти
              </h1>
              <p className="text-sm md:text-base text-[#777777]">
                Максимум 4 продукта ({items.length}/4)
              </p>
            </div>

            <Button
              onClick={handleClearAll}
              variant="outline"
              size="sm"
              className="gap-2 w-full sm:w-auto"
              disabled={isLoading}
            >
              <Trash2 size={16} />
              Изчисти всички
            </Button>
          </div>
        </div>

        {/* Comparison Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {items.map((item, index) => {
            // Get correct variant
            let variant: ProductVariant | undefined;
            
            if (item.product?.selectedVariant) {
              variant = {
                id: item.product.selectedVariant.id,
                price: item.product.selectedVariant.price,
                sale_price: item.product.selectedVariant.sale_price,
                stock_quantity: item.product.selectedVariant.stock_quantity,
              } as ProductVariant;
            } else if (item.variant_id && item.product?.variants) {
              variant = item.product.variants.find(v => v.id === item.variant_id);
            } else {
              variant = item.product?.variants?.[0];
            }

            const isSale = variant?.sale_price;
            const currentPrice = variant?.sale_price || variant?.price;
            const isOutOfStock = !variant || variant.stock_quantity === 0;
            
            // ✅ Get variant display name
            const variantDisplayName = getVariantDisplayName(item);

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card className="relative h-full flex flex-col overflow-hidden hover:shadow-lg transition-shadow">
                  {/* Remove Button */}
                  <button
                    onClick={() => handleRemove(item.id)}
                    disabled={removingIds.has(item.product_id)}
                    className="absolute top-2 sm:top-3 right-2 sm:right-3 z-10 w-8 h-8 sm:w-10 sm:h-10 bg-white/90 
                      backdrop-blur-sm rounded-full flex items-center 
                      justify-center shadow-lg hover:bg-red-50 transition-colors
                      disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Премахни продукт"
                  >
                    <Trash2 size={14} className="text-red-600 sm:w-[18px] sm:h-[18px]" />
                  </button>

                  {/* Product Image */}
                  <Link href={`/products/${item.product?.slug}`}>
                    <div className="relative w-full aspect-square bg-[#F5F5F5] hover:opacity-90 transition-opacity">
                      {item.product?.images?.[0] ? (
                        <Image
                          src={getImageUrl(
                            item.product.images[0].thumbnail_url ||
                              item.product.images[0].image_url
                          )}
                          alt={`${item.product.name}${variantDisplayName ? ` - ${variantDisplayName}` : ''}`}
                          fill
                          loading="eager"
                          className="object-contain"
                          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-sm text-[#777777]">
                            Няма изображение
                          </span>
                        </div>
                      )}
                    </div>
                  </Link>

                  {/* Product Info */}
                  <div className="p-4 flex flex-col flex-grow">
                    {/* Brand */}
                    {item.product?.brand && (
                      <p className="text-xs text-[#777777] mb-1">
                        {item.product.brand.name}
                      </p>
                    )}

                    {/* Product Name + Variant Name */}
                    <div className="min-h-[2.6rem]">
                      <Link href={`/products/${item.product?.slug}`}>
                        <h3 className="font-semibold text-[#1F1F1F] text-sm mb-1 hover:text-[#00BFA6] transition-colors line-clamp-2">
                          {item.product?.name}
                        </h3>
                      </Link>
                      
                      {/* ✅ Variant Name */}
                      {variantDisplayName && (
                        <p className="text-xs text-[#777777] mb-3">
                          {variantDisplayName}
                        </p>
                      )}
                    </div>

                    {/* Price */}
                    <div className="mb-3">
                      <div className="flex items-baseline gap-2">
                        <span className="text-xl font-bold text-[#00BFA6]">
                          {currentPrice ? formatPrice(currentPrice) : '-'}
                        </span>
                        {isSale && variant && (
                          <span className="text-sm text-[#777777] line-through">
                            {formatPrice(variant.price)}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Stock Status */}
                    <div className="mb-4">
                      {variant && variant.stock_quantity > 0 ? (
                        variant.stock_quantity < 10 ? (
                          <span className="inline-block px-2 py-1 text-xs font-medium text-yellow-800 bg-yellow-100 rounded">
                            Ниско количество
                          </span>
                        ) : (
                          <span className="inline-block px-2 py-1 text-xs font-medium text-[#00BFA6] bg-[#E6FBF8] rounded">
                            В наличност
                          </span>
                        )
                      ) : (
                        <span className="inline-block px-2 py-1 text-xs font-medium text-red-700 bg-red-50 rounded">
                          Изчерпано
                        </span>
                      )}
                    </div>

                    {/* Attributes */}
                    {variant?.variantAttributes && variant.variantAttributes.length > 0 && (
                      <div className="mb-4 space-y-2 flex-grow">
                        {variant.variantAttributes.map(
                          (varAttr: VariantAttribute) => (
                            <div key={varAttr.attribute.id} className="text-xs">
                              <span className="font-medium text-[#333333]">
                                {varAttr.attribute.name}:
                              </span>{' '}
                              <span className="text-[#777777]">
                                {varAttr.attributeValue?.value || '-'}
                              </span>
                            </div>
                          )
                        )}
                      </div>
                    )}
                      
                    {/* Add to Cart Button */}
                    <Button
                      onClick={() => handleAddToCart(item)}
                      disabled={isOutOfStock || isLoading}
                      size="sm"
                      className="w-full gap-2 mt-auto"
                    >
                      <ShoppingCart size={16} />
                      Добави в количка
                    </Button>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
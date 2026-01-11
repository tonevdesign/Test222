'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Heart, ShoppingCart, Trash2, Package, ArrowRight } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { WishlistItem } from '@/types/wishlist';
import type { Bundle } from '@/types/bundle';
import { formatPrice, calculateDiscount } from '@/lib/utils';
import { getImageUrl } from '@/lib/imageUtils';
import { createBundleCartItem } from '@/lib/cartHelpers';
import { useCartStore } from '@/store/cartStore';

interface WishlistGridProps {
  items: WishlistItem[];
  onRemove: (itemId: number) => Promise<void>;
  onMoveToCart: (item: WishlistItem) => Promise<void>;
  onMove?: (item: WishlistItem) => void;
  showMoveButton?: boolean;
}

export function WishlistGrid({
  items,
  onRemove,
  onMoveToCart,
  onMove,
  showMoveButton = false
}: WishlistGridProps) {
  const [removingIds, setRemovingIds] = useState<number[]>([]);
  const [addingToCartIds, setAddingToCartIds] = useState<number[]>([]);
  const addToCart = useCartStore((state) => state.addToCart);

  const handleRemove = async (itemId: number) => {
    try {
      setRemovingIds((prev) => [...prev, itemId]);
      await onRemove(itemId);
    } catch (error) {
      console.error('Failed to remove:', error);
    } finally {
      setRemovingIds((prev) => prev.filter((id) => id !== itemId));
    }
  };

  const handleMoveToCart = async (item: WishlistItem) => {
    try {
      setAddingToCartIds((prev) => [...prev, item.id]);

      if (item.bundle) {
        const imagePath =
          item.bundle.image_url ||
          item.bundle.media?.file_path ||
          item.bundle.media?.filename;

        const cartItem = createBundleCartItem(
          item.bundle as unknown as Bundle,
          imagePath ?? undefined
        );
        addToCart(cartItem);
        await onRemove(item.id);
        return;
      }

      await onMoveToCart(item);
    } catch (error) {
      console.error('Failed to add to cart:', error);
    } finally {
      setAddingToCartIds((prev) => prev.filter((id) => id !== item.id));
    }
  };

  // ✅ Get variant info (use selectedVariant if available, otherwise get default)
  const getVariantInfo = (item: WishlistItem) => {
    if (!item.product) return null;
    
    // If backend provided selectedVariant info, use it
    if (item.product.selectedVariant) {
      return item.product.selectedVariant;
    }
    
    // Otherwise fallback to default variant
    const variant = item.product.variants?.find((v) => v.is_default) || item.product.variants?.[0];
    return variant ? {
      id: variant.id,
      name: variant.variant_name || '',
      price: variant.price,
      sale_price: variant.sale_price,
      stock_quantity: variant.stock_quantity
    } : null;
  };

  const getImage = (item: WishlistItem) => {
    if (item.product) {
      // Images are already filtered by backend to show variant-specific images
      const primary = item.product.images?.find((img) => img.is_primary);
      return (
        primary?.thumbnail_url ||
        primary?.image_url ||
        item.product.images?.[0]?.thumbnail_url ||
        item.product.images?.[0]?.image_url ||
        null
      );
    }

    if (item.bundle) {
      return (
        item.bundle.image_url ||
        item.bundle.media?.file_path ||
        null
      );
    }

    return null;
  };

  const getDiscount = (item: WishlistItem) => {
    if (item.product) {
      const variantInfo = getVariantInfo(item);
      if (variantInfo?.sale_price) {
        return calculateDiscount(variantInfo.price, variantInfo.sale_price);
      }
      return 0;
    }

    if (item.bundle?.bundle_pricing) {
      return item.bundle.bundle_pricing.savings_percentage;
    }

    return 0;
  };

  const isOutOfStock = (item: WishlistItem) => {
    if (!item.product) return false;
    const variantInfo = getVariantInfo(item);
    return !variantInfo || variantInfo.stock_quantity === 0;
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
      {items.map((item, index) => {
        const variantInfo = getVariantInfo(item);
        const discount = getDiscount(item);

        const isRemoving = removingIds.includes(item.id);
        const isAddingToCart = addingToCartIds.includes(item.id);

        const isProduct = !!item.product;
        const isBundle = !!item.bundle;

        const link = isProduct
          ? `/products/${item.product!.slug}`
          : `/bundles/${item.bundle!.slug}`;

        const image = getImage(item);

        return (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          >
            <Card className="group relative overflow-hidden hover:shadow-xl transition-all">
              <Link href={link}>
                <div className="relative bg-white overflow-hidden aspect-square">

                  {image ? (
                    <Image
                      src={getImageUrl(image)}
                      alt={ isProduct? `${item.product!.name}${variantInfo?.name ? ` - ${variantInfo.name}` : ''}`: item.bundle!.name}
                      fill
                      priority
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-[#F5F5F5]">
                      {isBundle ? (
                        <Package size={32} className="text-[#777777] sm:w-12 sm:h-12" />
                      ) : (
                        <Heart size={32} className="text-[#777777] sm:w-12 sm:h-12" />
                      )}
                    </div>
                  )}

                  {/* BADGES */}
                  <div className="absolute top-2 sm:top-3 left-2 sm:left-3 flex flex-col sm:flex-row flex-wrap gap-1 sm:gap-2 max-w-[calc(100%-4rem)]">
                    {isBundle && (
                      <Badge variant="primary" size="sm">Пакет</Badge>
                    )}

                    {isProduct && variantInfo && variantInfo.stock_quantity > 0 && (
                      <Badge
                        variant={variantInfo.stock_quantity < 10 ? 'warning' : 'success'}
                        size="sm"
                      >
                        {variantInfo.stock_quantity < 10
                          ? 'Ниско количество'
                          : 'В наличност'}
                      </Badge>
                    )}

                    {discount > 0 && (
                      <Badge variant="dangerSolid" size="sm">
                        -{discount}%
                      </Badge>
                    )}
                  </div>

                  {/* REMOVE BUTTON */}
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      handleRemove(item.id);
                    }}
                    disabled={isRemoving}
                    className="absolute top-2 sm:top-3 right-2 sm:right-3 z-10 w-8 h-8 sm:w-10 sm:h-10 bg-white/90 
                      backdrop-blur-sm rounded-full flex items-center 
                      justify-center shadow-lg hover:bg-red-50 transition-colors
                      disabled:opacity-50"
                  >
                    {isRemoving ? (
                      <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-red-600 border-t-transparent 
                        rounded-full animate-spin" />
                    ) : (
                      <Trash2 size={14} className="text-red-600 sm:w-[18px] sm:h-[18px]" />
                    )}
                  </button>
                </div>
              </Link>

              {/* INFO */}
              <div className="p-3 sm:p-4">
                <Link href={link}>
                  <div className="min-h-[2.6rem] sm:min-h-[3rem] mb-2">
                    <h3
                      className="font-semibold text-[#1F1F1F] line-clamp-2 
                        hover:text-[#00BFA6] transition-colors text-xs sm:text-sm"
                    >
                      {isProduct ? item.product!.name : item.bundle!.name}
                    </h3>

                    {/* Variant name (products only) */}
                    {isProduct && variantInfo?.name && (
                      <p className="text-[10px] sm:text-xs text-[#777777] mt-0.5">
                        {variantInfo.name}
                      </p>
                    )}
                  </div>

                  {/* PRICE DISPLAY */}
                  {isProduct && variantInfo && (
                    <div className="flex items-baseline gap-1 sm:gap-2 mb-2">
                      {variantInfo.sale_price ? (
                        <>
                          <span className="text-base sm:text-xl font-bold text-[#00BFA6]">
                            {formatPrice(variantInfo.sale_price)}
                          </span>
                          <span className="text-xs sm:text-sm text-[#777777] line-through">
                            {formatPrice(variantInfo.price)}
                          </span>
                        </>
                      ) : (
                        <span className="text-base sm:text-xl font-bold text-[#1F1F1F]">
                          {formatPrice(variantInfo.price)}
                        </span>
                      )}
                    </div>
                  )}

                  {isBundle && item.bundle!.bundle_pricing && (
                    <div className="flex flex-col mb-2">
                      <span className="text-base sm:text-xl font-bold text-[#00BFA6]">
                        {formatPrice(item.bundle!.bundle_pricing.bundle_price)}
                      </span>
                    </div>
                  )}

                  <p className="text-[10px] sm:text-xs text-[#777777]">
                    Добавено{' '}
                    {new Date(item.added_at).toLocaleDateString('bg-BG', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </p>
                </Link>

                {/* BUTTONS */}
                <div className="flex flex-col gap-2 mt-3">

                  {showMoveButton && onMove && (
                    <Button
                      onClick={() => onMove(item)}
                      variant="outline"
                      size="sm"
                      className="w-full gap-1 sm:gap-2 text-xs sm:text-sm"
                    >
                      <ArrowRight size={14} className="sm:w-4 sm:h-4" />
                      <span className="hidden sm:inline">Премести</span>
                      <span className="sm:hidden">Премести</span>
                    </Button>
                  )}

                  <Button
                    onClick={() => handleMoveToCart(item)}
                    disabled={
                      isAddingToCart ||
                      (isProduct && isOutOfStock(item))
                    }
                    size="sm"
                    className="w-full gap-1 sm:gap-2 text-xs sm:text-sm"
                  >
                    {isAddingToCart ? (
                      <>
                        <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-white border-t-transparent 
                          rounded-full animate-spin" />
                        <span className="hidden sm:inline">Добавяне...</span>
                        <span className="sm:hidden">...</span>
                      </>
                    ) : (
                      <>
                        <ShoppingCart size={14} className="sm:w-4 sm:h-4" />
                        <span className="hidden sm:inline">Добави в количката</span>
                        <span className="sm:hidden">Количка</span>
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}
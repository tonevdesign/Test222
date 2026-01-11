'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, ShoppingCart, Scale } from 'lucide-react';
import { motion } from 'framer-motion';
import { calculateDiscount, formatPrice } from '@/lib/utils';
import { useCartStore } from '@/store/cartStore';
import { useWishlist } from '@/hooks/useWishlist';
import { useComparison } from '@/hooks/useComparison';
import { useAuth } from '@/hooks/useAuth';
import { Product, ProductVariant } from '@/types/product';
import { getImageUrl } from '@/lib/imageUtils';
import { useRouter } from 'next/navigation';
import { Badge } from '../ui/badge';

interface ProductCardProps {
  product: Product;
}

// Helper to get variant display name
const getVariantDisplayName = (variant: ProductVariant): string => {
  if (variant.variant_name) {
    return variant.variant_name;
  }
  
  if (variant.variantAttributes && variant.variantAttributes.length > 0) {
    return variant.variantAttributes
      .map(va => va.attributeValue.value)
      .join(' - ');
  }
  
  // Return empty string for all variants (including default)
  // The cart will handle display - empty string means no variant badge needed
  return '';
};

export default function ProductCard({ product }: ProductCardProps) {
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isTogglingWishlist, setIsTogglingWishlist] = useState(false);
  const [isTogglingComparison, setIsTogglingComparison] = useState(false);

  const { addToCart } = useCartStore();
  const { isAuthenticated } = useAuth();
  
  // Use hooks for wishlist and comparison (variant-aware)
  const { toggleWishlist, isVariantInWishlist } = useWishlist();
  const { toggleComparison, isVariantInComparison, canAddMore } = useComparison();

  const variant = product.variants?.[0];
  const primaryImage = product.images?.[0];
  const secondaryImage = product.images?.[1];

  if (!variant) return null;

  // ✅ Check if THIS SPECIFIC VARIANT is in wishlist/comparison
  const inWishlist = isVariantInWishlist(product.id, variant.id);
  const inComparison = isVariantInComparison(product.id, variant.id);

  const isSale = !!variant.sale_price;
  const currentPrice = variant.sale_price || variant.price;

  const discount = isSale
    ? calculateDiscount(Number(variant.price), Number(variant.sale_price!))
    : 0;

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    
    if (isAddingToCart) return;
    
    setIsAddingToCart(true);

    try {
      // ✅ Get variant display name
      const variantDisplayName = getVariantDisplayName(variant);

      const cartItem = {
        id: Date.now(),
        product_id: product.id,
        variant_id: variant.id,
        product_name: product.name,
        product_slug: product.slug,
        variant_name: variantDisplayName, // ✅ Include variant_name (can be empty string)
        quantity: 1,
        unit_price: variant.sale_price || variant.price,
        regular_price: variant.price,
        sale_price: variant.sale_price || undefined,
        total_amount: currentPrice,
        image_url: primaryImage?.thumbnail_url || primaryImage?.image_url || '',
      };

      addToCart(cartItem);

      setTimeout(() => {
        setIsAddingToCart(false);
      }, 500);
    } catch (error) {
      console.error('Error adding to cart:', error);
      setIsAddingToCart(false);
    }
  };

  const handleToggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    
    if (isTogglingWishlist) return;
    
    if (!isAuthenticated) {
      router.push(`/login?redirect=/products/${product.slug}`);
      return;
    }

    setIsTogglingWishlist(true);
    try {
      // ✅ Pass variant ID to toggle specific variant
      await toggleWishlist(product.id, { variantId: variant.id });
    } catch (error) {
      console.error('Error toggling wishlist:', error);
    } finally {
      setIsTogglingWishlist(false);
    }
  };

  const handleToggleComparison = async (e: React.MouseEvent) => {
    e.preventDefault();
    
    if (isTogglingComparison) return;

    setIsTogglingComparison(true);
    try {
      // ✅ Pass variant ID to toggle specific variant
      await toggleComparison(product.id, variant.id);
    } catch (error) {
      console.error('Error toggling comparison:', error);
    } finally {
      setIsTogglingComparison(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Link href={`/products/${product.slug}`}>
        <div className="bg-white rounded-lg overflow-hidden border border-[#F5F5F5] hover:border-[#E0E0E0] transition-all duration-300">
          {/* Image Container */}
          <div className="relative w-full aspect-square overflow-hidden bg-[#F5F5F5] group">
            {/* Primary Image */}
            {primaryImage ? (
              <motion.div
                animate={{ opacity: isHovered && secondaryImage ? 0 : 1 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <div className="relative w-full h-full">
                  <Image
                    src={getImageUrl(primaryImage?.thumbnail_url || primaryImage?.image_url)}
                    alt={product.name}
                    loading="eager"
                    fill
                    className="object-contain"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>
              </motion.div>
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-[#F5F5F5]">
                <span className="text-[#777777]">Няма изображение</span>
              </div>
            )}

            {/* Secondary Image on Hover - Desktop Only */}
            {secondaryImage && (
              <motion.div
                animate={{ opacity: isHovered ? 1 : 0 }}
                transition={{ duration: 0.3 }}
                className="hidden md:block absolute inset-0"
              >
                <div className="relative w-full h-full">
                  <Image
                    src={getImageUrl(secondaryImage.thumbnail_url || secondaryImage.image_url)}
                    alt={product.name}
                    fill
                    className="object-contain"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>
              </motion.div>
            )}

            {/* Badges */}
            <div className="absolute top-3 left-3 z-20 flex flex-row flex-wrap gap-1 sm:gap-2 max-w-[calc(100%-4rem)]">
              {variant.stock_quantity > 0 && (
                <Badge
                  variant={variant.stock_quantity < 10 ? 'warning' : 'success'}
                  size="sm"
                >
                  {variant.stock_quantity < 10 ? 'Ниско количество' : 'В наличност'}
                </Badge>
              )}

              {discount > 0 && (
                <Badge variant="dangerSolid" size="sm">
                  -{discount}%
                </Badge>
              )}
            </div>

            {/* Action Buttons - Desktop Only (md and up) */}
            <motion.div
              animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 20 }}
              transition={{ duration: 0.3 }}
              className="hidden md:flex absolute inset-0 bg-black/40 items-center justify-center gap-3"
            >
              {/* Add to Cart Button */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleAddToCart}
                disabled={isAddingToCart || variant.stock_quantity === 0}
                className="p-3 bg-[#00BFA6] text-white rounded-full hover:bg-[#00a08c] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Добави в количката"
              >
                {isAddingToCart ? (
                  <div className="animate-spin h-6 w-6 border-2 border-white border-t-transparent rounded-full" />
                ) : (
                  <ShoppingCart size={24} />
                )}
              </motion.button>

              {/* Wishlist Button - ✅ Now variant-aware */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleToggleWishlist}
                disabled={isTogglingWishlist}
                className={`p-3 rounded-full transition-all disabled:opacity-50 ${
                  inWishlist
                    ? 'bg-red-500 text-white'
                    : 'bg-white text-[#333333] hover:bg-[#A8FFF5]'
                }`}
                aria-label="Добави в любими"
              >
                {isTogglingWishlist ? (
                  <div className="animate-spin h-6 w-6 border-2 border-current border-t-transparent rounded-full" />
                ) : (
                  <Heart size={24} fill={inWishlist ? 'currentColor' : 'none'} />
                )}
              </motion.button>

              {/* Comparison Button - ✅ Now variant-aware */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleToggleComparison}
                disabled={isTogglingComparison || (!inComparison && !canAddMore)}
                className={`p-3 rounded-full transition-all disabled:opacity-50 ${
                  inComparison
                    ? 'bg-[#00BFA6] text-white'
                    : 'bg-white text-[#333333] hover:bg-[#A8FFF5]'
                }`}
                aria-label="Добави за сравнение"
              >
                {isTogglingComparison ? (
                  <div className="animate-spin h-6 w-6 border-2 border-current border-t-transparent rounded-full" />
                ) : (
                  <Scale size={24} />
                )}
              </motion.button>
            </motion.div>

            {/* Stock Status */}
            {variant.stock_quantity === 0 && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <span className="text-white font-bold text-lg">Изчерпано</span>
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="p-4">
            {product.brand && (
              <p className="text-xs text-[#777777] font-medium mb-1">
                {product.brand.name}
              </p>
            )}

            <h3 className="font-semibold text-[#1F1F1F] mb-2 line-clamp-2 min-h-[3rem] hover:text-[#00BFA6] transition-colors">
              {product.name}
            </h3>

            <div className="flex items-baseline gap-2">
              <span className="font-bold text-lg text-[#00BFA6]">
                {formatPrice(currentPrice)}
              </span>
              {isSale && (
                <span className="text-sm text-[#777777] line-through">
                  {formatPrice(variant.price)}
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, ShoppingCart, Plus, Minus, Scale } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { useWishlist } from '@/hooks/useWishlist';
import { useComparison } from '@/hooks/useComparison';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { Product, ProductImage, ProductVariant } from '@/types/product';

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
  
  return variant.is_default ? '' : 'Вариант';
};

export function ProductActions({
  product,
  variant,
  currentPrice,
  primaryImage
}: {
  product: Product;
  variant?: ProductVariant;
  currentPrice: string;
  primaryImage?: ProductImage;
}) {
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isTogglingWishlist, setIsTogglingWishlist] = useState(false);
  const [isTogglingComparison, setIsTogglingComparison] = useState(false);

  const { addToCart } = useCartStore();
  const { toggleWishlist, isVariantInWishlist } = useWishlist();
  const { toggleComparison, isVariantInComparison, canAddMore } = useComparison();
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const { ensureWishlistLoaded } = useWishlist();

  useEffect(() => {
    ensureWishlistLoaded();
  }, [ensureWishlistLoaded]);

  // ✅ Check if THIS SPECIFIC VARIANT is in wishlist
  const inWishlist = isVariantInWishlist(product.id, variant?.id);

  // ✅ Check if THIS SPECIFIC VARIANT is in comparison
  const inComparison = isVariantInComparison(product.id, variant?.id);

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= (variant?.stock_quantity || 1)) {
      setQuantity(newQuantity);
    }
  };

  const getVariantPrimaryImage = (variant?: ProductVariant) => {
    if (!variant?.images || variant.images.length === 0) return null;

    return (
      variant.images.find(img => img.is_primary) ||
      variant.images[0]
    );
  };

  const handleAddToCart = async () => {
    if (!variant) return;

    setIsAddingToCart(true);

    try {
      const variantDisplayName = getVariantDisplayName(variant);

      const variantPrimaryImage = getVariantPrimaryImage(variant);

      const cartItem = {
        id: Date.now(),
        product_id: product.id,
        variant_id: variant.id,
        product_name: product.name,
        ...(variantDisplayName && { variant_name: variantDisplayName }),
        product_slug: product.slug,
        quantity,
        unit_price: variant.sale_price || variant.price,
        regular_price: variant.price,
        sale_price: variant.sale_price || undefined,
        total_amount: (parseFloat(currentPrice) * quantity).toString(),
        image_url:
          variantPrimaryImage?.image_url ||
          primaryImage?.image_url ||
          undefined,
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

  const handleToggleWishlist = async () => {
    if (!isAuthenticated) {
      router.push(`/login?redirect=/products/${product.slug}`);
      return;
    }

    setIsTogglingWishlist(true);
    try {
      // ✅ Pass variant ID to toggle specific variant
      await toggleWishlist(product.id, { variantId: variant?.id });
    } catch (error) {
      console.error('Error toggling wishlist:', error);
    } finally {
      setIsTogglingWishlist(false);
    }
  };

  const handleToggleComparison = async () => {
    setIsTogglingComparison(true);
    try {
      // ✅ Pass variant ID to toggle specific variant
      await toggleComparison(product.id, variant?.id);
    } catch (error) {
      console.error('Error toggling comparison:', error);
    } finally {
      setIsTogglingComparison(false);
    }
  };

  return (
    <div className="mb-6 sm:mb-8">
      {/* Mobile Layout - Stacked */}
      <div className="flex flex-col sm:hidden gap-3">

        {/* Top Row: Quantity + Compare + Wishlist */}
        <div className="flex items-center gap-3">

          {/* Quantity Selector */}
          <div className="flex items-center border-2 border-[#E0E0E0] rounded-lg overflow-hidden flex-1">
            <button
              onClick={() => handleQuantityChange(quantity - 1)}
              disabled={quantity === 1}
              className="flex-1 py-3 text-[#333333] hover:bg-[#F5F5F5] transition-colors disabled:opacity-50 flex items-center justify-center"
            >
              <Minus size={18} />
            </button>

            <span className="flex-1 py-3 text-base font-semibold text-[#1F1F1F] text-center border-x-2 border-[#E0E0E0]">
              {quantity}
            </span>

            <button
              onClick={() => handleQuantityChange(quantity + 1)}
              disabled={
                quantity >= (variant?.stock_quantity || 0) ||
                variant?.stock_quantity === 0
              }
              className="flex-1 py-3 text-[#333333] hover:bg-[#F5F5F5] transition-colors disabled:opacity-50 flex items-center justify-center"
            >
              <Plus size={18} />
            </button>
          </div>

          {/* Comparison Button - ✅ Now variant-aware */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleToggleComparison}
            disabled={isTogglingComparison || (!inComparison && !canAddMore)}
            className={`px-4 py-3 rounded-lg border-2 transition-all flex items-center justify-center ${
              inComparison
                ? 'bg-[#00BFA6] border-[#00BFA6] text-white'
                : 'border-[#E0E0E0] text-[#333333] hover:border-[#00BFA6]'
            }`}
            aria-label="Добави за сравнение"
          >
            {isTogglingComparison ? (
              <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
            ) : (
              <Scale size={18} />
            )}
          </motion.button>

          {/* Wishlist Button - ✅ Variant-aware */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleToggleWishlist}
            disabled={isTogglingWishlist}
            className={`px-4 py-3 rounded-lg border-2 transition-all flex items-center justify-center ${
              inWishlist
                ? 'bg-red-500 border-red-500 text-white'
                : 'border-[#E0E0E0] text-[#333333] hover:border-[#00BFA6]'
            }`}
            aria-label="Добави в любими"
          >
            {isTogglingWishlist ? (
              <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
            ) : (
              <Heart size={18} fill={inWishlist ? 'currentColor' : 'none'} />
            )}
          </motion.button>

        </div>

        {/* Full-Width Add to Cart Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleAddToCart}
          disabled={isAddingToCart || variant?.stock_quantity === 0}
          className="w-full px-4 py-3 bg-[#00BFA6] text-white font-semibold rounded-lg hover:bg-[#00a08c] transition-all disabled:opacity-50 flex items-center justify-center gap-2 text-sm"
        >
          {isAddingToCart ? (
            <>
              <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
              <span className="hidden xs:inline">Добавяне...</span>
            </>
          ) : (
            <>
              <ShoppingCart size={18} />
              <span className="hidden xs:inline">Добави в количката</span>
              <span className="inline xs:hidden">Добави</span>
            </>
          )}
        </motion.button>

      </div>

      {/* Desktop Layout - Horizontal */}
      <div className="hidden sm:flex gap-4">
        {/* Quantity Selector */}
        <div className="flex items-center border-2 border-[#E0E0E0] rounded-lg overflow-hidden">
          <button
            onClick={() => handleQuantityChange(quantity - 1)}
            disabled={quantity === 1}
            className="px-3 md:px-4 py-2.5 md:py-3 text-[#333333] hover:bg-[#F5F5F5] transition-colors disabled:opacity-50"
          >
            <Minus size={18} />
          </button>

          <span className="px-4 md:px-6 py-2.5 md:py-3 text-base md:text-lg font-semibold text-[#1F1F1F] min-w-[50px] md:min-w-[60px] text-center">
            {quantity}
          </span>

          <button
            onClick={() => handleQuantityChange(quantity + 1)}
            disabled={
              quantity >= (variant?.stock_quantity || 0) ||
              variant?.stock_quantity === 0
            }
            className="px-3 md:px-4 py-2.5 md:py-3 text-[#333333] hover:bg-[#F5F5F5] transition-colors disabled:opacity-50"
          >
            <Plus size={18} />
          </button>
        </div>

        {/* Add to Cart */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleAddToCart}
          disabled={isAddingToCart || variant?.stock_quantity === 0}
          className="flex-1 px-4 md:px-6 py-2.5 md:py-3 bg-[#00BFA6] text-white font-semibold rounded-lg hover:bg-[#00a08c] transition-all disabled:opacity-50 flex items-center justify-center gap-2 text-sm md:text-base"
        >
          {isAddingToCart ? (
            <>
              <span className="animate-spin h-4 w-4 md:h-5 md:w-5 border-2 border-white border-t-transparent rounded-full" />
              Добавяне...
            </>
          ) : (
            <>
              <ShoppingCart size={18} className="md:w-5 md:h-5" />
              Добави в количката
            </>
          )}
        </motion.button>

        {/* Wishlist Button - ✅ Variant-aware */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleToggleWishlist}
          disabled={isTogglingWishlist}
          className={`px-4 md:px-6 py-2.5 md:py-3 rounded-lg border-2 transition-all flex items-center justify-center ${
            inWishlist
              ? 'bg-red-500 border-red-500 text-white'
              : 'border-[#E0E0E0] text-[#333333] hover:border-[#00BFA6]'
          }`}
          aria-label="Добави в любими"
        >
          {isTogglingWishlist ? (
            <div className="animate-spin h-4 w-4 md:h-5 md:w-5 border-2 border-current border-t-transparent rounded-full" />
          ) : (
            <Heart size={18} className="md:w-5 md:h-5" fill={inWishlist ? 'currentColor' : 'none'} />
          )}
        </motion.button>

        {/* Comparison Button - ✅ Now variant-aware */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleToggleComparison}
          disabled={isTogglingComparison || (!inComparison && !canAddMore)}
          className={`px-4 md:px-6 py-2.5 md:py-3 rounded-lg border-2 transition-all flex items-center justify-center ${
            inComparison
              ? 'bg-[#00BFA6] border-[#00BFA6] text-white'
              : 'border-[#E0E0E0] text-[#333333] hover:border-[#00BFA6]'
          }`}
          aria-label="Добави за сравнение"
        >
          {isTogglingComparison ? (
            <div className="animate-spin h-4 w-4 md:h-5 md:w-5 border-2 border-current border-t-transparent rounded-full" />
          ) : (
            <Scale size={18} className="md:w-5 md:h-5" />
          )}
        </motion.button>
      </div>
    </div>
  );
}
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Heart, ShoppingCart, Package } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { getImageUrl } from '@/lib/imageUtils';
import { useCartStore } from '@/store/cartStore';
import { useWishlist } from '@/hooks/useWishlist';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { Bundle } from '@/types/bundle';
import { createBundleCartItem } from '@/lib/cartHelpers';
import { Badge } from '../ui/badge';

interface BundleCardProps {
  bundle: Bundle;
}

export default function BundleCard({ bundle }: BundleCardProps) {
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isTogglingWishlist, setIsTogglingWishlist] = useState(false);

  const { addToCart } = useCartStore();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { isAuthenticated } = useAuth();

  const primaryImage = bundle.media || bundle.images?.[0];
  const imagePath =
    primaryImage?.thumbnail_url ||
    primaryImage?.image_url ||
    (primaryImage?.file_path ?? bundle.image_url);
  const imageUrl = getImageUrl(imagePath ?? undefined);
  const pricing = bundle.bundle_pricing;
  const itemCount = bundle.bundleItems?.length || 0;
  
  // Check if bundle is in wishlist
  const inWishlist = isInWishlist(bundle.id, true);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    setIsAddingToCart(true);

    try {
      if (!pricing) {
        throw new Error('Bundle pricing is unavailable');
      }

      const cartItem = createBundleCartItem(bundle, imagePath || undefined);

      addToCart(cartItem);
      setTimeout(() => setIsAddingToCart(false), 500);
    } catch (error) {
      console.error('Error adding bundle to cart:', error);
      setIsAddingToCart(false);
    }
  };

  const handleToggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      router.push(`/login?redirect=/bundles/${bundle.slug}`);
      return;
    }

    setIsTogglingWishlist(true);
    try {
      // Pass bundle ID with isBundle flag
      await toggleWishlist(bundle.id, { isBundle: true });
    } catch (error) {
      console.error('Error toggling wishlist:', error);
    } finally {
      setIsTogglingWishlist(false);
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
        <div className="bg-white rounded-lg overflow-hidden border-2 border-[#00BFA6]/20 hover:border-[#00BFA6] transition-all duration-300 shadow-sm hover:shadow-lg">
          {/* Image Container */}
          <div className="relative w-full h-64 overflow-hidden bg-gradient-to-br from-[#00BFA6]/10 to-[#A8FFF5]/10 group">
            {imagePath ? (
              <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative w-full h-full">
                <Image
                  src={imageUrl}
                  alt={bundle.name}
                  fill
                  loading='eager'
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
            </div>
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Package size={64} className="text-[#00BFA6]/30" />
              </div>
            )}

            {/* Badge Group */}
            <div className="absolute top-3 left-3 z-20 flex items-center gap-2">
              {/* Bundle Badge */}
              <Badge variant="primary" size="sm" className="shadow-md">
                Пакетна сделка
              </Badge>

              {/* Discount Badge */}
              {pricing?.savings_percentage > 0 && (
                <Badge variant="danger" size="sm" className="!bg-[#FF4C4C] !text-white">
                  -{pricing.savings_percentage}%
                </Badge>
              )}
            </div>

            {/* Action Buttons */}
            <motion.div
              animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 20 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 bg-black/40 flex items-center justify-center gap-3"
            >
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleAddToCart}
                disabled={isAddingToCart}
                className="p-3 bg-[#00BFA6] text-white rounded-full hover:bg-[#00a08c] transition-colors disabled:opacity-50"
              >
                {isAddingToCart ? (
                  <div className="animate-spin h-6 w-6 border-2 border-white border-t-transparent rounded-full" />
                ) : (
                  <ShoppingCart size={24} />
                )}
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleToggleWishlist}
                disabled={isTogglingWishlist}
                className={`p-3 rounded-full transition-all ${
                  inWishlist ? 'bg-red-500 text-white' : 'bg-white text-[#333333]'
                } disabled:opacity-50`}
              >
                {isTogglingWishlist ? (
                  <div className="animate-spin h-5 w-5 border-2 border-current border-t-transparent rounded-full" />
                ) : (
                  <Heart size={24} fill={inWishlist ? 'currentColor' : 'none'} />
                )}
              </motion.button>
            </motion.div>

            {/* Item Count Indicator */}
            <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
              <Package size={14} className="text-[#00BFA6]" />
              <span>{itemCount} Продукта</span>
            </div>
          </div>

          {/* Bundle Info */}
          <div className="p-4">
            <h3 className="font-bold text-[#1F1F1F] mb-2 line-clamp-2 hover:text-[#00BFA6] transition-colors">
              {bundle.name}
            </h3>

            {/* Price Comparison */}
            {pricing && (
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-[#777777] line-through">
                    {formatPrice(pricing.original_price)}
                  </span>
                  <span className="text-xs text-[#FF4C4C] font-semibold">
                    -{formatPrice(pricing.savings)}
                  </span>
                </div>
                <div className="text-2xl font-bold text-[#00BFA6]">
                  {formatPrice(pricing.bundle_price)}
                </div>
              </div>
            )}

            {/* Bundle Description Preview */}
            {bundle.description && (
              <p className="text-xs text-[#777777] mt-2 line-clamp-2">
                {bundle.description}
              </p>
            )}
          </div>
        </div>
    </motion.div>
  );
}
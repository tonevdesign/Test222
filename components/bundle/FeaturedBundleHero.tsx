'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Package, ShoppingCart } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { getImageUrl } from '@/lib/imageUtils';
import { Bundle, BundleItem } from '@/types/bundle';
import { useCartStore } from '@/store/cartStore';
import { createBundleCartItem } from '@/lib/cartHelpers';
import { Button } from '../ui/button';

interface FeaturedBundleHeroProps {
  bundle: Bundle;
}

export default function FeaturedBundleHero({ bundle }: FeaturedBundleHeroProps) {
  const { addToCart } = useCartStore();
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  // Get the primary image from multiple possible locations
  const primaryImage = bundle.media || bundle.images?.[0];
  const imagePath =
    primaryImage?.thumbnail_url ||
    primaryImage?.image_url ||
    primaryImage?.file_path ||
    bundle.image_url ||
    '';
  const imageUrl = getImageUrl(imagePath || undefined);
  
  const pricing = bundle.bundle_pricing;
  const itemCount = bundle.bundleItems?.length || 0;

  const handleAddToCart = async () => {
    if (!pricing) return;
    setIsAddingToCart(true);
    try {
      const cartItem = createBundleCartItem(bundle, imagePath);
      addToCart(cartItem);
    } catch (error) {
      console.error('Failed to add bundle to cart:', error);
    } finally {
      setTimeout(() => setIsAddingToCart(false), 400);
    }
  };

  return (
    <section className="bg-gradient-to-br from-[#00BFA6]/10 via-[#A8FFF5]/5 to-white py-12 sm:py-16 lg:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Side: Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Bundle Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#00BFA6] to-[#00FFD1] text-white rounded-full mb-4 font-bold text-sm"
            >
              <span>ИЗКЛЮЧИТЕЛНА СДЕЛКА</span>
            </motion.div>

            {/* Title */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1F1F1F] mb-4 leading-tight"
            >
              {bundle.name}
            </motion.h2>

            {/* Description */}
            {bundle.description && (
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="text-lg text-[#777777] mb-6"
              >
                {bundle.description}
              </motion.p>
            )}

            {/* Bundle Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-white rounded-xl p-6 border-2 border-[#00BFA6]/20 mb-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-sm text-[#777777]">
                  <Package size={18} className="text-[#00BFA6]" />
                  <span>{itemCount} Включени продукта</span>
                </div>
                {pricing && pricing.savings_percentage > 0 && (
                  <div className="flex items-center gap-1 bg-[#FF4C4C]/10 text-[#FF4C4C] px-3 py-1 rounded-full text-sm font-bold">
                    <span>-{pricing.savings_percentage}%</span>
                  </div>
                )}
              </div>

              {/* Pricing */}
              {pricing && (
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl text-[#777777] line-through">
                      {formatPrice(pricing.original_price)}
                    </span>
                    <span className="text-lg font-semibold text-[#FF4C4C]">
                      Спестявате {formatPrice(pricing.savings)}!
                    </span>
                  </div>
                  <div className="text-4xl font-bold text-[#00BFA6]">
                    {formatPrice(pricing.bundle_price)}
                  </div>
                </div>
              )}

              {/* Bundle Items List */}
              {bundle.bundleItems && bundle.bundleItems.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-sm font-semibold text-[#1F1F1F] mb-2">Какво включва:</p>
                  <ul className="space-y-1">
                    {bundle.bundleItems.map((item: BundleItem, idx: number) => (
                      <li key={idx} className="text-sm text-[#777777] flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-[#00BFA6] rounded-full"></span>
                        <span className="font-medium text-[#00BFA6]">{item.quantity}x</span>
                        <span>{item.bundledProduct?.name || 'Product'}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Button
                size="lg"
                className="w-full"
                onClick={handleAddToCart}
                disabled={isAddingToCart}
              >
                <ShoppingCart size={20} />
                {isAddingToCart ? 'Добавяне...' : 'Добави пакета в количката'}
              </Button>
            </motion.div>
          </motion.div>

          {/* Right Side: Image */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="relative h-64 sm:h-96 lg:h-full min-h-[400px]"
          >
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={bundle.name}
                fill
                className="object-cover rounded-2xl shadow-2xl w-full h-full"
                priority
                sizes="(max-width: 640px) 100vw, 
                      (max-width: 1024px) 50vw, 
                      33vw"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-[#00BFA6]/20 to-[#A8FFF5]/20 rounded-2xl flex items-center justify-center">
                <Package size={128} className="text-[#00BFA6]/30" />
              </div>
            )}

            {/* Floating Savings Badge */}
            {pricing && pricing.savings_percentage > 0 && (
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute -top-4 -right-4 bg-[#FF4C4C] text-white rounded-full w-24 h-24 flex flex-col items-center justify-center shadow-2xl"
              >
                <span className="text-3xl font-bold">-{pricing.savings_percentage}%</span>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
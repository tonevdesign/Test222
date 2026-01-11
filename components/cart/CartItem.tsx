'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, Trash2, Gift, X } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { getImageUrl } from '@/lib/imageUtils';
import { formatPrice } from '@/lib/utils';
import type { CartItem as CartItemType, BundleCartProduct } from '@/types/cart';

interface CartItemProps {
  item: CartItemType;
  index: number;
  isDeleting: boolean;
  isCancellable: boolean;
  onRemove: (itemId: number) => void;
  onCancelRemove: (itemId: number) => void;
  onQuantityChange: (itemId: number, newQuantity: number) => void;
}

export default function CartItem({
  item,
  index,
  isDeleting,
  isCancellable,
  onRemove,
  onCancelRemove,
  onQuantityChange,
}: CartItemProps) {
  const isBundle = Boolean(item.is_bundle);
  
  // Only create links for products, not bundles
  const hasProductLink = !isBundle && item.product_slug;
  const productHref = item.product_slug ? `/products/${item.product_slug}` : '/products';

  const hasSalePrice = item.sale_price && item.regular_price;

  // Wrapper component
  const NameWrapper = ({ children }: { children: React.ReactNode }) => {
    if (hasProductLink) {
      return <Link href={productHref}>{children}</Link>;
    }
    return <div>{children}</div>;
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      layout
    >
      <div className="relative overflow-hidden rounded-lg">
        <motion.div
          animate={{ scaleX: isDeleting ? 1 : 0 }}
          transition={{ duration: 3, ease: 'linear' }}
          className="absolute inset-0 bg-red-500/30 origin-left z-0"
        />

        <AnimatePresence>
          {isCancellable && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="absolute inset-0 z-20 flex items-center justify-center bg-black/40 backdrop-blur-sm"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onCancelRemove(item.id)}
                className="bg-white text-[#1F1F1F] px-4 sm:px-8 py-2 sm:py-3 rounded-lg font-semibold shadow-xl hover:bg-[#F5F5F5] transition-colors flex items-center gap-1.5 sm:gap-2 text-sm sm:text-base"
              >
                <X size={18} className="sm:w-5 sm:h-5" />
                Отказ
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          animate={{
            opacity: isDeleting ? 0.5 : 1,
            scale: isDeleting ? 0.98 : 1,
          }}
          transition={{ duration: 0.3 }}
          className="relative z-10"
        >
          <Card className="p-3 sm:p-4 md:p-6 hover:shadow-md transition-shadow">
            <div className="flex gap-3 sm:gap-4 md:gap-6">
              {/* Product Image */}
              <div className="flex-shrink-0">
                <div className="relative w-20 sm:w-28 md:w-32 aspect-square rounded-lg overflow-hidden bg-[#F5F5F5]">
                  {item.image_url ? (
                    <Image
                      src={getImageUrl(item.image_url)}
                      alt={`${item.product_name}${item.variant_name ? ` - ${item.variant_name}` : ''}`}
                      fill
                      loading="eager"
                      className="object-cover"
                      sizes="(max-width: 640px) 80px, (max-width: 768px) 112px, 128px"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-[#777777] text-xs">Няма</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Content - Right side */}
              <div className="flex-1 flex flex-col gap-3 min-w-0">
                
                {/* Top Row: Product Name + Variant */}
                <div className="min-h-[2.6rem]">
                  <NameWrapper>
                    <h3
                      className={`font-semibold text-sm sm:text-base md:text-lg text-[#1F1F1F] line-clamp-2 transition-colors ${
                        hasProductLink ? 'hover:text-[#00BFA6] cursor-pointer' : ''
                      }`}
                    >
                      {item.product_name || 'Неизвестен продукт'}
                    </h3>
                  </NameWrapper>

                  {/* Variant Name */}
                  {item.variant_name && (
                    <p className="text-xs sm:text-sm text-[#777777] mt-0.5">
                      {item.variant_name}
                    </p>
                  )}

                  {/* Bundle badge */}
                  {isBundle && (
                    <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mt-1">
                      <span className="inline-flex items-center gap-1 text-[10px] sm:text-xs font-bold text-[#00BFA6] bg-[#00BFA6]/10 px-2 py-0.5 rounded-full">
                        <Gift size={10} />
                        Комплект
                      </span>
                      {item.bundle_savings_percentage && (
                        <span className="text-[10px] sm:text-xs font-semibold text-[#FF4C4C]">
                          Спестявате {item.bundle_savings_percentage}%
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Bundle Items - For bundles only */}
                {isBundle && item.bundle_items && item.bundle_items.length > 0 && (
                  <div className="border border-[#E0E0E0] rounded-lg">
                    <p className="text-[10px] sm:text-xs font-semibold text-[#1F1F1F] px-2 sm:px-3 py-1 sm:py-1.5 border-b border-[#F5F5F5] bg-[#F5F5F5]">
                      Комплектът включва
                    </p>
                    <ul className="divide-y divide-[#F5F5F5] max-h-32 overflow-y-auto">
                      {item.bundle_items.map((bundleProduct: BundleCartProduct, idx: number) => (
                        <li
                          key={`${bundleProduct.product_id}-${idx}`}
                          className="px-2 sm:px-3 py-1 sm:py-1.5 text-[10px] sm:text-xs text-[#777777] flex items-center gap-1.5 sm:gap-2"
                        >
                          <span className="font-semibold text-[#00BFA6]">
                            {bundleProduct.quantity}x
                          </span>
                          <span className="flex-1 truncate">
                            {bundleProduct.product_name}
                          </span>
                          {bundleProduct.unit_price && (
                            <span className="font-semibold text-[#1F1F1F] whitespace-nowrap text-[10px] sm:text-xs">
                              {formatPrice(bundleProduct.unit_price)}
                            </span>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Bottom Row: Price (left) and Quantity + Remove (right) */}
                <div className="flex items-center justify-between gap-3 sm:gap-4">
                  
                  {/* Price Section - Far Left */}
                  <div className="flex-shrink-0">
                    {isBundle ? (
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                          {item.bundle_original_price && (
                            <span className="text-xs sm:text-sm text-[#777777] line-through">
                              {formatPrice(item.bundle_original_price)}
                            </span>
                          )}
                          {item.bundle_savings_amount && (
                            <span className="text-[10px] sm:text-xs text-[#FF4C4C] font-semibold">
                              -{formatPrice(item.bundle_savings_amount)}
                            </span>
                          )}
                        </div>
                        <p className="text-base sm:text-lg md:text-xl font-bold text-[#00BFA6]">
                          {formatPrice(item.unit_price)}
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-0.5">
                        {hasSalePrice && item.regular_price !== undefined && (
                          <span className="text-xs sm:text-sm text-[#777777] line-through block">
                            {formatPrice(item.regular_price)}
                          </span>
                        )}
                        <p className="text-base sm:text-lg md:text-xl font-bold text-[#00BFA6]">
                          {formatPrice(item.sale_price ?? item.unit_price ?? 0)}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Quantity + Remove Section - Far Right */}
                  <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                    {/* Quantity Selector */}
                    <div className="flex items-center border-2 border-[#E0E0E0] rounded-lg overflow-hidden">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => onQuantityChange(item.id, item.quantity - 1)}
                        disabled={item.quantity === 1}
                        className="px-1.5 sm:px-2 py-1 sm:py-1.5 text-[#333333] hover:bg-[#F5F5F5] transition-colors disabled:opacity-50"
                      >
                        <Minus size={14} className="sm:w-4 sm:h-4" />
                      </motion.button>

                      <span className="px-2 sm:px-3 py-1 sm:py-1.5 font-semibold text-[#1F1F1F] min-w-[32px] sm:min-w-[40px] text-center text-xs sm:text-sm">
                        {item.quantity}
                      </span>

                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => onQuantityChange(item.id, item.quantity + 1)}
                        className="px-1.5 sm:px-2 py-1 sm:py-1.5 text-[#333333] hover:bg-[#F5F5F5] transition-colors"
                      >
                        <Plus size={14} className="sm:w-4 sm:h-4" />
                      </motion.button>
                    </div>

                    {/* Delete Button */}
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => onRemove(item.id)}
                      className="p-1.5 sm:p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      aria-label="Remove item"
                    >
                      <Trash2 size={16} className="sm:w-[18px] sm:h-[18px]" />
                    </motion.button>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}
'use client';

import { motion } from 'framer-motion';
import { ProductVariant } from '@/types/product';
import { Check } from 'lucide-react';

interface VariantSelectorProps {
  variants: ProductVariant[];
  selectedVariantId: number;
  onVariantChange: (variantId: number) => void;
}

export function VariantSelector({ 
  variants, 
  selectedVariantId,
  onVariantChange 
}: VariantSelectorProps) {
  if (!variants || variants.length <= 1) {
    return null; // Don't show selector if only one variant
  }

  // Get display name for variant
  const getVariantDisplayName = (variant: ProductVariant, index: number): string => {
    // Use variant_name if available
    if (variant.variant_name) {
      return variant.variant_name;
    }

    // Build name from attributes
    if (variant.variantAttributes && variant.variantAttributes.length > 0) {
      return variant.variantAttributes
        .map(va => va.attributeValue.value)
        .join(' - ');
    }

    // Fallback to generic name
    return variant.is_default ? 'Стандартен' : `Вариант ${index + 1}`;
  };

  // Group variants by attribute type for better display
  const hasMultipleAttributes = variants.some(v => 
    v.variantAttributes && v.variantAttributes.length > 1
  );

  return (
    <div className="mb-6 sm:mb-8 pb-6 sm:pb-8 border-b border-[#F5F5F5]">
      <h3 className="font-semibold text-[#1F1F1F] mb-3 sm:mb-4 text-sm sm:text-base">
        Изберете вариант
      </h3>
      
      <div className="space-y-4">
        {/* Variant Buttons */}
        <div className={`grid gap-2 sm:gap-3 ${
          hasMultipleAttributes 
            ? 'grid-cols-1 sm:grid-cols-2' 
            : 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4'
        }`}>
          {variants.map((variant, index) => {
            const isSelected = variant.id === selectedVariantId;
            const isOutOfStock = variant.stock_quantity === 0;
            const displayName = getVariantDisplayName(variant, index);

            return (
              <motion.button
                key={variant.id}
                whileHover={!isOutOfStock ? { scale: 1.02 } : undefined}
                whileTap={!isOutOfStock ? { scale: 0.98 } : undefined}
                onClick={() => !isOutOfStock && onVariantChange(variant.id)}
                disabled={isOutOfStock}
                className={`
                  relative px-3 sm:px-4 py-3 sm:py-3.5 rounded-lg border-2 
                  font-medium transition-all text-sm sm:text-base
                  ${isSelected && !isOutOfStock
                    ? 'border-[#00BFA6] bg-[#00BFA6] text-white shadow-md'
                    : isOutOfStock
                    ? 'border-[#E0E0E0] bg-gray-50 text-gray-400 cursor-not-allowed opacity-60'
                    : 'border-[#E0E0E0] text-[#333333] hover:border-[#00BFA6] hover:bg-[#00BFA6]/5'
                  }
                `}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="flex-1 text-left truncate">{displayName}</span>
                  
                  {isSelected && !isOutOfStock && (
                    <Check size={18} className="flex-shrink-0" />
                  )}
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
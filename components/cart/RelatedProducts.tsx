'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Sparkles, Package } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { getImageUrl } from '@/lib/imageUtils';
import { formatPrice } from '@/lib/utils';
import { Product } from '@/types/product';

interface RelatedProductsProps {
  products: Product[];
  loading?: boolean;
}

export default function RelatedProducts({ products, loading }: RelatedProductsProps) {
  if (loading) {
    return (
      <div className="mt-8 sm:mt-10 md:mt-12 border-t border-[#F5F5F5] pt-6 sm:pt-8">
        <div className="flex items-center gap-2 mb-4 sm:mb-6">
          <Sparkles size={20} className="sm:w-6 sm:h-6 text-[#00BFA6]" />
          <h2 className="text-xl sm:text-2xl font-bold text-[#1F1F1F]">
            Зареждане на препоръки...
          </h2>
        </div>
      </div>
    );
  }

  if (products.length === 0) return null;

  const getProductImage = (product: Product) => {
    const primaryImage = product.images?.[0];
    if (!primaryImage) return null;
    return getImageUrl(primaryImage.thumbnail_url || primaryImage.image_url);
  };

  const getProductPrice = (product: Product) => {
    const variant = product.variants?.[0];
    if (!variant) return { current: '0', original: null };
    return {
      current: variant.sale_price || variant.price,
      original: variant.sale_price ? variant.price : null,
    };
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="mt-8 sm:mt-10 md:mt-12 pt-6 sm:pt-8"
    >
      <div className="flex items-center gap-2 mb-4 sm:mb-6">
        <Sparkles size={20} className="sm:w-6 sm:h-6 text-[#00BFA6]" />
        <h2 className="text-xl sm:text-2xl font-bold text-[#1F1F1F]">
          Може да ви харесат и
        </h2>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {products.map((product) => {
          const imageUrl = getProductImage(product);
          const { current, original } = getProductPrice(product);

          return (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Link href={`/products/${product.slug}`}>
                <Card className="overflow-hidden hover:shadow-lg transition-all group">
                  <div className="relative w-full aspect-square overflow-hidden bg-[#F5F5F5] flex items-center justify-center">
                    {imageUrl ? (
                      <Image
                        src={imageUrl}
                        alt={product.name}
                        fill
                        loading="eager"
                        className="object-contain transition-transform duration-300"
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 25vw"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package size={32} className="sm:w-12 sm:h-12 text-[#777777]" />
                      </div>
                    )}
                  </div>
                  <div className="p-3 sm:p-4">
                    {product.brand && (
                      <p className="text-[10px] sm:text-xs text-[#777777] font-medium mb-1">
                        {product.brand.name}
                      </p>
                    )}

                    <h4 className="font-semibold text-[#1F1F1F] text-xs sm:text-sm mb-1.5 sm:mb-2 line-clamp-2 min-h-[2rem] sm:min-h-[2.5rem] group-hover:text-[#00BFA6] transition-colors">
                      {product.name}
                    </h4>

                    <div className="flex items-center gap-1.5 sm:gap-2">
                      <span className="font-bold text-[#00BFA6] text-sm sm:text-base">
                        {formatPrice(current)}
                      </span>
                      {original && (
                        <span className="text-[10px] sm:text-xs text-[#777777] line-through">
                          {formatPrice(original)}
                        </span>
                      )}
                    </div>
                  </div>
                </Card>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
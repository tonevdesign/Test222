'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { formatPrice } from '@/lib/utils';
import { getImageUrl } from '@/lib/imageUtils';
import { Product } from '@/types/product';

interface RelatedProductsProps {
  products: Product[];
}

export default function RelatedProducts({ products }: RelatedProductsProps) {
  if (!products || products.length === 0) return null;

  return (
    <section className="bg-[#F5F5F5] py-12 sm:py-16 lg:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-[#1F1F1F] mb-2">
            Подобни продукти
          </h2>
          <p className="text-[#777777]">
            Може да харесате и тези продукти
          </p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => {
            const image = product.images?.[0];
            const variant = product.variants?.[0];
            const currentPrice = variant?.sale_price || variant?.price;

            return (
              <Link
                key={product.id}
                href={`/products/${product.slug}`}
                className="bg-white rounded-lg overflow-hidden border border-[#E0E0E0] hover:border-[#00BFA6] transition-all duration-300"
              >
                <div className="relative w-full h-48 bg-[#F5F5F5]">
                  {image ? (
                    <Image
                      src={getImageUrl(image.thumbnail_url || image.image_url)}
                      alt={image.alt_text || product.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[#777777]">
                      Няма изображение
                    </div>
                  )}
                </div>

                <div className="p-4">
                  <h3 className="font-semibold text-[#1F1F1F] mb-1 line-clamp-2 hover:text-[#00BFA6] transition-colors">
                    {product.name}
                  </h3>

                  {currentPrice && (
                    <span className="font-bold text-[#00BFA6]">
                      {formatPrice(currentPrice)}
                    </span>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

'use client';

import { motion } from 'framer-motion';
import ProductCard from '@/components/product/ProductCard';
import { Product } from '@/types/product';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export function ProductsGrid({ products }: { products: Product[] }) {
  const router = useRouter();

  if (products.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-8 sm:py-12 md:py-16 px-4"
      >
        <div className="bg-[#F5F5F5] rounded-lg p-6 sm:p-8 md:p-12">
          <p className="text-[#777777] text-sm sm:text-base md:text-lg mb-3 sm:mb-4">
            Няма намерени продукти
          </p>
          <p className="text-[#777777] text-xs sm:text-sm mb-4 sm:mb-6">
            Опитайте да коригирате филтрите или търсенето си
          </p>
          <div className="flex justify-center items-center">
            <Button onClick={() => router.push('/products')} size="md">
              Нулирай филтрите
            </Button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-8 sm:mb-12 pb-20 lg:pb-0"
    >
      {products.map((product, index) => (
        <motion.div
          key={product.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
        >
          <ProductCard product={product} />
        </motion.div>
      ))}
    </motion.div>
  );
}
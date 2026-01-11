'use client';

import { motion } from 'framer-motion';

export function ProductsHeader({ 
  searchQuery, 
  total 
}: { 
  searchQuery?: string; 
  total: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mt-4 sm:mt-6"
    >
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#1F1F1F] mb-1 sm:mb-2">
        {searchQuery ? `Резултати за "${searchQuery}"` : 'Продукти'}
      </h1>
      <p className="text-sm sm:text-base text-[#777777]">
        {total} {total === 1 ? 'продукт' : 'продукта'}
      </p>
    </motion.div>
  );
}
'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function EmptyCart() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mx-auto text-center py-12 sm:py-16 px-4"
    >
      <div className="mb-4 sm:mb-6 flex justify-center">
        <div className="w-20 h-20 sm:w-24 sm:h-24 bg-[#F5F5F5] rounded-full flex items-center justify-center">
          <ShoppingBag size={40} className="sm:w-12 sm:h-12 text-[#777777]" />
        </div>
      </div>

      <h1 className="text-2xl sm:text-3xl font-bold text-[#1F1F1F] mb-2 sm:mb-3">
        Вашата количка е празна
      </h1>
      <p className="text-sm sm:text-base text-[#777777] mb-6 sm:mb-8">
        Изглежда все още не сте добавили продукти към вашата количка. Време е да
        започнете пазаруването!
      </p>
      
      <div className="flex justify-center">
        <Link href="/products">
          <Button size="lg" className="w-full">
            Започнете пазаруването
            <ArrowRight size={18} className="sm:w-5 sm:h-5" />
          </Button>
        </Link>
      </div>
    </motion.div>
  );
}
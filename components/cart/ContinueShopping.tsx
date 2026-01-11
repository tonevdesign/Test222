'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export default function ContinueShopping() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="mt-6 sm:mt-8"
    >
      <Link
        href="/products"
        className="text-[#00BFA6] font-semibold hover:text-[#00a08c] flex items-center gap-1.5 sm:gap-2 text-sm sm:text-base"
      >
        <ArrowRight size={16} className="sm:w-[18px] sm:h-[18px] rotate-180" />
        Продължете пазаруването
      </Link>
    </motion.div>
  );
}
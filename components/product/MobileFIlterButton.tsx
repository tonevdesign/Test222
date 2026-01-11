'use client';

import { motion } from 'framer-motion';
import { Filter } from 'lucide-react';
import { useFilterSidebar } from '@/hooks/useFilterSidebar';

export function MobileFilterButton() {
  const { isOpen, toggle } = useFilterSidebar();

  return (
    <>
      <motion.button
        className="lg:hidden fixed bottom-6 left-6 z-30 bg-[#00BFA6] text-white p-4 rounded-full shadow-lg"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={toggle}
      >
        <Filter size={24} />
      </motion.button>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={toggle}
          className="fixed inset-0 bg-black/50 lg:hidden z-30"
        />
      )}
    </>
  );
}
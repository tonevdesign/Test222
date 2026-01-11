'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';
import { Category } from '@/types/product';

interface CategoryMenuProps {
  categories: Category[];
}

export default function CategoryMenu({ categories }: CategoryMenuProps) {
  const [openMenu, setOpenMenu] = useState<number | null>(null);
  const topCategories = categories.filter(cat => !cat.parent_id).slice(0, 6);

  return (
    <div className="flex items-center gap-8">
      {topCategories.map((category) => (
        <div
          key={category.id}
          className="relative group"
          onMouseEnter={() => setOpenMenu(category.id)}
          onMouseLeave={() => setOpenMenu(null)}
        >
          <Link
            href={`/products?categories=${category.slug}`}
            className="flex items-center gap-1 text-[#333333] font-medium hover:text-[#00BFA6] transition-colors"
          >
            <span className='text-[#333333]'>{category.name}</span>
            {category.children && category.children.length > 0 && (
              <ChevronDown size={16} className="text-[#777777]" />
            )}
          </Link>

          {category.children && category.children.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={
                openMenu === category.id
                  ? { opacity: 1, y: 0 }
                  : { opacity: 0, y: -10, pointerEvents: 'none' }
              }
              transition={{ duration: 0.2 }}
              className="absolute left-0 top-full pt-2 w-48 bg-white rounded-lg shadow-lg border border-[#F5F5F5] z-50"
            >
              <div className="py-2">
                {category.children.map((subcategory) => (
                  <Link
                    key={subcategory.id}
                    href={`/products?categories=${subcategory.slug}`}
                    className="block px-4 py-2 text-[#333333] hover:text-[#00BFA6] hover:bg-[#F5F5F5] transition-all"
                  >
                    <span className='text-[#333333]'>{subcategory.name}</span>
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      ))}
    </div>
  );
}
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronRight, Heart, Scale } from 'lucide-react';
import { motion } from 'framer-motion';
import { Category } from '@/types/product';

interface MobileNavProps {
  categories: Category[];
  onClose: () => void;
  cartCount: number;
  wishlistCount: number;
  comparisonCount: number;
  isAuthenticated: boolean;
  isLoading: boolean;
  pathname: string;
}

export default function MobileNav({ 
  categories, 
  onClose,
  wishlistCount,
  comparisonCount,
  isAuthenticated,
  isLoading,
  pathname
}: MobileNavProps) {
  const [expandedCategory, setExpandedCategory] = useState<number | null>(null);

  const handleLinkClick = () => {
    onClose();
  };

  const topCategories = categories.filter(cat => !cat.parent_id);

  return (
    <nav className="overflow-y-auto" style={{ maxHeight: 'calc(100vh - 4rem)' }}>
      {/* Quick Actions Section - Only visible on mobile */}
      <div className="border-b border-[#E0E0E0] bg-[#FAFAFA]">
        <div className="grid grid-cols-2 gap-2 px-4 py-4">
          {/* Comparison */}
          <Link
            href="/comparison"
            onClick={handleLinkClick}
            className="flex flex-col items-center gap-2 p-3 bg-white hover:bg-[#F5F5F5] rounded-lg transition-colors border border-[#E0E0E0]"
          >
            <div className="relative">
              <Scale size={22} className="text-[#333333]" />
              {comparisonCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#00BFA6] text-white text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {comparisonCount}
                </span>
              )}
            </div>
            <span className="text-xs text-[#333333] font-medium">Сравнение</span>
          </Link>

          {/* Wishlist */}
          <Link
            href={
              isLoading
                ? pathname || '/'
                : isAuthenticated
                  ? '/account/wishlist'
                  : `/login?redirect=${encodeURIComponent('/account/wishlist')}`
            }
            onClick={handleLinkClick}
            className="flex flex-col items-center gap-2 p-3 bg-white hover:bg-[#F5F5F5] rounded-lg transition-colors border border-[#E0E0E0]"
          >
            <div className="relative">
              <Heart size={22} className="text-[#333333]" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </div>
            <span className="text-xs text-[#333333] font-medium">Списък с желания</span>
          </Link>
        </div>
      </div>

      {/* Categories Section */}
      <div className="px-4 py-4">
        <div className="text-xs uppercase tracking-wider text-[#777777] px-4 pb-2 font-semibold">
          Категории
        </div>

        <div className="space-y-1">
          {topCategories.map((category) => (
            <div key={category.id}>
              <div className="flex items-center">
                <Link
                  href={`/products?categories=${category.slug}`}
                  onClick={handleLinkClick}
                  className="flex-1 px-4 py-3 text-[#333333] hover:bg-[#F5F5F5] rounded-lg transition-colors font-medium"
                >
                  {category.name}
                </Link>
                
                {category.children && category.children.length > 0 && (
                  <motion.button
                    onClick={() =>
                      setExpandedCategory(
                        expandedCategory === category.id ? null : category.id
                      )
                    }
                    className="p-3"
                    animate={{
                      rotate: expandedCategory === category.id ? 90 : 0,
                    }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronRight size={18} className="text-[#777777]" />
                  </motion.button>
                )}
              </div>

              {expandedCategory === category.id &&
                category.children &&
                category.children.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="bg-[#F5F5F5] rounded-lg my-2 overflow-hidden"
                  >
                    {category.children.map((subcategory) => (
                      <Link
                        key={subcategory.id}
                        href={`/products?categories=${subcategory.slug}`}
                        className="block px-8 py-2.5 text-[#333333] hover:text-[#00BFA6] transition-colors text-sm"
                        onClick={handleLinkClick}
                      >
                        {subcategory.name}
                      </Link>
                    ))}
                  </motion.div>
                )}
            </div>
          ))}
        </div>
      </div>
    </nav>
  );
}
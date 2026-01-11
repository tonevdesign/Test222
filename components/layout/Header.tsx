'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Heart, ShoppingCart, Search, Menu, X, Scale } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { Category } from '@/types/product';
import CategoryMenu from './CategoryMenu';
import MobileNav from './MobileNav';
import SearchModal from './SearchModal';
import UserMenu from './UserMenu';
import NotificationBell from '@/components/notifications/NotificationBell';
import { useHeaderData, useHeaderCounts } from '@/hooks/useHeaderData';

interface HeaderProps {
  categories: Category[];
}

export default function Header({ categories }: HeaderProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const { isAuthenticated, isLoading } = useAuth();
  const pathname = usePathname();
  
  // Load all header data once on mount
  useHeaderData();
  
  // Get counts from stores (no API calls)
  const { cartCount, wishlistCount, comparisonCount } = useHeaderCounts();
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header
        className={`sticky top-0 z-40 bg-white transition-all duration-300 ${
          isScrolled ? 'shadow-md' : 'shadow-sm'
        }`}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Left Section - Mobile Menu + Logo */}
            <div className="flex items-center gap-2 sm:gap-4 lg:gap-12">
              <button
                className="lg:hidden p-2 hover:bg-[#F5F5F5] rounded-lg transition-colors"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
              >
                {isMobileMenuOpen ? (
                  <X size={24} className="text-[#1F1F1F]" />
                ) : (
                  <Menu size={24} className="text-[#1F1F1F]" />
                )}
              </button>

              <Link href="/" className="flex items-center gap-2">
                <div className="relative w-24 h-12 sm:w-28 sm:h-14 lg:w-32 lg:h-20">
                  <Image
                    src="/logo/logo-black.png"
                    alt="Store Logo"
                    fill
                    className="object-contain"
                    priority
                    sizes="(max-width: 640px) 96px, 
                          (max-width: 1024px) 112px, 
                          128px"
                  />
                </div>
              </Link>

              {/* Desktop Category Menu */}
              <nav className="hidden lg:flex items-center">
                <CategoryMenu categories={categories} />
              </nav>
            </div>

            {/* Right Section - Actions */}
            <div className="flex items-center gap-2 sm:gap-3 lg:gap-6">
              {/* Search - Always visible */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsSearchOpen(true)}
                className="p-2 hover:bg-[#F5F5F5] rounded-lg transition-colors"
                aria-label="Search"
              >
                <Search size={20} className="text-[#333333]" />
              </motion.button>

              {/* Comparison - Hidden on mobile, visible on desktop */}
              <Link
                href="/comparison"
                className="hidden lg:flex relative p-2 hover:bg-[#F5F5F5] rounded-lg transition-colors"
                aria-label="Product Comparison"
              >
                <Scale size={20} className="text-[#333333]" />
                {comparisonCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -top-1 -right-1 bg-[#00BFA6] text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center"
                  >
                    {comparisonCount}
                  </motion.span>
                )}
              </Link>
              
              {/* Wishlist - Hidden on mobile, visible on desktop */}
              <Link
                href={
                  isLoading
                    ? pathname || '/'
                    : isAuthenticated
                      ? '/account/wishlist'
                      : `/login?redirect=${encodeURIComponent('/account/wishlist')}`
                }
                className="hidden lg:flex relative p-2 hover:bg-[#F5F5F5] rounded-lg transition-colors"
                aria-label="Wishlist"
              >
                <Heart size={20} className="text-[#333333]" />
                {wishlistCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center"
                  >
                    {wishlistCount}
                  </motion.span>
                )}
              </Link>

              {/* Notification Bell - Only for authenticated users, desktop only */}
              {isAuthenticated && (
                  <NotificationBell />
              )}

              {/* Cart - Always visible */}
              <Link
                href="/cart"
                className="relative p-2 hover:bg-[#F5F5F5] rounded-lg transition-colors"
                aria-label="Shopping Cart"
              >
                <ShoppingCart size={20} className="text-[#333333]" />
                {cartCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -top-1 -right-1 bg-[#00BFA6] text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center"
                  >
                    {cartCount}
                  </motion.span>
                )}
              </Link>

              {/* User Menu - Always visible */}
              <UserMenu />
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ 
              opacity: 1, 
              height: 'auto',
              transition: {
                height: { duration: 0.3, ease: "easeInOut" },
                opacity: { duration: 0.2, delay: 0.1 }
              }
            }}
            exit={{ 
              opacity: 0, 
              height: 0,
              transition: {
                height: { duration: 0.3, ease: "easeInOut" },
                opacity: { duration: 0.2 }
              }
            }}
            className="lg:hidden fixed top-16 lg:top-20 left-0 right-0 z-30 bg-white border-t border-[#E0E0E0] overflow-hidden shadow-lg"
            style={{ maxHeight: 'calc(100vh - 4rem)' }}
          >
            <MobileNav 
              categories={categories} 
              onClose={() => setIsMobileMenuOpen(false)}
              cartCount={cartCount}
              wishlistCount={wishlistCount}
              comparisonCount={comparisonCount}
              isAuthenticated={isAuthenticated}
              isLoading={isLoading}
              pathname={pathname}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
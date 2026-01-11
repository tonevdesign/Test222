'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
  Package,
  MapPin,
  Settings,
  LogOut,
  ChevronDown,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export default function UserMenu() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleLogout = async () => {
    try {
      await logout();
      setIsOpen(false);
      router.push('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const menuItems = [
    {
      icon: User,
      label: 'Профил',
      href: '/account',
    },
    {
      icon: Package,
      label: 'Поръчки',
      href: '/account/orders',
    },
    {
      icon: MapPin,
      label: 'Адреси',
      href: '/account/addresses',
    },
    {
      icon: Settings,
      label: 'Настройки',
      href: '/account/settings',
    },
  ];

  // If not authenticated, show login link
  if (!isAuthenticated && !isLoading) {
    return (
      <Link
        href="/login"
        className="p-2 hover:bg-[#F5F5F5] rounded-lg transition-colors"
        aria-label="Login"
      >
        <User size={20} className="text-[#333333]" />
      </Link>
    );
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className="p-2">
        <div className="w-5 h-5 border-2 border-[#00BFA6] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div ref={menuRef} className="relative">
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={() => setIsOpen(true)}
        className="flex items-center gap-2 p-2 hover:bg-[#F5F5F5] rounded-lg transition-colors"
        aria-label="Account menu"
        aria-expanded={isOpen}
      >
        <div className="w-8 h-8 bg-[#00BFA6] rounded-full flex items-center justify-center">
          <span className="text-white font-semibold text-sm">
            {user?.first_name?.[0]?.toUpperCase() || 'U'}
          </span>
        </div>
        <ChevronDown
          size={16}
          className={`text-[#777777] transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            onMouseLeave={() => setIsOpen(false)}
            className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-[#E0E0E0] py-2 z-50"
          >
            {/* User Info */}
            <div className="px-4 py-3 border-b border-[#F5F5F5]">
              <p className="font-semibold text-[#1F1F1F]">
                {user?.first_name} {user?.last_name}
              </p>
              <p className="text-sm text-[#777777] truncate">{user?.email}</p>
            </div>

            {/* Menu Items */}
            <div className="py-2">
              {menuItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 hover:bg-[#F5F5F5] transition-colors"
                >
                  <item.icon size={18} className="text-[#777777]" />
                  <span className="text-[#1F1F1F]">{item.label}</span>
                </Link>
              ))}
            </div>

            {/* Logout */}
            <div className="border-t border-[#F5F5F5] pt-2">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-red-50 transition-colors text-red-600"
              >
                <LogOut size={18} />
                <span>Изход</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Copy, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Wishlist } from '@/types/wishlist';

interface ShareWishlistModalProps {
  isOpen: boolean;
  onClose: () => void;
  wishlist: Wishlist;
}

export function ShareWishlistModal({
  isOpen,
  onClose,
  wishlist,
}: ShareWishlistModalProps) {
  const [shareLink, setShareLink] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen && wishlist) {
      const slug = wishlist.slug || wishlist.id.toString();
      const link = `${window.location.origin}/wishlist/shared/${slug}`;
      setShareLink(link);
    }
  }, [isOpen, wishlist]);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  // If wishlist is private, show warning
  if (!wishlist.is_public) {
    return (
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={onClose}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-lg max-w-md w-full p-6"
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-[#F5F5F5] rounded-full flex items-center 
                              justify-center mx-auto mb-4">
                  <Lock size={32} className="text-[#777777]" />
                </div>
                <h2 className="text-2xl font-bold text-[#1F1F1F] mb-2">
                  Частен списък
                </h2>
                <p className="text-[#777777] mb-6">
                  Този списък е частен и не може да бъде споделен. Моля, направете го
                  публичен, за да можете да споделяте връзката.
                </p>
                <Button onClick={onClose} size="lg" className="w-full">
                  Разбрах
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-lg max-w-md w-full p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-[#1F1F1F]">
                Сподели списъка
              </h2>
              <button
                onClick={onClose}
                className="text-[#777777] hover:text-[#1F1F1F] transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="mb-6">
              <p className="text-[#777777] mb-4">
                Споделете <strong>{wishlist.name}</strong> с приятели и семейство:
              </p>

              <div className="flex gap-2">
                <div className="flex-1 bg-[#F5F5F5] rounded-lg px-4 py-3 text-sm 
                              text-[#1F1F1F] overflow-x-auto whitespace-nowrap 
                              scrollbar-thin scrollbar-thumb-[#E0E0E0]">
                  {shareLink}
                </div>
                <Button
                  onClick={handleCopyLink}
                  variant="outline"
                  className={`gap-2 shrink-0 ${
                    copied ? 'bg-green-50 border-green-500' : ''
                  }`}
                >
                  {copied ? (
                    <>
                      <Check size={18} className="text-green-600" />
                      <span className="text-green-600 hidden sm:inline">Копирано</span>
                    </>
                  ) : (
                    <>
                      <Copy size={18} />
                      <span className="hidden sm:inline">Копирай</span>
                    </>
                  )}
                </Button>
              </div>

              <p className="text-xs text-[#777777] mt-3">
                Всеки с тази връзка ще може да види артикулите в този списък.
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
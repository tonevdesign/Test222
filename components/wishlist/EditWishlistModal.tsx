'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Edit2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Wishlist } from '@/types/wishlist';

interface EditWishlistModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (wishlistId: number, name: string, isPublic: boolean) => Promise<void>;
  wishlist: Wishlist;
}

export function EditWishlistModal({
  isOpen,
  onClose,
  onSubmit,
  wishlist,
}: EditWishlistModalProps) {
  const [name, setName] = useState(wishlist.name);
  const [isPublic, setIsPublic] = useState(wishlist.is_public);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Update state when wishlist changes
  useEffect(() => {
    setName(wishlist.name);
    setIsPublic(wishlist.is_public);
  }, [wishlist]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      setError('Моля, въведете име на списъка');
      return;
    }

    try {
      setIsSubmitting(true);
      setError('');
      await onSubmit(wishlist.id, name.trim(), isPublic);
      onClose();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Грешка при запазване на промените');
      }
    } finally {
      setIsSubmitting(false);
    }
  };


  const handleClose = () => {
    if (!isSubmitting) {
      setName(wishlist.name);
      setIsPublic(wishlist.is_public);
      setError('');
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-lg max-w-md w-full p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Edit2 size={24} className="text-[#00BFA6]" />
                <h2 className="text-2xl font-bold text-[#1F1F1F]">
                  Редактирай списък
                </h2>
              </div>
              <button
                onClick={handleClose}
                disabled={isSubmitting}
                className="text-[#777777] hover:text-[#1F1F1F] transition-colors 
                           disabled:opacity-50"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name input */}
              <div>
                <label
                  htmlFor="edit-wishlist-name"
                  className="block text-sm font-medium text-[#1F1F1F] mb-2"
                >
                  Име на списъка
                </label>
                <input
                  id="edit-wishlist-name"
                  type="text"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    setError('');
                  }}
                  maxLength={255}
                  disabled={isSubmitting}
                  className="w-full px-4 py-3 border border-[#E0E0E0] rounded-lg 
                             focus:outline-none focus:ring-2 focus:ring-[#00BFA6] 
                             disabled:opacity-50 disabled:cursor-not-allowed"
                />
                {error && (
                  <p className="mt-1 text-sm text-red-600">{error}</p>
                )}
              </div>

              {/* Privacy toggle */}
              <div className="flex items-start gap-3 p-4 bg-[#F5F5F5] rounded-lg">
                <input
                  id="edit-wishlist-public"
                  type="checkbox"
                  checked={isPublic}
                  onChange={(e) => setIsPublic(e.target.checked)}
                  disabled={isSubmitting || wishlist.is_default}
                  className="mt-1 w-4 h-4 text-[#00BFA6] border-[#E0E0E0] 
                             rounded focus:ring-[#00BFA6] disabled:opacity-50"
                />
                <div className="flex-1">
                  <label
                    htmlFor="edit-wishlist-public"
                    className="block font-medium text-[#1F1F1F] cursor-pointer"
                  >
                    Публичен списък
                  </label>
                  <p className="text-sm text-[#777777] mt-1">
                    Други потребители ще могат да видят този списък чрез споделена връзка
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <Button
                  type="button"
                  onClick={handleClose}
                  variant="outline"
                  size="lg"
                  className="flex-1"
                  disabled={isSubmitting}
                >
                  Отказ
                </Button>
                <Button
                  type="submit"
                  size="lg"
                  className="flex-1"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent 
                                    rounded-full animate-spin mr-2" />
                      Запазване...
                    </>
                  ) : (
                    'Запази'
                  )}
                </Button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
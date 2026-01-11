'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Wishlist, WishlistItem } from '@/types/wishlist';
import { apiClient } from '@/lib/api';

interface MoveToWishlistModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: WishlistItem;
  currentWishlistId: number;
  onSuccess?: () => void;
}

interface ApiError {
  status?: number;
  message?: string;
}

export function MoveToWishlistModal({
  isOpen,
  onClose,
  item,
  currentWishlistId,
  onSuccess,
}: MoveToWishlistModalProps) {
  const [wishlists, setWishlists] = useState<Wishlist[]>([]);
  const [selectedWishlistId, setSelectedWishlistId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isMoving, setIsMoving] = useState(false);
  const [error, setError] = useState('');

  const fetchWishlists = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await apiClient.get<Wishlist[]>('/wishlist');
      if (response.data) {
        setWishlists(response.data.filter((w) => w.id !== currentWishlistId));
      }
    } catch (err) {
      console.error('Failed to fetch wishlists:', err);
    } finally {
      setIsLoading(false);
    }
  }, [currentWishlistId]);

  useEffect(() => {
    if (isOpen) {
      fetchWishlists();
    }
  }, [isOpen, fetchWishlists]);

  const handleMove = async () => {
    if (!selectedWishlistId) {
      setError('Моля, изберете списък');
      return;
    }

    try {
      setIsMoving(true);
      setError('');

      // Remove from current wishlist
      await apiClient.delete(`/wishlist/${currentWishlistId}/items/${item.id}`);

      // Add to target wishlist - now supports bundles safely
      await apiClient.post(`/wishlist/${selectedWishlistId}/items`, {
        product_id: item.product_id ?? undefined,
        variant_id: item.variant_id ?? undefined,
        bundle_id: item.bundle_id ?? undefined,
      });

      onSuccess?.();
      onClose();
    } catch (err) {
      const apiError = err as ApiError;
      if (apiError.status === 409) {
        setError('Продуктът вече е в избрания списък');
      } else {
        setError(apiError.message || 'Грешка при преместване');
      }
    } finally {
      setIsMoving(false);
    }
  };

  const handleClose = () => {
    if (!isMoving) {
      setSelectedWishlistId(null);
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
                <ArrowRight size={24} className="text-[#00BFA6]" />
                <h2 className="text-2xl font-bold text-[#1F1F1F]">
                  Премести към списък
                </h2>
              </div>
              <button
                onClick={handleClose}
                disabled={isMoving}
                className="text-[#777777] hover:text-[#1F1F1F] transition-colors disabled:opacity-50"
              >
                <X size={24} />
              </button>
            </div>

            {/* Product / Bundle preview */}
            <div className="mb-4 p-3 bg-[#F5F5F5] rounded-lg">
              <p className="text-sm text-[#777777] mb-1">Премества се:</p>
              <p className="font-medium text-[#1F1F1F] line-clamp-2">
                {item.product?.name ?? item.bundle?.name ?? 'Неизвестен артикул'}
              </p>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="w-8 h-8 border-4 border-[#00BFA6] border-t-transparent rounded-full animate-spin" />
              </div>
            ) : wishlists.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-[#777777]">Нямате други списъци с желания</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#1F1F1F] mb-3">
                    Избери целеви списък
                  </label>

                  <div className="space-y-2 max-h-[300px] overflow-y-auto">
                    {wishlists.map((wishlist) => (
                      <button
                        key={wishlist.id}
                        onClick={() => {
                          setSelectedWishlistId(wishlist.id);
                          setError('');
                        }}
                        disabled={isMoving}
                        className={`w-full flex items-center justify-between p-4 rounded-lg 
                          border-2 transition-all text-left
                          ${
                            selectedWishlistId === wishlist.id
                              ? 'border-[#00BFA6] bg-[#00BFA6]/5'
                              : 'border-[#E0E0E0] hover:border-[#00BFA6]/50'
                          }
                          disabled:opacity-50 disabled:cursor-not-allowed`}
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-[#1F1F1F]">
                              {wishlist.name}
                            </p>
                            {wishlist.is_default && (
                              <span className="text-xs text-[#00BFA6] font-medium">
                                По подразбиране
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-[#777777] mt-0.5">
                            {wishlist.items?.length || 0} артикула
                          </p>
                        </div>

                        {selectedWishlistId === wishlist.id && (
                          <Check size={20} className="text-[#00BFA6] shrink-0" />
                        )}
                      </button>
                    ))}
                  </div>

                  {error && (
                    <p className="mt-2 text-sm text-red-600">{error}</p>
                  )}
                </div>

                <div className="flex gap-3 pt-2">
                  <Button
                    type="button"
                    onClick={handleClose}
                    variant="outline"
                    size="lg"
                    className="flex-1"
                    disabled={isMoving}
                  >
                    Отказ
                  </Button>
                  <Button
                    onClick={handleMove}
                    size="lg"
                    className="flex-1"
                    disabled={isMoving || !selectedWishlistId}
                  >
                    {isMoving ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Преместване...
                      </>
                    ) : (
                      'Премести'
                    )}
                  </Button>
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

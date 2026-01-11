'use client';

import { useState } from 'react';
import { Check, ChevronDown, Trash2, Edit2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wishlist } from '@/types/wishlist';

interface WishlistSelectorProps {
  wishlists: Wishlist[];
  currentWishlistId?: number;
  onSelect: (wishlistId: number) => void;
  onDelete: (wishlistId: number) => void;
  onEdit: (wishlistId: number) => void;
}

export function WishlistSelector({
  wishlists,
  currentWishlistId,
  onSelect,
  onDelete,
  onEdit,
}: WishlistSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  const currentWishlist = wishlists.find((w) => w.id === currentWishlistId);

  return (
    <div className="relative ">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2.5 bg-white border border-[#E0E0E0] 
                   rounded-lg hover:border-[#00BFA6] transition-colors min-w-[200px] 
                   justify-between"
      >
        <span className="font-medium text-[#1F1F1F] truncate">
          {currentWishlist?.name || 'Избери списък'}
        </span>
        <ChevronDown
          size={20}
          className={`text-[#777777] transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-10"
              onClick={() => setIsOpen(false)}
            />

            {/* Dropdown */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full left-0 mt-2 w-full min-w-[280px] bg-white 
                         rounded-lg shadow-lg border border-[#E0E0E0] overflow-hidden z-20"
            >
              <div className="max-h-[400px] overflow-y-auto">
                {wishlists.map((wishlist) => (
                  <div
                    key={wishlist.id}
                    className="flex items-center justify-between hover:bg-[#F5F5F5] 
                               transition-colors group"
                  >
                    <button
                      onClick={() => {
                        onSelect(wishlist.id);
                        setIsOpen(false);
                      }}
                      className="flex-1 flex items-center gap-3 px-4 py-3 text-left"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-[#1F1F1F] truncate">
                            {wishlist.name}
                          </p>
                          {wishlist.is_default && (
                            <span className="text-xs text-[#00BFA6] font-medium">
                              Основен
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-[#777777]">
                          {wishlist.items?.length || 0} {(wishlist.items?.length || 0) === 1 ? 'артикул' : 'артикула'}
                          {!wishlist.is_public && ' • Частен'}
                        </p>
                      </div>

                      {currentWishlistId === wishlist.id && (
                        <Check size={20} className="text-[#00BFA6]" />
                      )}
                    </button>

                    {/* Actions - Edit and Delete */}
                    <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                      {/* Edit button */}
                      {!wishlist.is_default && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onEdit(wishlist.id);
                            setIsOpen(false);
                          }}
                          className="px-3 py-3 text-[#00BFA6] hover:bg-[#00BFA6]/10 transition-colors"
                          title="Редактирай"
                        >
                          <Edit2 size={18} />
                        </button>
                      )}

                      {/* Delete button - only for non-default */}
                      {!wishlist.is_default && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDelete(wishlist.id);
                            setIsOpen(false);
                          }}
                          className="px-3 py-3 text-red-600 hover:bg-red-50 transition-colors"
                          title="Изтрий списък"
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
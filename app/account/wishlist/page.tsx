'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Share2, Plus, LockOpen, Lock, MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { Breadcrumbs } from '@/components/common/Breadcrumbs';
import { WishlistSelector } from '@/components/wishlist/WishlistSelector';
import { CreateWishlistModal } from '@/components/wishlist/CreateWishlistModal';
import { EditWishlistModal } from '@/components/wishlist/EditWishlistModal';
import { ShareWishlistModal } from '@/components/wishlist/ShareWishlistModal';
import { WishlistGrid } from '@/components/wishlist/WishlistGrid';
import { MoveToWishlistModal } from '@/components/wishlist/MoveToWishlistModal';
import { useWishlistManager } from '@/hooks/useWishlistManager';
import EmptyWishlist from '@/components/wishlist/EmptyWishlist';
import { WishlistItem } from '@/types/wishlist';
import { useWishlist } from '@/hooks/useWishlist';

function WishlistPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const wishlistSlug = searchParams.get('list');

  const {
    wishlists,
    currentWishlist,
    isLoading,
    selectWishlist,
    createWishlist,
    deleteWishlist,
    updateWishlist,
    removeItem,
    moveToCart,
    refresh,
  } = useWishlistManager(wishlistSlug);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showMoveModal, setShowMoveModal] = useState(false);
  const [itemToMove, setItemToMove] = useState<WishlistItem | null>(null);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { ensureWishlistLoaded } = useWishlist();

  useEffect(() => {
    ensureWishlistLoaded();
  }, [ensureWishlistLoaded]);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMobileMenu(false);
      }
    };

    if (showMobileMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMobileMenu]);

  // Update URL when wishlist changes
  useEffect(() => {
    if (!currentWishlist) return;

    const targetSlug = currentWishlist.is_default
      ? null
      : (currentWishlist.slug || currentWishlist.id.toString());

    // Only update the URL if it's actually different
    if (wishlistSlug !== targetSlug) {
      if (targetSlug) {
        router.replace(`/account/wishlist?list=${targetSlug}`, { scroll: false });
      } else {
        router.replace(`/account/wishlist`, { scroll: false });
      }
    }
  }, [currentWishlist, wishlistSlug, router]);


  const handleWishlistSelect = (wishlistId: number) => {
    selectWishlist(wishlistId);
  };

  const handleCreateWishlist = async (name: string, isPublic: boolean) => {
    await createWishlist(name, isPublic);
    setShowCreateModal(false);
  };

  const handleDeleteWishlist = async (wishlistId: number) => {
    if (confirm('Сигурни ли сте, че искате да изтриете този списък?')) {
      await deleteWishlist(wishlistId);
    }
  };

  const handleEditWishlist = (wishlistId: number) => {
    const wishlist = wishlists.find((w) => w.id === wishlistId);
    if (wishlist) {
      // Select the wishlist first, then open edit modal
      selectWishlist(wishlistId);
      setShowEditModal(true);
    }
  };

  const handleUpdateWishlist = async (wishlistId: number, name: string, isPublic: boolean) => {
    await updateWishlist(wishlistId, { name, is_public: isPublic });
    setShowEditModal(false);
  };

  const handleTogglePrivacy = async () => {
    if (currentWishlist) {
      await updateWishlist(currentWishlist.id, {
        is_public: !currentWishlist.is_public,
      });
    }
  };

  const handleMoveItem = (item: WishlistItem) => {
    setItemToMove(item);
    setShowMoveModal(true);
  };

  const handleMoveSuccess = () => {
    setShowMoveModal(false);
    setItemToMove(null);
    refresh(); // Refresh the wishlist data
  };

  if (isLoading && !currentWishlist) {
    return (
      <LoadingSpinner fullScreen text="Зареждане на списъка с желания..." />
    );
  }

  const items = currentWishlist?.items || [];

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6 md:mb-8"
        >
          <Breadcrumbs
            items={[
              { label: 'Акаунт', href: '/account' },
              { label: 'Списък с желания' },
            ]}
            className="mb-4"
          />

          <div className="flex flex-col gap-4">
            {/* Title and count */}
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-[#1F1F1F] mb-2">
                {currentWishlist?.name || 'Списък с желания'}
              </h1>
              <p className="text-sm md:text-base text-[#777777]">
                {items.length} {items.length === 1 ? 'артикул' : 'артикула'}
              </p>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-3">

            {/* Left side: Wishlist selector */}
            {wishlists.length > 0 && (
              <WishlistSelector
                wishlists={wishlists}
                currentWishlistId={currentWishlist?.id}
                onSelect={handleWishlistSelect}
                onDelete={handleDeleteWishlist}
                onEdit={handleEditWishlist}
              />
            )}

              {/* Mobile: Dropdown menu */}
              <div className="ml-auto lg:hidden relative" ref={menuRef}>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setShowMobileMenu(!showMobileMenu)}
                >
                  <MoreVertical size={20} />
                </Button>

                <AnimatePresence>
                  {showMobileMenu && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: -10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -10 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50"
                    >
                      <button
                        onClick={() => {
                          setShowCreateModal(true);
                          setShowMobileMenu(false);
                        }}
                        className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2 text-[#1F1F1F]"
                      >
                        <Plus size={16} />
                        Създай списък
                      </button>

                      {currentWishlist && !currentWishlist.is_default && (
                        <button
                          onClick={() => {
                            handleTogglePrivacy();
                            setShowMobileMenu(false);
                          }}
                          className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2 text-[#1F1F1F]"
                        >
                          {currentWishlist.is_public ? (
                            <>
                              <LockOpen size={16} />
                              Направи частен
                            </>
                          ) : (
                            <>
                              <Lock size={16} />
                              Направи публичен
                            </>
                          )}
                        </button>
                      )}

                      {items.length > 0 && currentWishlist && !currentWishlist.is_default && (
                        <button
                          onClick={() => {
                            setShowShareModal(true);
                            setShowMobileMenu(false);
                          }}
                          className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2 text-[#1F1F1F]"
                        >
                          <Share2 size={16} />
                          Споделяне
                        </button>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Desktop: Individual buttons */}
              <div className="hidden lg:flex items-center gap-2 ml-auto">
                <Button
                  onClick={() => setShowCreateModal(true)}
                  variant="outline"
                  size="md"
                  className="gap-2 text-lg"
                >
                  <Plus size={16} />
                  Създай списък
                </Button>

                {currentWishlist && !currentWishlist.is_default && (
                  <Button
                    onClick={handleTogglePrivacy}
                    variant="outline"
                    size="md"
                    className="gap-2 text-lg"
                  >
                    {currentWishlist.is_public ? (
                      <>
                        <LockOpen size={16} />
                        Направи частен
                      </>
                    ) : (
                      <>
                        <Lock size={16} />
                        Направи публичен
                      </>
                    )}
                  </Button>
                )}

                {items.length > 0 && currentWishlist && !currentWishlist.is_default && (
                  <Button
                    onClick={() => setShowShareModal(true)}
                    size="md"
                    className="gap-2 text-lg"
                  >
                    <Share2 size={20} />
                    Споделяне
                  </Button>
                )}
              </div>

            </div>
          </div>
        </motion.div>

        {/* Empty state */}
        {items.length === 0 ? (
          <EmptyWishlist />
        ) : (
          <WishlistGrid
            items={items}
            onRemove={removeItem}
            onMoveToCart={moveToCart}
            onMove={handleMoveItem}
            showMoveButton={wishlists.length > 1}
          />
        )}


        {/* Modals */}
        <CreateWishlistModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateWishlist}
        />

        {currentWishlist && (
          <>
            <EditWishlistModal
              isOpen={showEditModal}
              onClose={() => setShowEditModal(false)}
              onSubmit={handleUpdateWishlist}
              wishlist={currentWishlist}
            />

            <ShareWishlistModal
              isOpen={showShareModal}
              onClose={() => setShowShareModal(false)}
              wishlist={currentWishlist}
            />

            {itemToMove && (
              <MoveToWishlistModal
                isOpen={showMoveModal}
                onClose={() => {
                  setShowMoveModal(false);
                  setItemToMove(null);
                }}
                item={itemToMove}
                currentWishlistId={currentWishlist.id}
                onSuccess={handleMoveSuccess}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default function WishlistPage() {
  return (
    <Suspense fallback={<LoadingSpinner fullScreen text="Зареждане на списъка с желания..." />}>
      <WishlistPageContent />
    </Suspense>
  )
}
'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Heart, ShoppingCart, Lock, Package } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { Breadcrumbs } from '@/components/common/Breadcrumbs';
import { Wishlist, WishlistItem } from '@/types/wishlist';
import type { Bundle } from '@/types/bundle';
import { formatPrice, calculateDiscount } from '@/lib/utils';
import { getImageUrl } from '@/lib/imageUtils';
import { useCartStore } from '@/store/cartStore';
import { createBundleCartItem } from '@/lib/cartHelpers';

export default function SharedWishlistPage() {
  const params = useParams();
  const identifier = params.slug as string;
  const { addToCart } = useCartStore();

  const [wishlist, setWishlist] = useState<Wishlist | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addingToCartIds, setAddingToCartIds] = useState<number[]>([]);

  useEffect(() => {
    const fetchSharedWishlist = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/wishlist/shared/${identifier}`,
          { credentials: 'omit' }
        );

        if (!response.ok) {
          setError('Списъкът с желания не е намерен или е частен');
          return;
        }

        const data = await response.json();
        if (data.success) {
          setWishlist(data.data);
        }
      } catch {
        setError('Грешка при зареждане на списъка с желания');
      } finally {
        setIsLoading(false);
      }
    };

    if (identifier) fetchSharedWishlist();
  }, [identifier]);

  const getProductVariant = (item: WishlistItem) => {
    if (!item.product) return null;
    return (
      item.product.variants?.find((v) => v.is_default) ||
      item.product.variants?.[0] ||
      null
    );
  };

  const getItemImage = (item: WishlistItem) => {
    if (item.product) {
      const primary = item.product.images?.find((img) => img.is_primary);
      return (
        primary?.thumbnail_url ||
        primary?.image_url ||
        item.product.images?.[0]?.thumbnail_url ||
        ''
      );
    }

    if (item.bundle) {
      return (
        item.bundle.media?.file_path ||
        item.bundle.image_url ||
        item.bundle.media?.filename ||
        ''
      );
    }

    return '';
  };

  const handleAddProductToCart = (item: WishlistItem) => {
    const product = item.product;
    if (!product) return;

    const variant = getProductVariant(item);
    if (!variant) return;

    setAddingToCartIds((ids) => [...ids, item.id]);

    addToCart({
      id: Date.now(),
      product_id: product.id,
      product_name: product.name,
      product_slug: product.slug,
      variant_id: variant.id,
      variant_name: variant.variant_name || '',
      quantity: 1,
      unit_price: (variant.sale_price || variant.price).toString(),
      total_amount: (variant.sale_price || variant.price).toString(),
      image_url: getItemImage(item),
    });

    setTimeout(() => {
      setAddingToCartIds((ids) => ids.filter((id) => id !== item.id));
    }, 500);
  };

  const handleAddBundleToCart = (item: WishlistItem) => {
    const bundle = item.bundle;
    if (!bundle || !bundle.bundle_pricing) return;

    setAddingToCartIds((ids) => [...ids, item.id]);

    const image =
      bundle.media?.file_path ||
      bundle.image_url ||
      bundle.media?.filename;

    const cartItem = createBundleCartItem(
      bundle as unknown as Bundle,
      image || undefined
    );

    addToCart(cartItem);

    setTimeout(() => {
      setAddingToCartIds((ids) => ids.filter((id) => id !== item.id));
    }, 500);
  };

  if (isLoading) {
    return <LoadingSpinner fullScreen text="Зареждане на списъка с желания..." />;
  }

  if (error || !wishlist) {
    return (
      <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center">
        <Card className="p-8 text-center max-w-md w-full">
          <Lock size={32} className="mx-auto mb-4 text-[#777777]" />
          <h2 className="text-xl font-bold mb-2">{error}</h2>
          <Link href="/products">
            <Button className="w-full">Разгледай продукти</Button>
          </Link>
        </Card>
      </div>
    );
  }

  const items = wishlist.items || [];

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      <div className="container mx-auto px-4 py-8">
        <Breadcrumbs
          items={[
            { label: 'Начало', href: '/' },
            { label: 'Споделен списък с желания' },
          ]}
          className="mb-6"
        />

        <h1 className="text-2xl md:text-3xl font-bold mb-6">
          {wishlist.name}
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {items.map((item, index) => {
            const isBundle = !!item.bundle;
            const isProduct = !!item.product;
            const variant = getProductVariant(item);

            const discount =
              isProduct && variant?.sale_price
                ? calculateDiscount(variant.price, variant.sale_price)
                : isBundle && item.bundle?.bundle_pricing
                ? item.bundle.bundle_pricing.savings_percentage
                : 0;

            const isAdding = addingToCartIds.includes(item.id);
            const image = getItemImage(item);

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="group overflow-hidden hover:shadow-xl transition-all">
                  <Link
                    href={
                      isBundle
                        ? `/bundles/${item.bundle!.slug}`
                        : `/products/${item.product!.slug}`
                    }
                  >
                    <div className="relative aspect-square bg-white overflow-hidden">
                      {image ? (
                        <Image
                          src={getImageUrl(image)}
                          alt={
                            isBundle
                              ? item.bundle!.name
                              : `${item.product!.name}${
                                  variant?.variant_name
                                    ? ` - ${variant.variant_name}`
                                    : ''
                                }`
                          }
                          fill
                          className="object-cover transition-transform group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package size={32} className="text-[#777777]" />
                        </div>
                      )}

                      {discount > 0 && (
                        <div className="absolute top-2 left-2">
                          <Badge variant="dangerSolid" size="sm">
                            -{discount}%
                          </Badge>
                        </div>
                      )}
                    </div>
                  </Link>

                  <div className="p-3 md:p-4">
                    <Link
                      href={
                        isBundle
                          ? `/bundles/${item.bundle!.slug}`
                          : `/products/${item.product!.slug}`
                      }
                    >
                      <div className="mb-3 min-h-[3rem]">
                        <h3 className="font-semibold text-sm md:text-base line-clamp-2">
                          {isBundle
                            ? item.bundle!.name
                            : item.product!.name}
                        </h3>

                        {isProduct && variant?.variant_name && (
                          <p className="text-xs text-[#777777] mt-0.5">
                            {variant.variant_name}
                          </p>
                        )}
                      </div>

                      {isProduct && variant && (
                        <div className="mb-3">
                          {variant.sale_price ? (
                            <div className="flex gap-2 items-baseline">
                              <span className="text-lg font-bold text-[#00BFA6]">
                                {formatPrice(variant.sale_price)}
                              </span>
                              <span className="text-xs line-through text-[#777777]">
                                {formatPrice(variant.price)}
                              </span>
                            </div>
                          ) : (
                            <span className="text-lg font-bold">
                              {formatPrice(variant.price)}
                            </span>
                          )}
                        </div>
                      )}

                      {isBundle && item.bundle?.bundle_pricing && (
                        <div className="mb-3">
                          <span className="text-lg font-bold text-[#00BFA6]">
                            {formatPrice(
                              item.bundle.bundle_pricing.bundle_price
                            )}
                          </span>
                        </div>
                      )}
                    </Link>

                    <Button
                      size="sm"
                      className="w-full"
                      disabled={isAdding}
                      onClick={() =>
                        isBundle
                          ? handleAddBundleToCart(item)
                          : handleAddProductToCart(item)
                      }
                    >
                      {isAdding ? (
                        'Добавяне...'
                      ) : (
                        <>
                          <ShoppingCart size={16} />
                          Добави в количката
                        </>
                      )}
                    </Button>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

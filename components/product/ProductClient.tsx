'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import ProductCarousel from '@/components/product/ProductCarousel';
import { formatPrice, calculateDiscount } from '@/lib/utils';
import { Product, ProductImage, ProductVariant } from '@/types/product';
import { ProductActions } from '@/components/product/ProductActions';
import { ProductImageGallery } from '@/components/product/ProductImageGallery';
import { ShippingInfo } from '@/components/product/ShippingInfo';
import { VariantSelector } from '@/components/product/VariantSelector';
import { ProductDescription } from '@/components/product/ProductDescription';
import { ArrowRight } from 'lucide-react';

interface ProductClientProps {
  product: Product;
  brandProducts: Product[];
}

export function ProductClient({ product, brandProducts }: ProductClientProps) {
  // ✅ Sort variants: default variant first
  const sortedVariants = useMemo(() => {
    return [...product.variants].sort((a, b) => {
      if (a.is_default) return -1;
      if (b.is_default) return 1;
      return 0;
    });
  }, [product.variants]);

  // Find default variant or use first variant
  const defaultVariant = sortedVariants.find(v => v.is_default) || sortedVariants[0];
  
  const [selectedVariantId, setSelectedVariantId] = useState<number>(defaultVariant.id);

  // Get current variant based on selected ID
  const selectedVariant = useMemo(() => {
    return sortedVariants.find(v => v.id === selectedVariantId) || defaultVariant;
  }, [selectedVariantId, sortedVariants, defaultVariant]);

  const variantImages = useMemo<ProductImage[]>(() => {
    // 1️⃣ Variant has its own images → use them
    if (selectedVariant.images && selectedVariant.images.length > 0) {
      return selectedVariant.images;
    }

    // 2️⃣ Fallback to product-level images
    return product.images || [];
  }, [selectedVariant.images, product.images]);

  // Calculate price info for current variant
  const priceInfo = useMemo(() => {
    const isSale = !!selectedVariant.sale_price;
    const currentPrice = selectedVariant.sale_price || selectedVariant.price;
    const discount = isSale && selectedVariant.price
      ? calculateDiscount(selectedVariant.price, selectedVariant.sale_price!)
      : 0;

    return { isSale, currentPrice, discount };
  }, [selectedVariant]);

  const relatedProducts = product.relatedProducts || [];
  const primaryImage = variantImages[0];

  // Get variant display name
  const getVariantName = (variant: ProductVariant): string => {
    if (variant.variant_name) {
      return variant.variant_name;
    }
    if (variant.variantAttributes && variant.variantAttributes.length > 0) {
      return variant.variantAttributes
        .map(va => va.attributeValue.value)
        .join(' - ');
    }
    return variant.is_default ? 'Стандартен вариант' : 'Вариант';
  };

  const currentVariantName = getVariantName(selectedVariant);

  return (
    <>
      {/* Main Product Section */}
      <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 pb-12 sm:pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">
          {/* Left Side: Images */}
          <ProductImageGallery
            images={variantImages}
            productName={`${product.name} - ${currentVariantName}`}
            isFeatured={product.is_featured ?? false}
            isSale={priceInfo.isSale}
            discount={priceInfo.discount}
            stockQuantity={selectedVariant.stock_quantity}
          />

          {/* Right Side: Product Info */}
          <div>
            {/* Brand */}
            {product.brand && (
              <Link
                href={`/products?brand=${product.brand.slug}`}
                className="text-sm font-semibold text-[#00BFA6] hover:text-[#00a08c] mb-2 inline-block"
              >
                {product.brand.name}
              </Link>
            )}

            {/* Product Name */}
            <h1 className="text-3xl sm:text-4xl font-bold text-[#1F1F1F] mb-2">
              {product.name}
            </h1>

            {/* Variant Name - ALWAYS SHOW */}
            <p className="text-lg text-[#777777] mb-4">
              {currentVariantName}
            </p>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-6 pb-6 border-b border-[#F5F5F5]">
              <span className="text-4xl font-bold text-[#00BFA6]">
                {formatPrice(priceInfo.currentPrice)}
              </span>
              
              {/* Show original price when on sale */}
              {priceInfo.isSale && (
                <span className="text-lg text-[#777777] line-through">
                  {formatPrice(selectedVariant.price)}
                </span>
              )}
              
              {/* Show compare_at_price if exists and not on sale */}
              {!priceInfo.isSale && selectedVariant.compare_at_price && (
                <span className="text-lg text-[#777777] line-through">
                  {formatPrice(selectedVariant.compare_at_price)}
                </span>
              )}
              
              {/* Show discount badge when on sale */}
              {priceInfo.isSale && priceInfo.discount > 0 && (
                <span className="inline-flex items-center px-2 py-1 rounded-md bg-red-100 text-red-700 text-sm font-semibold">
                  -{priceInfo.discount}%
                </span>
              )}
            </div>

            {/* Stock Status */}
            <div className="mb-6">
              {selectedVariant.stock_quantity === 0 ? (
                <div className="flex items-center gap-2 text-red-500 font-semibold">
                  Изчерпано количество
                </div>
              ) : selectedVariant.stock_quantity ? (
                <div
                  className={`flex items-center gap-2 font-semibold ${
                    selectedVariant.stock_quantity < 10
                      ? 'text-orange-500'
                      : 'text-[#00BFA6]'
                  }`}
                >
                  {selectedVariant.stock_quantity < 10
                    ? `Остават само ${selectedVariant.stock_quantity}`
                    : 'В наличност'}
                </div>
              ) : null}
            </div>

            <ProductDescription text={product.description || ''} />

            {/* Variants Selection - Don't show if only one variant */}
            {sortedVariants.length > 1 && (
              <VariantSelector
                variants={sortedVariants}
                selectedVariantId={selectedVariantId}
                onVariantChange={setSelectedVariantId}
              />
            )}

            {/* Quantity and Add to Cart */}
            <ProductActions
              product={product}
              variant={selectedVariant}
              currentPrice={priceInfo.currentPrice.toString()}
              primaryImage={primaryImage}
            />

            {/* Shipping Info */}
            <ShippingInfo />
          </div>
        </div>
      </div>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <section className="bg-[#F5F5F5] py-8 sm:py-12 lg:py-16 xl:py-24">
          <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
            <div className="mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-[#1F1F1F] mb-2">
                Подобни продукти
              </h2>
              <p className="text-[#777777]">
                Може да харесате тези продукти
              </p>
            </div>

            <ProductCarousel products={relatedProducts} visibleItems={4} />
          </div>
        </section>
      )}

      {/* Brand Products Section */}
      {brandProducts.length > 0 && (
        <section className="py-12 sm:py-16 lg:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-12 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-3xl sm:text-4xl font-bold text-[#1F1F1F] mb-2">
                  Още от {product.brand?.name}
                </h2>
                <p className="text-[#777777]">
                  Открийте още интересни предложения
                </p>
              </div>
              <Link href={`/products?brands=${product.brand?.slug}`}>
                <button className="flex items-center gap-2 text-[#00BFA6] hover:text-[#00a890] font-semibold transition-colors text-sm sm:text-base whitespace-nowrap">
                  Виж всички
                  <ArrowRight size={18} className="sm:w-5 sm:h-5" />
                </button>
              </Link>
            </div>
            <ProductCarousel products={brandProducts} visibleItems={4} />
          </div>
        </section>
      )}
    </>
  );
}
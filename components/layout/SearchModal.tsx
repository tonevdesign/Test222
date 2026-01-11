'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { apiClient } from '@/lib/api';
import { useDebounce } from '@/hooks/useDebounce';
import { formatPrice } from '@/lib/utils';
import { getImageUrl } from '@/lib/imageUtils';
import { Product } from '@/types/product';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  const debouncedQuery = useDebounce(searchQuery, 300);

  useEffect(() => {
    if (debouncedQuery.trim().length >= 2) {
      searchProducts(debouncedQuery);
    } else {
      setProducts([]);
      setRelatedProducts([]);
    }
  }, [debouncedQuery]);

  const searchProducts = async (query: string) => {
    setLoading(true);
    try {
      const response = await apiClient.get<Product[]>(
        `/search/products?q=${encodeURIComponent(query)}&limit=8`
      );

      const productsData = response.data ?? [];
      setProducts(productsData);

      // Fetch related products from the first result's product detail page
      if (productsData.length > 0 && productsData[0].slug) {
        const firstProductSlug = productsData[0].slug;
        
        const relatedResponse = await apiClient.get<Product>(
          `/products/${firstProductSlug}`
        );

        const relatedData = relatedResponse.data?.relatedProducts ?? [];

        // Filter out products that are already in search results
        setRelatedProducts(
          relatedData
            .filter((p: Product) => !productsData.some((sp) => sp.id === p.id))
            .slice(0, 4) // Limit to 4 related products
        );
      } else {
        setRelatedProducts([]);
      }
    } catch (error) {
      console.error('Search error:', error);
      setProducts([]);
      setRelatedProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // Close modal on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // Helper function to get product image
  const getProductImage = (product: Product) => {
    const primaryImage = product.images?.[0];
    if (!primaryImage) return null;
    
    return getImageUrl(primaryImage.thumbnail_url || primaryImage.image_url);
  };

  // Helper function to get product price
  const getProductPrice = (product: Product) => {
    const variant = product.variants?.[0];
    if (!variant) return { current: '0', original: null };
    
    return {
      current: variant.sale_price || variant.price,
      original: variant.sale_price ? variant.price : null
    };
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-0 left-0 right-0 z-50 container mx-auto w-full  px-4"
          >
            <div className="bg-white rounded-b-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
              {/* Search Bar Header */}
              <div className="sticky top-0 bg-white p-6 border-b border-[#F5F5F5] z-10">
                <div className="flex items-center gap-3">
                  <div className="flex-1 flex items-center gap-3 bg-[#F5F5F5] rounded-lg px-4 py-3">
                    <Search size={20} className="text-[#777777]" />
                    <input
                      type="text"
                      placeholder="Търсене на продукти..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      autoFocus
                      className="flex-1 bg-transparent outline-none text-[#1F1F1F] placeholder-[#777777] text-lg"
                    />
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                {searchQuery.trim().length < 2 ? (
                  <div className="text-center py-12">
                    <Search size={48} className="mx-auto text-[#A8FFF5] mb-4" />
                    <p className="text-[#777777] text-lg">
                      Въвдете поне 2 символа за да търсите
                    </p>
                  </div>
                ) : loading ? (
                  <div className="text-center py-12">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-[#F5F5F5] border-t-[#00BFA6]" />
                    <p className="text-[#777777] mt-4">Търсене...</p>
                  </div>
                ) : products.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-[#777777] text-lg">
                      Няма намерени продукти за &apos;{searchQuery}&apos;
                    </p>
                  </div>
                ) : (
                  <>
                    {/* Search Results */}
                    <div>
                      <h3 className="text-lg font-bold text-[#1F1F1F] mb-4">
                        Резултати от търсенето ({products.length})
                      </h3>
                      <motion.div
                        layout
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
                      >
                        {products.map((product) => {
                          const imageUrl = getProductImage(product);
                          const { current, original } = getProductPrice(product);

                          return (
                            <motion.div
                              key={product.id}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: 20 }}
                              onClick={onClose}
                            >
                              <Link href={`/products/${product.slug}`}>
                                <div className="bg-white border border-[#F5F5F5] rounded-lg overflow-hidden hover:shadow-lg hover:border-[#E0E0E0] transition-all cursor-pointer group">
                                  {/* Product Image */}
                                 <div className="relative w-full aspect-square overflow-hidden bg-[#F5F5F5]">
                                    {imageUrl ? (
                                      <Image
                                        src={imageUrl}
                                        alt={product.name}
                                        fill
                                        className="object-contain"
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                                      />
                                    ) : (
                                      <div className="w-full h-full flex items-center justify-center">
                                        <span className="text-[#777777] text-sm">Няма изображение</span>
                                      </div>
                                    )}
                                  </div>

                                  {/* Product Info */}
                                  <div className="p-3">
                                    {/* Brand */}
                                    {product.brand && (
                                      <p className="text-xs text-[#777777] font-medium mb-1">
                                        {product.brand.name}
                                      </p>
                                    )}
                                    
                                    {/* Product Name */}
                                    <h4 className="font-semibold text-[#1F1F1F] text-sm mb-2 line-clamp-2 min-h-[2.5rem] group-hover:text-[#00BFA6] transition-colors">
                                      {product.name}
                                    </h4>
                                    
                                    {/* Price */}
                                    <div className="flex items-center gap-2">
                                      <span className="font-bold text-[#00BFA6]">
                                        {formatPrice(current)}
                                      </span>
                                      {original && (
                                        <span className="text-xs text-[#777777] line-through">
                                          {formatPrice(original)}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </Link>
                            </motion.div>
                          );
                        })}
                      </motion.div>
                    </div>

                    {/* Related Products Section */}
                    {relatedProducts.length > 0 && (
                      <div className="border-t border-[#F5F5F5] pt-8">
                        <h3 className="text-lg font-bold text-[#1F1F1F] mb-4">
                          Подобни продукти
                        </h3>
                        <motion.div
                          layout
                          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
                        >
                          {relatedProducts.map((product) => {
                            const imageUrl = getProductImage(product);
                            const { current, original } = getProductPrice(product);

                            return (
                              <motion.div
                                key={product.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 20 }}
                                onClick={onClose}
                              >
                                <Link href={`/products/${product.slug}`}>
                                  <div className="bg-white border border-[#F5F5F5] rounded-lg overflow-hidden hover:shadow-lg hover:border-[#E0E0E0] transition-all cursor-pointer group">
                                    {/* Product Image */}
                                    <div className="relative w-full aspect-square overflow-hidden bg-[#F5F5F5]">
                                      {imageUrl ? (
                                        <Image
                                          src={imageUrl}
                                          alt={product.name}
                                          fill
                                          className="object-contain"
                                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                                        />
                                      ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                          <span className="text-[#777777] text-sm">Няма изображение</span>
                                        </div>
                                      )}
                                    </div>

                                    {/* Product Info */}
                                    <div className="p-3">
                                      {/* Brand */}
                                      {product.brand && (
                                        <p className="text-xs text-[#777777] font-medium mb-1">
                                          {product.brand.name}
                                        </p>
                                      )}
                                      
                                      {/* Product Name */}
                                      <h4 className="font-semibold text-[#1F1F1F] text-sm mb-2 line-clamp-2 min-h-[2.5rem] group-hover:text-[#00BFA6] transition-colors">
                                        {product.name}
                                      </h4>
                                      
                                      {/* Price */}
                                      <div className="flex items-center gap-2">
                                        <span className="font-bold text-[#00BFA6]">
                                          {formatPrice(current)}
                                        </span>
                                        {original && (
                                          <span className="text-xs text-[#777777] line-through">
                                            {formatPrice(original)}
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </Link>
                              </motion.div>
                            );
                          })}
                        </motion.div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
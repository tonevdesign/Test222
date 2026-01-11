'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { getImageUrl, productImageSizes } from '@/lib/imageUtils';
import { ProductImage } from '@/types/product';

export function ProductImageGallery({
  images,
  productName,
  stockQuantity
}: {
  images: ProductImage[];
  productName: string;
  isFeatured: boolean;
  isSale: boolean;
  discount: number;
  stockQuantity: number;
}) {
  const [selectedImage, setSelectedImage] = useState(0);
  const primaryImage = images[selectedImage];

  useEffect(() => {
    setSelectedImage(0);
  }, [images]);

  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Main Image */}
      <div className="relative w-full aspect-square bg-[#F5F5F5] rounded-lg overflow-hidden mb-3 sm:mb-4">
        {primaryImage ? (
          <Image
            src={getImageUrl(primaryImage.image_url)}
            alt={productName}
            fill
            className="object-contain"
            sizes={productImageSizes}
            priority
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-[#777777] text-sm sm:text-base">
              Няма налични изображения
            </span>
          </div>
        )}
        
        {/* Stock Status Overlay */}
        {stockQuantity === 0 && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="text-white font-bold text-sm sm:text-base md:text-lg">Няма наличност</span>
          </div>
        )}
      </div>

      {/* Thumbnail Images */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 sm:grid-cols-5 lg:grid-cols-6 gap-2 sm:gap-3">
          {images.map((image, index) => (
            <motion.button
              key={image.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedImage(index)}
              className={`relative w-full aspect-square rounded-lg overflow-hidden bg-[#F5F5F5] border-2 transition-all ${
                selectedImage === index
                  ? 'border-[#00BFA6]'
                  : 'border-[#E0E0E0] hover:border-[#00BFA6]'
              }`}
            >
              <Image
                src={getImageUrl(image.thumbnail_url || image.image_url)}
                alt={`Thumbnail ${index + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 80px, 100px"
              />
            </motion.button>
          ))}
        </div>
      )}
    </motion.div>
  );
}

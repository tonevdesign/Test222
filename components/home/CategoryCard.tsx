'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Category } from '@/types/product';
import { getImageUrl } from '@/lib/imageUtils';

interface CategoryCardProps {
  category: Category;
}

export default function CategoryCard({ category }: CategoryCardProps) {
  const imageUrl = getImageUrl(category.image_url);

  return (
    <Link href={`/products?categories=${category.slug}`}>
      <motion.div
        whileHover={{ translateY: -8 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="overflow-hidden aspect-square cursor-pointer">
          <div className="relative w-full h-full group">

            {/* Category Image */}
            <Image
              src={imageUrl}
              alt={category.name}
              fill
              className="object-contain bg-white group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex items-end p-4">
              <div>
                <h3 className="font-bold text-white text-lg">
                  {category.name}
                </h3>
                {category.children && category.children.length > 0 && (
                  <p className="text-[#A8FFF5] text-xs">
                    {category.children.length} подкатегории
                  </p>
                )}
              </div>
            </div>

            {/* Hover CTA */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileHover={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 bg-[#00BFA6]/80 flex items-center justify-center"
            >
              <span className="text-white font-bold text-lg">
                Разгледай {category.name}
              </span>
            </motion.div>
          </div>
        </Card>
      </motion.div>
    </Link>
  );
}

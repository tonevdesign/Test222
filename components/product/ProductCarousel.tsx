'use client';

import { useRef, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import ProductCard from './ProductCard';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import type { Swiper as SwiperClass } from 'swiper';

import { Product } from '@/types/product';

interface ProductCarouselProps {
  products: Product[];
  visibleItems?: 3 | 4;
}

export default function ProductCarousel({
  products,
  visibleItems = 4
}: ProductCarouselProps) {
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);
  const swiperRef = useRef<SwiperClass | null>(null);

  const slidesPerView = visibleItems;

  useEffect(() => {
    if (swiperRef.current && prevRef.current && nextRef.current) {
      const swiper = swiperRef.current;
  
      if (swiper.params.navigation && typeof swiper.params.navigation !== 'boolean') {
        swiper.params.navigation.prevEl = prevRef.current;
        swiper.params.navigation.nextEl = nextRef.current;
        swiper.navigation.init();
        swiper.navigation.update();
      }
    }
  }, []);
  
  return (
    <div className="relative pb-12 lg:pb-4">
      <Swiper
        modules={[Navigation, Pagination]}
        slidesPerView={1}
        spaceBetween={12}
        onSwiper={(swiper) => (swiperRef.current = swiper)}
        navigation={{
          prevEl: prevRef.current,
          nextEl: nextRef.current,
        }}
        pagination={{
          clickable: true,
          dynamicBullets: false,
        }}
        breakpoints={{
          480: { 
            slidesPerView: 1, 
            spaceBetween: 12 
          },
          640: { 
            slidesPerView: 2, 
            spaceBetween: 16 
          },
          768: { 
            slidesPerView: 2, 
            spaceBetween: 16 
          },
          1024: { 
            slidesPerView: 3, 
            spaceBetween: 20,
            pagination: false
          },
          1280: { 
            slidesPerView: slidesPerView, 
            spaceBetween: 24,
            pagination: false
          },
        }}
        loop={products.length > slidesPerView}
        className="!pb-10 lg:!pb-4"
      >
        {products.map((product) => (
          <SwiperSlide key={product.id}>
            <ProductCard product={product} />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Navigation Buttons - Hidden on mobile/tablet, visible on desktop */}
      <motion.button
        ref={prevRef}
        whileHover={{ scale: 1.1, x: -5 }}
        whileTap={{ scale: 0.95 }}
        className="absolute md:left-10 xl:left-0 top-1/2 -translate-y-1/2 -translate-x-12 xl:-translate-x-14 z-10 p-2 bg-white border-2 border-[#E0E0E0] rounded-full hover:bg-[#00BFA6] hover:border-[#00BFA6] hover:text-white transition-all duration-300 hidden lg:flex items-center justify-center"
        aria-label="Previous products"
      >
        <ChevronLeft size={20} className="xl:w-6 xl:h-6" />
      </motion.button>

      <motion.button
        ref={nextRef}
        whileHover={{ scale: 1.1, x: 5 }}
        whileTap={{ scale: 0.95 }}
        className="absolute md:right-10 xl:right-0 top-1/2 -translate-y-1/2 translate-x-12 xl:translate-x-14 z-10 p-2 bg-white border-2 border-[#E0E0E0] rounded-full hover:bg-[#00BFA6] hover:border-[#00BFA6] hover:text-white transition-all duration-300 hidden lg:flex items-center justify-center"
        aria-label="Next products"
      >
        <ChevronRight size={20} className="xl:w-6 xl:h-6" />
      </motion.button>

      {/* Pagination Styles */}
      <style jsx>{`
        :global(.swiper-pagination) {
          bottom: 0 !important;
          display: flex;
          justify-content: center;
          gap: 8px;
        }

        @media (min-width: 1024px) {
          :global(.swiper-pagination) {
            display: none !important;
          }
        }

        :global(.swiper-pagination-bullet) {
          width: 8px;
          height: 8px;
          background-color: #e0e0e0;
          opacity: 1;
          border-radius: 50%;
          transition: all 0.3s ease;
          margin: 0 !important;
        }

        :global(.swiper-pagination-bullet-active) {
          background-color: #00bfa6;
          width: 24px;
          border-radius: 4px;
        }
      `}</style>
    </div>
  );
}
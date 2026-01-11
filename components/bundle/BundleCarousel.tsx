'use client';

import { useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import BundleCard from './BundleCard';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Bundle } from '@/types/bundle';

interface BundleCarouselProps {
  bundles: Bundle[];
  visibleItems?: 3 | 6;
}

export default function BundleCarousel({ bundles, visibleItems = 3 }: BundleCarouselProps) {
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);

  return (
    <div className="relative pb-12 lg:pb-4">
      <Swiper
        modules={[Navigation, Pagination]}
        slidesPerView={1}
        spaceBetween={12}
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
          1024: { 
            slidesPerView: visibleItems, 
            spaceBetween: 24,
            pagination: false
          },
        }}
        loop={bundles.length > visibleItems}
        className="!pb-10 lg:!pb-4"
        onSwiper={(swiper) => {
          if (prevRef.current && nextRef.current) {
            swiper.params.navigation = { prevEl: prevRef.current, nextEl: nextRef.current };
            swiper.navigation.init();
            swiper.navigation.update();
          }
        }}
      >
        {bundles.map((bundle) => (
          <SwiperSlide key={bundle.id}>
            <BundleCard bundle={bundle} />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Navigation Buttons - Hidden on mobile/tablet, visible on desktop */}
      {bundles.length > visibleItems && (
        <>
          <motion.button
            ref={prevRef}
            whileHover={{ scale: 1.1, x: -5 }}
            whileTap={{ scale: 0.95 }}
            className="absolute md:left-10 xl:left-0 top-1/2 -translate-y-1/2 -translate-x-12 xl:-translate-x-14 z-10 p-2 bg-white border-2 border-[#00BFA6] rounded-full hover:bg-[#00BFA6] hover:text-white transition-all hidden lg:flex items-center justify-center"
          >
            <ChevronLeft size={20} className="xl:w-6 xl:h-6" />
          </motion.button>

          <motion.button
            ref={nextRef}
            whileHover={{ scale: 1.1, x: 5 }}
            whileTap={{ scale: 0.95 }}
            className="absolute md:right-10 xl:right-0 top-1/2 -translate-y-1/2 translate-x-12 xl:translate-x-14 z-10 p-2 bg-white border-2 border-[#00BFA6] rounded-full hover:bg-[#00BFA6] hover:text-white transition-all hidden lg:flex items-center justify-center"
          >
            <ChevronRight size={20} className="xl:w-6 xl:h-6" />
          </motion.button>
        </>
      )}

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
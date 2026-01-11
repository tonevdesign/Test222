'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, TrendingUp, Zap, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const HeroSection = () => {
  return (
    <section className="bg-[#1F1F1F] text-white py-8 sm:py-12 md:py-16 lg:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col justify-center order-2 lg:order-1"
          >
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 sm:mb-4 leading-tight"
            >
              <span className="text-[#00BFA6]">Качество</span>,{' '}
              което изпъква
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-base sm:text-lg text-[#A8FFF5] mb-6 sm:mb-8 max-w-md"
            >
              Открийте подбрани продукти за модерен живот.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-3 sm:gap-4"
            >
              <Link href="/products" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto">
                  Пазарувай сега
                  <ArrowRight size={20} />
                </Button>
              </Link>

              <Link href="/products?on_sale=true" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  Виж промоциите
                </Button>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-wrap gap-3 sm:gap-4 mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-[#333333]"
            >
              <div className="flex items-center gap-2">
                <Zap size={18} className="text-[#00BFA6]" />
                <span className="text-xs sm:text-sm text-[#A8FFF5]">Бърза доставка</span>
              </div>
              <div className="flex items-center gap-2">
                <Award size={18} className="text-[#00BFA6]" />
                <span className="text-xs sm:text-sm text-[#A8FFF5]">Високо качество</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp size={18} className="text-[#00BFA6]" />
                <span className="text-xs sm:text-sm text-[#A8FFF5]">Чудесни сделки</span>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="relative h-48 sm:h-64 md:h-80 lg:h-full min-h-[300px] lg:min-h-[400px] order-1 lg:order-2"
          >
            <Image
              src="/hero/hero.png"
              alt="Hero Image"
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 50vw"
              className="object-cover rounded-lg"
              priority
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};
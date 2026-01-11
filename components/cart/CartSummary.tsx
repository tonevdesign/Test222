'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Gift } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { formatPrice } from '@/lib/utils';
import { CartItem } from '@/types/cart';

interface CartSummaryProps {
  items: CartItem[];
  total: number;
  totalItems: number;
}

export default function CartSummary({ items, total, totalItems }: CartSummaryProps) {
  const subtotal = total;
  const discount = items.filter(item => item.is_bundle).reduce((sum, item) => {
    return sum + (parseFloat(item.bundle_savings_amount || '0') * item.quantity);
  }, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="lg:col-span-1"
    >
      <Card className="p-4 sm:p-5 md:p-6 lg:sticky lg:top-24">
        <h2 className="text-lg sm:text-xl font-bold text-[#1F1F1F] mb-4 sm:mb-6">
          Обобщение на поръчката
        </h2>

        <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6 pb-4 sm:pb-6 border-b border-[#F5F5F5]">
          <div className="flex items-center justify-between">
            <span className="text-xs sm:text-sm text-[#777777]">
              Междинна сума ({totalItems} {totalItems === 1 ? 'артикул' : 'артикула'})
            </span>
            <span className="font-semibold text-sm sm:text-base text-[#1F1F1F]">
              {formatPrice(subtotal.toString())}
            </span>
          </div>

          {discount > 0 && (
            <div className="flex items-center justify-between">
              <span className="text-xs sm:text-sm text-[#777777] flex items-center gap-1">
                <Gift size={14} className="sm:w-4 sm:h-4 text-[#00BFA6]" />
                Отстъпка от комплекти
              </span>
              <span className="font-semibold text-sm sm:text-base text-[#00BFA6]">
                -{formatPrice(discount.toString())}
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <span className="font-bold text-base sm:text-lg text-[#1F1F1F]">Общо</span>
          <span className="font-bold text-xl sm:text-2xl text-[#00BFA6]">
            {formatPrice(total.toString())}
          </span>
        </div>

        <Link href="/checkout" className="w-full block">
          <Button size="lg" className="w-full mb-2 sm:mb-3">
            Продължете към плащане
          </Button>
        </Link>

        <div className="mt-6 sm:mt-8 space-y-2 sm:space-y-3 pt-4 sm:pt-6 border-t border-[#F5F5F5]">
          <div className="flex items-center gap-2 text-xs sm:text-sm">
            <div className="w-4 h-4 sm:w-5 sm:h-5 bg-[#00BFA6] rounded flex items-center justify-center flex-shrink-0">
              <span className="text-white text-[10px] sm:text-xs">✓</span>
            </div>
            <span className="text-[#777777]">Сигурно плащане</span>
          </div>

          <div className="flex items-center gap-2 text-xs sm:text-sm">
            <div className="w-4 h-4 sm:w-5 sm:h-5 bg-[#00BFA6] rounded flex items-center justify-center flex-shrink-0">
              <span className="text-white text-[10px] sm:text-xs">✓</span>
            </div>
            <span className="text-[#777777]">Безплатна доставка над 100 €</span>
          </div>

          <div className="flex items-center gap-2 text-xs sm:text-sm">
            <div className="w-4 h-4 sm:w-5 sm:h-5 bg-[#00BFA6] rounded flex items-center justify-center flex-shrink-0">
              <span className="text-white text-[10px] sm:text-xs">✓</span>
            </div>
            <span className="text-[#777777]">14-дневно връщане</span>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
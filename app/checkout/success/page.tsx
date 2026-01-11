'use client';

import { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { CheckCircle, Package, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';

function CheckoutSuccessContent() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get('order');

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F5F5] to-white flex items-center justify-center p-4 sm:p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl w-full"
      >
        <Card className="p-6 sm:p-8 lg:p-12">
          {/* Success Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              duration: 0.5,
              delay: 0.2,
              type: 'spring',
              stiffness: 200,
            }}
            className="w-16 h-16 sm:w-20 sm:h-20 bg-[#00BFA6]/10 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6"
          >
            <CheckCircle size={40} className="text-[#00BFA6] sm:w-12 sm:h-12" />
          </motion.div>

          {/* Success Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-center mb-6 sm:mb-8"
          >
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1F1F1F] mb-2 sm:mb-3">
              Поръчката е направена успешно!
            </h1>
            <p className="text-[#777777] text-base sm:text-lg">
              Благодарив Ви, че пазарувахте при нас.
            </p>
          </motion.div>

          {/* Order Number */}
          {orderNumber && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-[#F5F5F5] rounded-lg p-4 sm:p-6 mb-6 sm:mb-8"
            >
              <p className="text-xs sm:text-sm text-[#777777] mb-1">Номер на поръчка</p>
              <p className="text-xl sm:text-2xl font-bold text-[#1F1F1F]">{orderNumber}</p>
            </motion.div>
          )}

          {/* Order Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="space-y-3 sm:space-y-4 mb-6 sm:mb-8"
          >
            <div className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 bg-[#F5F5F5] rounded-lg">
              <div>
                <h3 className="font-semibold text-[#1F1F1F] mb-1 text-sm sm:text-base">
                  Какво следва?
                </h3>
                <p className="text-xs sm:text-sm text-[#777777]">
                  Вашата поръчка се обработва и скоро ще се свържем с Вас за потвърждение.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 bg-[#F5F5F5] rounded-lg">
              <div>
                <h3 className="font-semibold text-[#1F1F1F] mb-1 text-sm sm:text-base">
                  Проследете поръчката си
                </h3>
                <p className="text-xs sm:text-sm text-[#777777]">
                  Може да следите статуса на поръчката си в секцията &quot;Моите поръчки&quot;.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4"
          >
            <Link href="/account/orders" className="w-full">
              <Button size="lg" className="w-full text-sm sm:text-base">
                <Package size={18} className="sm:w-5 sm:h-5" />
                Моите поръчки
              </Button>
            </Link>

            <Link href="/" className="w-full">
              <Button size="lg" variant="outline" className="w-full text-sm sm:text-base">
                <Home size={18} className="sm:w-5 sm:h-5" />
                Начало
              </Button>
            </Link>
          </motion.div>
        </Card>
      </motion.div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<LoadingSpinner fullScreen />}>
      <CheckoutSuccessContent />
    </Suspense>
  );
}
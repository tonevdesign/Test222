import Image from 'next/image';
import { Card } from '@/components/ui/card';
import { formatPrice } from '@/lib/utils';
import { getImageUrl } from '@/lib/imageUtils';
import { ShippingMethod } from '@/types/shipping';
import { CartItem } from '@/types/cart';

interface OrderSummaryProps {
  items: CartItem[];
  total: number;
  selectedShipping: ShippingMethod | null;
}

export function OrderSummary({ items, total }: OrderSummaryProps) {
  return (
    <Card className="p-4 sm:p-6 lg:sticky lg:top-24">
      <h2 className="text-lg sm:text-xl font-bold text-[#1F1F1F] mb-4 sm:mb-6">
        Обобщение
      </h2>

      {/* Cart Items */}
      <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6 pb-4 sm:pb-6 border-b border-[#F5F5F5]">
        {items.map((item) => (
          <div key={item.id} className="flex gap-2 sm:gap-3">
            {/* IMAGE */}
            <div className="relative w-12 h-12 sm:w-16 sm:h-16 bg-[#F5F5F5] rounded-lg flex-shrink-0 overflow-hidden">
              {item.image_url ? (
                <Image
                  src={getImageUrl(item.image_url)}
                  alt={item.product_name || 'Product image'}
                  fill
                  sizes="(max-width: 640px) 48px, 64px"
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[10px] text-[#777777]">
                  Без изображение
                </div>
              )}
            </div>

            {/* INFO */}
            <div className="flex-1 min-w-0">
              <p className="font-medium text-[#1F1F1F] text-xs sm:text-sm line-clamp-2">
                {item.product_name}
              </p>

              {/* VARIANT NAME */}
              {item.variant_name && (
                <p className="text-[10px] sm:text-xs text-[#777777]">
                  {item.variant_name}
                </p>
              )}

              <p className="text-xs text-[#777777]">
                Количество: {item.quantity}
              </p>

              <p className="text-xs sm:text-sm font-semibold text-[#00BFA6]">
                {formatPrice(item.total_amount)}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Subtotal */}
      <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
        <div className="flex justify-between text-xs sm:text-sm text-[#777777]">
          <span>Междинна сума</span>
          <span className="font-semibold">{formatPrice(total)}</span>
        </div>
      </div>

      {/* Grand Total */}
      <div className="flex justify-between text-base sm:text-lg pt-4 sm:pt-6 border-t border-[#F5F5F5]">
        <span className="font-bold text-[#1F1F1F]">Общо</span>
        <span className="font-bold text-xl sm:text-2xl text-[#00BFA6]">
          {formatPrice(total)}
        </span>
      </div>
    </Card>
  );
}

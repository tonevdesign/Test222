'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ChevronRight,
  Package,
  MapPin,
  CreditCard,
  Gift,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { apiClient } from '@/lib/api';
import { formatPrice, formatDate } from '@/lib/utils';
import { getStatusLabel, getStatusColor } from '@/lib/orderUtils';
import { Order, OrderItem } from '@/types/order';
import Image from 'next/image';
import { getImageUrl } from '@/lib/imageUtils';
import { ProtectedPage } from '@/components/auth/ProtectedPage';

interface GroupedBundleItem {
  bundle_id: number;
  bundle_name?: string;
  items: OrderItem[];
  total: number;
}

interface GroupedOrderItems {
  bundles: Record<number, GroupedBundleItem>;
  standalone: OrderItem[];
}

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const orderNumber = params.orderNumber as string;

  const [order, setOrder] = useState<Order | null>(null);

  const fetchOrderDetail = useCallback(async () => {
    try {
      const response = await apiClient.get<Order>(`/orders/${orderNumber}`);
      
      if (response.data) {
        setOrder(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch order:', error);
      router.push('/account/orders');
    }
  }, [orderNumber, router]);

  useEffect(() => {
    fetchOrderDetail();
  }, [fetchOrderDetail]);

  if (!order) {
    return (
      <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center">
        <Card className="p-8 text-center max-w-md">
          <Package size={48} className="mx-auto text-[#777777] mb-4" />
          <h2 className="text-xl font-bold text-[#1F1F1F] mb-2">
            Поръчката не е намерена
          </h2>
          <p className="text-[#777777] mb-6">
            Поръчката не е намерена. Моля, върнете се към списъка с поръчки.
          </p>
          <Link href="/account/orders">
            <Button>Обратно към поръчките</Button>
          </Link>
        </Card>
      </div>
    );
  }

  // Group items by bundle or standalone
  const groupedItems = order.items.reduce<GroupedOrderItems>((acc, item) => {
    if (item.bundle_id) {
      if (!acc.bundles[item.bundle_id]) {
        acc.bundles[item.bundle_id] = {
          bundle_id: item.bundle_id,
          bundle_name: item.bundle_name,
          items: [],
          total: 0,
        };
      }
      acc.bundles[item.bundle_id].items.push(item);
      acc.bundles[item.bundle_id].total += parseFloat(item.total_amount);
    } else {
      acc.standalone.push(item);
    }
    return acc;
  }, { bundles: {}, standalone: [] });

  const bundles = Object.values(groupedItems.bundles);
  const standaloneItems = groupedItems.standalone;

  return (
    <ProtectedPage loadingText="Зареждане на поръчката...">
      <div className="min-h-screen bg-[#F5F5F5]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {/* Breadcrumbs & Header */}
          <div className="mb-6 sm:mb-8">
            <div className="flex items-center gap-2 text-xs sm:text-sm text-[#777777] mb-4">
              <Link href="/account" className="hover:text-[#00BFA6] transition-colors">
                Акаунт
              </Link>
              <ChevronRight size={14} className="sm:w-4 sm:h-4" />
              <Link href="/account/orders" className="hover:text-[#00BFA6] transition-colors">
                Поръчки
              </Link>
              <ChevronRight size={14} className="sm:w-4 sm:h-4" />
              <span className="text-[#1F1F1F] font-medium truncate">#{order.order_number}</span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-[#1F1F1F] mb-2">
                  Поръчка #{order.order_number}
                </h1>
                <p className="text-sm sm:text-base text-[#777777]">Направена на {formatDate(order.created_at || '')}</p>
              </div>

              <span
                className={`px-4 sm:px-6 py-2 sm:py-3 rounded-lg text-xs sm:text-sm font-bold border-2 self-start sm:self-auto ${getStatusColor(
                  order.status
                )}`}
              >
                {getStatusLabel(order.status)}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Order Items & Payment */}
            <div className="lg:col-span-2">
              <Card className="p-4 sm:p-6">
                <h2 className="text-lg sm:text-xl font-bold text-[#1F1F1F] mb-4 sm:mb-6">
                  Продукти в поръчката
                </h2>

                <div className="space-y-4 sm:space-y-6">
                  {/* Bundles */}
                  {bundles.map((bundle) => (
                    <div key={`bundle-${bundle.bundle_id}`} className="border-2 border-[#00BFA6]/20 rounded-lg p-3 sm:p-4 bg-[#00BFA6]/5">
                      {/* Bundle Header */}
                      <div className="flex items-center justify-between mb-3 sm:mb-4 pb-3 border-b border-[#00BFA6]/20">
                        <div className="flex items-center gap-2">
                          <Gift size={18} className="text-[#00BFA6] sm:w-5 sm:h-5" />
                          <h3 className="text-sm sm:text-base font-bold text-[#1F1F1F]">
                            {bundle.bundle_name || 'Комплект'}
                          </h3>
                        </div>
                        <span className="text-xs font-semibold text-[#00BFA6] bg-[#00BFA6]/10 px-2 sm:px-3 py-1 rounded-full">
                          Пакетна оферта
                        </span>
                      </div>

                      {/* Bundle Items */}
                      <div className="space-y-2 sm:space-y-3">
                        {bundle.items.map((item) => {
                          const product = item.variant?.product;
                          const primaryImage =
                            product?.images?.find((img) => img.is_primary)?.thumbnail_url ||
                            product?.images?.find((img) => img.is_primary)?.image_url ||
                            product?.images?.[0]?.thumbnail_url ||
                            product?.images?.[0]?.image_url ||
                            '/placeholder.png';

                          const hasRegularPrice = item.regular_price && parseFloat(item.regular_price) > parseFloat(item.unit_price);

                          return (
                            <div key={item.id} className="flex gap-2 sm:gap-3 p-2 sm:p-3 bg-white rounded-lg">
                              {/* Product image - Square aspect ratio */}
                              <div className="relative w-12 h-12 sm:w-16 sm:h-16 rounded-lg overflow-hidden bg-[#F5F5F5] flex-shrink-0 flex items-center justify-center p-1 sm:p-2">
                                <div className="relative w-full h-full">
                                  <Image
                                    src={getImageUrl(primaryImage)}
                                    alt={`${item.product_name}${item.variant_name ? ` - ${item.variant_name}` : ''}`}
                                    fill
                                    className="object-contain"
                                    sizes="(max-width: 640px) 48px, 64px"
                                  />
                                </div>
                              </div>

                              {/* Product info */}
                              <div className="flex-1 min-w-0">
                                <h4 className="font-medium text-[#1F1F1F] text-xs sm:text-sm mb-1">
                                  {item.product_name}
                                </h4>
                                {/* ✅ Variant name */}
                                {item.variant_name && (
                                  <p className="text-xs text-[#777777] mb-1">
                                    {item.variant_name}
                                  </p>
                                )}
                                <div className="flex items-center justify-between">
                                  <p className="text-xs text-[#777777]">
                                    Количество: {item.quantity}
                                  </p>
                                  <div className="text-right">
                                    {hasRegularPrice && (
                                      <p className="text-xs text-[#777777] line-through">
                                        {formatPrice(item.regular_price!)}
                                      </p>
                                    )}
                                    <p className="font-semibold text-[#00BFA6] text-xs sm:text-sm">
                                      {formatPrice(item.unit_price)}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Bundle Total */}
                      <div className="mt-3 sm:mt-4 pt-3 border-t border-[#00BFA6]/20 flex items-center justify-between">
                        <span className="text-xs sm:text-sm font-semibold text-[#1F1F1F]">
                          Обща цена на комплекта
                        </span>
                        <span className="text-base sm:text-lg font-bold text-[#00BFA6]">
                          {formatPrice(bundle.total.toFixed(2))}
                        </span>
                      </div>
                    </div>
                  ))}

                  {/* Standalone Products */}
                  {standaloneItems.map((item) => {
                    const product = item.variant?.product;
                    const primaryImage =
                      product?.images?.find((img) => img.is_primary)?.thumbnail_url ||
                      product?.images?.find((img) => img.is_primary)?.image_url ||
                      product?.images?.[0]?.thumbnail_url ||
                      product?.images?.[0]?.image_url ||
                      '/placeholder.png';

                    const hasRegularPrice = item.regular_price && parseFloat(item.regular_price) > parseFloat(item.unit_price);

                    return (
                      <div
                        key={item.id}
                        className="flex gap-3 sm:gap-4 p-3 sm:p-4 bg-[#F5F5F5] rounded-lg"
                      >
                        {/* Product image - Square aspect ratio with centered image */}
                        <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-lg overflow-hidden bg-white flex-shrink-0 flex items-center justify-center p-2 sm:p-3">
                          <div className="relative w-full h-full">
                            <Image
                              src={getImageUrl(primaryImage)}
                              alt={`${item.product_name}${item.variant_name ? ` - ${item.variant_name}` : ''}`}
                              fill
                              className="object-contain"
                              sizes="(max-width: 640px) 64px, 96px"
                            />
                          </div>
                        </div>

                        {/* Product info */}
                        <div className="flex-1 min-w-0">
                          {/* ✅ Product name */}
                          <h3 className="font-semibold text-[#1F1F1F] mb-1 text-sm sm:text-base">
                            {item.product_name}
                          </h3>

                          {/* ✅ Variant name (shown below product name in gray) */}
                          {item.variant_name && (
                            <p className="text-xs sm:text-sm text-[#777777] mb-2">
                              {item.variant_name}
                            </p>
                          )}

                          {product?.description && (
                            <p className="text-xs sm:text-sm text-[#999999] mb-2 line-clamp-2 hidden sm:block">
                              {product.description}
                            </p>
                          )}

                          <div className="flex items-center justify-between">
                            <p className="text-xs sm:text-sm text-[#777777]">
                              Количество: {item.quantity}
                            </p>
                            <div className="text-right">
                              {hasRegularPrice && (
                                <p className="text-xs sm:text-sm text-[#777777] line-through mb-1">
                                  {formatPrice(item.regular_price!)}
                                </p>
                              )}
                              <p className="text-sm sm:text-base font-bold text-[#00BFA6]">
                                {formatPrice(item.total_amount)}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Payment Method */}
                <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-[#E0E0E0]">
                  <div className="flex items-center justify-between">
                    {/* Left side */}
                    <div className="flex items-center gap-3">
                      <CreditCard size={18} className="text-[#00BFA6] sm:w-5 sm:h-5" />
                      <h3 className="text-sm sm:text-base font-semibold text-[#1F1F1F]">
                        Начин на плащане
                      </h3>
                    </div>

                    {/* Right side */}
                    <p className="text-sm sm:text-base text-[#777777]">
                      Наложен платеж
                    </p>
                  </div>
                </div>

                {/* Order Totals */}
                <div className="flex justify-between items-center pt-4 sm:pt-6 mt-4 sm:mt-6 border-t border-[#E0E0E0]">
                  <span className="text-base sm:text-lg font-bold text-[#1F1F1F]">Обща сума</span>
                  <span className="text-xl sm:text-2xl font-bold text-[#00BFA6]">
                    {formatPrice(order.total_amount)}
                  </span>
                </div>

              </Card>
            </div>

            {/* Shipping Address */}
            <div className="lg:col-span-1">
              <Card className="p-4 sm:p-6">
                <div className="flex items-center gap-3 mb-4">
                  <MapPin size={18} className="text-[#00BFA6] sm:w-5 sm:h-5" />
                  <h2 className="text-lg sm:text-xl font-bold text-[#1F1F1F]">Адрес за доставка</h2>
                </div>

                {order.shippingAddress ? (
                  <div className="text-[#555555] space-y-1 text-sm sm:text-base">
                    <p className="font-medium text-[#1F1F1F]">
                      {order.shippingAddress.address_line1}
                    </p>
                    {order.shippingAddress.address_line2 && (
                      <p>{order.shippingAddress.address_line2}</p>
                    )}
                    <p>
                      {order.shippingAddress.city}, {order.shippingAddress.state}{' '}
                      {order.shippingAddress.postal_code}
                    </p>
                    <p>{order.shippingAddress.country}</p>
                    {order.shippingAddress.phone && (
                      <p className="mt-3 pt-3 border-t border-[#E0E0E0]">
                        <span className="text-[#777777] text-xs sm:text-sm">Телефон: </span>
                        <span className="font-medium">{order.shippingAddress.phone}</span>
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="text-sm sm:text-base text-[#777777]">Няма наличен адрес за доставка</p>
                )}
              </Card>
            </div>
          </div>
        </div>
      </div>
    </ProtectedPage>
  );
}
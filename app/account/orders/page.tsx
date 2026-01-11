'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Package, Search, ChevronRight } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Pagination } from '@/components/common/Pagination';
import { apiClient } from '@/lib/api';
import { formatPrice, formatDate } from '@/lib/utils';
import { getStatusLabel, getStatusColor } from '@/lib/orderUtils';
import { PaginationMeta } from '@/types/common';
import { Order } from '@/types/order';
import { ProtectedPage } from '@/components/auth/ProtectedPage';

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [pagination, setPagination] = useState<PaginationMeta>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  useEffect(() => {
  fetchOrders();
}, [statusFilter, pagination.page]);

  const fetchOrders = useCallback(async () => {
  try {
    setLoading(true);

    const params = new URLSearchParams();
    params.append('page', pagination.page.toString());
    params.append('limit', '10');

    if (statusFilter !== 'all') {
      params.append('status', statusFilter);
    }

    const response = await apiClient.get<Order[]>(`/orders?${params.toString()}`);

    if (response.data && response.pagination) {
      setOrders(response.data);
      setPagination(prev => ({
        ...prev,
        total: response.pagination!.total,
        totalPages: response.pagination!.totalPages,
      }));
    }
  } finally {
    setLoading(false);
  }
}, [statusFilter, pagination.page]);



  const displayedOrders = searchQuery
    ? orders.filter((order) =>
        order.order_number.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : orders;

  return (
    <ProtectedPage loadingText="Зареждане на поръчките...">
      <div className="min-h-screen bg-[#F5F5F5]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6 sm:mb-8"
          >
            <div className="flex items-center gap-2 text-xs sm:text-sm text-[#777777] mb-4">
              <Link href="/account" className="hover:text-[#00BFA6]">
                Акаунт
              </Link>
              <ChevronRight size={14} className="sm:w-4 sm:h-4" />
              <span className="text-[#1F1F1F] font-medium">Поръчки</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-[#1F1F1F] mb-2">Моите поръчки</h1>
            <p className="text-sm sm:text-base text-[#777777]">
              Преглед и проследяване на всички ваши поръчки
            </p>
          </motion.div>

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-4 sm:mb-6"
          >
            <Card className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center">
                {/* Search */}
                <div className="flex-1 w-full">
                  <Input
                    type="text"
                    placeholder="Търсене по номер на поръчка..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    icon={<Search size={16} className="sm:w-[18px] sm:h-[18px]" />}
                  />
                </div>

                {/* Status Filter */}
                <div className="w-full sm:w-64">
                  <Select
                    value={statusFilter}
                    onChange={(e) => {
                      setStatusFilter(e.target.value);
                      setPagination({ ...pagination, page: 1 });
                    }}
                    options={[
                      { value: 'all', label: 'Всички поръчки' },
                      { value: 'processing', label: 'Обработва се' },
                      { value: 'sent', label: 'Изпратена' },
                      { value: 'cancelled', label: 'Отказана' }
                    ]}
                  />
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Orders List */}
          {displayedOrders.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="p-8 sm:p-12 text-center flex flex-col items-center">
                <Package size={40} className="sm:w-12 sm:h-12 mx-auto text-[#777777] mb-4" />
                <h3 className="text-lg sm:text-xl font-bold text-[#1F1F1F] mb-2">
                  Няма намерени поръчки
                </h3>
                <p className="text-sm sm:text-base text-[#777777] mb-4 sm:mb-6">
                  {searchQuery || statusFilter !== 'all'
                    ? 'Опитайте да коригирате филтрите си'
                    : "Все още не сте направили поръчки"}
                </p>
                <Link href="/products">
                  <Button className="text-sm sm:text-base">Започнете пазаруване</Button>
                </Link>
              </Card>
            </motion.div>
          ) : (
            <div className="space-y-3 sm:space-y-4">
              {displayedOrders.map((order, index) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <Link href={`/account/orders/${order.order_number}`}>
                    <Card className="p-4 sm:p-6 hover:shadow-lg transition-all cursor-pointer hover:border-[#00BFA6] border-2 border-transparent">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-3 sm:mb-4">
                        <div className="min-w-0">
                          <h3 className="font-bold text-[#1F1F1F] text-base sm:text-lg mb-1 truncate">
                            Поръчка #{order.order_number}
                          </h3>
                          <p className="text-xs sm:text-sm text-[#777777]">
                            Направена на {formatDate(order.created_at || '')}
                          </p>
                        </div>

                        <div className="flex items-center gap-2 sm:gap-3 self-start sm:self-auto">
                          <span
                            className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold border-2 whitespace-nowrap ${getStatusColor(
                              order.status
                            )}`}
                          >
                            {getStatusLabel(order.status)}
                          </span>
                          <ChevronRight
                            size={18}
                            className="text-[#777777] hidden sm:block sm:w-5 sm:h-5"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 pt-3 sm:pt-4 border-t border-[#F5F5F5]">
                        <div>
                          <p className="text-[10px] sm:text-xs text-[#777777] mb-1">Обща сума</p>
                          <p className="font-bold text-[#00BFA6] text-sm sm:text-base lg:text-lg">
                            {formatPrice(order.total_amount)}
                          </p>
                        </div>

                        <div>
                          <p className="text-[10px] sm:text-xs text-[#777777] mb-1">Начин на плащане</p>
                          <p className="font-medium text-[#1F1F1F] text-xs sm:text-sm">
                            Наложен платеж
                          </p>
                        </div>

                        <div className="col-span-2 sm:col-span-1">
                          <p className="text-[10px] sm:text-xs text-[#777777] mb-1">Артикули</p>
                          <p className="font-medium text-[#1F1F1F] text-xs sm:text-sm">
                            {order.items?.length || 0} {order.items?.length === 1 ? 'артикул' : 'артикула'}
                          </p>
                        </div>
                      </div>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}

          {/* Pagination - only show if we have multiple pages AND no search filter */}
          {!searchQuery && pagination.totalPages > 1 && (
            <div className="mt-6 sm:mt-8">
              <Pagination
                currentPage={pagination.page}
                totalPages={pagination.totalPages}
                onPageChange={(page) => setPagination({ ...pagination, page })}
              />
            </div>
          )}
        </div>
      </div>
    </ProtectedPage>  
  );
}
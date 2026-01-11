'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Package,
  MapPin,
  Settings,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ProtectedPage } from '@/components/auth/ProtectedPage';
import { useAuthStore } from '@/store/authStore';
import { apiClient } from '@/lib/api';
import { formatPrice, formatDate } from '@/lib/utils';
import { getStatusLabel, getStatusColor } from '@/lib/orderUtils';
import { Order } from '@/types/order';

export default function AccountDashboard() {
  const user = useAuthStore((state) => state.user);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch dashboard data
  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const ordersResponse = await apiClient.get<Order[]>('/users/orders?limit=3');
      if (ordersResponse.data) {
        setRecentOrders(ordersResponse.data);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    {
      icon: Package,
      label: 'Моите поръчки',
      href: '/account/orders',
      color: '#00BFA6',
    },
    {
      icon: MapPin,
      label: 'Адреси',
      href: '/account/addresses',
      color: '#00BFA6',
    },
  ];

  return (
    <ProtectedPage loadingText="Зареждане на профила...">
      <div className="min-h-screen bg-[#F5F5F5]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {/* Welcome Section */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6 sm:mb-8"
          >
            <h1 className="text-2xl sm:text-3xl font-bold text-[#1F1F1F] mb-2">
              Добре дошли отново, {user?.first_name}!
            </h1>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="lg:col-span-1"
            >
              <Card className="p-4 sm:p-6">
                <h2 className="text-lg sm:text-xl font-bold text-[#1F1F1F] mb-4 sm:mb-6">
                  Бързи действия
                </h2>

                <div className="space-y-2 sm:space-y-3">
                  {quickActions.map((action) => (
                    <motion.div
                      key={action.label}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Link href={action.href}>
                        <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-[#F5F5F5] rounded-lg hover:bg-[#00BFA6]/10 transition-colors cursor-pointer">
                          <div
                            className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                            style={{ backgroundColor: `${action.color}15` }}
                          >
                            <action.icon 
                              size={18} 
                              style={{ color: action.color }} 
                              className="sm:w-5 sm:h-5" 
                            />
                          </div>
                          <span className="text-sm sm:text-base font-medium text-[#1F1F1F]">
                            {action.label}
                          </span>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>

                <Link href="/account/settings" className="block mt-4 sm:mt-6">
                  <Button variant="outline" size="lg" className="w-full text-sm sm:text-base">
                    <Settings size={18} className="sm:w-5 sm:h-5" />
                    Настройки на акаунта
                  </Button>
                </Link>
              </Card>
            </motion.div>

            {/* Recent Orders */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="lg:col-span-2"
            >
              <Card className="p-4 sm:p-6">
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                  <h2 className="text-lg sm:text-xl font-bold text-[#1F1F1F]">
                    Последни поръчки
                  </h2>
                  <Link href="/account/orders">
                    <Button variant="ghost" size="sm" className="text-xs sm:text-sm">
                      Виж всички
                    </Button>
                  </Link>
                </div>

                {loading ? (
                  <div className="text-center py-8 sm:py-12">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#00BFA6]" />
                  </div>
                ) : recentOrders.length === 0 ? (
                  <div className="text-center py-8 sm:py-12 flex flex-col items-center">
                    <Package size={40} className="sm:w-12 sm:h-12 mx-auto text-[#777777] mb-4" />
                    <p className="text-sm sm:text-base text-[#777777] mb-4 sm:mb-6">
                      Все още няма поръчки
                    </p>
                    <Link href="/products">
                      <Button className="text-sm sm:text-base">Започнете пазаруване</Button>
                    </Link>
                  </div>
                ) : (
                  <div className="flex flex-col space-y-3 sm:space-y-4">
                    {recentOrders.map((order) => (
                      <Link key={order.id} href={`/account/orders/${order.order_number}`}>
                        <motion.div
                          whileHover={{ scale: 1.01 }}
                          className="p-3 sm:p-4 border-2 border-[#F5F5F5] rounded-lg hover:border-[#00BFA6] transition-all cursor-pointer"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2 sm:mb-3 gap-2">
                            <div className="min-w-0">
                              <p className="text-sm sm:text-base font-semibold text-[#1F1F1F] truncate">
                                Поръчка #{order.order_number}
                              </p>
                              <p className="text-xs sm:text-sm text-[#777777]">
                                {formatDate(order.created_at || '')}
                              </p>
                            </div>
                            <div className="self-start sm:self-auto">
                              <span
                                className={`inline-block px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs font-semibold border-2 whitespace-nowrap ${getStatusColor(
                                  order.status
                                )}`}
                              >
                                {getStatusLabel(order.status)}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-end justify-between gap-2 text-xs sm:text-sm text-[#777777]">
                            <span>
                              {order.items.length} {order.items.length === 1 ? 'артикул' : 'артикула'}
                            </span>
                            <p className="text-sm sm:text-base font-bold text-[#00BFA6]">
                              {formatPrice(order.total_amount)}
                            </p>
                          </div>
                        </motion.div>
                      </Link>
                    ))}
                  </div>
                )}
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </ProtectedPage>
  );
}
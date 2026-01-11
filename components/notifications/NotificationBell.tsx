'use client';

import { useState, useEffect } from 'react';
import { Bell, Check, Trash2, ExternalLink, AlertCircle, CheckCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNotifications } from '@/hooks/useNotifications';
import { useRouter } from 'next/navigation';
import { formatNotificationDate, getFullNotificationDate } from '@/lib/notificationUtils';
import { getNotificationPriorityConfig } from '@/types/notification';
import type { Notification } from '@/types/notification';
import Image from 'next/image';

export default function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const { notifications, unreadCount, markAsRead, markAllAsRead, deleteNotification } =
    useNotifications();
  const router = useRouter();

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleNotificationClick = async (notification: Notification) => {
    if (!notification.is_read) {
      await markAsRead(notification.id);
    }

    const targetUrl = notification.action_url || notification.link;
    if (targetUrl) {
      setIsOpen(false);
      
      if (targetUrl.startsWith('http://') || targetUrl.startsWith('https://')) {
        window.open(targetUrl, '_blank', 'noopener,noreferrer');
      } else {
        router.push(targetUrl);
      }
    }
  };

  const handleMarkAsRead = async (e: React.MouseEvent, notificationId: number) => {
    e.stopPropagation();
    await markAsRead(notificationId);
  };

  const handleDelete = async (e: React.MouseEvent, notificationId: number) => {
    e.stopPropagation();
    await deleteNotification(notificationId);
  };

  const getNotificationIcon = (type: string) => {
    const icons: Record<string, string> = {
      order_update: '📦',
      back_in_stock: '✨',
      price_drop: '💰',
      cart_abandonment: '🛒',
      marketing: '📢',
      system: '⚙️',
    };
    return icons[type] || '🔔';
  };

  const allNotifications = Array.isArray(notifications) ? notifications : [];
  const filteredNotifications = filter === 'unread' 
    ? allNotifications.filter(n => !n.is_read)
    : allNotifications;

  const sortedNotifications = filteredNotifications.sort((a, b) => {
    const priorityOrder = { urgent: 0, high: 1, normal: 2, low: 3 };
    const aPriority = priorityOrder[a.priority] ?? 2;
    const bPriority = priorityOrder[b.priority] ?? 2;
    
    if (aPriority !== bPriority) {
      return aPriority - bPriority;
    }
    
    if (a.is_read !== b.is_read) {
      return a.is_read ? 1 : -1;
    }
    
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  const hasUrgent = allNotifications.some(n => !n.is_read && n.priority === 'urgent');

  return (
    <>
      {/* Bell Icon */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`relative p-2 hover:bg-[#F5F5F5] rounded-lg transition-colors ${
          hasUrgent ? 'animate-pulse' : ''
        }`}
        aria-label="Notifications"
      >
        <Bell size={20} className={hasUrgent ? 'text-[#FF4C4C]' : 'text-[#333333]'} />
        {unreadCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className={`absolute -top-1 -right-1 ${
              hasUrgent ? 'bg-[#FF4C4C]' : 'bg-[#00BFA6]'
            } text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center`}
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </motion.span>
        )}
      </motion.button>

      {/* Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 z-[999]"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed top-0 right-0 h-full w-full sm:w-[480px] bg-white shadow-2xl z-[1000] flex flex-col"
          >
            {/* Header */}
            <div className="bg-[#00BFA6] p-6 flex-shrink-0">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-white font-bold text-lg">Известия</h2>
                  {unreadCount > 0 && (
                    <p className="text-white/80 text-sm">{unreadCount} непрочетени</p>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      markAllAsRead();
                    }}
                    className="text-white/90 hover:text-white text-sm flex items-center gap-1 px-3 py-1.5 rounded-lg hover:bg-white/10 transition-colors"
                  >
                    <Check size={16} />
                    <span className="hidden sm:inline">Маркирай всички</span>
                  </button>
                )}
              </div>

              {/* Filter Tabs */}
              <div className="flex gap-2">
                <button
                  onClick={() => setFilter('all')}
                  className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                    filter === 'all'
                      ? 'bg-white text-[#00BFA6]'
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  Всички ({allNotifications.length})
                </button>
                <button
                  onClick={() => setFilter('unread')}
                  className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                    filter === 'unread'
                      ? 'bg-white text-[#00BFA6]'
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  Непрочетени ({unreadCount})
                </button>
              </div>
            </div>

            {/* Notifications List */}
            <div className="flex-1 overflow-y-auto">
              {sortedNotifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                  <Bell size={64} className="text-[#E0E0E0] mb-4" />
                  <p className="text-[#777777] text-lg mb-2">
                    {filter === 'unread' ? 'Няма непрочетени известия' : 'Няма известия'}
                  </p>
                  <p className="text-[#999999] text-sm">
                    Тук ще виждате актуализации за поръчки и оферти
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-[#F5F5F5]">
                  {sortedNotifications.map((notification) => {
                    const priorityConfig = getNotificationPriorityConfig(notification.priority);
                    const hasAction = notification.action_label && (notification.action_url || notification.link);

                    return (
                      <div
                        key={notification.id}
                        className={`p-4 hover:bg-[#F5F5F5] transition-colors relative group ${
                          !notification.is_read ? 'bg-[#00BFA6]/5' : ''
                        }`}
                      >
                        {/* Priority Indicator */}
                        {(notification.priority === 'high' || notification.priority === 'urgent') && (
                          <div 
                            className="absolute left-0 top-0 bottom-0 w-1"
                            style={{ backgroundColor: priorityConfig.color }}
                          />
                        )}

                        <div className="flex items-start gap-3 ml-2">
                          {/* Icon or Image - Larger */}
                          {notification.image_url ? (
                            <Image
                              src={notification.image_url}
                              alt=""
                              className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                            />
                          ) : (
                            <span className="text-4xl flex-shrink-0 w-16 h-16 flex items-center justify-center">
                              {getNotificationIcon(notification.type)}
                            </span>
                          )}

                          <div className="flex-1 min-w-0">
                            {/* Title with Priority Badge */}
                            <div className="flex items-start gap-2 mb-1">
                              <p className="font-semibold text-[#1F1F1F] text-sm flex-1">
                                {notification.title}
                              </p>
                              {notification.priority === 'urgent' && (
                                <AlertCircle size={16} className="text-[#FF4C4C] flex-shrink-0" />
                              )}
                            </div>

                            {/* Message */}
                            <p className="text-[#777777] text-sm mb-3 line-clamp-2">
                              {notification.message}
                            </p>

                            {/* Action Button and Timestamp Row */}
                            <div className="flex items-center justify-between gap-2">
                              {hasAction ? (
                                <button
                                  className="inline-flex items-center gap-1 text-[#00BFA6] hover:text-[#00897B] text-sm font-medium transition-colors"
                                  onClick={() => handleNotificationClick(notification)}
                                >
                                  {notification.action_label}
                                  <ExternalLink size={14} />
                                </button>
                              ) : (
                                <div />
                              )}
                              
                              <p 
                                className="text-[#999999] text-xs whitespace-nowrap"
                                title={getFullNotificationDate(notification.created_at)}
                              >
                                {formatNotificationDate(notification.created_at)}
                              </p>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            {!notification.is_read && (
                              <button
                                onClick={(e) => handleMarkAsRead(e, notification.id)}
                                className="p-2 hover:bg-[#00BFA6]/10 rounded-lg flex-shrink-0"
                                aria-label="Mark as read"
                                title="Маркирай като прочетено"
                              >
                                <CheckCheck size={16} className="text-[#00BFA6]" />
                              </button>
                            )}
                            <button
                              onClick={(e) => handleDelete(e, notification.id)}
                              className="p-2 hover:bg-[#FF4C4C]/10 rounded-lg flex-shrink-0"
                              aria-label="Delete notification"
                              title="Изтрий"
                            >
                              <Trash2 size={16} className="text-[#FF4C4C]" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
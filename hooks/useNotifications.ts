import { useEffect, useRef } from 'react';
import { useNotificationStore } from '@/store/notificationStore';
import { useAuth } from './useAuth';

export const useNotifications = () => {
  const { isAuthenticated } = useAuth();
  const hasLoadedRef = useRef(false);

  const {
    notifications,
    unreadCount,
    isLoading,
    fetchNotifications,
    fetchUnreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  } = useNotificationStore();

  // Load notifications on mount for authenticated users
  useEffect(() => {
    if (isAuthenticated && !hasLoadedRef.current) {
      hasLoadedRef.current = true;
      
      const loadData = async () => {
        await fetchUnreadCount();
        await fetchNotifications();
      };
      
      loadData();

      // Poll for new notifications every 60 seconds
      const interval = setInterval(() => {
        fetchUnreadCount();
        fetchNotifications();
      }, 60000);

      return () => clearInterval(interval);
    }
  }, [isAuthenticated, fetchNotifications, fetchUnreadCount]);

  return {
    notifications,
    unreadCount,
    isLoading,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    refetch: fetchNotifications,
  };
};
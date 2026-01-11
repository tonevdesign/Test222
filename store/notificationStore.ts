import { create } from 'zustand';
import { apiClient } from '@/lib/api';
import { Notification, NotificationPreferences, NotificationCounts } from '@/types/notification';

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  counts: NotificationCounts | null;
  preferences: NotificationPreferences;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchNotifications: (params?: { 
    page?: number; 
    limit?: number; 
    unread_only?: boolean;
    priority?: string;
    category?: string;
    type?: string;
  }) => Promise<void>;
  fetchUnreadCount: () => Promise<void>;
  fetchCounts: () => Promise<void>;
  fetchPreferences: () => Promise<void>;
  markAsRead: (id: number) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (id: number) => Promise<void>;
  deleteReadNotifications: () => Promise<void>;
  updatePreferences: (prefs: NotificationPreferences) => Promise<void>;
  clearError: () => void;
}

interface NotificationListResponse {
  notifications: Notification[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [],
  unreadCount: 0,
  counts: null,
  preferences: {},
  isLoading: false,
  error: null,

  clearError: () => set({ error: null }),

  fetchNotifications: async (params = {}) => {
    set({ isLoading: true, error: null });
    try {
      // Build query string from params
      const queryParams = new URLSearchParams();
      if (params.page) queryParams.append('page', String(params.page));
      if (params.limit) queryParams.append('limit', String(params.limit));
      if (params.unread_only !== undefined) queryParams.append('unread_only', String(params.unread_only));
      if (params.priority) queryParams.append('priority', params.priority);
      if (params.category) queryParams.append('category', params.category);
      if (params.type) queryParams.append('type', params.type);
      
      const queryString = queryParams.toString();
      const endpoint = queryString ? `/notifications?${queryString}` : '/notifications';
      
      const response = await apiClient.get<NotificationListResponse>(endpoint);
      
      // Backend returns: { data: { notifications: [], pagination: {} } }
      if (response.data?.notifications && Array.isArray(response.data.notifications)) {
        set({ notifications: response.data.notifications });
      } else if (Array.isArray(response.data)) {
        // Fallback if data is directly an array
        set({ notifications: response.data });
      } else {
        set({ notifications: [] });
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch notifications';
      console.error('Failed to fetch notifications:', error);
      set({ 
        notifications: [], 
        error: message
      });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchUnreadCount: async () => {
    try {
      const response = await apiClient.get<{ count: number }>('/notifications/unread-count');
      if (response.data) {
        set({ unreadCount: response.data.count });
      }
    } catch (error) {
      console.error('Failed to fetch unread count:', error);
      set({ unreadCount: 0 });
    }
  },

  fetchCounts: async () => {
    try {
      const response = await apiClient.get<NotificationCounts>('/notifications/counts');
      if (response.data) {
        set({ counts: response.data, unreadCount: response.data.total });
      }
    } catch (error) {
      console.error('Failed to fetch notification counts:', error);
      set({ counts: null });
    }
  },

  fetchPreferences: async () => {
    try {
      const response = await apiClient.get<NotificationPreferences>('/notifications/preferences');
      if (response.data) {
        set({ preferences: response.data });
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch preferences';
      console.error('Failed to fetch preferences:', error);
      set({ error: message });
    }
  },

  markAsRead: async (id: number) => {
    try {
      await apiClient.patch(`/notifications/${id}/read`);
      
      set((state) => {
        const notification = state.notifications.find(n => n.id === id);
        const wasUnread = notification && !notification.is_read;
        
        return {
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, is_read: true, read_at: new Date().toISOString() } : n
          ),
          unreadCount: wasUnread ? Math.max(0, state.unreadCount - 1) : state.unreadCount,
          counts: wasUnread && state.counts ? {
            ...state.counts,
            total: Math.max(0, state.counts.total - 1),
            [notification?.priority || 'normal']: Math.max(0, (state.counts[notification?.priority as keyof NotificationCounts] as number) - 1)
          } : state.counts
        };
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to mark notification as read';
      console.error('Failed to mark as read:', error);
      set({ error: message });
    }
  },

  markAllAsRead: async () => {
    try {
      await apiClient.patch('/notifications/read-all');
      
      set((state) => ({
        notifications: state.notifications.map((n) => ({
          ...n,
          is_read: true,
          read_at: new Date().toISOString(),
        })),
        unreadCount: 0,
        counts: state.counts ? {
          ...state.counts,
          total: 0,
          urgent: 0,
          high: 0,
          normal: 0,
          low: 0
        } : null
      }));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to mark all as read';
      console.error('Failed to mark all as read:', error);
      set({ error: message });
    }
  },

  deleteNotification: async (id: number) => {
    try {
      await apiClient.delete(`/notifications/${id}`);
      
      set((state) => {
        const notification = state.notifications.find(n => n.id === id);
        const wasUnread = notification && !notification.is_read;
        
        return {
          notifications: state.notifications.filter((n) => n.id !== id),
          unreadCount: wasUnread ? Math.max(0, state.unreadCount - 1) : state.unreadCount,
          counts: wasUnread && state.counts ? {
            ...state.counts,
            total: Math.max(0, state.counts.total - 1),
            [notification?.priority || 'normal']: Math.max(0, (state.counts[notification?.priority as keyof NotificationCounts] as number) - 1)
          } : state.counts
        };
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to delete notification';
      console.error('Failed to delete notification:', error);
      set({ error: message });
    }
  },

  deleteReadNotifications: async () => {
    try {
      const response = await apiClient.delete<{ deletedCount: number }>('/notifications/read');
      
      set((state) => ({
        notifications: state.notifications.filter((n) => !n.is_read),
      }));
      
      if (response.data?.deletedCount) {
        // Handle success if needed
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to delete read notifications';
      console.error('Failed to delete read notifications:', error);
      set({ error: message });
    }
  },

  updatePreferences: async (prefs: NotificationPreferences) => {
    try {
      await apiClient.put('/notifications/preferences', { preferences: prefs });
      set({ preferences: prefs });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update preferences';
      console.error('Failed to update preferences:', error);
      set({ error: message });
      throw error;
    }
  },
}));
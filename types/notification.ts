export type NotificationType = 
  | 'order_update'
  | 'back_in_stock'
  | 'price_drop'
  | 'cart_abandonment'
  | 'marketing'
  | 'system';

export type NotificationPriority = 'low' | 'normal' | 'high' | 'urgent';

export interface Notification {
  id: number;
  user_id: number;
  type: NotificationType;
  title: string;
  message: string;
  link: string | null;
  image_url: string | null;
  action_label: string | null;
  action_url: string | null;
  priority: NotificationPriority;
  category: string | null;
  metadata: Record<string, unknown> | null;
  is_read: boolean;
  read_at: string | null;
  expires_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface NotificationPreferences {
  [type: string]: {
    [channel: string]: boolean;
  };
}

export interface NotificationCounts {
  total: number;
  urgent: number;
  high: number;
  normal: number;
  low: number;
}

export const NOTIFICATION_TYPES = [
  { value: 'order_update', label: 'Актуализация на поръчка', icon: '📦' },
  { value: 'back_in_stock', label: 'Продукт на склад', icon: '✨' },
  { value: 'price_drop', label: 'Намаление на цена', icon: '💰' },
  { value: 'cart_abandonment', label: 'Напомняне за количка', icon: '🛒' },
  { value: 'marketing', label: 'Маркетинг', icon: '📢' },
  { value: 'system', label: 'Системно', icon: '⚙️' },
] as const;

export const NOTIFICATION_PRIORITIES = [
  { value: 'low', label: 'Нисък', color: '#999999', bgColor: '#F5F5F5' },
  { value: 'normal', label: 'Нормален', color: '#00BFA6', bgColor: '#E0F7F4' },
  { value: 'high', label: 'Висок', color: '#FF9800', bgColor: '#FFF3E0' },
  { value: 'urgent', label: 'Спешен', color: '#FF4C4C', bgColor: '#FFEBEE' },
] as const;

export const getNotificationPriorityConfig = (priority: NotificationPriority) => {
  return NOTIFICATION_PRIORITIES.find(p => p.value === priority) || NOTIFICATION_PRIORITIES[1];
};

export const getNotificationTypeConfig = (type: NotificationType) => {
  return NOTIFICATION_TYPES.find(t => t.value === type);
};
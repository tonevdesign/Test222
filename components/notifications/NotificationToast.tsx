'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useNotifications } from '@/hooks/useNotifications';
import { useRouter } from 'next/navigation';
import { Notification } from '@/types/notification';

export default function NotificationToast() {
  const { notifications, markAsRead } = useNotifications();
  const router = useRouter();
  const [shownNotificationIds, setShownNotificationIds] = useState<Set<number>>(new Set());
  const [currentNotification, setCurrentNotification] = useState<Notification | null>(null);

  useEffect(() => {
    const latestUnread = notifications.find(
      (n) => !n.is_read && !shownNotificationIds.has(n.id)
    );

    if (latestUnread) {
      setCurrentNotification(latestUnread);
      setShownNotificationIds((prev) => new Set([...prev, latestUnread.id]));

      // Auto-hide after 8 seconds
      const timer = setTimeout(() => {
        setCurrentNotification(null);
      }, 8000);

      return () => clearTimeout(timer);
    }
  }, [notifications, shownNotificationIds]);

  const handleClose = () => {
    setCurrentNotification(null);
  };

  const handleClick = async () => {
    if (currentNotification) {
      await markAsRead(currentNotification.id);
      if (currentNotification.link) {
        router.push(currentNotification.link);
      }
      setCurrentNotification(null);
    }
  };

  if (!currentNotification) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, x: 400 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 400 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="fixed top-20 right-4 z-[100] w-80 sm:w-96 bg-white rounded-xl shadow-2xl border border-[#E0E0E0] overflow-hidden cursor-pointer"
        onClick={handleClick}
      >
        <div className="p-4 flex items-start gap-3">
          <div className="w-2 h-2 bg-[#00BFA6] rounded-full flex-shrink-0 mt-2"></div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-[#1F1F1F] text-sm mb-1">
              {currentNotification.title}
            </p>
            <p className="text-[#777777] text-xs line-clamp-2">{currentNotification.message}</p>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleClose();
            }}
            className="p-1 hover:bg-[#F5F5F5] rounded transition-colors flex-shrink-0"
          >
            <X size={16} className="text-[#777777]" />
          </button>
        </div>
        <div className="h-1 bg-gradient-to-r from-[#00BFA6] to-[#00FFD1]"></div>
      </motion.div>
    </AnimatePresence>
  );
}

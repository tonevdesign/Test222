import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import clsx from 'clsx';

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  closeButton?: boolean;
}

export function Dialog({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  closeButton = true,
}: DialogProps) {
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const sizes = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40"
          />

          {/* Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50"
          >
            <div
              className={clsx(
                'bg-white rounded-lg shadow-2xl max-h-[90vh] overflow-y-auto w-full mx-4',
                sizes[size]
              )}
            >
              {/* Header */}
              {(title || closeButton) && (
                <div className="flex items-center justify-between p-6 border-b border-[#F5F5F5]">
                  {title && (
                    <h2 className="text-xl font-bold text-[#1F1F1F]">{title}</h2>
                  )}
                  {closeButton && (
                    <button
                      onClick={onClose}
                      className="p-2 hover:bg-[#F5F5F5] rounded-lg transition-colors ml-auto"
                      aria-label="Close dialog"
                    >
                      <X size={20} className="text-[#777777]" />
                    </button>
                  )}
                </div>
              )}

              {/* Content */}
              <div className="p-6">{children}</div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
import { AlertCircle, X } from 'lucide-react';
import { useState } from 'react';

interface ErrorMessageProps {
  message: string;
  title?: string;
  dismissible?: boolean;
  onDismiss?: () => void;
}

export function ErrorMessage({
  message,
  title = 'Error',
  dismissible = true,
  onDismiss,
}: ErrorMessageProps) {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  const handleDismiss = () => {
    setIsVisible(false);
    onDismiss?.();
  };

  return (
    <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
      <div className="flex items-start gap-3">
        <AlertCircle size={20} className="text-red-500 flex-shrink-0 mt-0.5" />

        <div className="flex-1">
          <h3 className="font-semibold text-red-800">{title}</h3>
          <p className="text-red-700 text-sm mt-1">{message}</p>
        </div>

        {dismissible && (
          <button
            onClick={handleDismiss}
            className="p-1 hover:bg-red-100 rounded transition-colors flex-shrink-0"
            aria-label="Dismiss error"
          >
            <X size={18} className="text-red-500" />
          </button>
        )}
      </div>
    </div>
  );
}
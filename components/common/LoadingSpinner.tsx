import { motion } from 'framer-motion';
import clsx from 'clsx';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  fullScreen?: boolean;
  text?: string;
}

export function LoadingSpinner({
  size = 'md',
  fullScreen = false,
  text,
}: LoadingSpinnerProps) {
  const sizes = {
    sm: 'h-5 w-5 sm:h-6 sm:w-6',
    md: 'h-10 w-10 sm:h-12 sm:w-12',
    lg: 'h-14 w-14 sm:h-16 sm:w-16',
  };

  const borderSizes = {
    sm: 'border-2 sm:border-3',
    md: 'border-3 sm:border-4',
    lg: 'border-4 sm:border-[5px]',
  };

  const spinner = (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      className={clsx(
        'rounded-full',
        'border-[#F5F5F5] border-t-[#00BFA6]',
        sizes[size],
        borderSizes[size]
      )}
    />
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm z-50 px-4">
        {spinner}
        {text && (
          <p className="mt-3 sm:mt-4 text-[#777777] font-medium text-sm sm:text-base text-center max-w-xs sm:max-w-sm">
            {text}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-6 sm:py-8 px-4">
      {spinner}
      {text && (
        <p className="mt-3 sm:mt-4 text-[#777777] font-medium text-sm sm:text-base text-center max-w-xs sm:max-w-sm">
          {text}
        </p>
      )}
    </div>
  );
}
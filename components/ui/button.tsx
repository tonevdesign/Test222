'use client'

import React from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import clsx from 'clsx';

interface ButtonProps extends HTMLMotionProps<'button'> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  children: React.ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled,
  children,
  className,
  ...props
}: ButtonProps) {
  const baseStyles =
    'font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2';

  const variants = {
    primary: 'bg-[#00BFA6] text-white hover:bg-[#00a08c] disabled:bg-[#A8FFF5]',
    secondary: 'bg-[#F5F5F5] text-[#1F1F1F] hover:bg-[#E0E0E0] disabled:bg-[#F5F5F5]',
    outline: 'border-2 border-[#00BFA6] text-[#00BFA6] hover:bg-[#F5F5F5] disabled:border-[#A8FFF5]',
    ghost: 'text-[#00BFA6] hover:bg-[#F5F5F5] disabled:text-[#A8FFF5]',
  };

  const sizes = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2.5 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      disabled={disabled || isLoading}
      className={clsx(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {isLoading ? (
        <>
          <span className="inline-block animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
          Зареждане...
        </>
      ) : (
        children
      )}
    </motion.button>
  );
}

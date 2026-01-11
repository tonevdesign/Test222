import React from 'react';
import clsx from 'clsx';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'dangerSolid';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export function Badge({
  variant = 'primary',
  size = 'md',
  children,
  className,
  ...props
}: BadgeProps) {
  const variants = {
    primary: 'bg-[#00BFA6] text-white',
    secondary: 'bg-[#F5F5F5] text-[#1F1F1F]',
    success: 'bg-[#00BFA6] text-white',
    danger: 'bg-red-100 text-red-800',
    dangerSolid: 'bg-[#FF4C4C] text-white',
    warning: 'bg-yellow-100 text-yellow-800',
    info: 'bg-blue-100 text-blue-800',
  };

  const sizes = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base',
  };

  return (
    <span
      className={clsx(
        'inline-flex items-center justify-center font-semibold rounded-full whitespace-nowrap',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
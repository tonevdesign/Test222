import React from 'react';
import clsx from 'clsx';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  hover?: boolean;
}

export function Card({ children, hover = false, className, ...props }: CardProps) {
  return (
    <div
      className={clsx(
        'bg-white rounded-lg border border-[#F5F5F5] overflow-hidden',
        hover && 'hover:shadow-lg hover:border-[#E0E0E0] transition-all duration-300',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
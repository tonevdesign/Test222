import React from 'react';
import { ChevronDown } from 'lucide-react';
import clsx from 'clsx';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: string;
  label?: string;
  options: { value: string; label: string }[];
}

export function Select({
  error,
  label,
  options,
  className,
  ...props
}: SelectProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-xs sm:text-sm font-semibold text-[#1F1F1F] mb-1.5 sm:mb-2">
          {label}
          {props.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <div className="relative">
        <select
          className={clsx(
            'w-full px-3 sm:px-4 py-2 sm:py-2.5 pr-9 sm:pr-10 border-2 border-[#E0E0E0] rounded-lg',
            'bg-white text-[#1F1F1F] text-sm sm:text-base',
            'focus:border-[#00BFA6] focus:outline-none',
            'disabled:bg-[#F5F5F5] disabled:cursor-not-allowed',
            'transition-all duration-200 appearance-none',
            error && 'border-red-500 focus:border-red-500',
            className
          )}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <ChevronDown
          size={18}
          className="absolute right-2.5 sm:right-3 top-1/2 -translate-y-1/2 text-[#777777] pointer-events-none"
        />
      </div>

      {error && (
        <p className="text-red-500 text-xs sm:text-sm mt-1.5 sm:mt-2 font-medium">{error}</p>
      )}
    </div>
  );
}
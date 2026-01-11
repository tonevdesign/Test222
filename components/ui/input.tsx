import React from 'react';
import clsx from 'clsx';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  label?: string;
  helperText?: string;
  icon?: React.ReactNode;
}

export function Input({
  error,
  label,
  helperText,
  icon,
  className,
  ...props
}: InputProps) {
  const [value, setValue] = React.useState(props.value?.toString() || '');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    props.onChange?.(e);
  };

  const showIcon = icon && value.length === 0;

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm sm:text-base font-semibold text-[#1F1F1F] mb-1.5 sm:mb-2">
          {label}
          {props.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <div className="relative">
        {showIcon && (
          <div className="absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 text-[#777777] pointer-events-none">
            <div className="scale-90 sm:scale-100">
              {icon}
            </div>
          </div>
        )}

        <input
          className={clsx(
            'w-full px-3 sm:px-4 py-2 sm:py-2.5 border-2 border-[#E0E0E0] rounded-lg',
            'bg-white text-[#1F1F1F] placeholder-[#777777]',
            'text-sm sm:text-base',
            'focus:border-[#00BFA6] focus:outline-none focus:shadow-lg focus:shadow-[#00BFA6]/10',
            'disabled:bg-[#F5F5F5] disabled:cursor-not-allowed disabled:opacity-50',
            'transition-all duration-200',
            error && 'border-red-500 focus:border-red-500',
            showIcon && 'pl-9 sm:pl-10 placeholder:pl-5 sm:placeholder:pl-6',
            !showIcon && 'pl-3 sm:pl-4',
            className
          )}
          {...props}
          value={value}
          onChange={handleChange}
        />
      </div>

      {error && (
        <p className="text-red-500 text-xs sm:text-sm mt-1.5 sm:mt-2 font-medium">{error}</p>
      )}

      {helperText && !error && (
        <p className="text-[#777777] text-xs sm:text-sm mt-1.5 sm:mt-2">{helperText}</p>
      )}
    </div>
  );
}
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import clsx from 'clsx';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={clsx('flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-2 sm:pb-0', className)}
    >
      <Link
        href="/"
        className="p-1 hover:bg-[#F5F5F5] rounded transition-colors flex-shrink-0"
        aria-label="Home"
      >
        <Home size={16} className="text-[#777777] sm:w-[18px] sm:h-[18px]" />
      </Link>

      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
          <ChevronRight size={14} className="text-[#777777] sm:w-4 sm:h-4" />

          {item.href ? (
            <Link
              href={item.href}
              className="text-[#00BFA6] hover:text-[#00a08c] transition-colors text-xs sm:text-sm font-medium whitespace-nowrap"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-[#333333] text-xs sm:text-sm font-medium whitespace-nowrap">
              {item.label}
            </span>
          )}
        </div>
      ))}
    </nav>
  );
}
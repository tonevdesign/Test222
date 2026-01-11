'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { Pagination as PaginationUI } from '@/components/common/Pagination';

interface PaginationWrapperProps {
  currentPage: number;
  totalPages: number;
}

export function PaginationWrapper({ currentPage, totalPages }: PaginationWrapperProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const onPageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', page.toString());

    router.push(`${pathname}?${params.toString()}`);

    // Scroll to top smoothly after page change
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <PaginationUI
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={onPageChange}
    />
  );
}
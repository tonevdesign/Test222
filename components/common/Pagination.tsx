import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import clsx from 'clsx';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  baseUrl?: string;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  // Generate page numbers to display
  const getPageNumbers = () => {
    const delta = totalPages <= 10 ? totalPages : 2;
    const pages = [];
    const range = [];
    const l = currentPage - delta;
    const r = currentPage + delta + 1;

    for (let i = l; i < r; i++) {
      if (i > 0 && i <= totalPages) {
        range.push(i);
      }
    }

    if (range[0] > 1) {
      pages.push(1);
      if (range[0] > 2) {
        pages.push('...');
      }
    }

    pages.push(...range);

    if (range[range.length - 1] < totalPages) {
      if (range[range.length - 1] < totalPages - 1) {
        pages.push('...');
      }
      pages.push(totalPages);
    }

    return pages;
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex items-center justify-center gap-1.5 sm:gap-2 py-6 sm:py-8 px-2">
      {/* Previous Button */}
      <motion.button
        whileHover={{ scale: currentPage === 1 ? 1 : 1.05 }}
        whileTap={{ scale: currentPage === 1 ? 1 : 0.95 }}
        onClick={handlePrevious}
        disabled={currentPage === 1}
        className={clsx(
          'p-1.5 sm:p-2 rounded-lg transition-all',
          currentPage === 1
            ? 'bg-[#F5F5F5] text-[#777777] cursor-not-allowed'
            : 'bg-[#F5F5F5] text-[#333333] hover:bg-[#00BFA6] hover:text-white'
        )}
        aria-label="Previous page"
      >
        <ChevronLeft size={18} className="sm:w-5 sm:h-5" />
      </motion.button>

      {/* Page Numbers */}
      {pageNumbers.map((page, index) => (
        <motion.div key={index}>
          {page === '...' ? (
            <span className="px-1 sm:px-2 text-[#777777] cursor-default select-none text-sm sm:text-base">
              ...
            </span>
          ) : (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => page !== currentPage && onPageChange(page as number)}
              className={clsx(
                'min-w-[32px] sm:min-w-[40px] h-8 sm:h-10 rounded-lg font-semibold transition-all text-sm sm:text-base',
                page === currentPage
                  ? 'bg-[#00BFA6] text-white cursor-default'
                  : 'bg-[#F5F5F5] text-[#333333] hover:bg-[#E0E0E0]'
              )}
              disabled={page === currentPage}
            >
              {page}
            </motion.button>
          )}
        </motion.div>
      ))}

      {/* Next Button */}
      <motion.button
        whileHover={{ scale: currentPage === totalPages ? 1 : 1.05 }}
        whileTap={{ scale: currentPage === totalPages ? 1 : 0.95 }}
        onClick={handleNext}
        disabled={currentPage === totalPages}
        className={clsx(
          'p-1.5 sm:p-2 rounded-lg transition-all',
          currentPage === totalPages
            ? 'bg-[#F5F5F5] text-[#777777] cursor-not-allowed'
            : 'bg-[#F5F5F5] text-[#333333] hover:bg-[#00BFA6] hover:text-white'
        )}
        aria-label="Next page"
      >
        <ChevronRight size={18} className="sm:w-5 sm:h-5" />
      </motion.button>
    </div>
  );
}

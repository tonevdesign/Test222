'use client';

import { motion } from 'framer-motion';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Select } from '@/components/ui/select';
import { Button } from '@/components/ui/button';

export function ProductsToolbar({
  selectedSort,
  hasActiveFilters
}: {
  selectedSort: string;
  hasActiveFilters: boolean;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleSortChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    
    params.delete('featured');
    params.delete('recommended');
    
    let sort_by = 'newest';
    let sort_order = 'desc';

    switch (value) {
      case 'price_low':
        sort_by = 'price';
        sort_order = 'asc';
        break;
      case 'price_high':
        sort_by = 'price';
        sort_order = 'desc';
        break;
      case 'popular':
        sort_by = 'popular';
        break;
      case 'newest':
        sort_by = 'newest';
        break;
      case 'name':
        sort_by = 'name';
        sort_order = 'asc';
        break;
      case 'featured':
        params.set('featured', 'true');
        sort_by = 'newest';
        break;
      case 'recommended':
        params.set('recommended', 'true');
        sort_by = 'newest';
        break;
    }

    params.set('sort_by', sort_by);
    params.set('sort_order', sort_order);
    params.set('page', '1');
    
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleResetFilters = () => {
    router.push(pathname);
  };

  return (
    <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full sm:w-64"
      >
        <Select
          value={selectedSort}
          onChange={(e) => handleSortChange(e.target.value)}
          options={[
            { value: 'newest', label: 'Най-нови' },
            { value: 'popular', label: 'Най-популярни' },
            { value: 'featured', label: 'Специални оферти' },
            { value: 'recommended', label: 'Препоръчани' },
            { value: 'price_low', label: 'Цена: Ниска към Висока' },
            { value: 'price_high', label: 'Цена: Висока към Ниска' },
            { value: 'name', label: 'Име: А-Я' },
          ]}
          label="Сортирай по"
        />
      </motion.div>

      {hasActiveFilters && (
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleResetFilters}
          className="w-full sm:w-auto"
        >
          Изчисти филтрите
        </Button>
      )}
    </div>
  );
}
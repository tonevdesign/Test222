'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import FilterSidebar from '@/components/product/FilterSidebar';
import { SearchFilters } from '@/types/search';
import { useFilterSidebar } from '@/hooks/useFilterSidebar';
import { apiClient } from '@/lib/api';

interface FilterSidebarWrapperProps {
  filters: SearchFilters | null;
  selectedCategories: string[];
  selectedBrands: string[];
  minPrice: number;
  maxPrice: number;
  hasActiveFilters: boolean;
}

export function FilterSidebarWrapper({
  filters: initialFilters,
  selectedCategories,
  selectedBrands,
  minPrice,
  maxPrice,
  hasActiveFilters
}: FilterSidebarWrapperProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { isOpen, close } = useFilterSidebar();
  
  const [filters, setFilters] = useState<SearchFilters | null>(initialFilters);
  const [isLoadingFilters, setIsLoadingFilters] = useState(false);

  const hasContextFilters = selectedCategories.length > 0 || selectedBrands.length > 0;

  useEffect(() => {
    const fetchDynamicFilters = async () => {
      setIsLoadingFilters(true);
      try {
        const params = new URLSearchParams(searchParams.toString());
        const response = await apiClient.get<SearchFilters>(`/search/filters?${params.toString()}`);
        setFilters(response.data || null);
      } catch (error) {
        console.error('Failed to fetch dynamic filters:', error);
        setFilters(initialFilters);
      } finally {
        setIsLoadingFilters(false);
      }
    };

    fetchDynamicFilters();
  }, [searchParams]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'; 
    } else {
      document.body.style.overflow = ''; 
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);


  const updateURL = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(updates).forEach(([key, value]) => {
      if (!value) params.delete(key);
      else params.set(key, value);
    });

    router.push(`${pathname}?${params.toString()}`);
  };

  const selectedAttributes: Record<string, string[]> = {};
  const attrParam = searchParams.get('attributes') || '';
  if (attrParam) {
    attrParam.split(';').forEach(pair => {
      const [key, values] = pair.split(':');
      if (key && values) {
        selectedAttributes[key] = values.split(',');
      }
    });
  }

  const handlePriceChange = (min: number, max: number) => {
    updateURL({ 
      min_price: min > 0 ? min.toString() : null, 
      max_price: max < 10000 ? max.toString() : null, 
      page: '1' 
    });
  };

  const handleCategoryChange = (slug: string, checked: boolean) => {
    const newCategories = checked
      ? [...selectedCategories, slug]
      : selectedCategories.filter((s) => s !== slug);

    updateURL({ 
      categories: newCategories.length ? newCategories.join(',') : null, 
      page: '1' 
    });
  };

  const handleBrandChange = (slug: string, checked: boolean) => {
    const newBrands = checked 
      ? [...selectedBrands, slug] 
      : selectedBrands.filter((s) => s !== slug);
    
    updateURL({ 
      brands: newBrands.length ? newBrands.join(',') : null, 
      page: '1' 
    });
  };

  const handleAttributeChange = (attr: string, value: string, checked: boolean) => {
    const params = new URLSearchParams(searchParams.toString());
    const currentAttr = params.get('attributes') || '';
    
    const attrMap: Record<string, string[]> = {};
    if (currentAttr) {
      currentAttr.split(';').forEach(pair => {
        const [key, values] = pair.split(':');
        attrMap[key] = values ? values.split(',') : [];
      });
    }

    const currentValues = attrMap[attr] || [];
    const newValues = checked 
      ? [...currentValues, value] 
      : currentValues.filter((v) => v !== value);
    
    if (newValues.length > 0) {
      attrMap[attr] = newValues;
    } else {
      delete attrMap[attr];
    }

    const attrParam = Object.entries(attrMap)
      .map(([key, vals]) => `${key}:${vals.join(',')}`)
      .join(';');

    updateURL({ attributes: attrParam || null, page: '1' });
  };

  const handleResetFilters = () => {
    router.push(pathname);
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:block lg:w-64 lg:flex-shrink-0">
        {isLoadingFilters && (
          <div className="p-6 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00BFA6] mx-auto"></div>
            <p className="text-[#777777] mt-2 text-sm">Зареждане на филтри...</p>
          </div>
        )}

        {!isLoadingFilters && (
          <FilterSidebar
            filters={filters}
            priceRange={[minPrice, maxPrice]}
            selectedCategories={selectedCategories}
            selectedBrands={selectedBrands}
            selectedAttributes={selectedAttributes}
            onPriceChange={handlePriceChange}
            onCategoryChange={handleCategoryChange}
            onBrandChange={handleBrandChange}
            onAttributeChange={handleAttributeChange}
            onReset={handleResetFilters}
            hasActiveFilters={hasActiveFilters}
            showAttributes={hasContextFilters}
          />
        )}
      </div>

      {/* Mobile Sidebar - Slides from bottom */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-2xl shadow-2xl max-h-[85vh] overflow-y-auto"
          >
            <div className="sticky top-0 bg-white border-b border-[#E0E0E0] px-4 py-4 flex items-center justify-between rounded-t-2xl z-10">
              <h2 className="text-lg font-semibold text-[#1F1F1F]">Филтри</h2>
              <button
                className="p-2 hover:bg-[#F5F5F5] rounded-lg transition-colors"
                onClick={close}
              >
                <X size={24} className="text-[#333333]" />
              </button>
            </div>

            <div className="px-4 pb-6">
              {isLoadingFilters && (
                <div className="p-6 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00BFA6] mx-auto"></div>
                  <p className="text-[#777777] mt-2 text-sm">Зареждане на филтри...</p>
                </div>
              )}

              {!isLoadingFilters && (
                <FilterSidebar
                  filters={filters}
                  priceRange={[minPrice, maxPrice]}
                  selectedCategories={selectedCategories}
                  selectedBrands={selectedBrands}
                  selectedAttributes={selectedAttributes}
                  onPriceChange={handlePriceChange}
                  onCategoryChange={handleCategoryChange}
                  onBrandChange={handleBrandChange}
                  onAttributeChange={handleAttributeChange}
                  onReset={handleResetFilters}
                  hasActiveFilters={hasActiveFilters}
                  showAttributes={hasContextFilters}
                />
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
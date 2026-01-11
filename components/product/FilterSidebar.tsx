'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SearchFilters } from '@/types/search';
import AttributeFilter from '../filters/AttributeFilter';
import BrandFilter from '../filters/BrandFilter';
import CategoryFilter from '../filters/CategoryFIlter';
import PriceFilter from '../filters/PriceFilter';


interface FilterSidebarProps {
  filters: SearchFilters | null;
  priceRange: [number, number];
  selectedCategories: string[];
  selectedBrands: string[];
  selectedAttributes: Record<string, string[]>;
  onPriceChange: (min: number, max: number) => void;
  onCategoryChange: (categorySlug: string, checked: boolean) => void;
  onBrandChange: (brandSlug: string, checked: boolean) => void;
  onAttributeChange: (attributeSlug: string, value: string, checked: boolean) => void;
  onReset: () => void;
  hasActiveFilters: boolean;
  showAttributes?: boolean;
}

export default function FilterSidebar({
  filters,
  priceRange,
  selectedCategories,
  selectedBrands,
  selectedAttributes,
  onPriceChange,
  onCategoryChange,
  onBrandChange,
  onAttributeChange,
  onReset,
  hasActiveFilters,
  showAttributes = false,
}: FilterSidebarProps) {
  const [expandedSections, setExpandedSections] = useState<string[]>([
    'price',
    'category',
    'brand',
  ]);

  const toggleSection = (section: string) => {
    setExpandedSections((prev) =>
      prev.includes(section)
        ? prev.filter((s) => s !== section)
        : [...prev, section]
    );
  };

  if (!filters) {
    return (
      <div className="p-6">
        <p className="text-[#777777]">Зареждане на филтрите...</p>
      </div>
    );
  }

  return (
    <div className="pr-12 lg:pr-8">
      <div className="mb-6 lg:mb-4">
        <h2 className="hidden lg:flex text-xl font-bold text-[#1F1F1F]">Филтри</h2>
      </div>
      <div className="space-y-4">
        {/* Price Filter */}
        <motion.div
          initial={false}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
          className="border-b border-[#F5F5F5] pb-4"
        >
          <button
            onClick={() => toggleSection('price')}
            className="w-full flex items-center justify-between py-3 px-2 hover:bg-[#F5F5F5] rounded transition-colors group"
          >
            <span className="font-semibold text-[#1F1F1F]">Цена</span>
            <motion.div
              animate={{
                rotate: expandedSections.includes('price') ? 180 : 0,
              }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown size={18} className="text-[#777777]" />
            </motion.div>
          </button>

          {expandedSections.includes('price') && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="py-3"
            >
              <PriceFilter
                min={filters.priceRange.min}
                max={filters.priceRange.max}
                selectedMin={priceRange[0]}
                selectedMax={priceRange[1]}
                onChange={onPriceChange}
              />
            </motion.div>
          )}
        </motion.div>

        {/* Category Filter */}
        {filters.categories.length > 0 && (
          <motion.div
            initial={false}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
            className="border-b border-[#F5F5F5] pb-4"
          >
            <button
              onClick={() => toggleSection('category')}
              className="w-full flex items-center justify-between py-3 px-2 hover:bg-[#F5F5F5] rounded transition-colors"
            >
              <span className="font-semibold text-[#1F1F1F]">
                Категории ({filters.categories.length})
              </span>
              <motion.div
                animate={{
                  rotate: expandedSections.includes('category') ? 180 : 0,
                }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown size={18} className="text-[#777777]" />
              </motion.div>
            </button>

            {expandedSections.includes('category') && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="py-3 space-y-2"
              >
                <CategoryFilter
                  categories={filters.categories}
                  selected={selectedCategories}
                  onChange={onCategoryChange}
                />
              </motion.div>
            )}
          </motion.div>
        )}

        {/* Brand Filter */}
        {filters.brands.length > 0 && (
          <motion.div
            initial={false}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
            className="border-b border-[#F5F5F5] pb-4"
          >
            <button
              onClick={() => toggleSection('brand')}
              className="w-full flex items-center justify-between py-3 px-2 hover:bg-[#F5F5F5] rounded transition-colors"
            >
              <span className="font-semibold text-[#1F1F1F]">
                Марки ({filters.brands.length})
              </span>
              <motion.div
                animate={{
                  rotate: expandedSections.includes('brand') ? 180 : 0,
                }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown size={18} className="text-[#777777]" />
              </motion.div>
            </button>

            {expandedSections.includes('brand') && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="py-3 space-y-2"
              >
                <BrandFilter
                  brands={filters.brands}
                  selected={selectedBrands}
                  onChange={onBrandChange}
                />
              </motion.div>
            )}
          </motion.div>
        )}

        {/* Attribute Filters - Only show if category or brand is selected */}
        {showAttributes && filters.attributes.length > 0 && (
          <>
            {filters.attributes.map((attribute) => (
              <motion.div
                key={attribute.id}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="border-b border-[#F5F5F5] pb-4"
              >
                <button
                  onClick={() => toggleSection(`attr-${attribute.id}`)}
                  className="w-full flex items-center justify-between py-3 px-2 hover:bg-[#F5F5F5] rounded transition-colors"
                >
                  <span className="font-semibold text-[#1F1F1F]">
                    {attribute.name} ({attribute.values?.length || 0})
                  </span>
                  <motion.div
                    animate={{
                      rotate: expandedSections.includes(
                        `attr-${attribute.id}`
                      )
                        ? 180
                        : 0,
                    }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown size={18} className="text-[#777777]" />
                  </motion.div>
                </button>

                {expandedSections.includes(`attr-${attribute.id}`) && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="py-3 space-y-2"
                  >
                    <AttributeFilter
                      attribute={attribute}
                      selected={selectedAttributes[attribute.slug] || []}
                      onChange={(value, checked) =>
                        onAttributeChange(attribute.slug, value, checked)
                      }
                    />
                  </motion.div>
                )}
              </motion.div>
            ))}
          </>
        )}
      </div>

      {/* Reset Button for Mobile */}
      {hasActiveFilters && (
        <Button
          onClick={onReset}
          className="w-full mt-6 lg:hidden"
          variant="outline"
        >
          Изчисти филтрите
        </Button>
      )}
    </div>
  );
}
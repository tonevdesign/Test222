import { useState } from 'react';
import { ChevronRight } from 'lucide-react';

interface Category {
  id: number;
  name: string;
  slug: string;
  parent_id?: number | null;
  children?: Category[];
  product_count?: number;
}

interface CategoryFilterProps {
  categories: Category[];
  selected: string[];
  onChange: (categorySlug: string, checked: boolean) => void;
}

export default function CategoryFilter({
  categories,
  selected,
  onChange,
}: CategoryFilterProps) {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(categories.map(c => c.slug))
  );

  const toggleExpanded = (slug: string) => {
    setExpandedCategories(prev => {
      const next = new Set(prev);
      if (next.has(slug)) {
        next.delete(slug);
      } else {
        next.add(slug);
      }
      return next;
    });
  };

  // Get all descendant slugs for a category
  const getAllDescendants = (category: Category): string[] => {
    const descendants: string[] = [];
    
    const collectDescendants = (cat: Category) => {
      if (cat.children) {
        cat.children.forEach(child => {
          descendants.push(child.slug);
          collectDescendants(child);
        });
      }
    };
    
    collectDescendants(category);
    return descendants;
  };

  // Check if all children are selected
  const areAllChildrenSelected = (category: Category): boolean => {
    if (!category.children || category.children.length === 0) {
      return false;
    }
    return category.children.every(child => 
      selected.includes(child.slug) && 
      (!child.children || areAllChildrenSelected(child))
    );
  };

  // Check if some (but not all) children are selected
  const areSomeChildrenSelected = (category: Category): boolean => {
    if (!category.children || category.children.length === 0) {
      return false;
    }
    return category.children.some(child => 
      selected.includes(child.slug) || areSomeChildrenSelected(child)
    );
  };

  const handleCategoryChange = (category: Category, checked: boolean) => {
    // Handle parent category
    onChange(category.slug, checked);

    // Handle all descendants
    if (category.children && category.children.length > 0) {
      const descendants = getAllDescendants(category);
      descendants.forEach(slug => {
        onChange(slug, checked);
      });
    }
  };

  const renderCategory = (category: Category, level: number = 0) => {
    const hasChildren = category.children && category.children.length > 0;
    const isExpanded = expandedCategories.has(category.slug);
    const isSelected = selected.includes(category.slug);
    const allChildrenSelected = hasChildren && areAllChildrenSelected(category);
    const someChildrenSelected = hasChildren && areSomeChildrenSelected(category);
    const isIndeterminate = Boolean(someChildrenSelected && !allChildrenSelected);


    return (
      <div key={category.slug}>
        <div
          className="flex items-center gap-2 cursor-pointer p-2 hover:bg-[#F5F5F5] rounded transition-colors"
          style={{ paddingLeft: `${level * 1.5 + 0.5}rem` }}
        >
          {hasChildren && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleExpanded(category.slug);
              }}
              className="p-0.5 hover:bg-[#E0E0E0] rounded transition-colors flex-shrink-0"
            >
              <ChevronRight
                size={16}
                className={`text-[#777777] transition-transform ${
                  isExpanded ? 'rotate-90' : ''
                }`}
              />
            </button>
          )}
          
          {!hasChildren && <div className="w-[20px]" />}

          <label className="flex items-center gap-3 cursor-pointer flex-1">
            <div className="relative flex-shrink-0">
              <input
                type="checkbox"
                checked={isSelected || allChildrenSelected}
                ref={(input) => {
                  if (input) {
                    input.indeterminate = isIndeterminate;
                  }
                }}
                onChange={(e) => {
                  e.stopPropagation();
                  handleCategoryChange(category, e.target.checked);
                }}
                className="w-4 h-4 text-[#00BFA6] bg-white border-2 border-[#E0E0E0] rounded cursor-pointer accent-[#00BFA6]"
              />
            </div>
            <span className={`text-sm ${level === 0 ? 'font-semibold' : 'font-medium'} text-[#333333] flex-1`}>
              {category.name}
              {category.product_count !== undefined && (
                <span className="text-[#777777] ml-1">({category.product_count})</span>
              )}
            </span>
          </label>
        </div>

        {hasChildren && isExpanded && (
          <div className="space-y-1">
            {category.children!.map(child => renderCategory(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-1">
      {categories.map(category => renderCategory(category, 0))}
    </div>
  );
}
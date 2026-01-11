import { apiClient } from '@/lib/api';
import { Breadcrumbs } from '@/components/common/Breadcrumbs';
import { Product } from '@/types/product';
import { SearchFilters } from '@/types/search';
import { FilterSidebarWrapper } from '@/components/product/FilterSdidebarWrapper';
import { MobileFilterButton } from '@/components/product/MobileFIlterButton';
import { ProductsGrid } from '@/components/product/ProductsGrid';
import { ProductsHeader } from '@/components/product/ProductsHeader';
import { ProductsToolbar } from '@/components/product/ProductsToolbar';
import { PaginationWrapper } from '@/components/common/PaginationWrapper';

export const revalidate = 60;

interface ProductsPageProps {
  searchParams: {
    q?: string;
    categories?: string;
    brands?: string;
    min_price?: string;
    max_price?: string;
    attributes?: string;
    sort_by?: string;
    sort_order?: string;
    featured?: string;
    recommended?: string;
    page?: string;
    limit?: string;
  };
}

async function fetchProducts(searchParams: ProductsPageProps['searchParams']) {
  try {
    const params = new URLSearchParams();
    Object.entries(searchParams).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    
    const response = await apiClient.get<Product[]>(`/search/products?${params.toString()}`);
    return {
      products: response.data || [],
      pagination: response.pagination || { page: 1, limit: 20, total: 0, totalPages: 0 }
    };
  } catch (error) {
    console.error('Failed to fetch products:', error);
    return { products: [], pagination: { page: 1, limit: 20, total: 0, totalPages: 0 } };
  }
}

async function fetchFilters(searchParams: ProductsPageProps['searchParams']) {
  try {
    const params = new URLSearchParams();
    Object.entries(searchParams).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    
    const response = await apiClient.get<SearchFilters>(`/search/filters?${params.toString()}`);
    return response.data || null;
  } catch (error) {
    console.error('Failed to fetch filters:', error);
    return null;
  }
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const resolvedSearchParams = await searchParams;

  const [{ products, pagination }, filters] = await Promise.all([
    fetchProducts(resolvedSearchParams),
    fetchFilters(resolvedSearchParams)
  ]);

  const searchQuery = resolvedSearchParams.q;
  const currentPage = parseInt(resolvedSearchParams.page || '1');
  const isFeatured = resolvedSearchParams.featured === 'true';
  const isRecommended = resolvedSearchParams.recommended === 'true';

  const selectedCategories = resolvedSearchParams.categories?.split(',') || [];
  const selectedBrands = resolvedSearchParams.brands?.split(',') || [];
  const minPrice = parseFloat(resolvedSearchParams.min_price || '0');
  const maxPrice = parseFloat(resolvedSearchParams.max_price || '10000');

  // Determine selected sort
  let selectedSort = 'newest';
  if (isFeatured) {
    selectedSort = 'featured';
  } else if (isRecommended) {
    selectedSort = 'recommended';
  } else if (resolvedSearchParams.sort_by === 'price') {
    selectedSort = resolvedSearchParams.sort_order === 'asc' ? 'price_low' : 'price_high';
  } else if (resolvedSearchParams.sort_by === 'popular') {
    selectedSort = 'popular';
  } else if (resolvedSearchParams.sort_by === 'name') {
    selectedSort = 'name';
  } else if (resolvedSearchParams.sort_by) {
    selectedSort = resolvedSearchParams.sort_by;
  }

  const hasActiveFilters =
    selectedCategories.length > 0 ||
    selectedBrands.length > 0 ||
    minPrice > 0 ||
    maxPrice < 10000 ||
    isFeatured ||
    isRecommended;

  // Build breadcrumb items
  const breadcrumbItems = [{ label: 'Продукти', href: '/products' }];
  
  if (isFeatured) {
    breadcrumbItems.push({ label: 'Препоръчани', href: '' });
  }
  
  if (isRecommended) {
    breadcrumbItems.push({ label: 'Специални оферти', href: '' });
  }
  
  if (selectedCategories.length > 0 && filters?.categories) {
    const selectedCategoryNames = filters.categories
      .filter(cat => selectedCategories.includes(cat.slug))
      .map(cat => cat.name)
      .join(', ');
    
    if (selectedCategoryNames) {
      breadcrumbItems.push({
        label: selectedCategoryNames,
        href: ''
      });
    }
  }
  
  if (selectedBrands.length > 0 && filters?.brands) {
    const selectedBrandNames = filters.brands
      .filter(brand => selectedBrands.includes(brand.slug))
      .map(brand => brand.name)
      .join(', ');
    
    if (selectedBrandNames) {
      breadcrumbItems.push({
        label: `Марки: ${selectedBrandNames}`,
        href: ''
      });
    }
  }
  
  if (searchQuery) {
    breadcrumbItems.push({
      label: `Търсене: ${searchQuery}`,
      href: ''
    });
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header & Breadcrumbs */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Breadcrumbs items={breadcrumbItems} />
        <ProductsHeader 
          searchQuery={searchQuery}
          total={pagination.total}
        />
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="flex gap-6 lg:gap-8">
          {/* Mobile Filter Button */}
          <MobileFilterButton />

          {/* Sidebar */}
          <FilterSidebarWrapper
            filters={filters}
            selectedCategories={selectedCategories}
            selectedBrands={selectedBrands}
            minPrice={minPrice}
            maxPrice={maxPrice}
            hasActiveFilters={hasActiveFilters}
          />

          {/* Products Section */}
          <div className="flex-1 w-full">
            {/* Toolbar */}
            <ProductsToolbar
              selectedSort={selectedSort}
              hasActiveFilters={hasActiveFilters}
            />

            {/* Products Grid */}
            <ProductsGrid products={products} />

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex justify-center mt-12">
                <PaginationWrapper
                  currentPage={currentPage}
                  totalPages={pagination.totalPages}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { AnimatedSection, AnimatedGrid, AnimatedGridItem } from './AnimatedWrappers';
import CategoryCard from '@/components/home/CategoryCard';
import ProductCard from '@/components/product/ProductCard';
import { Category, Product, Brand } from '@/types/product';

export const CategoriesSection = ({ categories }: { categories: Category[] }) => {
  return (
    <section className="py-8 sm:py-12 md:py-16 lg:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#1F1F1F] mb-2">
            Избор по категории
          </h2>
          <p className="text-sm sm:text-base text-[#777777]">
            Разгледайте нашата разнообразна колекция от висококачествени продукти.
          </p>
        </AnimatedSection>

        <AnimatedGrid className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
          {categories.map((category, index) => (
            <AnimatedGridItem key={category.id} index={index}>
              <CategoryCard category={category} />
            </AnimatedGridItem>
          ))}
        </AnimatedGrid>
      </div>
    </section>
  );
};

export const ProductGridSection = ({
  title,
  description,
  viewAllLink,
  products,
  bgColor = "bg-white"
}: {
  title: string;
  description: string;
  viewAllLink: string;
  products: Product[];
  bgColor?: string;
}) => {
  if (products.length === 0) return null;

  return (
    <section className={`py-8 sm:py-12 md:py-16 lg:py-24 ${bgColor}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="mb-8 sm:mb-12 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#1F1F1F] mb-2">
              {title}
            </h2>
            <p className="text-sm sm:text-base text-[#777777]">{description}</p>
          </div>
          <Link href={viewAllLink}>
            <button className="flex items-center gap-2 text-[#00BFA6] hover:text-[#00a890] font-semibold transition-colors text-sm sm:text-base whitespace-nowrap">
              Виж всички
              <ArrowRight size={18} className="sm:w-5 sm:h-5" />
            </button>
          </Link>
        </AnimatedSection>

        <AnimatedGrid className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
          {products.map((product, index) => (
            <AnimatedGridItem key={product.id} index={index}>
              <ProductCard product={product} />
            </AnimatedGridItem>
          ))}
        </AnimatedGrid>
      </div>
    </section>
  );
};

export const BrandsSection = ({ brands }: { brands: Brand[] }) => {
  if (brands.length === 0) return null;

  return (
    <section className="py-8 sm:py-12 md:py-16 lg:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#1F1F1F] mb-2">
            Избор по марки
          </h2>
          <p className="text-sm sm:text-base text-[#777777]">
            Разгледайте продукти от надеждни марки
          </p>
        </AnimatedSection>

        <AnimatedGrid className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3 sm:gap-4">
          {brands.map((brand, index) => (
            <AnimatedGridItem key={brand.id} index={index}>
              <Link href={`/products?brands=${brand.slug}`}>
                <div className="flex items-center justify-center h-24 sm:h-28 md:h-32 bg-[#F5F5F5] rounded-lg hover:bg-[#E5E5E5] transition-colors cursor-pointer">
                  <p className="font-semibold text-[#1F1F1F] text-xs sm:text-sm text-center px-2">
                    {brand.name}
                  </p>
                </div>
              </Link>
            </AnimatedGridItem>
          ))}
        </AnimatedGrid>
      </div>
    </section>
  );
};
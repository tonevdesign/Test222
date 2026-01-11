import { Metadata } from 'next';
import { apiClient } from "@/lib/api";
import { HeroSection } from "@/components/home/HeroSection";
import { CategoriesSection, ProductGridSection, BrandsSection } from "@/components/home/HomeSections";
import FeaturedBundleHero from "@/components/bundle/FeaturedBundleHero";
import ProductCarousel from "@/components/product/ProductCarousel";
import BundleCarousel from "@/components/bundle/BundleCarousel";
import { Brand, Category, Product } from "@/types/product";
import { Bundle } from "@/types/bundle";
import { AnimatedSection } from "@/components/home/AnimatedWrappers";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { seoConfig } from '@/config/seo';

export const revalidate = 60;

export const metadata: Metadata = {
  title: seoConfig.defaultTitle,
  description: seoConfig.defaultDescription,
  openGraph: {
    title: seoConfig.defaultTitle,
    description: seoConfig.defaultDescription,
    url: seoConfig.siteUrl,
    siteName: seoConfig.siteName,
    images: [
      {
        url: seoConfig.ogImage,
        width: 1200,
        height: 630,
        alt: seoConfig.siteName,
      },
    ],
    locale: 'bg_BG',
    type: 'website',
  },
  alternates: {
    canonical: seoConfig.siteUrl,
  },
};

export default async function Homepage() {
  const [
    categoriesRes,
    newestRes,
    saleRes,
    topSellingRes,
    recommendedRes,
    featuredRes,
    brandsRes,
    bundlesRes,
    featuredBundleRes
  ] = await Promise.all([
    // ✅ Fetch only categories marked to show in menu
    apiClient.get<Category[]>('/categories?show_in_menu=true').catch(() => ({ data: [] as Category[] })),
    apiClient.get<Product[]>('/products?sort=newest&limit=8').catch(() => ({ data: [] as Product[] })),
    apiClient.get<Product[]>('/sales/products?limit=8').catch(() => ({ data: [] as Product[] })),
    apiClient.get<Product[]>('/products?sort=popular&limit=8').catch(() => ({ data: [] as Product[] })),
    apiClient.get<Product[]>('/products?is_featured=true&limit=8').catch(() => ({ data: [] as Product[] })),
    apiClient.get<Product[]>('/products?is_featured=true&limit=6').catch(() => ({ data: [] as Product[] })),
    apiClient.get<Brand[]>('/brands?limit=8').catch(() => ({ data: [] as Brand[] })),
    apiClient.get<Bundle[]>('/bundles?limit=6').catch(() => ({ data: [] as Bundle[] })),
    apiClient.get<Bundle[]>('/bundles?is_featured=true&limit=1').catch(() => ({ data: [] as Bundle[] })),
  ]);

  const categories = Array.isArray(categoriesRes.data) ? categoriesRes.data.slice(0, 6) : [];
  const newestProducts = Array.isArray(newestRes.data) ? newestRes.data : [];
  const saleProducts = Array.isArray(saleRes.data) ? saleRes.data : [];
  const topSellingProducts = Array.isArray(topSellingRes.data) ? topSellingRes.data : [];
  const recommendedProducts = Array.isArray(recommendedRes.data) ? recommendedRes.data : [];
  const featuredProducts = Array.isArray(featuredRes.data) ? featuredRes.data : [];
  const brands = Array.isArray(brandsRes.data) ? brandsRes.data : [];
  const bundles = Array.isArray(bundlesRes.data) ? bundlesRes.data : [];
  const featuredBundle = featuredBundleRes.data?.[0] || bundles?.[0] || null;

  return (
    <div className="bg-white">
      <HeroSection />
      {featuredBundle && <FeaturedBundleHero bundle={featuredBundle} />}
      {categories.length > 0 && <CategoriesSection categories={categories} />}

      {featuredProducts.length > 0 && (
        <section className="py-12 sm:py-16 lg:py-24 bg-[#F5F5F5]">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <AnimatedSection className="mb-12 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-3xl sm:text-4xl font-bold text-[#1F1F1F] mb-2">
                  Избрана колекция
                </h2>
                <p className="text-[#777777]">
                 Разгледайте нашите специално подбрани предложения.
                </p>
              </div>
              <Link href="/products?featured=true">
                <button className="flex items-center gap-2 text-[#00BFA6] hover:text-[#00a890] font-semibold transition-colors text-sm sm:text-base whitespace-nowrap">
                  Виж всички
                  <ArrowRight size={18} className="sm:w-5 sm:h-5" />
                </button>
              </Link>
            </AnimatedSection>
            <ProductCarousel products={featuredProducts} visibleItems={4} />
          </div>
        </section>
      )}

      {bundles.length > 0 && (
        <section className="py-12 sm:py-16 lg:py-24 bg-gradient-to-br from-[#00BFA6]/5 to-transparent">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <AnimatedSection className="mb-12 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-3xl sm:text-4xl font-bold text-[#1F1F1F] mb-2">
                  Пакетни оферти
                </h2>
                <p className="text-[#777777]">
                  Спестете повече с нашите специално подбрани продуктови пакети
                </p>
              </div>
            </AnimatedSection>
            <BundleCarousel bundles={bundles} visibleItems={3} />
          </div>
        </section>
      )}

      <ProductGridSection
        title="Нови предложения"
        description="Открийте най-новите ни попълнения."
        viewAllLink="/products?sort=newest"
        products={newestProducts}
      />

      {saleProducts.length > 0 && (
        <section className="py-12 sm:py-16 lg:py-24 bg-[#F5F5F5]">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <AnimatedSection className="mb-12 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-3xl sm:text-4xl font-bold text-[#1F1F1F] mb-2">
                  В промоция сега
                </h2>
                <p className="text-[#777777]">
                  Специални оферти за ограничен период
                </p>
              </div>
              <Link href="/products?on_sale=true">
                <button className="flex items-center gap-2 text-[#00BFA6] hover:text-[#00a890] font-semibold transition-colors text-sm sm:text-base whitespace-nowrap">
                  Виж всички
                  <ArrowRight size={18} className="sm:w-5 sm:h-5" />
                </button>
              </Link>
            </AnimatedSection>
            <ProductCarousel products={saleProducts} visibleItems={4} />
          </div>
        </section>
      )}

      <ProductGridSection
        title="Най-продавани"
        description="Любими и най-продавани продукти"
        viewAllLink="/products?sort=popular"
        products={topSellingProducts}
      />

      {recommendedProducts.length > 0 && (
        <section className="py-12 sm:py-16 lg:py-24 bg-[#F5F5F5]">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <AnimatedSection className="mb-12 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-3xl sm:text-4xl font-bold text-[#1F1F1F] mb-2">
                  Подбрани за вас
                </h2>
                <p className="text-[#777777]">
                  Продукти, подбрани специално за вас
                </p>
              </div>
              <Link href="/products?recommended=true">
                <button className="flex items-center gap-2 text-[#00BFA6] hover:text-[#00a890] font-semibold transition-colors text-sm sm:text-base whitespace-nowrap">
                  Виж всички
                  <ArrowRight size={18} className="sm:w-5 sm:h-5" />
                </button>
              </Link>
            </AnimatedSection>
            <ProductCarousel products={recommendedProducts} visibleItems={4} />
          </div>
        </section>
      )}

      <BrandsSection brands={brands} />
    </div>
  );
}
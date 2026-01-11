import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { apiClient } from '@/lib/api';
import { Breadcrumbs } from '@/components/common/Breadcrumbs';
import { Product } from '@/types/product';
import { ProductClient } from '@/components/product/ProductClient';

export const revalidate = 60;

interface ProductPageProps {
  params: {
    slug: string;
  };
}

async function fetchProduct(slug: string) {
  try {
    const response = await apiClient.get<Product>(
      `/products/${slug}?incrementView=true`
    );
    return response.data || null;
  } catch {
    return null;
  }
}

async function fetchBrandProducts(brandId: number, excludeId: number) {
  try {
    const response = await apiClient.get<Product[]>(`/products?brand_id=${brandId}&limit=8`);
    const products = response.data || [];
    return Array.isArray(products) ? products.filter((p) => p.id !== excludeId) : [];
  } catch {
    return [];
  }
}

// Generate dynamic metadata for SEO
export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await fetchProduct(slug);

  if (!product) {
    return {
      title: 'Продуктът не е намерен',
      description: 'Продуктът, който търсите, не съществува.',
    };
  }

  const variant = product.variants?.find(v => v.is_default) || product.variants?.[0];
  const primaryImage = product.images?.find(img => !img.variant_id && img.is_primary) || 
                       product.images?.[0];
  const currentPrice = variant?.sale_price || variant?.price;
  const isSale = !!variant?.sale_price;

  const title = product.meta_title || `${product.name} - ${product.brand?.name || 'Zekto'}`;
  const description = product.meta_description || 
    (product.description 
      ? product.description.substring(0, 160) + '...' 
      : `Купете ${product.name} на най-добрата цена. ${isSale ? 'В момента на промоция!' : ''}`);
  
  // Build structured data for rich results in search engines
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    sku: product.sku,
    brand: product.brand ? {
      '@type': 'Brand',
      name: product.brand.name,
    } : undefined,
    image: primaryImage?.image_url ? [primaryImage.image_url] : [],
    offers: {
      '@type': 'Offer',
      price: currentPrice,
      priceCurrency: 'BGN',
      availability: variant?.stock_quantity && variant.stock_quantity > 0
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/products/${product.slug}`,
    },
  };

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/products/${product.slug}`,
      images: primaryImage?.image_url ? [
        {
          url: primaryImage.image_url,
          width: 1200,
          height: 630,
          alt: primaryImage.alt_text || product.name,
        },
      ] : [],
      siteName: 'Zekto',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: primaryImage?.image_url ? [primaryImage.image_url] : [],
    },
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/products/${product.slug}`,
    },
    other: {
      'application/ld+json': JSON.stringify(structuredData),
    },
  };
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { slug } = await params;

  const product = await fetchProduct(slug);

  if (!product) {
    notFound();
  }

  const brandProducts = product.brand 
    ? await fetchBrandProducts(product.brand.id, product.id)
    : [];

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumbs */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Breadcrumbs
          items={[
            { label: 'Products', href: '/products' },
            ...(product.categories?.[0]
              ? [
                  {
                    label: product.categories[0].name,
                    href: `/products?category=${product.categories[0].slug}`,
                  },
                ]
              : []),
            { label: product.name },
          ]}
        />
      </div>

      {/* Product Client Component (handles variant switching) */}
      <ProductClient 
        product={product} 
        brandProducts={brandProducts}
      />
    </div>
  );
}
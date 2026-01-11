export interface BundleItem {
  id: number;
  bundle_product_id: number;
  bundled_product_id: number;
  quantity: number;
  discount_percentage: number | null;
  sort_order: number;
  bundledProduct: {
    id: number;
    name: string;
    slug: string;
    variants?: Array<{
      id: number;
      price: string;
      compare_at_price: string | null;
      stock_quantity: number;
    }>;
    images?: Array<{
      id: number;
      image_url: string;
      thumbnail_url: string | null;
    }>;
  };
}

export interface BundlePricing {
  original_price: number;
  bundle_price: number;
  savings: number;
  savings_percentage: number;
}

export interface BundleImage {
  id: number;
  filename: string;
  file_path: string;
  original_name: string;
  image_url: string;
  thumbnail_url: string | null;
}

export interface Bundle {
  id: number;
  name: string;
  slug?: string;
  description: string | null;
  is_active: boolean;
  is_featured: boolean;
  image_url: string | null;
  media_library_id: number | null;
  created_at: string;
  updated_at: string;
  media?: BundleImage | null;
  images?: BundleImage[];
  bundleItems: BundleItem[];
  bundle_pricing: BundlePricing;
  variants?: Array<{ id: number }>; 
}
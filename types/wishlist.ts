export interface WishlistItem {
  id: number;
  wishlist_id: number;
  product_id?: number | null;
  bundle_id?: number | null;
  variant_id?: number | null; // ✅ Specific variant selected
  added_at: string;
  product?: {
    id: number;
    name: string;
    slug: string;
    is_active: boolean;
    images?: Array<{
      id: number;
      image_url: string;
      thumbnail_url: string;
      is_primary: boolean;
      variant_id?: number | null; // ✅ Track which variant owns this image
    }>;
    variants?: Array<{
      id: number;
      price: number;
      sale_price?: number;
      stock_quantity: number;
      is_active: boolean;
      is_default: boolean;
      variant_name?: string; // ✅ Custom variant name
    }>;
    // ✅ Selected variant info (added by backend transform)
    selectedVariant?: {
      id: number;
      name: string;
      price: number;
      sale_price?: number;
      stock_quantity: number;
    };
    brand?: {
      id: number;
      name: string;
      slug: string;
    };
  };
  bundle?: {
    id: number;
    name: string;
    slug?: string;
    description?: string;
    is_active: boolean;
    is_featured?: boolean;
    image_url?: string;
    media_library_id?: number;
    media?: {
      id: number;
      filename: string;
      file_path: string;
      original_name: string;
    };
    items?: Array<{
      id: number;
      bundle_id: number;
      product_id: number;
      quantity: number;
      discount_percentage?: number;
      sort_order: number;
      product?: {
        id: number;
        name: string;
        slug: string;
        variants?: Array<{
          id: number;
          price: number;
          sale_price?: number;
          stock_quantity: number;
        }>;
      };
    }>;
    bundleItems?: Array<{
      id: number;
      bundle_id: number;
      product_id: number;
      quantity: number;
      discount_percentage?: number;
      sort_order: number;
      product?: {
        id: number;
        name: string;
        slug: string;
        variants?: Array<{
          id: number;
          price: number;
          sale_price?: number;
          stock_quantity: number;
        }>;
      };
    }>;
    bundle_pricing?: {
      original_price: number;
      bundle_price: number;
      savings: number;
      savings_percentage: number;
    };
  };
}

export interface Wishlist {
  id: number;
  user_id: number;
  name: string;
  slug: string;
  is_default: boolean;
  is_public: boolean;
  created_at: string;
  updated_at: string;
  items?: WishlistItem[];
  user?: {
    id: number;
    first_name: string;
    last_name: string;
  };
}
export interface BundleCartProduct {
  product_id: number;
  variant_id?: number | null;
  product_name: string;
  product_slug?: string;
   variant_name?: string;
  image_url?: string;
  unit_price?: string;
  quantity: number;
}

export interface CartItem {
  id: number;
  product_id: number;
  variant_id?: number | null;
  product_slug?: string;
  product_name: string;
  variant_name?: string;
  quantity: number;
  unit_price: string;
  regular_price?: string;
  sale_price?: string; 
  total_amount: string;
  image_url?: string;
  is_bundle?: boolean;
  bundle_id?: number;
  bundle_name?: string;
  bundle_slug?: string;
  bundle_original_price?: string;
  bundle_savings_amount?: string;
  bundle_savings_percentage?: number;
  bundle_items?: BundleCartProduct[];
}

export interface Cart {
  id?: number;
  items: CartItem[];
  subtotal?: string;
  tax_amount?: string;
  shipping_amount?: string;
  discount_amount?: string;
  total_amount: string;
}
export interface Brand {
  id: number;
  name: string;
  slug: string;
  description?: string;
  is_active?: boolean;
  sort_order?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  image_url?: string;
  media_library_id?: number;
  parent_id?: number | null;
  sort_order?: number;
  is_active: boolean;
  meta_title?: string;
  meta_description?: string;
  children?: Category[];
  parent?: Category;
  product_count?: number;
  created_at?: string;
  updated_at?: string;
}

export interface Label {
  id: number;
  name: string;
  slug: string;
  color: string;
  background_color: string;
}

export interface ProductImage {
  id: number;
  image_url: string;
  thumbnail_url?: string;
  alt_text?: string;
  sort_order?: number;
  is_primary: boolean;
  variant_id?: number | null;
}

export interface AttributeValue {
  id: number;
  value: string;
  slug: string;
}

export interface Attribute {
  id: number;
  name: string;
  slug: string;
  type: 'select' | 'text' | 'color';
  is_filterable: boolean;
  is_visible: boolean;
  sort_order: number;
  values?: AttributeValue[];
}

export interface VariantAttribute {
  attribute: Attribute;
  attributeValue: AttributeValue;
}

export interface ProductVariant {
  images: ProductImage[];
  id: number;
  price: string;
  sale_price?: string;
  compare_at_price?: string;
  stock_quantity: number;
  is_default: boolean;
  variant_name?: string;
  variantAttributes?: VariantAttribute[];
}

export interface Product {
  selectedVariant?: any;
  id: number;
  name: string;
  slug: string;
  description: string;
  is_active: boolean;
  is_featured?: boolean;
  view_count?: number;
  brand?: Brand;
  variants: ProductVariant[];
  images: ProductImage[];
  categories?: Category[];
  labels?: Label[];
  tags?: string[];
  relatedProducts?: Product[];
  meta_title?: string;
  meta_description?: string;
  sku?: string;
  createdAt: string;
  updatedAt: string;
}
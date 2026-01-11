import { Product } from './product';

export interface ComparisonItem {
  id: number;
  comparison_id: number;
  product_id: number;
  variant_id: number | null;
  added_at: string;
  product?: Product;
}

export interface ProductComparison {
  id: number;
  user_id: number | null;
  session_id: string | null;
  items: ComparisonItem[];
  count: number;
  max: number;
  createdAt: string;
  updatedAt: string;
}

export interface ComparisonResponse {
  items: ComparisonItem[];
  count: number;
  max: number;
}

export interface ComparisonIdsResponse {
  product_ids: number[];
}
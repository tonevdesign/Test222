import { Product, Brand, Category, Attribute } from "./product";

export interface SearchSuggestion {
  products?: Pick<Product, 'id' | 'name' | 'slug'>[];
  brands?: Pick<Brand, 'id' | 'name' | 'slug'>[];
  categories?: Pick<Category, 'id' | 'name' | 'slug'>[];
}

export interface SearchFilters {
  brands: Brand[];
  categories: Category[];
  attributes: Attribute[];
  priceRange: {
    min: number;
    max: number;
  };
}

export interface PopularSearch {
  query: string;
  count: number;
}

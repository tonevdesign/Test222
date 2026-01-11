export interface ShippingMethod {
  id: number;
  name: string;
  code: string;
  description: string;
  price: string;
  is_active: boolean;
  sort_order: number;
}
